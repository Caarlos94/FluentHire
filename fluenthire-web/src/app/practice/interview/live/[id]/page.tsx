"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { getDefaultLanguage } from "@/components/code-editor-utils";
import { InterviewView } from "@/components/interview-mode/interview-view";
import { BehavioralInterviewView } from "@/components/interview-mode/behavioral-interview-view";
import { DesktopRequiredMessage } from "@/components/practice/desktop-required-message";
import { Loader2 } from "lucide-react";
import type { QuestionResponse } from "@/types/api";
import type { InterviewCategory, FocusArea, InterviewFormat, InterviewPersonality, InterviewSessionResult, SpeakingSpeed } from "@/types/interview";

export default function InterviewLivePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const format = (searchParams.get("format") || "QUICK") as InterviewFormat;
  const category = searchParams.get("category") as InterviewCategory | null;
  const personality = (searchParams.get("personality") || "SUPPORTIVE") as InterviewPersonality;
  const speed = (searchParams.get("speed") || "NORMAL") as SpeakingSpeed;
  const focusArea = (searchParams.get("focus") || "BALANCED") as FocusArea;
  const defaultLanguage = getDefaultLanguage(user?.mainLanguage ?? null);
  const secondQuestionId = searchParams.get("q2");

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ids = [Number(params.id)];
    if (secondQuestionId) ids.push(Number(secondQuestionId));

    Promise.all(ids.map((id) => api.getQuestion(id)))
      .then(setQuestions)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id, secondQuestionId]);

  if (isMobile) return <DesktopRequiredMessage />;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">Could not load the question.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleComplete = (result: InterviewSessionResult) => {
    router.replace(`/practice/interview/report/${result.sessionId}`);
  };

  if (category === "BEHAVIORAL") {
    return (
      <BehavioralInterviewView
        questions={questions}
        format={format}
        personality={personality}
        speed={speed}
        focusArea={focusArea}
        onComplete={handleComplete}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <InterviewView
      questions={[questions[0]]}
      format={format}
      personality={personality}
      speed={speed}
      focusArea={focusArea}
      onComplete={handleComplete}
      onBack={() => router.back()}
      defaultLanguage={defaultLanguage}
    />
  );
}
