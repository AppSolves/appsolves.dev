import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

export function useThemeSelection() {
  const { theme = "system", setTheme } = useTheme();
  const active = useRef<ViewTransition | null>(null);
  const animation = useRef<Animation | null>(null);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      active.current?.skipTransition();
      animation.current?.cancel();
      document.documentElement.classList.remove("theme-reveal");
    },
    [],
  );

  const chooseTheme = (value: string, control: HTMLElement) => {
    const current = ++generation.current;
    active.current?.skipTransition();
    animation.current?.cancel();
    const apply = () => {
      if (generation.current === current) flushSync(() => setTheme(value));
    };
    const resolved =
      value === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : value;
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      resolved === document.documentElement.dataset.theme ||
      document.hidden
    ) {
      apply();
      return;
    }
    const bounds = control.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    document.documentElement.classList.add("theme-reveal");
    const transition = document.startViewTransition(apply);
    active.current = transition;
    void transition.ready
      .then(() => {
        if (active.current !== transition) return;
        animation.current = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(.22,1,.36,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Skipped or superseded snapshots still execute the theme update callback.
      });
    void transition.finished
      .finally(() => {
        if (active.current === transition) {
          active.current = null;
          document.documentElement.classList.remove("theme-reveal");
        }
      })
      .catch(() => {
        /* A skipped transition has already applied the preference. */
      });
  };
  return { theme, chooseTheme };
}
