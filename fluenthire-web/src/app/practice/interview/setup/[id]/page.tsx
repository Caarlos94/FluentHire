"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { SessionFormatSelector } from "@/components/interview-mode/session-format-selector";
import { DesktopRequiredMessage } from "@/components/practice/desktop-required-message";
import { Loader2 } from "lucide-react";
import type { QuestionResponse } from "@/types/api";
import type { InterviewCategory, FocusArea, InterviewFormat, InterviewPersonality, InterviewSessionResult, SpeakingSpeed } from "@/types/interview";

export default function InterviewSetupPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const category = searchParams.get("category") as InterviewCategory | null;

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getQuestion(Number(params.id))
      .then(setQuestion)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (isMobile) return <DesktopRequiredMessage />;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">Could not load the question.</p>
        <button
          onClick={() => router.push("/practice")}
          className="text-sm text-primary hover:underline"
        >
          Browse Questions
        </button>
      </div>
    );
  }

  const handleStart = (format: InterviewFormat, personality: InterviewPersonality, speed: SpeakingSpeed, focusArea: FocusArea, extraQuestionIds?: number[]) => {
    const catParam = category ? `&category=${category}` : "";
    const extraParam = extraQuestionIds?.length ? `&q2=${extraQuestionIds[0]}` : "";
    router.push(`/practice/interview/live/${params.id}?format=${format}${catParam}&personality=${personality}&speed=${speed}&focus=${focusArea}${extraParam}`);
  };

  const handleViewAttempt = (result: InterviewSessionResult) => {
    router.push(`/practice/interview/report/${result.sessionId}`);
  };

  return (
    <SessionFormatSelector
      credits={user?.credits ?? 0}
      question={question}
      onStart={handleStart}
      category={category || undefined}
      onViewAttempt={handleViewAttempt}
    />
  );
}
