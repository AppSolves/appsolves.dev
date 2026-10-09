import { useEffect, useRef } from "react";

export default function TagVaultScene() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    let near = false;
    let generation = 0;
    let request: AbortController | undefined;
    let dispose: (() => void) | undefined;
    const update = async () => {
      const current = ++generation;
      request?.abort();
      dispose?.();
      dispose = undefined;
      if (!near || !motion.matches) return;
      request = new AbortController();
      const signal = request.signal;
      try {
        const { mountPhoneScene } = await import("./phone-scene");
        if (current !== generation || signal.aborted) return;
        const cleanup = await mountPhoneScene(element, signal);
        if (current !== generation || signal.aborted) cleanup();
        else dispose = cleanup;
      } catch (error) {
        if (!signal.aborted)
          console.warn("TagVault preview unavailable:", error);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || near) return;
        near = true;
        observer.disconnect();
        void update();
      },
      { rootMargin: "240px" },
    );
    observer.observe(element);
    motion.addEventListener("change", update);
    return () => {
      generation++;
      request?.abort();
      observer.disconnect();
      motion.removeEventListener("change", update);
      dispose?.();
    };
  }, []);
  return (
    <div className="phone-scene" ref={container} aria-hidden="true">
      <picture className="phone-poster">
        <source
          srcSet={`${import.meta.env.BASE_URL}images/tagvault-phone.avif`}
          type="image/avif"
        />
        <img
          src={`${import.meta.env.BASE_URL}images/tagvault-phone.webp`}
          alt=""
          width="1600"
          height="1600"
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}
