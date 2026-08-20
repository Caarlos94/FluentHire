"use client";

import { useState, useEffect } from "react";

const words = [
  "Behavioral",
  "System Design",
  "Coding",
  "Technical",
];

export function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block rounded-lg bg-primary/10 px-3 text-primary transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {words[index]}
    </span>
  );
}
