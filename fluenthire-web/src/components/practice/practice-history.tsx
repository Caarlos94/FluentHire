"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Clock, Loader2 } from "lucide-react";
import { CATEGORY_CONFIG } from "./constants";
import type { InterviewHistoryItem } from "@/types/interview";

type HistoryEntry = {
  id: string;
  type: "qa" | "tol" | "interview";
  questionTitle: string;
  questionTitles?: string[];
  questionId: number;
  category: string;
  mode: string;
  format?: string;
  difficulty?: string;
  communicationScore: number | null;
  technicalScore: number | null;
  problemSolvingScore?: number;
  attemptNumber: number;
  totalAttempts: number;
  createdAt: string;
};

type ModeFilter = "ALL" | "QA" | "TOL" | "INTERVIEW";

const PAGE_SIZE = 10;

function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-500";
  if (score >= 70) return "text-blue-400";
  if (score >= 55) return "text-yellow-500";
  return "text-red-400";
}

function scoreBgColor(score: number): string {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-400";
  if (score >= 55) return "bg-yellow-500";
  return "bg-red-400";
}

function relativeDate(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
      {label}:
      <span className={`font-bold ${scoreColor(score)}`}>{score}</span>
      <span className="inline-block h-[4px] w-10 rounded-full bg-muted overflow-hidden">
        <span className={`block h-full rounded-full ${scoreBgColor(score)}`} style={{ width: `${score}%` }} />
      </span>
    </span>
  );
}

export function PracticeHistory({
  modeFilter,
  setModeFilter,
  currentPage,
  setCurrentPage,
}: {
  modeFilter: string;
  setModeFilter: (f: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    Promise.all([
      api.getProgress().catch(() => null),
      api.getInterviewHistory(0, 100).catch(() => null),
    ]).then(([progress, interviewData]) => {
      const merged: HistoryEntry[] = [];

      // Flatten Q&A/TOL attempts
      if (progress) {
        for (const qh of progress.questionProgress) {
          const analyzed = qh.attempts
            .filter((a) => a.analyzed)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const total = analyzed.length;
          analyzed.forEach((attempt, i) => {
            merged.push({
              id: String(attempt.responseId),
              type: qh.mode === "THINK_OUT_LOUD" ? "tol" : "qa",
              questionTitle: qh.questionTitle,
              questionId: qh.questionId,
              category: qh.category,
              mode: qh.mode === "THINK_OUT_LOUD" ? "Think Out Loud" : "Q&A Practice",
              communicationScore: attempt.communicationScore,
              technicalScore: attempt.technicalScore,
              attemptNumber: i + 1,
              totalAttempts: total,
              createdAt: attempt.createdAt,
            });
          });
        }
      }

      // Add interview sessions — one entry per session
      if (interviewData) {
        const sorted = [...interviewData.content].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        sorted.forEach((item, i) => {
          const topicCount = item.questionIds?.length || 1;
          const displayTitle = topicCount > 1
            ? item.questionTitles?.join(" & ") ?? item.questionTitle
            : item.questionTitle;
          merged.push({
            id: item.sessionId,
            type: "interview",
            questionTitle: displayTitle,
            questionTitles: item.questionTitles,
            questionId: item.questionId,
            category: item.category,
            mode: item.category === "BEHAVIORAL" ? "Behavioral Interview" : "Coding Interview",
            format: item.format === "STANDARD" ? "Standard" : "Quick",
            communicationScore: item.communicationScore,
            technicalScore: item.technicalScore,
            problemSolvingScore: item.problemSolvingScore,
            attemptNumber: i + 1,
            totalAttempts: sorted.length,
            createdAt: item.createdAt,
          });
        });
      }

      // Group by question+type for Q&A/TOL, by session for interviews
      // Sort groups by latest attempt (newest first), within each group sort by attempt number (oldest first)
      const groups = new Map<string, HistoryEntry[]>();
      for (const entry of merged) {
        const key = entry.type === "interview"
          ? `interview-${entry.id}`
          : `${entry.questionId}-${entry.type}`;
        const list = groups.get(key) ?? [];
        list.push(entry);
        groups.set(key, list);
      }
      const sortedGroups = [...groups.values()]
        .map((group) => {
          group.sort((a, b) => a.attemptNumber - b.attemptNumber);
          const latest = Math.max(...group.map((e) => new Date(e.createdAt).getTime()));
          return { group, latest };
        })
        .sort((a, b) => b.latest - a.latest)
        .flatMap((g) => g.group);

      setEntries(sortedGroups);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (modeFilter === "ALL") return entries;
    if (modeFilter === "QA") return entries.filter((e) => e.type === "qa");
    if (modeFilter === "TOL") return entries.filter((e) => e.type === "tol");
    return entries.filter((e) => e.type === "interview");
  }, [entries, modeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const page = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleView = (entry: HistoryEntry) => {
    if (entry.type === "interview") {
      router.push(`/practice/interview/report/${entry.id}`);
    } else {
      const mode = entry.type === "tol" ? "think-out-loud" : "qa";
      router.push(`/practice/${entry.questionId}/results/${entry.id}?mode=${mode}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Interview History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your past practice sessions and track your progress over time.
        </p>
      </div>

      {/* Mode filter */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-4">
        {([
          { value: "ALL", label: "All" },
          { value: "QA", label: "Q&A Practice" },
          { value: "TOL", label: "Think Out Loud" },
          { value: "INTERVIEW", label: "Interviews" },
        ] as const).map((f) => (
          <button
            key={f.value}
            onClick={() => { setModeFilter(f.value); setCurrentPage(0); }}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              modeFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              {modeFilter === "ALL"
                ? "No practice sessions yet. Start practicing to see your history here."
                : "No sessions found for this mode."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {page.map((entry) => {
            const cat = CATEGORY_CONFIG[entry.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
            const catTextColor = cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground";
            const catBorderColor: Record<string, string> = {
              BEHAVIORAL: "border-l-cyan-500",
              SYSTEM_DESIGN: "border-l-purple-500",
              CODING: "border-l-blue-500",
              TECHNICAL_KNOWLEDGE: "border-l-orange-500",
            };
            return (
              <button
                key={`${entry.type}-${entry.id}`}
                onClick={() => handleView(entry)}
                className={`group w-full rounded-lg border border-border/60 border-l-4 ${catBorderColor[entry.category] ?? "border-l-primary"} bg-card p-3 text-left transition-all hover:bg-muted/40 hover:ring-1 hover:ring-primary/40 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]`}
              >
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 text-sm font-medium leading-snug group-hover:text-primary">
                    {entry.type !== "interview" && (
                      <><span className="text-[12px] text-muted-foreground font-normal">Attempt {entry.attemptNumber}</span> <span className="text-border">&middot;</span>{" "}</>
                    )}
                    {entry.questionTitle}
                  </p>
                  <span className={`shrink-0 text-xs font-semibold ${catTextColor}`}>
                    {entry.type === "interview" && entry.format ? `${entry.format} · ` : ""}
                    {entry.type === "interview"
                      ? `${(entry.questionTitles?.length ?? 1)} ${(entry.questionTitles?.length ?? 1) === 1 ? "topic" : "topics"}`
                      : entry.mode}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
                  <span className="text-border">&middot;</span>
                  <span className="text-[12px] text-muted-foreground">
                    {relativeDate(entry.createdAt)}
                  </span>
                </div>
                {(entry.communicationScore !== null || entry.technicalScore !== null || entry.problemSolvingScore !== undefined) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {entry.communicationScore !== null && (
                      <ScoreBadge label="Communication" score={entry.communicationScore} />
                    )}
                    {entry.technicalScore !== null && (
                      <ScoreBadge label="Technical" score={entry.technicalScore} />
                    )}
                    {entry.problemSolvingScore !== undefined && (
                      <ScoreBadge label="Problem Solving" score={entry.problemSolvingScore} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ArrowLeft />
            Previous
          </Button>
          <span className="px-3 text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      )}
    </div>
  );
}
