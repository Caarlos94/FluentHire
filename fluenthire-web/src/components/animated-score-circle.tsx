"use client";

import { useEffect, useRef, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 40;

export function AnimatedScoreCircle({
  score,
  label,
  delay = 0,
}: {
  score: number;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // Count-up animation
  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, score]);

  const progress = started ? (score / 100) * CIRCUMFERENCE : 0;

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div className="relative size-20 md:size-24">
        <svg className="size-20 md:size-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted-foreground/12"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
            className="text-emerald-500 transition-[stroke-dasharray] duration-[1.2s] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold md:text-2xl">{count}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground md:text-sm">
        {label}
      </span>
      <span className="text-xs font-semibold text-emerald-500">Excellent</span>
    </div>
  );
}
