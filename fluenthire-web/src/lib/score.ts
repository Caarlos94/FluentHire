export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Solid Start";
  if (score >= 40) return "Keep Practicing";
  return "Building Foundations";
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-500";
  if (score >= 55) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 70) return "bg-emerald-500/10 text-emerald-600";
  if (score >= 55) return "bg-yellow-500/10 text-yellow-600";
  if (score >= 40) return "bg-orange-500/10 text-orange-600";
  return "bg-red-500/10 text-red-600";
}
