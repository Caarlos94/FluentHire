"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquareText, Send, Star } from "lucide-react";

type SessionRatingCardProps =
  | { userResponseId: number; interviewSessionId?: never; alwaysShow?: boolean }
  | { userResponseId?: never; interviewSessionId: string; alwaysShow?: boolean };

export function SessionRatingCard({ userResponseId, interviewSessionId, alwaysShow }: SessionRatingCardProps) {
  const [state, setState] = useState<"checking" | "hidden" | "stars" | "submitting" | "feedback" | "thanks">("checking");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const showRef = useRef(alwaysShow || Math.random() < 0.5);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const checkExisting = interviewSessionId
      ? api.getInterviewRating(interviewSessionId)
      : api.getSessionRating(userResponseId!);

    checkExisting.then((existing) => {
      if (existing) {
        setState("hidden");
      } else {
        setState(showRef.current ? "stars" : "hidden");
      }
    }).catch(() => setState("hidden"));

    return () => clearTimeout(timerRef.current);
  }, [userResponseId, interviewSessionId]);

  const hideAfterDelay = () => {
    setState("thanks");
    timerRef.current = setTimeout(() => setState("hidden"), 2000);
  };

  const handleRate = async (stars: number) => {
    setRating(stars);
    setState("submitting");
    try {
      if (interviewSessionId) {
        await api.submitInterviewRating(interviewSessionId, stars);
      } else {
        await api.submitSessionRating(userResponseId!, stars);
      }
      if (stars <= 3) {
        setState("feedback");
      } else {
        hideAfterDelay();
      }
    } catch {
      setState("hidden");
    }
  };

  const handleSendFeedback = async () => {
    if (feedbackText.trim()) {
      try {
        if (interviewSessionId) {
          await api.submitInterviewRating(interviewSessionId, rating, feedbackText.trim());
        } else {
          await api.submitSessionRating(userResponseId!, rating, feedbackText.trim());
        }
      } catch { /* rating already saved, feedback is bonus */ }
    }
    hideAfterDelay();
  };

  if (state === "checking" || state === "hidden") return null;

  return (
    <Card className="border-dashed border-muted-foreground/20 bg-muted/30 py-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <CardContent className="py-1">
        {(state === "stars" || state === "submitting") && (
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MessageSquareText className="size-3.5" />
              How was this session?
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={state === "submitting"}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="rounded-md p-1 transition-transform hover:scale-110 disabled:pointer-events-none"
                >
                  <Star
                    className={`size-6n transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {state === "feedback" && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in-0 duration-200">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-5 ${
                    star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Textarea
              placeholder="Any additional feedback? (optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={2}
              className="max-w-md text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={hideAfterDelay}>
                Skip
              </Button>
              <Button size="sm" disabled={!feedbackText.trim()} onClick={handleSendFeedback}>
                <Send className="size-3.5" />
                Send
              </Button>
            </div>
          </div>
        )}

        {state === "thanks" && (
          <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in-0 duration-300">
            Thanks for your feedback!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
