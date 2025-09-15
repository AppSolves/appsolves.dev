import { useScrollTriggered } from '@/hooks/use-scroll-triggered';
import { ReactNode, useEffect } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  afterReveal?: () => void;
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  threshold = 0.3,
  afterReveal,
}: ScrollRevealProps) => {
  const { elementRef, isVisible } = useScrollTriggered({ threshold });

  useEffect(() => {
    if (isVisible && afterReveal) {
      afterReveal();
    }
  }, [isVisible, afterReveal]);

  return (
    <div
      ref={elementRef as any}
      className={`transition-all duration-700 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
