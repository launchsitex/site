import React, { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  threshold?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ children, threshold = 0.1 }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      {
        threshold,
        rootMargin: '50px',
      }
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
  }, [threshold]);

  return (
    <div ref={elementRef} className="fade-in-section">
      {children}
    </div>
  );
};

export default ScrollAnimation;