import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

export function useThemeSelection() {
  const { theme = "system", setTheme } = useTheme();
  const active = useRef<ViewTransition | null>(null);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      active.current?.skipTransition();
      document.documentElement.classList.remove("theme-reveal");
    },
    [],
  );

  const chooseTheme = (value: string, control: HTMLElement) => {
    const current = ++generation.current;
    active.current?.skipTransition();
    document.documentElement.classList.remove("theme-reveal");
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
    // Keep the reveal on the native snapshot, with its duration owned by CSS.
    const root = document.documentElement;
    root.style.setProperty("--theme-reveal-x", `${x}px`);
    root.style.setProperty("--theme-reveal-y", `${y}px`);
    root.style.setProperty("--theme-reveal-radius", `${radius}px`);
    root.classList.add("theme-reveal");
    const transition = document.startViewTransition(apply);
    active.current = transition;
    void transition.ready.catch(() => {
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
