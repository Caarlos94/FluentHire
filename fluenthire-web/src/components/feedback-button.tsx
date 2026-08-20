"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { FeedbackCategory } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  MessageCircle,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/privacy", "/terms"];

const CATEGORIES: {
  value: FeedbackCategory;
  label: string;
  icon: typeof Bug;
  activeClass: string;
}[] = [
  {
    value: "BUG",
    label: "Bug",
    icon: Bug,
    activeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  },
  {
    value: "FEATURE_REQUEST",
    label: "Feature Request",
    icon: Lightbulb,
    activeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    value: "GENERAL",
    label: "General",
    icon: MessageCircle,
    activeClass: "bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30",
  },
];

export function FeedbackButton() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Auto-close after success
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      setCategory(null);
      setMessage("");
      setError(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [success]);

  // 60-second cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Don't render for unauthenticated users or public routes
  if (!user) return null;
  if (PUBLIC_ROUTES.includes(pathname)) return null;

  const canSubmit = category !== null && message.trim().length > 0 && !submitting && cooldownSeconds <= 0;

  const handleSubmit = async () => {
    if (!canSubmit || !category) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.submitFeedback({
        feedback: message.trim(),
        feedbackCategory: category,
        pageUrl: pathname,
      });
      setSuccess(true);
      setCooldownSeconds(60);
    } catch {
      setError("Failed to send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setError(null);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-6 right-6 z-[5] flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquarePlus className="size-5" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal content */}
          <div className="relative w-full max-w-md rounded-xl border bg-background p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {success ? (
              /* Success state */
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium">Thanks for your feedback!</p>
                <p className="text-xs text-muted-foreground">
                  We appreciate you helping us improve.
                </p>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold">Share Feedback</h2>
                  <p className="text-sm text-muted-foreground">
                    Help us improve your experience.
                  </p>
                </div>

                {/* Category pills */}
                <div className="mb-4 flex gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? cat.activeClass
                            : "border-transparent bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Message textarea */}
                <div className="mb-4">
                  <Textarea
                    placeholder="Tell us what's on your mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                    rows={4}
                    className="min-h-[100px] resize-none"
                  />
                  <p className="mt-1.5 text-right text-xs text-muted-foreground">
                    {message.length}/2000
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p className="mb-3 text-xs text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : cooldownSeconds > 0 ? (
                    `Wait ${cooldownSeconds}s`
                  ) : (
                    "Send Feedback"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
