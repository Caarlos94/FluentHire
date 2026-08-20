"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Bug,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Flame,
  Lightbulb,
  Loader2,
  MessageCircle,
  MessageSquareText,
  Mic,
  Monitor,
  RefreshCw,
  Shield,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  RevenueResponse,
  ProductHealthResponse,
  GrowthResponse,
  ApiCostsResponse,
  InterviewSessionCostDto,
  QuestionScoreDto,
  FeedbackResponse,
  FeedbackCategory,
  SessionRatingsResponse,
} from "@/types/api";
import { Star, ThumbsDown } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tab = "revenue" | "product-health" | "growth" | "api-costs" | "feedback";

const TABS: { key: Tab; label: string; description: string }[] = [
  { key: "revenue", label: "Revenue & Survival", description: "Check daily" },
  { key: "product-health", label: "Product Health", description: "Check weekly" },
  { key: "growth", label: "Growth Intelligence", description: "Check monthly" },
  { key: "api-costs", label: "API Costs", description: "Per-session costs" },
  { key: "feedback", label: "Feedback & Ratings", description: "User satisfaction" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatMinutes(value: number): string {
  return `${value.toFixed(1)} min`;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 55) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getBarColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 55) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: typeof DollarSign;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold tracking-tight">{value}</p>
            {trend === "up" && <ArrowUpRight className="size-4 text-emerald-500" />}
            {trend === "down" && <ArrowDownRight className="size-4 text-red-500" />}
          </div>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Distribution Bar ───────────────────────────────────────────────────────

function DistributionBar({
  data,
  total,
  colorMap,
}: {
  data: Record<string, number>;
  total?: number;
  colorMap?: Record<string, string>;
}) {
  const entries = Object.entries(data);
  const sum = total ?? entries.reduce((acc, [, v]) => acc + v, 0);
  if (sum === 0) return <p className="text-sm text-muted-foreground">No data yet</p>;

  const defaultColors = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500",
    "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
    "bg-indigo-500", "bg-lime-500", "bg-teal-500", "bg-rose-500",
  ];

  return (
    <div className="space-y-2">
      {entries.map(([key, value], i) => {
        const pct = (value / sum) * 100;
        const color = colorMap?.[key] ?? defaultColors[i % defaultColors.length];
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">
                {value} ({pct.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Peak Hours Chart ───────────────────────────────────────────────────────

function PeakHoursChart({ data }: { data: Record<string, number> }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const values = hours.map((h) => data[String(h)] ?? 0);
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-[2px] h-28">
      {hours.map((hour, i) => {
        const pct = (values[i] / max) * 100;
        const isActive = values[i] > 0;
        return (
          <div
            key={hour}
            className="group relative flex-1 flex flex-col items-center justify-end"
          >
            <div
              className={`w-full rounded-t-sm transition-all duration-300 ${
                isActive ? "bg-primary/70 hover:bg-primary" : "bg-muted"
              }`}
              style={{ height: `${Math.max(pct, 4)}%` }}
            />
            <span className="mt-1 text-[9px] text-muted-foreground">
              {hour % 6 === 0 ? `${hour}h` : ""}
            </span>
            {isActive && (
              <div className="absolute -top-7 hidden rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
                {hour}:00 — {values[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Question Score List ────────────────────────────────────────────────────

function QuestionScoreList({
  questions,
  type,
}: {
  questions: QuestionScoreDto[];
  type: "highest" | "lowest";
}) {
  if (questions.length === 0)
    return <p className="text-sm text-muted-foreground">No data yet</p>;

  return (
    <div className="space-y-2">
      {questions.map((q, i) => (
        <div key={q.questionId} className="flex items-center gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {i + 1}
          </span>
          <span className="flex-1 truncate text-sm">{q.title}</span>
          <span className={`text-sm font-semibold ${getScoreColor(q.avgScore)}`}>
            {q.avgScore.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Tier 1: Revenue ────────────────────────────────────────────────────────

function RevenueTier({ data }: { data: RevenueResponse }) {
  return (
    <div className="space-y-6">
      {/* Revenue row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="MRR" value={formatCurrency(data.mrr)} icon={DollarSign} />
        <StatCard label="Starter Revenue" value={formatCurrency(data.interviewStarterRevenue)} subtext={`${data.paidUsersInterviewStarterPlan} subscribers`} icon={CreditCard} />
        <StatCard label="Pro Revenue" value={formatCurrency(data.interviewProRevenue)} subtext={`${data.paidUsersInterviewProPlan} subscribers`} icon={CreditCard} />
        <StatCard label="Intensive Revenue" value={formatCurrency(data.interviewIntensiveRevenue)} subtext={`${data.paidUsersInterviewIntensivePlan} subscribers`} icon={CreditCard} />
        <StatCard label="Conversion" value={formatPercent(data.conversionRate)} subtext={`${data.paidUsers} / ${data.totalUsers}`} icon={TrendingUp} />
      </div>

      {/* Users & Churn */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Users" value={String(data.totalUsers)} subtext={`${data.freeUsers} free · ${data.paidUsers} paid`} icon={Users} />
        <StatCard label="Churn Rate" value={formatPercent(data.churnRate)} subtext={`${data.canceledThisMonth} canceled this month`} icon={UserMinus} trend={data.churnRate > 5 ? "down" : "neutral"} />
        <StatCard label="API Cost Today" value={formatCurrency(data.estimatedApiCostToday)} subtext={`${data.creditsConsumedToday} credits used`} icon={Flame} />
        <StatCard label="New (24h / 7d / 30d)" value={`${data.newUsersLast24Hours} / ${data.newUsersLast7Days} / ${data.newUsersLast30Days}`} icon={UserPlus} />
      </div>
    </div>
  );
}

// ─── Tier 2: Product Health ─────────────────────────────────────────────────

function ProductHealthTier({ data }: { data: ProductHealthResponse }) {
  return (
    <div className="space-y-6">
      {/* Engagement */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="DAU" value={String(data.dau)} icon={Users} />
        <StatCard label="WAU" value={String(data.wau)} icon={Users} />
        <StatCard label="MAU" value={String(data.mau)} icon={Users} />
        <StatCard label="Sessions / User" value={data.avgSessionsPerUser.toFixed(1)} subtext="last 30 days" icon={BarChart3} />
      </div>

      {/* Mode popularity & Duration */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Q&A Sessions (30d)" value={String(data.qaSessionsLast30Days)} icon={MessageSquareText} />
        <StatCard label="Live Interviews (30d)" value={String(data.liveInterviewsLast30Days)} icon={Mic} />
        <StatCard label="Avg Interview Duration" value={formatMinutes(data.avgInterviewDurationMinutes)} icon={Clock} />
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Q&A Avg Scores (30d)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreBar label="Communication" score={data.avgQaCommunicationScore} />
            <ScoreBar label="Technical" score={data.avgQaTechnicalScore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Live Interview Avg Scores (30d)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreBar label="Communication" score={data.avgInterviewCommunicationScore} />
            <ScoreBar label="Technical" score={data.avgInterviewTechnicalScore} />
            <ScoreBar label="Problem Solving" score={data.avgInterviewProblemSolvingScore} />
          </CardContent>
        </Card>
      </div>

      {/* Funnel & Credits */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Onboarding Rate" value={formatPercent(data.onboardingCompletionRate)} icon={UserCheck} />
        <StatCard label="JD Upload Rate" value={formatPercent(data.jdUploadRate)} icon={Monitor} />
        <StatCard label="Credit Utilization" value={formatPercent(data.creditUtilizationRate)} subtext={`${data.creditsUsedThisPeriod} used / ${data.creditsGrantedThisPeriod} granted`} icon={Zap} />
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className={`font-semibold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Tier 3: Growth Intelligence ────────────────────────────────────────────

function GrowthTier({ data }: { data: GrowthResponse }) {
  const totalRegs = data.emailRegistrations + data.googleRegistrations;

  return (
    <div className="space-y-6">
      {/* Demographics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Experience Level</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBar data={data.experienceLevelDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Role Type</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBar data={data.roleTypeDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Main Language</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBar data={data.mainLanguageDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Category popularity + Registration split */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Most Practiced Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBar
              data={data.categoryPopularity}
              colorMap={{
                BEHAVIORAL: "bg-blue-500",
                CODING: "bg-emerald-500",
                SYSTEM_DESIGN: "bg-purple-500",
                TECHNICAL_KNOWLEDGE: "bg-orange-500",
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Registration Method</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBar
              data={{
                Email: data.emailRegistrations,
                Google: data.googleRegistrations,
              }}
              total={totalRegs}
              colorMap={{ Email: "bg-blue-500", Google: "bg-red-500" }}
            />
            <div className="mt-3 flex gap-4">
              <StatCard label="Cancellations" value={String(data.totalCancellations)} icon={UserMinus} />
              <StatCard label="Avg Days Before Cancel" value={data.avgDaysBeforeCancel.toFixed(1)} icon={Clock} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question scores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Highest Scored Questions</CardTitle>
            <CardDescription>Top 5 easiest</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionScoreList questions={data.highestScoredQuestions} type="highest" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lowest Scored Questions</CardTitle>
            <CardDescription>Top 5 hardest</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionScoreList questions={data.lowestScoredQuestions} type="lowest" />
          </CardContent>
        </Card>
      </div>

      {/* Peak hours + Interview format */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Peak Usage Hours (UTC)</CardTitle>
            <CardDescription>User activity by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <PeakHoursChart data={data.peakUsageHours} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Interview Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">By Format</p>
              <DistributionBar
                data={data.interviewFormatDistribution}
                colorMap={{ QUICK: "bg-cyan-500", STANDARD: "bg-indigo-500" }}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">By Category</p>
              <DistributionBar
                data={data.interviewCategoryDistribution}
                colorMap={{
                  BEHAVIORAL: "bg-blue-500",
                  CODING: "bg-emerald-500",
                  SYSTEM_DESIGN: "bg-purple-500",
                  TECHNICAL_KNOWLEDGE: "bg-orange-500",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Tier 4: Feedback & Ratings ───────────────────────────────────────────

const FEEDBACK_FILTERS: { value: FeedbackCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BUG", label: "Bugs" },
  { value: "FEATURE_REQUEST", label: "Feature Requests" },
  { value: "GENERAL", label: "General" },
];

const CATEGORY_STYLE: Record<FeedbackCategory, { bg: string; icon: typeof Bug }> = {
  BUG: { bg: "bg-red-500/10 text-red-600 dark:text-red-400", icon: Bug },
  FEATURE_REQUEST: { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Lightbulb },
  GENERAL: { bg: "bg-gray-500/10 text-gray-600 dark:text-gray-400", icon: MessageCircle },
};

function formatFeedbackDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function categoryLabel(cat: FeedbackCategory): string {
  if (cat === "FEATURE_REQUEST") return "Feature Request";
  return cat.charAt(0) + cat.slice(1).toLowerCase();
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`size-3.5 ${
            s <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

function formatRating(avg: number): string {
  return avg > 0 ? avg.toFixed(1) : "—";
}

function FeedbackAndRatingsTier({
  feedbacks,
  filter,
  onFilterChange,
  ratings,
}: {
  feedbacks: FeedbackResponse[];
  filter: FeedbackCategory | "ALL";
  onFilterChange: (cat: FeedbackCategory | "ALL") => void;
  ratings: SessionRatingsResponse | null;
}) {
  const lowRatingsWithFeedback = ratings?.lowRatings.filter((e) => e.feedback) ?? [];

  return (
    <div className="space-y-6">
      {/* Session Ratings Section */}
      {ratings && (
        <>
          {/* Average ratings by mode */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Q&A Practice</CardDescription>
                <CardTitle className="flex items-baseline gap-2 text-3xl">
                  {formatRating(ratings.avgRatingQaPractice)}
                  <span className="text-sm font-normal text-muted-foreground">/ 5</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {ratings.totalQaPracticeRatings} {ratings.totalQaPracticeRatings === 1 ? "rating" : "ratings"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Interview AI</CardDescription>
                <CardTitle className="flex items-baseline gap-2 text-3xl">
                  {formatRating(ratings.avgRatingInterview)}
                  <span className="text-sm font-normal text-muted-foreground">/ 5</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {ratings.totalInterviewRatings} {ratings.totalInterviewRatings === 1 ? "rating" : "ratings"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interview AI by category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interview AI by Category</CardTitle>
              <CardDescription>Average rating per question type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Coding</p>
                    <p className="text-xs text-muted-foreground">
                      {ratings.totalInterviewCodingRatings} {ratings.totalInterviewCodingRatings === 1 ? "rating" : "ratings"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatRating(ratings.avgRatingInterviewCoding)}</p>
                    <RatingStars rating={Math.round(ratings.avgRatingInterviewCoding)} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Behavioral</p>
                    <p className="text-xs text-muted-foreground">
                      {ratings.totalInterviewBehavioralRatings} {ratings.totalInterviewBehavioralRatings === 1 ? "rating" : "ratings"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatRating(ratings.avgRatingInterviewBehavioral)}</p>
                    <RatingStars rating={Math.round(ratings.avgRatingInterviewBehavioral)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low ratings with feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ThumbsDown className="size-4 text-red-500" />
                Low Ratings (1-2 stars)
              </CardTitle>
              <CardDescription>
                {lowRatingsWithFeedback.length} {lowRatingsWithFeedback.length === 1 ? "entry" : "entries"} with feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowRatingsWithFeedback.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No low ratings with feedback yet — great sign!
                </p>
              ) : (
                <div className="space-y-3">
                  {lowRatingsWithFeedback.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <RatingStars rating={entry.rating} />
                          <Badge variant="secondary">{entry.mode}</Badge>
                          {entry.category && (
                            <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                          )}
                          <span className="truncate text-sm font-medium">{entry.userFirstName}</span>
                          <span className="hidden text-xs text-muted-foreground sm:inline">{entry.userEmail}</span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          }).format(new Date(entry.createdAt))}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">{entry.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* User Feedback Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold">User Feedback</h2>

        {/* Filter bar + count */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {FEEDBACK_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {feedbacks.length} {feedbacks.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {/* Empty state */}
        {feedbacks.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <MessageSquareText className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No feedback yet. When users submit feedback, it will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Feedback list */}
        <div className="space-y-3">
          {feedbacks.map((fb) => {
            const style = CATEGORY_STYLE[fb.feedbackCategory];
            const Icon = style.icon;
            return (
              <Card key={fb.id}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="secondary" className={style.bg}>
                        <Icon className="size-3" />
                        {categoryLabel(fb.feedbackCategory)}
                      </Badge>
                      <span className="truncate text-sm font-medium">
                        {fb.userFirstName} {fb.userLastName}
                      </span>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {fb.userEmail}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatFeedbackDate(fb.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{fb.feedback}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <ExternalLink className="size-3" />
                    <span>{fb.pageUrl}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tier: API Costs ───────────────────────────────────────────────────────

function CacheRateIndicator({ rate }: { rate: number }) {
  const color =
    rate >= 90 ? "text-emerald-500" :
    rate >= 70 ? "text-yellow-500" :
    rate >= 50 ? "text-orange-500" : "text-red-500";
  const bg =
    rate >= 90 ? "bg-emerald-500" :
    rate >= 70 ? "bg-yellow-500" :
    rate >= 50 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <span className={`text-sm font-semibold ${color}`}>{rate.toFixed(1)}%</span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${bg}`} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
    </div>
  );
}

function ApiCostsTier({ data }: { data: ApiCostsResponse }) {
  const interviewAgg = data.byFeature["ai-interview"];
  const sessions = data.interviewSessions;
  const exactSessions = sessions.filter((s) => s.exactCost);
  const avgCacheRate = exactSessions.length > 0
    ? exactSessions.reduce((sum, s) => sum + s.cacheRate, 0) / exactSessions.length
    : -1;

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total API Spend"
          value={formatCurrency(data.totalCostUsd)}
          subtext={`${data.totalRequests} requests`}
          icon={DollarSign}
        />
        <StatCard
          label="Avg Cost / Interview"
          value={interviewAgg ? formatCurrency(interviewAgg.avgCostPerRequest) : "—"}
          subtext={interviewAgg ? `${interviewAgg.requestCount} sessions` : "No data"}
          icon={Mic}
        />
        <StatCard
          label="Avg Realtime Cost"
          value={interviewAgg ? formatCurrency(interviewAgg.avgRealtimeCost) : "—"}
          subtext="OpenAI Realtime API"
          icon={Zap}
        />
        <StatCard
          label="Avg Claude Cost"
          value={interviewAgg ? formatCurrency(interviewAgg.avgClaudeCost) : "—"}
          subtext="Scoring per session"
          icon={BrainCircuit}
        />
      </div>

      {/* Cache health */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cache Performance</CardTitle>
            <CardDescription>
              {exactSessions.length > 0
                ? `Based on ${exactSessions.length} sessions with real usage data`
                : "No sessions with real usage data yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {avgCacheRate >= 0 ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Average Cache Hit Rate</p>
                  <CacheRateIndicator rate={avgCacheRate} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Exact cost sessions</p>
                    <p className="text-lg font-bold">{exactSessions.length}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Estimated (legacy)</p>
                    <p className="text-lg font-bold">{sessions.length - exactSessions.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cache metrics will appear after the first interview session with the updated client.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cost by Category</CardTitle>
            <CardDescription>Average per session</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(data.byCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.byCategory).map(([key, agg]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="text-sm font-medium">{key.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{agg.requestCount} sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(agg.avgCostPerRequest)}</p>
                      {agg.avgCacheRate >= 0 && (
                        <p className="text-xs text-muted-foreground">
                          cache: {agg.avgCacheRate.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions table */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Interview Sessions</CardTitle>
            <CardDescription>Last {sessions.length} sessions — per-session cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4">Category</th>
                    <th className="pb-2 pr-4">Duration</th>
                    <th className="pb-2 pr-4 text-right">Realtime</th>
                    <th className="pb-2 pr-4 text-right">Claude</th>
                    <th className="pb-2 pr-4 text-right">Total</th>
                    <th className="pb-2 pr-4 text-right">Cache</th>
                    <th className="pb-2 text-right">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, i) => (
                    <tr key={i} className="border-b border-muted/50 last:border-0">
                      <td className="py-2 pr-4 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                        }).format(new Date(s.timestamp))}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant="secondary" className="text-[10px]">
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">{formatMinutes(s.durationSeconds / 60)}</td>
                      <td className="py-2 pr-4 text-right font-mono">{formatCurrency(s.realtimeCost)}</td>
                      <td className="py-2 pr-4 text-right font-mono">{formatCurrency(s.claudeCost)}</td>
                      <td className="py-2 pr-4 text-right font-mono font-semibold">{formatCurrency(s.totalCost)}</td>
                      <td className="py-2 pr-4 text-right">
                        {s.exactCost ? (
                          <CacheRateIndicator rate={s.cacheRate} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <Badge variant={s.exactCost ? "default" : "outline"} className="text-[10px]">
                          {s.exactCost ? "Exact" : "Est."}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("revenue");
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [health, setHealth] = useState<ProductHealthResponse | null>(null);
  const [growth, setGrowth] = useState<GrowthResponse | null>(null);
  const [apiCosts, setApiCosts] = useState<ApiCostsResponse | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[] | null>(null);
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackCategory | "ALL">("ALL");
  const [sessionRatings, setSessionRatings] = useState<SessionRatingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async (cat: FeedbackCategory | "ALL") => {
    setLoading(true);
    setError(null);
    try {
      const category = cat === "ALL" ? undefined : cat;
      setFeedbacks(await api.getAdminFeedbacks(category));
    } catch {
      setError("Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchData = useCallback(async (tab: Tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "revenue") {
        setRevenue(await api.getRevenueData());
      } else if (tab === "product-health") {
        setHealth(await api.getProductHealthData());
      } else if (tab === "growth") {
        setGrowth(await api.getGrowthData());
      } else if (tab === "api-costs") {
        setApiCosts(await api.getApiCostsData());
      } else if (tab === "feedback") {
        const category = feedbackFilter === "ALL" ? undefined : feedbackFilter;
        const [fb, sr] = await Promise.all([
          api.getAdminFeedbacks(category),
          sessionRatings ?? api.getSessionRatingsData(),
        ]);
        setFeedbacks(fb);
        setSessionRatings(sr);
      }
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [feedbackFilter]);

  useEffect(() => {
    fetchData("revenue");
  }, [fetchData]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const cached =
      tab === "revenue" ? revenue : tab === "product-health" ? health : tab === "growth" ? growth : tab === "api-costs" ? apiCosts : feedbacks;
    if (!cached) fetchData(tab);
  };

  const handleFeedbackFilter = (cat: FeedbackCategory | "ALL") => {
    setFeedbackFilter(cat);
    fetchFeedbacks(cat);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Dashboard
            {revenue && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                Welcome, {revenue.firstName}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor your platform metrics and make data-driven decisions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(activeTab)}
          disabled={loading}
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="block">{label}</span>
            <span className="block text-[10px] font-normal opacity-70">
              {description}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="size-5 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          {activeTab === "revenue" && revenue && <RevenueTier data={revenue} />}
          {activeTab === "product-health" && health && (
            <ProductHealthTier data={health} />
          )}
          {activeTab === "growth" && growth && <GrowthTier data={growth} />}
          {activeTab === "api-costs" && apiCosts && <ApiCostsTier data={apiCosts} />}
          {activeTab === "feedback" && feedbacks !== null && (
            <FeedbackAndRatingsTier
              feedbacks={feedbacks}
              filter={feedbackFilter}
              onFilterChange={handleFeedbackFilter}
              ratings={sessionRatings}
            />
          )}
        </>
      )}
    </div>
  );
}
