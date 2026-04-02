import { useState, useEffect, useRef } from "react";

interface UseScrollTriggeredOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollTriggered = (options: UseScrollTriggeredOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true);
        }
      },
      {
        threshold: options.threshold || 0.3,
        rootMargin: options.rootMargin || "0px",
      },
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasTriggered, options.threshold, options.rootMargin]);

  return { elementRef, isVisible, hasTriggered };
};
