"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AnalysisResults } from "@/components/practice/analysis-results";
import { Loader2 } from "lucide-react";
import type { QuestionResponse, AnalysisResponse } from "@/types/api";

export default function ResultsPage() {
  const params = useParams<{ id: string; responseId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fresh = searchParams.get("fresh") === "true";
  const mode = searchParams.get("mode") || "qa";

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getAnalysis(Number(params.responseId)),
      api.getQuestion(Number(params.id)),
    ])
      .then(([a, q]) => { setAnalysis(a); setQuestion(q); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.responseId, params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !analysis || !question) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">Could not load results.</p>
        <button
          onClick={() => router.push("/practice")}
          className="text-sm text-primary hover:underline"
        >
          Browse Questions
        </button>
      </div>
    );
  }

  return (
    <AnalysisResults
      analysis={analysis}
      question={question}
      freshSession={fresh}
      onTryAgain={() => router.push(`/practice/${params.id}?mode=${mode}`)}
      onBackToQuestions={() => router.push("/practice")}
    />
  );
}
