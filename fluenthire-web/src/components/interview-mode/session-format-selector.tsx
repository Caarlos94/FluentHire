"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Briefcase, Clock, Coins, Flame, Heart, Headphones, Loader2, RefreshCw, Wifi, Zap, BookOpen, Turtle, AudioLines, Rabbit, Scale, MessageSquareText, BrainCircuit } from "lucide-react";
import { CATEGORY_CONFIG, DIFFICULTY_COLOR, TIER_COLOR, TIER_LABEL } from "@/components/practice/constants";
import { getScoreBadgeColor } from "@/lib/score";
import Link from "next/link";
import { api } from "@/lib/api";
import { INTERVIEW_FORMATS, BEHAVIORAL_FORMATS, INTERVIEWER_PERSONALITIES, SPEAKING_SPEEDS, FOCUS_AREAS, type InterviewAttemptSummary, type InterviewCategory, type InterviewHistoryItem, type FocusArea, type InterviewFormat, type InterviewPersonality, type InterviewSessionResult, type SpeakingSpeed } from "@/types/interview";
import type { QuestionResponse } from "@/types/api";

const PERSONALITY_ICONS: Record<InterviewPersonality, typeof Heart> = {
  SUPPORTIVE: Heart,
  PROFESSIONAL: Briefcase,
  CHALLENGING: Flame,
};

const PERSONALITY_COLORS: Record<InterviewPersonality, string> = {
  SUPPORTIVE: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  PROFESSIONAL: "bg-primary/10 text-primary",
  CHALLENGING: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

const SPEED_ICONS: Record<SpeakingSpeed, typeof AudioLines> = {
  SLOW: Turtle,
  NORMAL: AudioLines,
  FAST: Rabbit,
};

const SPEED_COLORS: Record<SpeakingSpeed, string> = {
  SLOW: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
  NORMAL: "bg-muted text-muted-foreground",
  FAST: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const FOCUS_ICONS: Record<FocusArea, typeof Scale> = {
  BALANCED: Scale,
  COMMUNICATION: MessageSquareText,
  TECHNICAL_DEPTH: BrainCircuit,
};

const FOCUS_COLORS: Record<FocusArea, string> = {
  BALANCED: "bg-muted text-muted-foreground",
  COMMUNICATION: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  TECHNICAL_DEPTH: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
};

export function SessionFormatSelector({
  credits,
  onStart,
  category,
  question,
  onViewAttempt,
}: {
  credits: number;
  onStart: (format: InterviewFormat, personality: InterviewPersonality, speed: SpeakingSpeed, focusArea: FocusArea, extraQuestionIds?: number[]) => void;
  category?: InterviewCategory;
  question?: QuestionResponse;
  onViewAttempt?: (result: InterviewSessionResult) => void;
}) {
  const [selected, setSelected] = useState<InterviewFormat>("QUICK");
  const [selectedPersonality, setSelectedPersonality] = useState<InterviewPersonality>("SUPPORTIVE");
  const [selectedSpeed, setSelectedSpeed] = useState<SpeakingSpeed>("NORMAL");
  const [selectedFocus, setSelectedFocus] = useState<FocusArea>("BALANCED");
  const [isStarting, setIsStarting] = useState(false);
  const hasCredits = credits >= 1;
  const isBehavioral = category === "BEHAVIORAL";
  const formats = isBehavioral ? BEHAVIORAL_FORMATS : INTERVIEW_FORMATS;
  const showSecondTopicPicker = isBehavioral && selected === "STANDARD";

  const router = useRouter();

  const [attempts, setAttempts] = useState<InterviewAttemptSummary[]>([]);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [previousError, setPreviousError] = useState("");
  const [globalHistory, setGlobalHistory] = useState<InterviewHistoryItem[]>([]);

  // Second topic picker state (behavioral STANDARD only)
  const [behavioralQuestions, setBehavioralQuestions] = useState<QuestionResponse[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [secondQuestionId, setSecondQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (!showSecondTopicPicker || !question) return;
    setLoadingQuestions(true);
    api.getQuestions({ category: "BEHAVIORAL", size: 50 })
      .then((page) => {
        const filtered = page.content.filter((q) => q.id !== question.id);
        setBehavioralQuestions(filtered);
        setSecondQuestionId(null);
      })
      .catch(() => {})
      .finally(() => setLoadingQuestions(false));
  }, [showSecondTopicPicker, question?.id]);

  // Category & difficulty styling
  const cat = question ? (CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.CODING) : CATEGORY_CONFIG.CODING;
  const catTextColor = cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground";
  const diffColor = question ? (DIFFICULTY_COLOR[question.difficulty] ?? "") : "";

  useEffect(() => {
    if (question) {
      api.getInterviewAttempts(question.id).then(setAttempts).catch(() => {});
    }
  }, [question?.id]);

  useEffect(() => {
    if (!hasCredits) {
      api.getInterviewHistory(0, 50).then((page) => setGlobalHistory(page.content)).catch(() => {});
    }
  }, [hasCredits]);

  // Progress stats for paywall message (uses global history across all questions)
  const sortedHistory = [...globalHistory].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const avgScore = (h: InterviewHistoryItem) => Math.round((h.communicationScore + h.technicalScore + h.problemSolvingScore) / 3);
  const firstScore = sortedHistory.length >= 2 ? avgScore(sortedHistory[0]) : 0;
  const latestScore = sortedHistory.length >= 2 ? avgScore(sortedHistory[sortedHistory.length - 1]) : 0;
  const delta = latestScore - firstScore;
  const gap = 85 - latestScore;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Back + category/difficulty header */}
      {/* Back button */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      {/* Title + description */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {isBehavioral ? "Behavioral Interview" : "Interview Mode"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isBehavioral
            ? "Practice behavioral questions with an AI interviewer who probes using the STAR method."
            : "Have a real-time conversation with an AI interviewer who asks follow-up questions."}
        </p>
      </div>

      {/* Credit balance */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5">
          <Coins className="size-3.5 text-amber-500" />
          <span className="text-sm">
            <span className="font-semibold text-amber-500">{credits}</span> credit{credits !== 1 ? "s" : ""} available
          </span>
          <span className="text-border">&middot;</span>
          <span className="text-xs text-muted-foreground">1 credit per session</span>
        </div>
      </div>

      {/* Question name + category/difficulty */}
      {question && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">{question.title}</span>
          <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
          <span className="text-border">&middot;</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>
            {question.difficulty}
          </span>
        </div>
      )}

      {/* Format cards */}
      <div role="radiogroup" aria-label="Interview format" className="grid gap-4 sm:grid-cols-2">
        {(Object.entries(formats) as [InterviewFormat, typeof formats.QUICK][]).map(
          ([key, format]) => {
            const isSelected = selected === key;
            const Icon = key === "QUICK" ? Zap : BookOpen;

            return (
              <button
                key={key}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(key)}
                className={cn(
                  "flex flex-col rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card/50 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    key === "QUICK" ? "bg-amber-500/10 text-amber-600" : "bg-purple-500/10 text-purple-600"
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{format.label}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {format.duration / 60} min
                      {isBehavioral && (
                        <>
                          <span className="text-border">&middot;</span>
                          <MessageSquareText className="size-3" />
                          {format.problems} {format.problems === 1 ? "topic" : "topics"}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {format.description}
                </p>
              </button>
            );
          }
        )}
      </div>

      {/* Session preferences */}
      <div className="rounded-xl border border-border p-4 space-y-4">
        <p className="text-sm font-semibold text-muted-foreground">Session Preferences</p>
        {/* Interviewer Style */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-foreground">Interviewer Style</span>
          <div role="radiogroup" aria-label="Interviewer style" className="flex flex-wrap gap-1.5">
            {(Object.entries(INTERVIEWER_PERSONALITIES) as [InterviewPersonality, typeof INTERVIEWER_PERSONALITIES.SUPPORTIVE][]).map(
              ([key, personality]) => {
                const isSelected = selectedPersonality === key;
                const Icon = PERSONALITY_ICONS[key];
                return (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedPersonality(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card/50 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {personality.name}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Speaking Speed */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-foreground">Speaking Speed</span>
          <div role="radiogroup" aria-label="Speaking speed" className="flex flex-wrap gap-1.5">
            {(Object.entries(SPEAKING_SPEEDS) as [SpeakingSpeed, typeof SPEAKING_SPEEDS.NORMAL][]).map(
              ([key, speed]) => {
                const isSelected = selectedSpeed === key;
                const Icon = SPEED_ICONS[key];
                return (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedSpeed(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card/50 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {speed.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Focus Area */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-foreground">Focus Area</span>
          <div role="radiogroup" aria-label="Focus area" className="flex flex-wrap gap-1.5">
            {(Object.entries(FOCUS_AREAS) as [FocusArea, typeof FOCUS_AREAS.BALANCED][]).map(
              ([key, focus]) => {
                const isSelected = selectedFocus === key;
                const Icon = FOCUS_ICONS[key];
                return (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedFocus(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card/50 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {focus.label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
      {/* Second topic picker (behavioral STANDARD) */}
      {showSecondTopicPicker && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Choose a Second Topic</p>
          <p className="text-xs text-muted-foreground">The Standard format covers two topics. Pick your second behavioral question.</p>
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="max-h-[200px] space-y-1.5 overflow-y-auto rounded-lg border border-border p-2">
              {behavioralQuestions.map((q) => {
                const isSelected = secondQuestionId === q.id;
                const tierColor = q.tier ? (TIER_COLOR[q.tier] ?? "") : "";
                const tierLabel = q.tier ? (TIER_LABEL[q.tier] ?? q.tier) : null;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSecondQuestionId(isSelected ? null : q.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all",
                      isSelected
                        ? "border border-primary bg-primary/5 text-foreground"
                        : "border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="flex-1 truncate">{q.title}</span>
                    {tierLabel && (
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${tierColor}`}>
                        {tierLabel}
                      </span>
                    )}
                  </button>
                );
              })}
              {behavioralQuestions.length === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground">No other behavioral questions available.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Previous interview attempts */}
      {attempts.length > 0 && (() => {
        const recent = attempts.slice(-3);
        const hidden = attempts.length - recent.length;
        return (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 shrink-0 text-primary" />
              <span className="text-sm font-medium">
                You&apos;ve attempted this question {attempts.length} time
                {attempts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-1.5 pl-6">
              {hidden > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{hidden} earlier attempt{hidden !== 1 ? "s" : ""}
                </p>
              )}
              {recent.map((attempt, idx) => (
                <div
                  key={attempt.sessionId}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                    <span className="font-medium text-foreground shrink-0">
                      Attempt {attempts.length - recent.length + idx + 1}
                    </span>
                    <span className="shrink-0">
                      {new Date(attempt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getScoreBadgeColor(attempt.communicationScore)}`}>Comm {attempt.communicationScore}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getScoreBadgeColor(attempt.technicalScore)}`}>Tech {attempt.technicalScore}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getScoreBadgeColor(attempt.problemSolvingScore)}`}>PS {attempt.problemSolvingScore}</span>
                  </div>
                  <button
                    type="button"
                    disabled={loadingPrevious}
                    onClick={async () => {
                      setLoadingPrevious(true);
                      setPreviousError("");
                      try {
                        const result = await api.getInterviewSession(attempt.sessionId);
                        onViewAttempt?.(result);
                      } catch {
                        setPreviousError("Failed to load interview results.");
                      } finally {
                        setLoadingPrevious(false);
                      }
                    }}
                    className="shrink-0 font-medium text-primary hover:underline"
                  >
                    {loadingPrevious ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      "View \u2192"
                    )}
                  </button>
                </div>
              ))}
            </div>
            {previousError && (
              <p className="text-xs text-destructive">{previousError}</p>
            )}
          </div>
        );
      })()}

      {!hasCredits && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3">
            <Coins className="size-5 shrink-0 text-amber-500" />
            <p className="flex-1 text-sm">
              {sortedHistory.length >= 2 && delta > 0 ? (
                <>
                  <span className="font-semibold">You improved {delta} points.</span>{" "}
                  <span className="text-muted-foreground">
                    {gap > 0
                      ? `${gap} away from interview-ready. Upgrade to keep going.`
                      : "You're interview-ready. Upgrade to stay sharp."}
                  </span>
                </>
              ) : sortedHistory.length >= 1 ? (
                <>
                  <span className="font-semibold">You're building momentum.</span>{" "}
                  <span className="text-muted-foreground">Upgrade to see real improvement.</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">You're just getting started.</span>{" "}
                  <span className="text-muted-foreground">Upgrade to build real momentum.</span>
                </>
              )}
            </p>
            <Button
              size="sm"
              className="shrink-0 gap-1.5"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              View Plans
              <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pre-session tips */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <Headphones className="size-3.5 shrink-0 text-muted-foreground/70" />
            Use <span className="font-medium text-foreground">headphones</span> in a quiet environment for best results.
          </li>
          <li className="flex items-center gap-2.5">
            <Wifi className="size-3.5 shrink-0 text-muted-foreground/70" />
            A <span className="font-medium text-foreground">stable connection</span> is required — disconnections cannot be recovered.
          </li>
        </ul>
      </div>

      <Button
        className="h-11 w-full"
        size="lg"
        disabled={!hasCredits || isStarting || (showSecondTopicPicker && !secondQuestionId)}
        onClick={() => {
          setIsStarting(true);
          const extraIds = showSecondTopicPicker && secondQuestionId ? [secondQuestionId] : undefined;
          onStart(selected, selectedPersonality, selectedSpeed, selectedFocus, extraIds);
        }}
      >
        {isStarting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isStarting ? "Starting..." : showSecondTopicPicker && !secondQuestionId ? "Select a Second Topic to Start" : "Start Interview (1 Credit)"}
      </Button>
    </div>
  );
}
