"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationMessage } from "@/types/interview";

export function ConversationPanel({
  messages,
  isMuted,
  isAiSpeaking,
  isAiThinking = false,
  onToggleMute,
  headerTourId,
}: {
  messages: ConversationMessage[];
  isMuted: boolean;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
  onToggleMute: () => void;
  headerTourId?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3" {...(headerTourId ? { "data-tour": headerTourId } : {})}>
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
            <BrainCircuit className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">AI Interviewer</span>
          {isAiSpeaking && (
            <span className="flex items-center gap-1 text-xs text-purple-500">
              <span className="size-1.5 animate-pulse rounded-full bg-purple-500" />
              Speaking
            </span>
          )}
          {isAiThinking && !isAiSpeaking && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
              Thinking
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleMute}
          title={isMuted ? "Unmute microphone" : "Mute microphone"}
          data-tour="interview-mute"
        >
          {isMuted ? (
            <MicOff className="size-4 text-red-500" />
          ) : (
            <Mic className="size-4 text-emerald-500" />
          )}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
              <Mic className="size-5 text-purple-500" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">The interview will begin shortly...</p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Click <span className="font-semibold text-emerald-500">Start Interview</span> when you&apos;re ready. The AI will ask questions and listen to your responses in real time.
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isAiThinking && !isAiSpeaking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="pb-4" />
      </div>
    </div>
  );
}
