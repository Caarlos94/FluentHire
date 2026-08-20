"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function useInterviewTimer(
  durationSeconds: number,
  onExpire: () => void
) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          cleanup();
          setIsRunning(false);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return cleanup;
  }, [isRunning, cleanup]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const elapsedSeconds = durationSeconds - remainingSeconds;

  return {
    remainingSeconds,
    elapsedSeconds,
    isExpired: remainingSeconds <= 0,
    isRunning,
    formattedRemaining: formatRemaining(remainingSeconds),
    start,
    pause,
  };
}
