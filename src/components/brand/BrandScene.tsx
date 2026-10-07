import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function BrandScene() {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const dark =
    (resolvedTheme ?? document.documentElement.dataset.theme) === "dark";

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const preference = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let generation = 0;
    let request: AbortController | undefined;

    const update = async () => {
      const current = ++generation;
      request?.abort();
      request = new AbortController();
      const signal = request.signal;
      dispose?.();
      dispose = undefined;
      if (!preference.matches) return;
      try {
        const { mountBrandScene } = await import("./brand-scene");
        if (cancelled || current !== generation) return;
        const cleanup = await mountBrandScene(element, signal, dark);
        if (cancelled || current !== generation) cleanup();
        else dispose = cleanup;
      } catch (error) {
        // The static render remains visible when WebGL or its chunk is unavailable.
        if (!signal.aborted)
          console.warn("AppSolves 3D preview unavailable:", error);
      }
    };
    void update();
    preference.addEventListener("change", update);
    return () => {
      cancelled = true;
      generation++;
      request?.abort();
      preference.removeEventListener("change", update);
      dispose?.();
    };
  }, [dark]);

  return (
    <div className="brand-scene" ref={container} aria-hidden="true">
      <img
        className="brand-poster"
        src={`${import.meta.env.BASE_URL}images/brand-object${dark ? "-dark" : ""}.png`}
        alt=""
        width="900"
        height="900"
        fetchPriority="high"
      />
    </div>
  );
}
