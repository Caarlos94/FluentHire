"use client";

import { getScoreLabel, getScoreColor } from "@/lib/score";

export function ScoreCircle({
  score,
  label,
  size = "md",
}: {
  score: number;
  label: string;
  size?: "sm" | "md";
}) {
  const circumference = 2 * Math.PI * 40;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const sizeClass = size === "sm" ? "size-20" : "size-24";
  const textSize = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${sizeClass}`}>
        <svg className={`${sizeClass} -rotate-90`} viewBox="0 0 96 96">
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
            strokeDasharray={`${progress} ${circumference}`}
            className={color}
            style={{ transition: "stroke-dasharray 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${textSize} font-bold`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold ${color}`}>{scoreLabel}</span>
    </div>
  );
}
