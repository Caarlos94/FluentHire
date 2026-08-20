"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useMicrophone, formatTime } from "@/hooks/use-microphone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { QATour } from "@/components/practice-tour";
import {
  CATEGORY_CONFIG,
  DIFFICULTY_COLOR,
  TIER_COLOR,
  TIER_LABEL,
  COACHING_TIPS,
  CATEGORY_PLACEHOLDERS,
} from "./constants";
import { getScoreBadgeColor } from "@/lib/score";
import { saveDraft, loadDraft, clearDraft } from "./drafts";
import type { QuestionResponse, AnalysisResponse, QuestionHistoryResponse, ApiError } from "@/types/api";

export function PracticeView({
  question,
  onAnalysisComplete,
}: {
  question: QuestionResponse;
  onAnalysisComplete: (analysis: AnalysisResponse, fresh?: boolean) => void;
}) {
  const draftKey = `qa-${question.id}`;
  const [response, setResponse] = useState(() => {
    const draft = loadDraft(draftKey);
    return draft?.response ?? "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [micError, setMicError] = useState("");
  const [history, setHistory] = useState<QuestionHistoryResponse | null>(null);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [previousError, setPreviousError] = useState("");

  const { state: micState, elapsed, nearLimit, toggle: toggleMic } = useMicrophone({
    onTranscription: useCallback((text: string) => {
      setResponse((prev) => {
        if (!prev.trim()) return text;
        return `${prev.trimEnd()} ${text}`;
      });
    }, []),
    onError: useCallback((msg: string) => setMicError(msg), []),
    transcribe: useCallback((blob: Blob) => api.transcribeAudio(blob), []),
  });

  const router = useRouter();
  const cat = CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
  const diffColor = DIFFICULTY_COLOR[question.difficulty] ?? "";

  useEffect(() => {
    api.getQuestionHistory(question.id, "QA").then(setHistory).catch(() => {});
  }, [question.id]);

  // Auto-save draft on change, clear when empty
  useEffect(() => {
    if (response.trim()) {
      saveDraft(draftKey, { response });
    } else {
      clearDraft(draftKey);
    }
  }, [response, draftKey]);

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Step 1: Submit the response
      const userResponse = await api.submitResponse({
        questionId: question.id,
        originalResponse: response.trim(),
        mode: "QA",
      });

      clearDraft(draftKey);

      // Step 2: Trigger AI analysis
      setIsSubmitting(false);
      setIsAnalyzing(true);

      const analysis = await api.analyzeResponse(userResponse.id);
      onAnalysisComplete(analysis);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Something went wrong. Please try again.");
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  const MIN_WORDS = 20;
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const isTooShort = wordCount < MIN_WORDS;

  if (isAnalyzing) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-7 text-primary" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Analyzing your response...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {question.category === "CODING"
              ? "Our AI is evaluating your problem-solving process and how clearly you communicated your thinking."
              : question.category === "SYSTEM_DESIGN"
                ? "Our AI is evaluating your architectural thinking and how clearly you communicated your design."
                : "Our AI is evaluating your communication clarity and technical depth."}
            {" "}This usually takes 10–20 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      {/* Question card */}
      <Card data-tour="qa-question" className={`border-l-[3px] ${{ BEHAVIORAL: "border-l-cyan-500", SYSTEM_DESIGN: "border-l-purple-500", CODING: "border-l-blue-500", TECHNICAL_KNOWLEDGE: "border-l-orange-500" }[question.category] ?? "border-l-primary"}`}>
        <CardHeader>
          <CardTitle className="text-xl">{question.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[12px] font-semibold ${cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground"}`}>
              {cat.label}
            </span>
            <span className="text-border">&middot;</span>
            {question.tier ? (
              <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${TIER_COLOR[question.tier] ?? ""}`}>
                {TIER_LABEL[question.tier] ?? question.tier}
              </span>
            ) : (
              <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>
                {question.difficulty}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {question.content}
            </p>
          </div>

          {/* Examples */}
          {question.examples && question.examples.length > 0 && (
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="flex w-full items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground group cursor-pointer">
                <ChevronDown className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
                Show {question.examples!.length > 1 ? `${question.examples!.length} examples` : "example"}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className={`grid gap-2 ${question.examples!.length === 3 ? "sm:grid-cols-3" : question.examples!.length === 2 ? "sm:grid-cols-2" : ""}`}>
                  {question.examples.map((ex: { input: string; output: string }, i: number) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">
                        {question.examples!.length > 1 ? `Example ${i + 1}` : "Example"}
                      </p>
                      <div className="text-sm overflow-x-auto">
                        <span className="font-medium text-muted-foreground">Input: </span>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono break-all">{ex.input}</code>
                      </div>
                      <div className="text-sm overflow-x-auto">
                        <span className="font-medium text-muted-foreground">Output: </span>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono break-all">{ex.output}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category coaching tip */}
      {COACHING_TIPS[question.category] && (
        <Card size="sm" className="border-amber-500/20 bg-amber-500/5" data-tour="qa-coaching-tip">
          <CardContent className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Coaching Tip</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {COACHING_TIPS[question.category]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous attempts */}
      {history && history.attempts?.filter((a) => a.analyzed).length > 0 && (() => {
          const analyzed = history.attempts.filter((a) => a.analyzed);
          return (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 shrink-0 text-primary" />
              <span className="text-sm font-medium">
                You&apos;ve attempted this question {analyzed.length} time
                {analyzed.length !== 1 ? "s" : ""}
              </span>
            </div>
            {(() => {
              const recent = analyzed.slice(-3);
              const hidden = analyzed.length - recent.length;
              return (
              <div className="space-y-1.5 pl-6">
                {hidden > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +{hidden} earlier attempt{hidden !== 1 ? "s" : ""}
                  </p>
                )}
                {recent.map((attempt) => (
                    <div
                      key={attempt.responseId}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                        <span className="font-medium text-foreground shrink-0">
                          Attempt {attempt.attemptNumber}
                        </span>
                        <span className="shrink-0">
                          {new Date(attempt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        {attempt.communicationScore !== null && (
                          <>
                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getScoreBadgeColor(attempt.communicationScore)}`}>Comm {attempt.communicationScore}</span>
                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getScoreBadgeColor(attempt.technicalScore ?? 0)}`}>Tech {attempt.technicalScore}</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={loadingPrevious}
                        onClick={async () => {
                          setLoadingPrevious(true);
                          setPreviousError("");
                          try {
                            const analysis = await api.getAnalysis(attempt.responseId);
                            onAnalysisComplete(analysis, false);
                          } catch {
                            setPreviousError("Failed to load feedback.");
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
              );
            })()}
          </div>
          );
        })()}

      {previousError && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {previousError}
        </div>
      )}

      {/* Response textarea / Recording UI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="response" className="text-sm font-medium">
            Your Answer
          </label>
          <span data-tour="qa-word-count" className={`text-xs ${response.length > 4500 ? "text-destructive" : "text-muted-foreground"}`}>
            {wordCount} word{wordCount !== 1 ? "s" : ""} · {response.length}/5,000
          </span>
        </div>

        {micState === "recording" ? (
          /* ── Recording state: centered focused UI ── */
          <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-red-500/40 bg-red-500/5 ring-2 ring-red-500/20">
            <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
              <span className="size-2.5 animate-pulse rounded-full bg-red-500" />
              Recording...
              <span className="font-mono tabular-nums">{formatTime(elapsed)}</span>
            </span>
            <p className="mt-2 text-xs text-muted-foreground">
              Speak naturally. Click the microphone to stop.
            </p>
            {nearLimit && (
              <p className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                Approaching 3-minute limit
              </p>
            )}
          </div>
        ) : micState === "transcribing" ? (
          /* ── Transcribing state: loading UI ── */
          <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-border bg-muted/30">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="mt-3 text-sm font-medium">Transcribing your answer...</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This usually takes a few seconds.
            </p>
          </div>
        ) : (
          /* ── Idle state: normal textarea with mic button ── */
          <div className="relative" data-tour="qa-textarea">
            <Textarea
              id="response"
              placeholder={CATEGORY_PLACEHOLDERS[question.category] || "Write or speak your answer in English, as if you were in a real interview. Be specific, use technical terms, and structure your response clearly..."}
              value={response}
              onChange={(e) => {
                if (e.target.value.length <= 5000) setResponse(e.target.value);
              }}
              maxLength={5000}
              className="min-h-52 max-h-[375px] text-sm leading-relaxed resize-none [field-sizing:content] overflow-y-auto transition-shadow focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_15px_-3px] focus:shadow-primary/20"
            />
            <button
              type="button"
              onClick={toggleMic}
              data-tour="qa-mic"
              className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              title="Speak your answer"
            >
              <Mic className="size-4" />
            </button>
          </div>
        )}

        {/* Mic button — visible during recording */}
        {micState === "recording" && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleMic}
              className="flex size-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600"
              title="Stop recording"
            >
              <MicOff className="size-5" />
            </button>
          </div>
        )}

        {micError && (
          <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">
            <span>{micError}</span>
            <button onClick={() => setMicError("")} className="ml-2 font-medium hover:underline">
              Dismiss
            </button>
          </div>
        )}

        <p className={`text-xs ${isTooShort && wordCount > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
          {isTooShort && wordCount > 0
            ? `${MIN_WORDS - wordCount} more word${MIN_WORDS - wordCount !== 1 ? "s" : ""} needed to submit. Aim for 100–300 words.`
            : "Tip: Click the microphone to speak your answer, or type it. Aim for 100\u2013300 words."}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Submit button */}
      <Button
        data-tour="qa-submit"
        className="h-11 w-full"
        size="lg"
        disabled={!response.trim() || isTooShort || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send />
            Submit & Get AI Feedback
          </>
        )}
      </Button>

      <QATour />
    </div>
  );
}
