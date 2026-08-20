"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Loader2,
  MessageSquareText,
  Mic,
  RefreshCw,
  Sparkles,
  Square,
  Target,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { KaraokeText } from "@/components/karaoke-text";
import { ScoreCircle } from "@/components/score-circle";
import { getScoreBadgeColor } from "@/lib/score";
import { CommunicationBreakdownRows, hasCommunicationBreakdown } from "@/components/communication-breakdown";
import { SessionRatingCard } from "./session-rating-card";
import type { QuestionResponse, AnalysisResponse, WordTimestamp } from "@/types/api";

export function AnalysisResults({
  analysis,
  question,
  onTryAgain,
  onBackToQuestions,
  freshSession,
}: {
  analysis: AnalysisResponse;
  question: QuestionResponse;
  onTryAgain: () => void;
  onBackToQuestions: () => void;
  freshSession?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const credits = user?.credits ?? 0;
  const [showOriginal, setShowOriginal] = useState(false);
  const [ttsState, setTtsState] = useState<"idle" | "playing">("idle");
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsError, setTtsError] = useState("");
  const [wordTimestamps, setWordTimestamps] = useState<WordTimestamp[] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const timestampsRef = useRef<WordTimestamp[] | null>(null);

  // Prefetch audio + timestamps when results appear
  // Button stays disabled until ready — guarantees play() works on all browsers
  useEffect(() => {
    setTtsReady(false);
    api.getTtsAudio(analysis.id).then((url) => {
      audioUrlRef.current = url;
      return api.getTtsTimestamps(analysis.id);
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
  }, [analysis.id]);

  const handleListen = async () => {
    setTtsError("");

    // Stop if already playing
    if (ttsState === "playing" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTtsState("idle");
      return;
    }

    // Audio is always ready here (button disabled until prefetch completes)
    // play() with zero awaits — works on all browsers including Safari
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
    <div className="mx-auto max-w-3xl space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">

      {/* Back button */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Your Results</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Attempt #{analysis.attemptNumber} for &ldquo;{question.title}&rdquo;
        </p>
        {(() => {
          const avg = Math.round((analysis.communicationScore + analysis.technicalScore) / 2);
          if (avg >= 90) return <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Outstanding! You&apos;d impress any interviewer with this answer.</p>;
          if (avg >= 80) return <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Great score! You&apos;re communicating like a senior engineer.</p>;
          if (avg >= 60) return <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">Solid work. A few tweaks and you&apos;ll nail this.</p>;
          if (avg >= 40) return <p className="mt-3 text-sm font-medium text-muted-foreground">Good effort. Review the feedback below and try again — every attempt makes you stronger.</p>;
          return <p className="mt-3 text-sm font-medium text-muted-foreground">Every expert was once a beginner. Read the model answer below and give it another shot.</p>;
        })()}
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-12 py-4">
        <ScoreCircle
          score={analysis.communicationScore}
          label="Communication"
        />
        <ScoreCircle
          score={analysis.technicalScore}
          label="Technical"
        />
      </div>
      <p className="text-center text-xs text-muted-foreground/60">AI feedback may not be perfectly accurate. Use it as a guide, not a grade.</p>

      {/* What to focus on */}
      <div className="rounded-lg border-l-[3px] border-l-primary bg-primary/5 px-4 py-3 space-y-1">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <span className="text-sm font-semibold">What to Focus On</span>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {analysis.focusTip || "Review the feedback below and try again to improve your scores."}
        </p>
      </div>

      {/* Communication Feedback */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-blue-500" />
              <CardTitle className="text-sm">Communication Feedback</CardTitle>
            </div>
            <Badge variant="secondary" className={`${getScoreBadgeColor(analysis.communicationScore)}`}>
              {analysis.communicationScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {hasCommunicationBreakdown(analysis) ? (
            <CommunicationBreakdownRows data={analysis} />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {analysis.communicationFeedback}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Technical Feedback */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-purple-500" />
              <CardTitle className="text-sm">Technical Feedback</CardTitle>
            </div>
            <Badge variant="secondary" className={`${getScoreBadgeColor(analysis.technicalScore)}`}>
              {analysis.technicalScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {analysis.technicalFeedback}
          </p>
        </CardContent>
      </Card>

      {/* Code Review — only for coding questions */}
      {analysis.codeFeedback && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-emerald-500" />
              <CardTitle className="text-sm">Code Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {analysis.codeFeedback}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Improved Response */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <CardTitle className="text-sm">
              Model Answer — How a Senior Engineer Would Say It
            </CardTitle>
          </div>
          <CardDescription>
            Compare this with your answer to learn better phrasing and structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {wordTimestamps && wordTimestamps.length > 0 ? (
              <KaraokeText
                text={analysis.improvedResponse}
                timestamps={wordTimestamps}
                audioRef={audioRef as RefObject<HTMLAudioElement | null>}
                isPlaying={ttsState === "playing"}
              />
            ) : (
              <div className="max-h-64 overflow-y-auto overscroll-contain rounded-lg bg-primary/5 p-4">
                <p className="text-sm leading-loose">
                  {analysis.improvedResponse}
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
                  <div
                    className="h-full rounded-full bg-primary animate-tts-progress"
                  />
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
                  ) : !ttsReady ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
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
          </CardContent>
      </Card>

      {/* Session rating — only on fresh submissions, not history views */}
      {freshSession && <SessionRatingCard userResponseId={analysis.userResponseId} />}

      {/* Your original response — collapsible */}
      <div className="rounded-lg border border-border/60">
        <button
          onClick={() => setShowOriginal((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
        >
          Your Original Response
          {showOriginal ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>
        {showOriginal && (
          <div className="border-t px-4 py-3">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {analysis.originalResponse}
            </p>
          </div>
        )}
      </div>

      {/* Interview mode CTA */}
      {credits > 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Mic className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Ready for a Live Interview?</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Put your skills to the test with a real-time AI interviewer. You have{" "}
              <span className="font-medium text-primary">{credits} credit{credits !== 1 ? "s" : ""}</span> available.
            </p>
          </div>
          <Link
            href={question.category === "CODING" ? `/practice/interview/setup/${question.id}` : "/practice?mode=interview"}
            className={buttonVariants({ size: "sm", className: "shrink-0" })}
          >
            Try Interview Mode
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Want Real-Time AI Feedback?</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Upgrade to unlock Live AI Interviews with real-time scoring and conversation.
            </p>
          </div>
          <Link
            href="/pricing"
            className={buttonVariants({ variant: "outline", size: "sm", className: "shrink-0 border-amber-500/30 hover:bg-amber-500/10" })}
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="h-11 flex-1" onClick={onTryAgain}>
          <RefreshCw />
          Practice Again
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 flex-1"
          onClick={onBackToQuestions}
        >
          <ArrowLeft />
          Browse Questions
        </Button>
      </div>
    </div>
  );
}
