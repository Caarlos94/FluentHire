"use client";

import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { KaraokeText } from "@/components/karaoke-text";
import type { WordTimestamp } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCircle } from "@/components/score-circle";
import { getScoreBadgeColor } from "@/lib/score";
import { CommunicationBreakdownRows, hasCommunicationBreakdown } from "@/components/communication-breakdown";
import { SessionRatingCard } from "@/components/practice/session-rating-card";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  Code2,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  Square,
  Target,
  TrendingUp,
  Volume2,
} from "lucide-react";
import type { InterviewCategory, InterviewHistoryItem, InterviewSessionResult } from "@/types/interview";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function hasScoringFailed(feedback: string, scores: number[]): boolean {
  return (
    scores.every((s) => s === 0) ||
    feedback.toLowerCase().includes("scoring failed")
  );
}

function ProblemModelAnswer({ resultId, improvedResponse }: {
  resultId: number;
  improvedResponse: string;
}) {
  const [ttsState, setTtsState] = useState<"idle" | "playing">("idle");
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsError, setTtsError] = useState("");
  const [wordTimestamps, setWordTimestamps] = useState<WordTimestamp[] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const timestampsRef = useRef<WordTimestamp[] | null>(null);

  useEffect(() => {
    if (!resultId) return;
    setTtsReady(false);
    api.getInterviewResultTtsAudio(resultId).then((url) => {
      audioUrlRef.current = url;
      return api.getInterviewResultTtsTimestamps(resultId);
    }).then((ts) => {
      if (ts) timestampsRef.current = ts;
      setTtsReady(true);
    }).catch(() => {});

    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [resultId]);

  const handleListen = async () => {
    setTtsError("");

    if (ttsState === "playing" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTtsState("idle");
      return;
    }

    try {
      if (timestampsRef.current) setWordTimestamps(timestampsRef.current);
      const audio = new Audio(audioUrlRef.current!);
      audioRef.current = audio;
      audio.onended = () => setTtsState("idle");
      await audio.play();
      setTtsState("playing");
    } catch {
      setTtsState("idle");
      setTtsError("Failed to play audio. Please try again.");
    }
  };

  return (
    <>
      {wordTimestamps && wordTimestamps.length > 0 ? (
        <KaraokeText
          text={improvedResponse}
          timestamps={wordTimestamps}
          audioRef={audioRef as RefObject<HTMLAudioElement | null>}
          isPlaying={ttsState === "playing"}
        />
      ) : (
        <div className="max-h-64 overflow-y-auto overscroll-contain rounded-lg bg-primary/5 p-4">
          <p className="text-sm leading-loose">
            {improvedResponse}
          </p>
        </div>
      )}
      {!ttsReady ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Generating audio... First time takes a few seconds.
            </span>
            <span className="font-medium text-primary">
              <Loader2 className="inline size-3 animate-spin mr-1" />
              Processing
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary animate-tts-progress" />
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-end gap-3">
          {ttsError && (
            <p className="text-xs text-destructive">{ttsError}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleListen}
            disabled={!ttsReady && ttsState !== "playing"}
            className="gap-2"
          >
            {ttsState === "playing" ? (
              <>
                <Square className="size-4" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="size-4" />
                {audioRef.current ? "Replay" : "Listen"}
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const positive = value > 0;
  return (
    <span className={`text-xs font-semibold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
      {positive ? "+" : ""}{value}
    </span>
  );
}

function trajectoryInsight(
  current: { comm: number; tech: number; ps: number },
  previous: { comm: number; tech: number; ps: number },
  sessionCount: number,
) {
  const commDelta = current.comm - previous.comm;
  const techDelta = current.tech - previous.tech;
  const psDelta = current.ps - previous.ps;
  const avgDelta = Math.round((commDelta + techDelta + psDelta) / 3);
  const currentAvg = Math.round((current.comm + current.tech + current.ps) / 3);

  if (avgDelta >= 8) {
    return `You jumped +${avgDelta} points on average. That's serious progress in just ${sessionCount} sessions.`;
  }
  if (avgDelta >= 3) {
    return `You're improving steadily — +${avgDelta} points on average. A few more sessions could push you into interview-ready territory.`;
  }
  if (avgDelta > 0) {
    return "You're trending up. Candidates typically see their biggest jumps between sessions 3 and 5.";
  }
  if (currentAvg >= 70) {
    return "You're scoring above 70 on average — that's strong. Consistency comes with more reps.";
  }
  return "Scores can fluctuate early on. The trend becomes clear after 3–4 sessions — keep going.";
}

function ScoreTrajectory({ history, currentSessionId, scoreLabels }: {
  history: InterviewHistoryItem[];
  currentSessionId: string;
  scoreLabels: { comm: string; tech: string; ps: string };
}) {
  // Sort oldest → newest, exclude current session
  const previous = history
    .filter((h) => h.sessionId !== currentSessionId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (previous.length === 0) return null;

  const current = history.find((h) => h.sessionId === currentSessionId);
  if (!current) return null;

  const first = previous[0];
  const totalSessionCount = previous.length + 1;

  // Show first session (baseline) + last 2 previous + current when 4+ sessions
  // Collapse when 4+ sessions total (3+ previous): show first + last previous only
  const showCollapsed = previous.length > 2;
  const visiblePrevious = showCollapsed
    ? [previous[0], previous[previous.length - 1]]
    : previous;

  // Total change: current vs first ever session
  const commDelta = current.communicationScore - first.communicationScore;
  const techDelta = current.technicalScore - first.technicalScore;
  const psDelta = current.problemSolvingScore - first.problemSolvingScore;

  const insight = trajectoryInsight(
    { comm: current.communicationScore, tech: current.technicalScore, ps: current.problemSolvingScore },
    { comm: first.communicationScore, tech: first.technicalScore, ps: first.problemSolvingScore },
    totalSessionCount,
  );

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <span className="text-sm font-semibold">Your Progress</span>
        <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
          {totalSessionCount} sessions
        </Badge>
      </div>

      {/* Score comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="pb-2 text-left font-medium" />
              <th className="pb-2 text-center font-medium">{scoreLabels.comm}</th>
              <th className="pb-2 text-center font-medium">{scoreLabels.tech}</th>
              <th className="pb-2 text-center font-medium">{scoreLabels.ps}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {visiblePrevious.map((session, i) => {
              const realIndex = previous.indexOf(session) + 1;
              // Insert ··· separator after the first row when collapsed
              const showSeparator = showCollapsed && i === 0;

              return (
                <Fragment key={session.sessionId}>
                  <tr className="text-muted-foreground">
                    <td className="py-1.5 pr-3 text-xs">Interview {realIndex}</td>
                    <td className="py-1.5 text-center">{session.communicationScore}</td>
                    <td className="py-1.5 text-center">{session.technicalScore}</td>
                    <td className="py-1.5 text-center">{session.problemSolvingScore}</td>
                  </tr>
                  {showSeparator && (
                    <tr>
                      <td colSpan={4} className="py-1 text-center text-xs text-muted-foreground/60">···</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            <tr className="font-medium">
              <td className="py-1.5 pr-3 text-xs">
                Interview {totalSessionCount}
                <span className="ml-1.5 text-[10px] text-primary">← now</span>
              </td>
              <td className="py-1.5 text-center">{current.communicationScore}</td>
              <td className="py-1.5 text-center">{current.technicalScore}</td>
              <td className="py-1.5 text-center">{current.problemSolvingScore}</td>
            </tr>
            <tr>
              <td className="pt-1.5 pr-3 text-xs text-muted-foreground">Total change</td>
              <td className="pt-1.5 text-center"><DeltaBadge value={commDelta} /></td>
              <td className="pt-1.5 text-center"><DeltaBadge value={techDelta} /></td>
              <td className="pt-1.5 text-center"><DeltaBadge value={psDelta} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Insight line */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {insight}
      </p>
    </div>
  );
}

export function SessionReport({
  result,
  attemptInfo,
  interviewHistory,
  onBackToDashboard,
  onPracticeAgain,
}: {
  result: InterviewSessionResult;
  attemptInfo?: { number: number; total: number } | null;
  interviewHistory?: InterviewHistoryItem[];
  onBackToDashboard: () => void;
  onPracticeAgain: () => void;
}) {
  const router = useRouter();
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);
  const isBehavioral = result.category === "BEHAVIORAL";
  const scoreLabels = isBehavioral
    ? { comm: "Communication", tech: "STAR Structure", ps: "Self-Awareness" }
    : { comm: "Communication", tech: "Technical", ps: "Problem Solving" };
  const ProblemIcon = isBehavioral ? MessageSquareText : Code;
  const problemIconColor = isBehavioral ? "bg-blue-500/10 text-blue-600" : "bg-green-500/10 text-green-600";

  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Back button */}
      <button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Interview Complete</h2>
        <div className="mt-2 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{result.format}</Badge>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(result.durationSeconds)}
          </span>
          <span>{result.problems.length} {isBehavioral ? "topic" : "problem"}{result.problems.length !== 1 ? "s" : ""}</span>
        </div>
        {attemptInfo && result.problems[0] && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Attempt #{attemptInfo.number} for &ldquo;{result.problems[0].questionTitle}&rdquo;
          </p>
        )}
        {(() => {
          const avg = Math.round((result.communicationScore + result.technicalScore + result.problemSolvingScore) / 3);
          if (avg >= 90) return <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Outstanding! You&apos;d impress any interviewer with this performance.</p>;
          if (avg >= 75) return <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Great score! You&apos;re communicating like a senior engineer.</p>;
          if (avg >= 60) return <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">Solid work. A few tweaks and you&apos;ll nail your next interview.</p>;
          if (avg >= 40) return <p className="mt-3 text-sm font-medium text-muted-foreground">Good effort. Review the feedback below and try again — every attempt makes you stronger.</p>;
          return <p className="mt-3 text-sm font-medium text-muted-foreground">Every expert was once a beginner. Read the feedback below and give it another shot.</p>;
        })()}
        <p className="mt-3 text-center text-xs text-muted-foreground/60">AI feedback may not be perfectly accurate. Use it as a guide, not a grade.</p>
      </div>

      {/* Scoring failure warning */}
      {result.problems.some((p) =>
        hasScoringFailed(p.feedback, [p.communicationScore, p.technicalScore, p.problemSolvingScore])
      ) && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-500">
                Scoring issue detected
              </p>
              <p className="mt-0.5 text-muted-foreground">
                One or more problems could not be scored properly. The scores shown may not reflect your actual performance. This is usually a temporary issue — try another session.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall scores */}
      <div className="flex justify-center gap-12 py-4">
        <ScoreCircle score={result.communicationScore} label={scoreLabels.comm} />
        <ScoreCircle score={result.technicalScore} label={scoreLabels.tech} />
        <ScoreCircle score={result.problemSolvingScore} label={scoreLabels.ps} />
      </div>

      {/* Score trajectory */}
      {interviewHistory && interviewHistory.length >= 2 && (
        <ScoreTrajectory
          history={interviewHistory}
          currentSessionId={result.sessionId}
          scoreLabels={scoreLabels}
        />
      )}

      {/* Overall feedback */}
      <div className="rounded-lg border border-border/60 px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquareText className="size-4 text-blue-500" />
          <span className="text-sm font-semibold">Overall Feedback</span>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
          {result.overallFeedback || "No feedback available."}
        </p>
      </div>

      {/* What to focus on */}
      {(() => {
        const tips = result.problems
          .filter((p) => p.focusTip)
          .map((p) => ({ title: p.questionTitle, tip: p.focusTip! }));
        if (tips.length === 0) return null;
        return (
          <div className="rounded-lg border-l-[3px] border-l-primary bg-primary/5 px-4 py-3 space-y-1">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <span className="text-sm font-semibold">What to Focus On</span>
            </div>
            {tips.length === 1 ? (
              <p className="text-[13px] leading-relaxed text-muted-foreground">{tips[0].tip}</p>
            ) : (
              <ul className="space-y-1.5">
                {tips.map((t) => (
                  <li key={t.title} className="text-[13px] leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">{t.title}:</span> {t.tip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })()}

      {/* Per-problem breakdown */}
      {result.problems.map((problem, i) => {
        const isExpanded = expandedProblem === i;

        return (
          <Card key={problem.questionId}>
            <button
              onClick={() => setExpandedProblem(isExpanded ? null : i)}
              className="w-full text-left"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-lg ${problemIconColor}`}>
                      <ProblemIcon className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{problem.questionTitle}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden gap-2 sm:flex">
                      <Badge variant="secondary" className={getScoreBadgeColor(problem.communicationScore)}>
                        Comm {problem.communicationScore}
                      </Badge>
                      <Badge variant="secondary" className={getScoreBadgeColor(problem.technicalScore)}>
                        {isBehavioral ? "STAR" : "Tech"} {problem.technicalScore}
                      </Badge>
                      <Badge variant="secondary" className={getScoreBadgeColor(problem.problemSolvingScore)}>
                        {isBehavioral ? "Self" : "PS"} {problem.problemSolvingScore}
                      </Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </button>
            {isExpanded && (
              <CardContent className="space-y-4 border-t pt-4">
                {/* Scores (mobile) */}
                <div className="flex gap-2 sm:hidden">
                  <Badge variant="secondary" className={getScoreBadgeColor(problem.communicationScore)}>
                    Comm {problem.communicationScore}
                  </Badge>
                  <Badge variant="secondary" className={getScoreBadgeColor(problem.technicalScore)}>
                    {isBehavioral ? "STAR" : "Tech"} {problem.technicalScore}
                  </Badge>
                  <Badge variant="secondary" className={getScoreBadgeColor(problem.problemSolvingScore)}>
                    {isBehavioral ? "Self" : "PS"} {problem.problemSolvingScore}
                  </Badge>
                </div>

                {problem.communicationFeedback ? (
                  <>
                    {/* Communication feedback — breakdown or fallback */}
                    <div className="rounded-lg border border-border/60 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquareText className="size-4 text-blue-500" />
                          <p className="text-sm font-semibold">{scoreLabels.comm}</p>
                        </div>
                        <Badge variant="secondary" className={getScoreBadgeColor(problem.communicationScore)}>
                          {problem.communicationScore}
                        </Badge>
                      </div>
                      {hasCommunicationBreakdown(problem) ? (
                        <CommunicationBreakdownRows data={problem} />
                      ) : (
                        <p className="text-sm leading-relaxed">{problem.communicationFeedback}</p>
                      )}
                    </div>

                    {/* Technical + Problem Solving feedback */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/60 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-purple-500" />
                            <p className="text-sm font-semibold">{scoreLabels.tech}</p>
                          </div>
                          <Badge variant="secondary" className={getScoreBadgeColor(problem.technicalScore)}>
                            {problem.technicalScore}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{problem.technicalFeedback}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="size-4 text-orange-500" />
                            <p className="text-sm font-semibold">{scoreLabels.ps}</p>
                          </div>
                          <Badge variant="secondary" className={getScoreBadgeColor(problem.problemSolvingScore)}>
                            {problem.problemSolvingScore}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{problem.problemSolvingFeedback}</p>
                      </div>
                    </div>

                    {/* Improved response with TTS + karaoke */}
                    {problem.improvedResponse && (
                      <div className="rounded-lg border border-primary/20 bg-card p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-primary" />
                          <p className="text-sm font-medium leading-snug">
                            Model Approach — How a Senior Engineer Would Approach This
                          </p>
                        </div>
                        {problem.id ? (
                          <ProblemModelAnswer
                            resultId={problem.id}
                            improvedResponse={problem.improvedResponse}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {problem.improvedResponse}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Fallback for old sessions without enriched feedback */
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Feedback</p>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {problem.feedback || "No feedback available for this problem."}
                    </p>
                  </div>
                )}

                {/* Code Review */}
                {problem.codeFeedback && (
                  <div className="rounded-lg border border-border/60 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-emerald-500" />
                      <p className="text-sm font-semibold">Code Review</p>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {problem.codeFeedback}
                    </p>
                  </div>
                )}

                {/* Code submitted */}
                {problem.codeSubmitted && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Code Submitted</p>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                      <code>{problem.codeSubmitted}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Session rating */}
      <SessionRatingCard interviewSessionId={result.sessionId} alwaysShow />

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="h-11 flex-1" onClick={onPracticeAgain}>
          <RefreshCw />
          Practice Again
        </Button>
        <Button variant="outline" size="lg" className="h-11 flex-1" onClick={onBackToDashboard}>
          <LayoutDashboard />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
