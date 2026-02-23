"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;   // ms
  start?: number;
  decimals?: number;
  suffix?: string;
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  suffix = "",
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Intersection Observer: trigger saat elemen masuk viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Animasi count-up saat hasStarted
  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    const range = end - start;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;

      setCount(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasStarted, end, start, duration, decimals]);

  const display = suffix
    ? `${count.toLocaleString("id-ID")}${suffix}`
    : count.toLocaleString("id-ID");

  return { ref, display, count };
}