"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConversationPanel } from "./conversation-panel";
import { useInterviewTimer } from "@/hooks/use-interview-timer";
import { useRealtimeInterview } from "@/hooks/use-realtime-interview";
import { BEHAVIORAL_FORMATS } from "@/types/interview";
import type { FocusArea, InterviewFormat, InterviewPersonality, InterviewSessionResult, SpeakingSpeed } from "@/types/interview";
import type { QuestionResponse } from "@/types/api";
import { useAuth } from "@/lib/auth";
import { AlertCircle, ChevronDown, ChevronUp, Clock, Loader2, MessageSquareText, PhoneOff, Play } from "lucide-react";
import { BehavioralInterviewTour } from "@/components/practice-tour";

export function BehavioralInterviewView({
  questions,
  format,
  personality,
  speed,
  focusArea,
  onComplete,
  onBack,
}: {
  questions: QuestionResponse[];
  format: InterviewFormat;
  personality?: InterviewPersonality;
  speed?: SpeakingSpeed;
  focusArea?: FocusArea;
  onComplete: (result: InterviewSessionResult) => void;
  onBack: () => void;
}) {
  const { refreshProfile } = useAuth();
  const formatConfig = BEHAVIORAL_FORMATS[format];
  const [isEnding, setIsEnding] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showContext, setShowContext] = useState(true);

  const interview = useRealtimeInterview({
    questions,
    format,
    personality,
    speed,
    focusArea,
    category: "BEHAVIORAL",
    onSessionComplete: (result) => {
      refreshProfile().catch(() => {});
      onComplete(result);
    },
  });

  const timer = useInterviewTimer(formatConfig.duration, () => {
    interview.endSession();
  });

  const handleStartSession = () => {
    setHasStarted(true);
    interview.startSession();
    timer.start();
  };

  const handleEndSession = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end the interview? Your session will be scored based on your current progress."
    );
    if (!confirmed) return;
    setIsEnding(true);
    timer.pause();
    interview.endSession();
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

  // Timer color logic
  const isTimeLow = timer.remainingSeconds <= 180;
  const isTimeCritical = timer.remainingSeconds <= 60;

  return (
    <div className="fixed inset-0 top-14 z-10 flex flex-col bg-background mx-auto max-w-[900px]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <div className="flex items-center gap-3">
          <div data-tour="behavioral-timer" className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono tabular-nums ${
            isTimeCritical
              ? "bg-red-500/10 text-red-600 animate-pulse"
              : isTimeLow
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-foreground"
          }`}>
            <Clock className="size-3.5" />
            {timer.formattedRemaining}
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
            <MessageSquareText className="mr-1 size-3" />
            Topic {interview.currentProblemIndex + 1}/{questions.length}
          </Badge>
          <span className="hidden text-sm font-medium truncate max-w-[300px] sm:inline">
            {questions[interview.currentProblemIndex]?.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hasStarted && (
            <Button
              size="sm"
              onClick={handleStartSession}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-tour="behavioral-start"
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
            data-tour="behavioral-end"
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

      {/* Collapsible question context */}
      <div className="border-b border-border/40" data-tour="behavioral-topic">
        <button
          onClick={() => setShowContext(!showContext)}
          className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <span className="text-lg font-semibold">{questions[interview.currentProblemIndex]?.title}</span>
          {showContext ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {showContext && (
          <div className="px-4 pb-4 max-h-[30vh] overflow-y-auto">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {questions[interview.currentProblemIndex]?.content}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Full-width conversation panel */}
      <div className="flex flex-1 flex-col overflow-hidden p-4 pb-6">
        <ConversationPanel
          headerTourId="behavioral-conversation"
          messages={interview.messages}
          isMuted={interview.isMuted}
          isAiSpeaking={interview.isAiSpeaking}
          isAiThinking={interview.isAiThinking}
          onToggleMute={interview.toggleMute}
        />
      </div>

      <BehavioralInterviewTour />
    </div>
  );
}
