"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { getDefaultLanguage } from "@/components/code-editor-utils";
import { PracticeView } from "@/components/practice/practice-view";
import { ThinkOutLoudView } from "@/components/practice/think-out-loud-view";
import { DesktopRequiredMessage } from "@/components/practice/desktop-required-message";
import { Loader2 } from "lucide-react";
import type { QuestionResponse, AnalysisResponse } from "@/types/api";

export default function QuestionPracticePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const mode = searchParams.get("mode") || "qa";
  const defaultLanguage = getDefaultLanguage(user?.mainLanguage ?? null);

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getQuestion(Number(params.id))
      .then(setQuestion)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

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

  if (mode === "think-out-loud" && isMobile) {
    return <DesktopRequiredMessage />;
  }

  const handleAnalysisComplete = (analysis: AnalysisResponse, fresh = true) => {
    router.push(`/practice/${params.id}/results/${analysis.userResponseId}?mode=${mode}&fresh=${fresh}`);
  };

  if (mode === "think-out-loud") {
    return (
      <ThinkOutLoudView
        question={question}
        onAnalysisComplete={handleAnalysisComplete}
        defaultLanguage={defaultLanguage}
      />
    );
  }

  return (
    <PracticeView
      question={question}
      onAnalysisComplete={handleAnalysisComplete}
    />
  );
}
