'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!counterRef.current || startedRef.current) return;
    startedRef.current = true;

    const el = counterRef.current;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
      },
    });

    return () => {
      gsap.killTweensOf(obj);
    };
  }, [value, suffix, prefix, duration]);

  return <span ref={counterRef}>{prefix}0{suffix}</span>;
}
