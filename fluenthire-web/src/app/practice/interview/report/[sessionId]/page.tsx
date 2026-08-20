"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SessionReport } from "@/components/interview-mode/session-report";
import { Loader2 } from "lucide-react";
import type { InterviewHistoryItem, InterviewSessionResult } from "@/types/interview";

export default function InterviewReportPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [result, setResult] = useState<InterviewSessionResult | null>(null);
  const [attemptInfo, setAttemptInfo] = useState<{ number: number; total: number } | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getInterviewSession(params.sessionId);
        setResult(res);

        const questionId = res.problems[0]?.questionId;
        if (questionId) {
          const attempts = await api.getInterviewAttempts(questionId).catch(() => []);
          const sorted = [...attempts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const idx = sorted.findIndex((a) => a.sessionId === params.sessionId);
          setAttemptInfo({ number: idx >= 0 ? idx + 1 : sorted.length, total: sorted.length });
        }

        const history = await api.getInterviewHistory(0, 50).catch(() => null);
        if (history?.content) {
          setInterviewHistory(history.content);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">Could not load interview results.</p>
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
    <SessionReport
      result={result}
      attemptInfo={attemptInfo}
      interviewHistory={interviewHistory}
      onBackToDashboard={() => router.push("/dashboard")}
      onPracticeAgain={() => {
        const questionId = result.problems[0]?.questionId;
        const catParam = result.category ? `?category=${result.category}` : "";
        router.push(`/practice/interview/setup/${questionId}${catParam}`);
      }}
    />
  );
}
