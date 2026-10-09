import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { mountBrandScene } from "./brand-scene";

export default function BrandScene() {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const dark =
    (resolvedTheme ?? document.documentElement.dataset.theme) === "dark";
  const currentTheme = useRef(dark);
  const scene = useRef<Awaited<ReturnType<typeof mountBrandScene>> | null>(
    null,
  );

  useEffect(() => {
    currentTheme.current = dark;
    scene.current?.setTheme(dark);
  }, [dark]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const preference = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let cancelled = false;
    let generation = 0;
    let request: AbortController | undefined;

    const update = async () => {
      const current = ++generation;
      request?.abort();
      request = new AbortController();
      const signal = request.signal;
      scene.current?.dispose();
      scene.current = null;
      if (!preference.matches) return;
      try {
        const { mountBrandScene } = await import("./brand-scene");
        if (cancelled || current !== generation) return;
        const controls = await mountBrandScene(
          element,
          signal,
          currentTheme.current,
        );
        if (cancelled || current !== generation) controls.dispose();
        else {
          scene.current = controls;
          controls.setTheme(currentTheme.current);
        }
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
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <div className="brand-scene" ref={container} aria-hidden="true">
      <picture className="brand-poster">
        <source
          srcSet={`${import.meta.env.BASE_URL}images/brand-object${dark ? "-dark" : ""}.avif`}
          type="image/avif"
        />
        <img
          src={`${import.meta.env.BASE_URL}images/brand-object${dark ? "-dark" : ""}.webp`}
          alt=""
          width="1440"
          height="1440"
          fetchPriority="high"
        />
      </picture>
    </div>
  );
}
