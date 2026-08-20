"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { useMicrophone, formatTime } from "@/hooks/use-microphone";
import { getLanguageLabel, getLanguageTemplate, getQuestionTemplate } from "@/components/code-editor-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { TOLTour } from "@/components/practice-tour";
import { getScoreBadgeColor } from "@/lib/score";
import { CATEGORY_CONFIG, DIFFICULTY_COLOR, COACHING_TIPS } from "./constants";
import { saveDraft, loadDraft, clearDraft } from "./drafts";
import type { QuestionResponse, AnalysisResponse, QuestionHistoryResponse, ApiError } from "@/types/api";

const CodeEditor = dynamic(
  () => import("@/components/code-editor").then((m) => ({ default: m.CodeEditor })),
  { ssr: false }
);

export function ThinkOutLoudView({
  question,
  onAnalysisComplete,
  defaultLanguage,
}: {
  question: QuestionResponse;
  onAnalysisComplete: (analysis: AnalysisResponse, fresh?: boolean) => void;
  defaultLanguage: string;
}) {
  const questionMeta = question.methodName ? {
    methodName: question.methodName,
    methodParams: question.methodParams,
    returnType: question.returnType,
  } : null;
  const draftKey = `tol-${question.id}`;
  const [code, setCode] = useState(() => {
    const draft = loadDraft(draftKey);
    return draft?.code ?? getQuestionTemplate(defaultLanguage, questionMeta);
  });
  const [explanation, setExplanation] = useState(() => {
    const draft = loadDraft(draftKey);
    return draft?.explanation ?? "";
  });
  const [language, setLanguage] = useState(() => {
    const draft = loadDraft(draftKey);
    return draft?.language ?? defaultLanguage;
  });
  const [showProblem, setShowProblem] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang);
    // Only replace with template if code is empty or still matches the previous template
    setCode((prev) => {
      const currentTemplate = getQuestionTemplate(language, questionMeta);
      if (!prev.trim() || prev.trim() === currentTemplate.trim()) {
        return getQuestionTemplate(newLang, questionMeta);
      }
      return prev;
    });
  }, [language, questionMeta]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [micError, setMicError] = useState("");
  const [history, setHistory] = useState<QuestionHistoryResponse | null>(null);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [previousError, setPreviousError] = useState("");

  const { state: micState, elapsed, nearLimit, toggle: toggleMic } = useMicrophone({
    onTranscription: useCallback((text: string) => {
      setExplanation((prev) => {
        if (!prev.trim()) return text;
        return `${prev.trimEnd()} ${text}`;
      });
    }, []),
    onError: useCallback((msg: string) => setMicError(msg), []),
    transcribe: useCallback((blob: Blob) => api.transcribeAudio(blob), []),
  });

  const router = useRouter();
  const cat = CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.BEHAVIORAL;
  const catTextColor = cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground";
  const diffColor = DIFFICULTY_COLOR[question.difficulty] ?? "";

  useEffect(() => {
    api.getQuestionHistory(question.id, "THINK_OUT_LOUD").then(setHistory).catch(() => {});
  }, [question.id]);

  // Auto-expand explanation when recording starts
  useEffect(() => {
    if (micState === "recording" || micState === "transcribing") {
      setShowExplanation(true);
    }
  }, [micState]);

  // Auto-save draft on change
  useEffect(() => {
    const template = getQuestionTemplate(language, questionMeta);
    const hasCode = code.trim() && code.trim() !== template.trim();
    if (hasCode || explanation.trim()) {
      saveDraft(draftKey, { code, explanation, language });
    }
  }, [code, explanation, language, draftKey]);

  const handleSubmit = async () => {
    if (!code.trim() && !explanation.trim()) return;

    setError("");
    setIsSubmitting(true);

    // Combine code + explanation into a structured format for AI analysis
    const langLabel = getLanguageLabel(language);
    const combined = [
      `### My Solution (${langLabel})`,
      "",
      "```" + language,
      code.trim(),
      "```",
      "",
      "### My Explanation",
      "",
      explanation.trim(),
    ].join("\n");

    try {
      const userResponse = await api.submitResponse({
        questionId: question.id,
        originalResponse: combined,
        mode: "THINK_OUT_LOUD",
      });

      clearDraft(draftKey);

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

  const MIN_EXPLANATION_WORDS = 15;
  const explanationWordCount = explanation.trim().split(/\s+/).filter(Boolean).length;
  const isExplanationTooShort = explanationWordCount < MIN_EXPLANATION_WORDS;
  const template = getQuestionTemplate(language, questionMeta);
  const hasCode = code.trim().length > 0 && code.trim() !== template.trim();
  const canSubmit = hasCode && !isExplanationTooShort && !isSubmitting;

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
          <p className="text-lg font-semibold">Analyzing your solution...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our AI is evaluating your code, problem-solving approach, and how clearly you explained your thinking. This usually takes 10–20 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-14 z-10 flex flex-col bg-background mx-auto max-w-[1440px]">
      {/* Top bar — always visible with submit */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
            <span className="text-border">&middot;</span>
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>{question.difficulty}</span>
          </div>
          <span className="hidden text-sm font-medium truncate max-w-[300px] lg:inline">
            {question.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-destructive truncate max-w-[200px]">{error}</span>
          )}
          <Button
            data-tour="tol-submit"
            size="sm"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Submit & Get AI Feedback
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem panel (collapsible) */}
        {showProblem && (
          <div className="w-[380px] shrink-0 border-r border-border/40 overflow-y-auto p-4 space-y-4">
            {/* Question */}
            <div data-tour="tol-question" className={`rounded-lg border border-border/60 border-l-[3px] ${{ BEHAVIORAL: "border-l-cyan-500", SYSTEM_DESIGN: "border-l-purple-500", CODING: "border-l-blue-500", TECHNICAL_KNOWLEDGE: "border-l-orange-500" }[question.category] ?? "border-l-primary"} p-3 space-y-3`}>
              <div className="flex flex-wrap items-center gap-2 sm:hidden">
                <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
                <span className="text-border">&middot;</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>{question.difficulty}</span>
              </div>
              <h2 className="text-lg font-semibold mt-2 sm:mt-0">{question.title}</h2>
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {question.content}
                </p>
              </div>
            </div>

            {/* Examples */}
            {question.examples && question.examples.length > 0 && (
              <div className="space-y-2">
                {question.examples.map((ex: { input: string; output: string }, i: number) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {question.examples!.length > 1 ? `Example ${i + 1}` : "Example"}
                    </p>
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">Input: </span>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{ex.input}</code>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">Output: </span>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{ex.output}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Coaching tip */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-3" data-tour="tol-coaching-tip">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Coaching Tip</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  {COACHING_TIPS[question.category] ?? "Think out loud! Walk through your approach step by step. Discuss data structures, tradeoffs, and edge cases."}
                </p>
              </div>
            </div>

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
                  {previousError && (
                    <p className="text-xs text-destructive">{previousError}</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Right: Code editor + Explanation */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Toggle bar */}
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-1.5">
            <button
              onClick={() => setShowProblem(!showProblem)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {showProblem ? (
                <>
                  <PanelLeftClose className="size-3.5" />
                  Hide problem
                </>
              ) : (
                <>
                  <PanelLeftOpen className="size-3.5" />
                  Show problem
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCode(getQuestionTemplate(language, questionMeta));
                setExplanation("");
                clearDraft(draftKey);
              }}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
            >
              <RefreshCw className="size-3.5" />
              Reset
            </button>
          </div>

          {/* Code editor (fills remaining space) */}
          <div className="flex-1 overflow-hidden p-4" data-tour="tol-editor">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              minHeight={showExplanation ? "calc(100vh - 24rem)" : "calc(100vh - 14rem)"}
            />
          </div>

          {/* Explanation section (collapsible from bottom) */}
          <div className="border-t border-border/40" data-tour="tol-explanation">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Explain Your Approach</span>
                {micState === "recording" && (
                  <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <span className="size-2 animate-pulse rounded-full bg-red-500" />
                    Recording...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span data-tour="tol-word-count" className={`text-xs ${isExplanationTooShort && explanationWordCount > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
                  {explanationWordCount} word{explanationWordCount !== 1 ? "s" : ""} · {explanation.length}/3,000
                </span>
                {showExplanation ? (
                  <ChevronDown className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="size-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {showExplanation && (
              <div className="px-4 pb-4 space-y-2">
                {micState === "recording" ? (
                  <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-red-500/40 bg-red-500/5 ring-2 ring-red-500/20">
                    <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                      <span className="size-2.5 animate-pulse rounded-full bg-red-500" />
                      Recording...
                      <span className="font-mono tabular-nums">{formatTime(elapsed)}</span>
                    </span>
                    {nearLimit && (
                      <p className="mt-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        Approaching 3-minute limit
                      </p>
                    )}
                  </div>
                ) : micState === "transcribing" ? (
                  <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-border bg-muted/30">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <p className="mt-2 text-xs font-medium">Transcribing...</p>
                  </div>
                ) : (
                  <div className="relative">
                    <Textarea
                      id="explanation"
                      placeholder="Why did you choose this approach? What's the time/space complexity? What tradeoffs did you consider?"
                      value={explanation}
                      onChange={(e) => {
                        if (e.target.value.length <= 3000) setExplanation(e.target.value);
                      }}
                      maxLength={3000}
                      className="min-h-[150px] max-h-[150px] text-sm leading-relaxed resize-none overflow-y-auto transition-shadow focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_15px_-3px] focus:shadow-primary/20"
                    />
                    <button
                      type="button"
                      onClick={toggleMic}
                      className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                      title="Speak your explanation"
                    >
                      <Mic className="size-3.5" />
                    </button>
                  </div>
                )}

                {micState === "recording" && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={toggleMic}
                      className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600"
                      title="Stop recording"
                    >
                      <MicOff className="size-4" />
                    </button>
                  </div>
                )}

                {micError && (
                  <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-700 dark:text-yellow-400">
                    <span>{micError}</span>
                    <button onClick={() => setMicError("")} className="ml-2 font-medium hover:underline">
                      Dismiss
                    </button>
                  </div>
                )}

                <p className={`text-xs ${isExplanationTooShort && explanationWordCount > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
                  {isExplanationTooShort && explanationWordCount > 0
                    ? `${MIN_EXPLANATION_WORDS - explanationWordCount} more word${MIN_EXPLANATION_WORDS - explanationWordCount !== 1 ? "s" : ""} needed.`
                    : "Tip: Click the mic to explain your approach out loud, or type it."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TOLTour />
    </div>
  );
}
