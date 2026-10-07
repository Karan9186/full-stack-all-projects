'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
  threshold?: number;
}

export default function GSAPReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
}: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const el = ref.current;

    const getFromProps = () => {
      switch (direction) {
        case 'up':
          return { y: 40, opacity: 0 };
        case 'down':
          return { y: -40, opacity: 0 };
        case 'left':
          return { x: 60, opacity: 0 };
        case 'right':
          return { x: -60, opacity: 0 };
        case 'scale':
          return { scale: 0.9, opacity: 0 };
        default:
          return { y: 40, opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        getFromProps(),
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: `top bottom-=${threshold * 100}%`,
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, direction, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
