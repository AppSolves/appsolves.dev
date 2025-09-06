import { ReactNode } from 'react';
import { useScrollTriggered } from '@/hooks/use-scroll-triggered';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

const ScrollReveal = ({ children, className = "", delay = 0, threshold = 0.3 }: ScrollRevealProps) => {
  const { elementRef, isVisible } = useScrollTriggered({ threshold });

  return (
    <div
      ref={elementRef as any}
      className={`transition-all duration-700 ease-out ${
        isVisible 
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