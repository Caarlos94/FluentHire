"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { getDefaultLanguage, getLanguageTemplate, getQuestionTemplate } from "@/components/code-editor-utils";

const CodeEditor = dynamic(
  () => import("@/components/code-editor").then((m) => ({ default: m.CodeEditor })),
  { ssr: false }
);
import { ConversationPanel } from "./conversation-panel";
import { useInterviewTimer } from "@/hooks/use-interview-timer";
import { useRealtimeInterview } from "@/hooks/use-realtime-interview";
import { INTERVIEW_FORMATS } from "@/types/interview";
import type { FocusArea, InterviewFormat, InterviewPersonality, InterviewSessionResult, SpeakingSpeed } from "@/types/interview";
import type { QuestionResponse } from "@/types/api";
import { useAuth } from "@/lib/auth";
import { AlertCircle, ChevronDown, ChevronUp, Clock, Loader2, PhoneOff, Play, RefreshCw } from "lucide-react";
import { InterviewTour } from "@/components/practice-tour";
import { CATEGORY_CONFIG, DIFFICULTY_COLOR } from "@/components/practice/constants";

export function InterviewView({
  questions,
  format,
  personality,
  speed,
  focusArea,
  onComplete,
  onBack,
  defaultLanguage,
}: {
  questions: QuestionResponse[];
  format: InterviewFormat;
  personality?: InterviewPersonality;
  speed?: SpeakingSpeed;
  focusArea?: FocusArea;
  onComplete: (result: InterviewSessionResult) => void;
  onBack: () => void;
  defaultLanguage: string;
}) {
  const { refreshProfile } = useAuth();
  const formatConfig = INTERVIEW_FORMATS[format];
  const currentQuestion = questions[0];
  const questionMeta = currentQuestion?.methodName ? {
    methodName: currentQuestion.methodName,
    methodParams: currentQuestion.methodParams,
    returnType: currentQuestion.returnType,
  } : null;
  const [code, setCode] = useState(() => getQuestionTemplate(defaultLanguage, questionMeta));
  const [language, setLanguage] = useState(defaultLanguage);
  const [isEnding, setIsEnding] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showProblem, setShowProblem] = useState(true);
  const codeRef = useRef(code);
  codeRef.current = code;
  const languageRef = useRef(language);
  languageRef.current = language;

  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang);
    setCode((prev) => {
      const currentTemplate = getQuestionTemplate(language, questionMeta);
      if (!prev.trim() || prev.trim() === currentTemplate.trim()) {
        return getQuestionTemplate(newLang, questionMeta);
      }
      return prev;
    });
  }, [language, questionMeta]);

  const interview = useRealtimeInterview({
    questions,
    format,
    personality,
    speed,
    focusArea,
    onSessionComplete: (result) => {
      refreshProfile().catch(() => {}); // Refresh credits after session
      onComplete(result);
    },
  });

  const buildCodeSnapshots = useCallback(() => {
    const q = questions[interview.currentProblemIndex];
    if (!q || !codeRef.current.trim()) return [];
    return [{ questionId: q.id, code: codeRef.current, language: languageRef.current }];
  }, [questions, interview.currentProblemIndex]);

  const timer = useInterviewTimer(formatConfig.duration, () => {
    interview.endSession(buildCodeSnapshots());
  });

  const handleStartSession = () => {
    setHasStarted(true);
    interview.startSession();
    timer.start();
  };

  // Send code snapshots periodically to the AI
  const sendTextMessageRef = useRef(interview.sendTextMessage);
  sendTextMessageRef.current = interview.sendTextMessage;

  useEffect(() => {
    if (interview.state === "CODING" || interview.state === "FOLLOW_UP") {
      const interval = setInterval(() => {
        if (codeRef.current.trim()) {
          sendTextMessageRef.current(`[Current code (${languageRef.current})]\n${codeRef.current}`);
        }
      }, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [interview.state]);

  const handleEndSession = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end the interview? Your session will be scored based on your current progress."
    );
    if (!confirmed) return;
    setIsEnding(true);
    timer.pause();
    interview.endSession(buildCodeSnapshots());
  };

  if (hasStarted && interview.state === "CONNECTING") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Connecting to AI interviewer...</p>
      </div>
    );
  }

  if (hasStarted && interview.state === "IDLE" && !isEnding) {
    if (interview.startError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-destructive">{interview.startError}</p>
          <Button variant="outline" onClick={onBack}>Back to Setup</Button>
        </div>
      );
    }
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Preparing interview session...</p>
      </div>
    );
  }

  // Category & difficulty styling
  const cat = CATEGORY_CONFIG[currentQuestion?.category] ?? CATEGORY_CONFIG.CODING;
  const catTextColor = cat.color.split(" ").find((c: string) => c.startsWith("text-")) ?? "text-muted-foreground";
  const diffColor = DIFFICULTY_COLOR[currentQuestion?.difficulty] ?? "";

  // Timer color logic
  const isTimeLow = timer.remainingSeconds <= 180; // 3 min
  const isTimeCritical = timer.remainingSeconds <= 60; // 1 min

  return (
    <div className="fixed inset-0 top-14 z-10 flex flex-col bg-background px-5 mx-auto max-w-[1440px]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <div className="flex items-center gap-3">
          <div data-tour="interview-timer" className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-mono tabular-nums ${
            isTimeCritical
              ? "border-red-500/30 bg-red-500/10 text-red-600 animate-pulse"
              : isTimeLow
                ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                : "border-border/60 bg-muted text-foreground"
          }`}>
            <Clock className="size-3.5" />
            {timer.formattedRemaining}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
            <span className="text-border">&middot;</span>
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffColor}`}>
              {currentQuestion?.difficulty}
            </span>
            <span className="text-border">&middot;</span>
            <span className="text-[12px] text-muted-foreground">
              Problem {interview.currentProblemIndex + 1}/{questions.length}
            </span>
            <span className="text-border">&middot;</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {formatConfig.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasStarted && (
            <Button
              size="sm"
              onClick={handleStartSession}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-tour="interview-start"
            >
              <Play className="size-4" />
              Start Interview
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndSession}
            disabled={isEnding || !hasStarted}
            data-tour="interview-end"
          >
            {isEnding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PhoneOff className="size-4" />
            )}
            End Interview
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden pb-6">
        {/* Left: Code editor (60%) */}
        <div className="flex w-[60%] flex-col border-r border-border/40 overflow-hidden">
          {/* Collapsible problem brief */}
          <div className={`border-b border-border/40 border-l-[3px] ${{
            BEHAVIORAL: "border-l-cyan-500",
            SYSTEM_DESIGN: "border-l-purple-500",
            CODING: "border-l-blue-500",
            TECHNICAL_KNOWLEDGE: "border-l-orange-500",
          }[currentQuestion?.category] ?? "border-l-primary"}`} data-tour="interview-problem">
            <button
              onClick={() => setShowProblem(!showProblem)}
              className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg font-semibold">{questions[interview.currentProblemIndex]?.title}</span>
              {showProblem ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </button>

            {showProblem && (
              <div className="px-4 pb-4 space-y-3 max-h-[40vh] overflow-y-auto">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {questions[interview.currentProblemIndex]?.content}
                  </p>
                </div>
                {(questions[interview.currentProblemIndex]?.examples?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {questions[interview.currentProblemIndex]?.examples?.map((ex, i) => (
                      <div key={i} className="flex-1 min-w-0 rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Example {i + 1}</p>
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
              </div>
            )}
          </div>

          {/* Code editor (fills remaining space) */}
          <div className="flex-1 overflow-hidden p-4" data-tour="interview-editor">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              fillHeight
              toolbarRight={
                <button
                  onClick={() => setCode(getQuestionTemplate(language, questionMeta))}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                >
                  <RefreshCw className="size-3.5" />
                  Reset
                </button>
              }
            />
          </div>
        </div>

        {/* Right: Conversation panel (40%) */}
        <div className="flex w-[40%] flex-col p-4 overflow-hidden" data-tour="interview-conversation">
          <ConversationPanel
            messages={interview.messages}
            isMuted={interview.isMuted}
            isAiSpeaking={interview.isAiSpeaking}
            isAiThinking={interview.isAiThinking}
            onToggleMute={interview.toggleMute}
          />
        </div>
      </div>

      <InterviewTour />
    </div>
  );
}
