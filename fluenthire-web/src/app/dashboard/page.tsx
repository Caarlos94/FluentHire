"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Briefcase,
  ChevronDown,
  Code,
  DollarSign,
  FileText,
  Gauge,
  Lightbulb,
  Loader2,
  MessageSquareText,
  Mic,
  Pencil,
  Play,
  RefreshCw,
  Sparkles,
  Heart,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { getScoreLabel, getScoreBadgeColor } from "@/lib/score";
import { CATEGORY_CONFIG, DIFFICULTY_COLOR } from "@/components/practice/constants";
import { DashboardJDTour, DashboardImproveTour, DashboardWelcomeTour } from "@/components/practice-tour";
import type {
  ProgressResponse,
  QuestionResponse,
  JobDescriptionAnalysisResponse,
  Page,
} from "@/types/api";
import type { InterviewHistoryItem } from "@/types/interview";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatScore(score: number | null): string {
  if (score === null) return "—";
  return score.toFixed(1);
}


// ─── Stats Cards ────────────────────────────────────────────────────────────

function StatsCards({ progress }: { progress: ProgressResponse | null }) {
  const stats = [
    {
      label: "Questions Attempted",
      value: progress?.totalQuestionsAttempted ?? 0,
      icon: Target,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Responses",
      value: progress?.totalResponses ?? 0,
      icon: MessageSquareText,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      label: "Avg. Communication",
      value: formatScore(progress?.averageCommunicationScore ?? null),
      icon: BarChart3,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      label: "Avg. Technical",
      value: formatScore(progress?.averageTechnicalScore ?? null),
      icon: TrendingUp,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`size-5 ${stat.iconColor}`} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Practice Mode Button ────────────────────────────────────────────────────

const CATEGORY_MODES: Record<string, { label: string; mode: string; disabled?: boolean }[]> = {
  CODING: [
    { label: "Q&A Practice", mode: "" },
    { label: "Think Out Loud", mode: "think-out-loud" },
    { label: "Coding Interview", mode: "interview" },
  ],
  BEHAVIORAL: [
    { label: "Q&A Practice", mode: "" },
    { label: "Behavioral Interview", mode: "behavioral-interview" },
  ],
  SYSTEM_DESIGN: [
    { label: "Q&A Practice", mode: "" },
  ],
  TECHNICAL_KNOWLEDGE: [
    { label: "Q&A Practice", mode: "" },
  ],
};

function PracticeModeButton({ questionId, category }: { questionId: number; category: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const modes = CATEGORY_MODES[category] ?? CATEGORY_MODES.TECHNICAL_KNOWLEDGE;

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen(!open);
  };

  // Single mode — direct link, no dropdown
  if (modes.length === 1) {
    return (
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href={`/practice/${questionId}`} />}
      >
        Practice
        <ArrowRight data-icon="inline-end" />
      </Button>
    );
  }

  return (
    <div ref={ref}>
      <Button variant="outline" size="sm" onClick={handleToggle}>
        Practice
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <div
          className="fixed z-50 min-w-44 rounded-lg border bg-background p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
          style={{ top: pos.top, right: pos.right }}
        >
          {modes.map((m) =>
            m.disabled ? (
              <span
                key={m.mode}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              >
                {m.label}
              </span>
            ) : (
              <Link
                key={m.mode}
                href={m.mode === "interview" ? `/practice/interview/setup/${questionId}` : m.mode === "behavioral-interview" ? `/practice/interview/setup/${questionId}?category=BEHAVIORAL` : m.mode === "think-out-loud" ? `/practice/${questionId}?mode=think-out-loud` : `/practice/${questionId}`}
                className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {m.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Recommended Questions ──────────────────────────────────────────────────

function RecommendedQuestions({
  questions,
}: {
  questions: QuestionResponse[];
}) {
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Sparkles className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            No recommended questions yet. Start practicing to get personalized
            recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => {
        const cat = CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
        const diffColor = DIFFICULTY_COLOR[question.difficulty] ?? "";

        const catBorderColor: Record<string, string> = {
              BEHAVIORAL: "border-l-cyan-500",
              SYSTEM_DESIGN: "border-l-purple-500",
              CODING: "border-l-blue-500",
              TECHNICAL_KNOWLEDGE: "border-l-orange-500",
            };

        return (
          <Card key={question.id} size="sm" className={`border-l-4 ${catBorderColor[question.category] ?? "border-l-primary"} transition-all hover:bg-muted/40 hover:ring-1 hover:ring-primary/40 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]`}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {question.title}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className={`text-[12px] font-semibold ${cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground"}`}>
                    {cat.label}
                  </span>
                  <span className="text-border">&middot;</span>
                  {question.category === "BEHAVIORAL" && question.tier ? (
                    <span className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {question.tier.replace("_", " ")}
                    </span>
                  ) : (
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>
                      {question.difficulty}
                    </span>
                  )}
                  {question.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] text-muted-foreground/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <PracticeModeButton questionId={question.id} category={question.category} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


// ─── Recommended Section with Tabs ──────────────────────────────────────────

type RecommendedTab = "profile" | "job" | "improve" | "favorites";

const TAB_STYLE_ACTIVE = "bg-background text-foreground shadow-sm";
const TAB_STYLE_INACTIVE = "text-muted-foreground hover:text-foreground";

function RecommendedSection({
  recommended,
  jobRecommended,
  hasJobAnalysis,
  progress,
  interviewHistory,
  favoriteQuestions,
  setFavoriteQuestions,
}: {
  recommended: QuestionResponse[];
  jobRecommended: QuestionResponse[];
  hasJobAnalysis: boolean;
  progress: ProgressResponse | null;
  interviewHistory: InterviewHistoryItem[];
  favoriteQuestions: QuestionResponse[];
  setFavoriteQuestions: (questions: QuestionResponse[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<RecommendedTab>("profile");

  // Practice mode weak questions
  const weakPractice = (progress?.questionProgress ?? [])
    .filter((qh) => {
      if (qh.latestCommunicationScore === null || qh.latestTechnicalScore === null) return false;
      const ps = qh.latestProblemSolvingScore;
      const avg = ps !== null
        ? (qh.latestCommunicationScore + qh.latestTechnicalScore + ps) / 3
        : (qh.latestCommunicationScore + qh.latestTechnicalScore) / 2;
      return avg < 60;
    })
    .map((qh) => {
      const ps = qh.latestProblemSolvingScore;
      const avg = ps !== null
        ? ((qh.latestCommunicationScore ?? 0) + (qh.latestTechnicalScore ?? 0) + ps) / 3
        : ((qh.latestCommunicationScore ?? 0) + (qh.latestTechnicalScore ?? 0)) / 2;
      return { ...qh, avgScore: Math.round(avg), source: "practice" as const };
    });

  // Interview session weak questions (3 scores)
  const weakInterviews = interviewHistory
    .filter((iv) => {
      const avg = (iv.communicationScore + iv.technicalScore + iv.problemSolvingScore) / 3;
      return avg < 60;
    })
    .map((iv) => ({
      questionId: iv.questionId,
      questionTitle: iv.questionTitle,
      category: iv.category,
      mode: "INTERVIEW",
      avgScore: Math.round((iv.communicationScore + iv.technicalScore + iv.problemSolvingScore) / 3),
      communicationScore: iv.communicationScore,
      technicalScore: iv.technicalScore,
      problemSolvingScore: iv.problemSolvingScore,
      format: iv.format,
      sessionId: iv.sessionId,
      source: "interview" as const,
    }));

  const weakQuestions = [...weakPractice, ...weakInterviews]
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 9);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "profile" ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE
            }`}
          >
            Recommended
          </button>
          <button
            onClick={() => setActiveTab("job")}
            data-tour="jd-tailored-tab"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "job" ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE
            }`}
          >
            Tailored for This Job
          </button>
          <button
            onClick={() => setActiveTab("improve")}
            data-tour="improve-tab"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "improve" ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE
            }`}
          >
            Keep Practicing
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "favorites" ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE
            }`}
          >
            Favorites
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/practice" />}
        >
          View All
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="min-h-[28rem]">
      {activeTab === "profile" && (
        <RecommendedQuestions questions={recommended} />
      )}

      {activeTab === "job" && (
        hasJobAnalysis ? (
          <RecommendedQuestions questions={jobRecommended} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">No job description yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a job description to get questions matched to your target role.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                nativeButton={false}
                render={<Link href="/onboarding?step=jd" />}
              >
                <FileText className="size-4" />
                Add Job Description
              </Button>
            </CardContent>
          </Card>
        )
      )}

      {activeTab === "improve" && (
        weakQuestions.length > 0 ? (
          <div className="space-y-2">
            {weakQuestions.map((qh) => {
              const catBorderColor: Record<string, string> = {
                BEHAVIORAL: "border-l-cyan-500",
                SYSTEM_DESIGN: "border-l-purple-500",
                CODING: "border-l-blue-500",
                TECHNICAL_KNOWLEDGE: "border-l-orange-500",
              };
              const cat = CATEGORY_CONFIG[qh.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
              const catTextColor = cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground";
              const isInterview = qh.source === "interview";
              const retryHref = isInterview
                ? `/practice/interview/setup/${qh.questionId}`
                : qh.mode === "THINK_OUT_LOUD"
                  ? `/practice/${qh.questionId}?mode=think-out-loud`
                  : `/practice/${qh.questionId}`;
              const modeBadge = isInterview
                ? "Interview"
                : qh.mode === "THINK_OUT_LOUD" ? "TOL" : "Q&A";
              return (
              <Card key={`${qh.source}-${qh.questionId}-${qh.mode}`} size="sm" className={`border-l-4 ${catBorderColor[qh.category] ?? "border-l-primary"} transition-all hover:bg-muted/40 hover:ring-1 hover:ring-primary/40 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]`}>
                <CardContent className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{qh.questionTitle}</p>
                      <Badge variant={isInterview ? "default" : "outline"} className="shrink-0 text-[11px] px-1.5 py-0">
                        {modeBadge}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
                      <span className="text-border">&middot;</span>
                      {isInterview && "communicationScore" in qh ? (
                        <>
                          <span className="text-[12px] text-muted-foreground">Comm: {qh.communicationScore}</span>
                          <span className="text-border">&middot;</span>
                          <span className="text-[12px] text-muted-foreground">Tech: {qh.technicalScore}</span>
                          <span className="text-border">&middot;</span>
                          <span className="text-[12px] text-muted-foreground">PS: {qh.problemSolvingScore}</span>
                        </>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">Score: {qh.avgScore}/100</span>
                      )}
                      <span className="text-[12px] text-amber-600 dark:text-amber-400">→ aim for 60+</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={retryHref} />}
                  >
                    Retry
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <TrendingUp className="mx-auto size-8 text-emerald-500/40" />
              <p className="mt-3 text-sm font-medium">All your scores are above 60 — keep it up!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Practice more questions and any scoring below 60 will show up here for you to retry.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {activeTab === "favorites" && (() => {
        const handleRemoveFavorite = async (questionId: number) => {
          const prev = favoriteQuestions;
          setFavoriteQuestions(favoriteQuestions.filter((q) => q.id !== questionId));
          try {
            await api.toggleFavoriteQuestion(questionId);
          } catch {
            setFavoriteQuestions(prev);
          }
        };

        return favoriteQuestions.length > 0 ? (
          <div className="space-y-2">
            {favoriteQuestions.map((question) => {
              const cat = CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
              const diffColor = DIFFICULTY_COLOR[question.difficulty] ?? "";
              const catBorderColor: Record<string, string> = {
                BEHAVIORAL: "border-l-cyan-500",
                SYSTEM_DESIGN: "border-l-purple-500",
                CODING: "border-l-blue-500",
                TECHNICAL_KNOWLEDGE: "border-l-orange-500",
              };
              return (
                <Card key={question.id} size="sm" className={`border-l-4 ${catBorderColor[question.category] ?? "border-l-primary"} transition-all hover:bg-muted/40 hover:ring-1 hover:ring-primary/40 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]`}>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {question.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className={`text-[12px] font-semibold ${cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground"}`}>
                          {cat.label}
                        </span>
                        <span className="text-border">&middot;</span>
                        {question.category === "BEHAVIORAL" && question.tier ? (
                          <span className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {question.tier.replace("_", " ")}
                          </span>
                        ) : (
                          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>
                            {question.difficulty}
                          </span>
                        )}
                        {question.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] text-muted-foreground/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => handleRemoveFavorite(question.id)}
                        aria-label="Remove from favorites"
                        className="rounded-md p-1.5 text-rose-500 transition-colors hover:bg-rose-500/10"
                      >
                        <Heart className="size-4 fill-current" />
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/practice/${question.id}`} />}
                      >
                        Try
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Heart className="mx-auto size-8 text-rose-400/40" />
              <p className="mt-3 text-sm font-medium">No favorites yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap the heart icon on any question in Practice to save it here.
              </p>
            </CardContent>
          </Card>
        );
      })()}
      </div>
    </div>
  );
}

// ─── Job Description Summary ────────────────────────────────────────────────

function JobDescriptionCard({
  analysis,
}: {
  analysis: JobDescriptionAnalysisResponse | null;
}) {
  if (!analysis) {
    return (
      <Card className="border-dashed" data-tour="jd-card">
        <CardContent className="py-6 text-center">
          <FileText className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No Job Description Yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste a job posting to get personalized questions and feedback
            tailored to your target role.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href="/onboarding?step=jd" />}
          >
            <FileText className="size-4" />
            Add Job Description
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" data-tour="jd-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-primary" />
            <CardTitle className="truncate text-sm">Job Description Analysis</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            nativeButton={false}
            render={<Link href="/onboarding?step=jd" />}
            title="Update job description"
            data-tour="jd-edit"
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
        <CardDescription className="truncate">{analysis.jobTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{analysis.seniorityLevel}</Badge>
          <Badge variant="secondary">{analysis.roleType}</Badge>
          {analysis.companyType && (
            <Badge variant="outline" className="max-w-full truncate">{analysis.companyType}</Badge>
          )}
        </div>
        {analysis.technologies.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.technologies.slice(0, 16).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {analysis.technologies.length > 16 && (
                <Badge variant="secondary" className="text-xs">
                  +{analysis.technologies.length - 16} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Recent Progress ────────────────────────────────────────────────────────

function RecentProgress({ progress, interviews }: { progress: ProgressResponse | null; interviews: InterviewHistoryItem[] }) {
  const hasQA = progress && progress.questionProgress.length > 0;
  const hasInterviews = interviews.length > 0;
  if (!hasQA && !hasInterviews) return null;

  // Build a unified list sorted by most recent activity
  type RecentItem =
    | { kind: "qa"; data: ProgressResponse["questionProgress"][number] }
    | { kind: "interview"; data: InterviewHistoryItem };

  const items: RecentItem[] = [];

  if (progress) {
    for (const qh of progress.questionProgress) {
      items.push({ kind: "qa", data: qh });
    }
  }
  // One card per interview session (sorted by date, no dedup by question)
  for (const iv of interviews) {
    items.push({ kind: "interview", data: iv });
  }

  // Sort by date — Q&A uses latest attempt date, interview uses createdAt
  items.sort((a, b) => {
    const dateA = a.kind === "interview"
      ? new Date(a.data.createdAt).getTime()
      : Math.max(...(a.data as ProgressResponse["questionProgress"][number]).attempts.map((att) => new Date(att.createdAt).getTime()));
    const dateB = b.kind === "interview"
      ? new Date(b.data.createdAt).getTime()
      : Math.max(...(b.data as ProgressResponse["questionProgress"][number]).attempts.map((att) => new Date(att.createdAt).getTime()));
    return dateB - dateA;
  });

  const hasMore = items.length > 5;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="size-4 text-primary" />
          <CardTitle className="text-sm">Recent Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className={hasMore ? "relative" : ""}>
          <div className={hasMore ? "max-h-[295px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : ""}>
          {items.map((item) => {
            if (item.kind === "qa") {
              const qh = item.data;
              const latestAttempt = [...qh.attempts].filter((a) => a.analyzed).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
              const mode = qh.mode === "THINK_OUT_LOUD" ? "think-out-loud" : "qa";
              const href = latestAttempt
                ? `/practice/${qh.questionId}/results/${latestAttempt.responseId}?mode=${mode}`
                : `/practice/${qh.questionId}${qh.mode === "THINK_OUT_LOUD" ? "?mode=think-out-loud" : ""}`;
              return (
                <Link
                  key={`${qh.questionId}-${qh.mode}`}
                  href={href}
                  className="block rounded-lg p-2 -mx-2 space-y-1.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-snug">
                      {qh.questionTitle}
                    </p>
                    <Badge variant="outline" className="shrink-0 text-[11px] px-1.5 py-0">
                      {qh.mode === "THINK_OUT_LOUD" ? "TOL" : "Q&A"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      {qh.totalAttempts} attempt{qh.totalAttempts !== 1 ? "s" : ""}
                    </span>
                    {qh.latestCommunicationScore !== null && (
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground">Comm</span>
                        <ScoreBadge score={qh.latestCommunicationScore} />
                        {qh.communicationImprovement !== null &&
                          qh.communicationImprovement > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              +{qh.communicationImprovement.toFixed(0)}
                            </span>
                          )}
                      </span>
                    )}
                    {qh.latestTechnicalScore !== null && (
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground">Tech</span>
                        <ScoreBadge score={qh.latestTechnicalScore} />
                        {qh.technicalImprovement !== null &&
                          qh.technicalImprovement > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              +{qh.technicalImprovement.toFixed(0)}
                            </span>
                          )}
                      </span>
                    )}
                  </div>
                </Link>
              );
            }

            const iv = item.data;
            const topicCount = iv.questionIds?.length || 1;
            const displayTitle = topicCount > 1
              ? iv.questionTitles?.join(" & ") ?? iv.questionTitle
              : iv.questionTitle;
            return (
              <Link
                key={`interview-${iv.sessionId}`}
                href={`/practice/interview/report/${iv.sessionId}`}
                className="block rounded-lg p-2 -mx-2 space-y-1.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-snug truncate">
                    {displayTitle}
                  </p>
                  <Badge variant="default" className="shrink-0 text-[11px] px-1.5 py-0">
                    Interview
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">Comm</span>
                    <ScoreBadge score={iv.communicationScore} />
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">Tech</span>
                    <ScoreBadge score={iv.technicalScore} />
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">PS</span>
                    <ScoreBadge score={iv.problemSolvingScore} />
                  </span>
                </div>
              </Link>
            );
          })}
          </div>
          {hasMore && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
          )}
        </div>
        <div className="h-[10px]" />
      </CardContent>
      <div className="px-6 pb-1.5">
        <Link
          href="/practice?mode=history"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          View Full History
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </Card>
  );
}


// ─── Practice Mode Picker (new users) ────────────────────────────────────────

const PRACTICE_MODES = [
  {
    icon: MessageSquareText,
    label: "Q&A Practice",
    description: "Practice behavioral, system design, and technical knowledge questions with AI feedback.",
    href: "/practice",
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    label: "Think Out Loud",
    description: "Solve coding problems with a code editor while explaining your reasoning out loud.",
    href: "/practice?mode=think-out-loud",
    color: "text-green-600 dark:text-green-400 bg-green-500/10",
  },
  {
    icon: Mic,
    label: "Coding Interview",
    description: "Solve coding problems in real-time while an AI interviewer asks follow-up questions and evaluates your approach.",
    href: "/practice?mode=interview",
    color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
  {
    icon: BrainCircuit,
    label: "Behavioral Interview",
    description: "Practice behavioral questions with an AI interviewer who probes using the STAR method.",
    href: "/practice?mode=behavioral-interview",
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
  },
];

function PracticeModePicker({ compact = false }: { compact?: boolean }) {
  return (
    <Card data-tour="dashboard-practice-modes">
      <CardHeader>
        <CardTitle className={compact ? "text-sm font-bold text-center sm:text-left" : "text-xl font-semibold"}>
          {compact ? "Practice Modes" : <h3>Choose Your Practice Mode</h3>}
        </CardTitle>
        <CardDescription className={compact ? "text-center sm:text-left" : ""}>
          Pick a mode that matches how you want to practice today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRACTICE_MODES.map((mode) => (
            <Link
              key={mode.label}
              href={mode.href}
              className="group relative flex flex-col rounded-xl border p-4 transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${mode.color}`}>
                <mode.icon className="size-5" />
              </div>
              <p className="mt-3 text-sm font-semibold">{mode.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {mode.description}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Feature Vote Banner ────────────────────────────────────────────────────

function FeatureVoteBanner({ featureName, icon: Icon, iconColor, label, description }: {
  featureName: string;
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
}) {
  const [userVote, setUserVote] = useState<boolean | null | "loading">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getFeatureVote(featureName)
      .then((data) => setUserVote(data.userVote))
      .catch(() => setUserVote(null));
  }, [featureName]);

  const handleVote = async (vote: boolean) => {
    if (isSubmitting) return;
    const prevVote = userVote;
    setIsSubmitting(true);
    setUserVote(vote);
    try {
      await api.submitFeatureVote(featureName, vote);
    } catch {
      setUserVote(prevVote);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconColor}`}>
          <Icon className="size-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{label}</p>
            <Badge variant="outline" className="text-[11px] px-1.5 py-0">
              Coming Soon
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <p className="mr-1 text-xs text-muted-foreground hidden sm:block">Interested?</p>
        <button
          onClick={() => handleVote(true)}
          disabled={isSubmitting || userVote === "loading"}
          aria-label="I want this feature"
          aria-pressed={userVote === true}
          className={`rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            userVote === true
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ThumbsUp className="size-4" />
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isSubmitting || userVote === "loading"}
          aria-label="Not interested in this feature"
          aria-pressed={userVote === false}
          className={`rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            userVote === false
              ? "bg-red-500/15 text-red-600 dark:text-red-400"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ThumbsDown className="size-4" />
        </button>
      </div>
    </div>
  );
}

function ComingSoonBanners() {
  return (
    <div className="space-y-3">
      <FeatureVoteBanner
        featureName="SALARY_NEGOTIATION"
        icon={DollarSign}
        iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        label="Salary Negotiation Practice"
        description="Practice negotiating offers with an AI hiring manager."
      />
    </div>
  );
}

// ─── Continue Where You Left Off (returning users) ───────────────────────────

function ContinueCard({ progress }: { progress: ProgressResponse }) {
  if (progress.questionProgress.length === 0) return null;

  const last = progress.questionProgress[0];
  const avgScore =
    last.latestCommunicationScore !== null && last.latestTechnicalScore !== null
      ? (last.latestCommunicationScore + last.latestTechnicalScore) / 2
      : null;

  return (
    <Card className="border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
      <CardContent className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Play className="size-5 text-primary" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-primary">Continue where you left off</p>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{last.questionTitle}</p>
            <Badge variant="outline" className="shrink-0 text-[11px] px-1.5 py-0">
              {last.mode === "THINK_OUT_LOUD" ? "TOL" : "Q&A"}
            </Badge>
          </div>
          {avgScore !== null && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Last score: {avgScore.toFixed(0)}/100 · {last.totalAttempts} attempt{last.totalAttempts !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={last.mode === "THINK_OUT_LOUD" ? `/practice/${last.questionId}?mode=think-out-loud` : `/practice/${last.questionId}`} />}
        >
          Try Again
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Score Badge ────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = getScoreBadgeColor(score);

  return (
    <span className={`inline-flex min-w-[2.5rem] items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${color}`} title={getScoreLabel(score)}>
      {score.toFixed(0)}
    </span>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryItem[]>([]);
  const [recommended, setRecommended] = useState<QuestionResponse[]>([]);
  const [jobRecommended, setJobRecommended] = useState<QuestionResponse[]>([]);
  const [favoriteQuestions, setFavoriteQuestions] = useState<QuestionResponse[]>([]);
  const [jobAnalysis, setJobAnalysis] =
    useState<JobDescriptionAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoadError(false);
      try {
        const [progressData, interviewData, recommendedData, jdData, jobRecData, favData] = await Promise.all([
          api.getProgress().catch(() => null),
          api.getInterviewHistory(0, 20).catch(() => null),
          api.getRecommendedQuestions().catch(() => []),
          user?.hasJobDescriptionAnalysis
            ? api.getJobDescriptionAnalysis().catch(() => null)
            : Promise.resolve(null),
          user?.hasJobDescriptionAnalysis
            ? api.getJobRecommendedQuestions().catch(() => [])
            : Promise.resolve([]),
          api.getFavoriteQuestions().catch(() => []),
        ]);

        // If all critical data failed, show error
        if (progressData === null && recommendedData.length === 0) {
          setLoadError(true);
        }

        setProgress(progressData);
        setInterviewHistory(interviewData?.content ?? []);
        setRecommended(recommendedData);
        setJobAnalysis(jdData);
        setJobRecommended(jobRecData);
        setFavoriteQuestions(favData);
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [user?.hasJobDescriptionAnalysis]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const isNewUser =
    !progress || progress.totalResponses === 0;

  const hasWeakPractice = (progress?.questionProgress ?? []).some((qh) => {
    if (qh.latestCommunicationScore === null || qh.latestTechnicalScore === null) return false;
    const ps = qh.latestProblemSolvingScore;
    const avg = ps !== null
      ? (qh.latestCommunicationScore + qh.latestTechnicalScore + ps) / 3
      : (qh.latestCommunicationScore + qh.latestTechnicalScore) / 2;
    return avg < 60;
  });
  const hasWeakInterviews = interviewHistory.some((iv) =>
    (iv.communicationScore + iv.technicalScore + iv.problemSolvingScore) / 3 < 60
  );
  const hasWeakQuestions = hasWeakPractice || hasWeakInterviews;

  return (
    <>
      <DashboardWelcomeTour />
      {jobAnalysis && <DashboardJDTour />}
      {hasWeakQuestions && <DashboardImproveTour />}
    <div className="mt-2.5 space-y-8">
      {loadError && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">
            Some data couldn&apos;t be loaded. Please check your connection.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setLoadError(false);
              window.location.reload();
            }}
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Welcome Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div data-tour="dashboard-start">
          <h1 className="text-2xl font-bold tracking-tight">
            {isNewUser ? `Welcome, ${user?.firstName}!` : `Welcome back, ${user?.firstName}`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNewUser
              ? "Pick a practice mode below and start your first session."
              : "Keep practicing to improve your interview skills."}
          </p>
        </div>

        <Link
          href="/practice"
          className="btn-gradient inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-6 text-sm font-medium"
        >
          Start Practicing
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* ── Profile Summary ── */}
      {user && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Gauge className="size-3" />
            {user.experienceLevel}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Briefcase className="size-3" />
            {user.roleType}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Code className="size-3" />
            {user.mainLanguage}
          </Badge>
        </div>
      )}

      {/* ── Stats + Continue (returning users) ── */}
      {!isNewUser && (
        <>
          <StatsCards progress={progress} />
          {progress && <ContinueCard progress={progress} />}
        </>
      )}

      {/* ── Interview Mode CTA ── */}
      {interviewHistory.length === 0 && (user?.credits ?? 0) > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Mic className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Try a Live AI Interview</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Practice with a real-time AI interviewer that asks follow-ups and scores you live. You have{" "}
              <span className="font-medium text-primary">{user?.credits} credit{(user?.credits ?? 0) !== 1 ? "s" : ""}</span> available.
            </p>
          </div>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/practice?mode=interview" />}
          >
            Try Interview Mode
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      )}
      {(user?.credits ?? 0) === 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Want More Interview Practice?</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Upgrade to get monthly Live AI Interview credits with real-time scoring and conversation.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-500/30 hover:bg-amber-500/10"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            View Plans
          </Button>
        </div>
      )}

      {/* ── Practice Mode Picker (always visible) ── */}
      <PracticeModePicker compact={!isNewUser} />

      {/* ── Coming Soon Features ── */}
      <ComingSoonBanners />

      {/* ── Main content grid ── */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        {/* Left: recommended questions */}
        <div className="min-w-0 space-y-4 lg:col-span-2" data-tour="dashboard-recommended">
          <RecommendedSection
            recommended={recommended}
            jobRecommended={jobRecommended}
            hasJobAnalysis={!!jobAnalysis}
            progress={progress}
            interviewHistory={interviewHistory}
            favoriteQuestions={favoriteQuestions}
            setFavoriteQuestions={setFavoriteQuestions}
          />
        </div>

        {/* Right: sidebar */}
        <div className="min-w-0 space-y-6">
          <JobDescriptionCard analysis={jobAnalysis} />
          <RecentProgress progress={progress} interviews={interviewHistory} />
        </div>
      </div>
    </div>
    </>
  );
}
