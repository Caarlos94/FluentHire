"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function CreditBadge() {
  const { user } = useAuth();

  if (!user) return null;

  const credits = user.credits ?? 0;

  return (
    <Link
      href="/pricing"
      className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
      data-tour="dashboard-credits"
    >
      <Coins className="size-3.5" />
      <span>{credits === 0 ? "Upgrade" : credits}</span>
    </Link>
  );
}
