"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuestionBrowser } from "@/components/practice/question-browser";
import { type PracticeMode, CATEGORIES } from "@/components/practice/constants";
import type { QuestionCategory, DifficultyLevel, QuestionTier } from "@/types/api";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Legacy deep-link redirect: /practice?questionId=123&mode=qa ──
  useEffect(() => {
    const questionId = searchParams.get("questionId");
    if (!questionId) return;

    const modeParam = searchParams.get("mode") || "qa";
    if (modeParam === "interview") {
      router.replace(`/practice/interview/setup/${questionId}`);
    } else if (modeParam === "behavioral-interview") {
      router.replace(`/practice/interview/setup/${questionId}?category=BEHAVIORAL`);
    } else {
      router.replace(`/practice/${questionId}?mode=${modeParam}`);
    }
  }, [searchParams, router]);

  // ── Read all filter state from URL params ──
  const [mode, setMode] = useState<PracticeMode>(
    () => (searchParams.get("mode") as PracticeMode) || "qa"
  );
  const [category, setCategory] = useState<QuestionCategory | "ALL">(() => {
    const cat = searchParams.get("category");
    return cat && CATEGORIES.some((c) => c.value === cat)
      ? (cat as QuestionCategory)
      : "ALL";
  });
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ALL">(
    () => (searchParams.get("difficulty") as DifficultyLevel) || "ALL"
  );
  const [tier, setTier] = useState<QuestionTier | "ALL">(
    () => (searchParams.get("tier") as QuestionTier) || "ALL"
  );
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 0
  );
  const [historyFilter, setHistoryFilter] = useState(
    () => searchParams.get("historyFilter") || "ALL"
  );
  const [historyPage, setHistoryPage] = useState(
    () => Number(searchParams.get("historyPage")) || 0
  );

  // ── Debounced URL sync — avoids replaceState throttling ──
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const modeRef = useRef(mode);
  const categoryRef = useRef(category);
  const difficultyRef = useRef(difficulty);
  const tierRef = useRef(tier);
  const pageRef = useRef(currentPage);
  const historyFilterRef = useRef(historyFilter);
  const historyPageRef = useRef(historyPage);
  modeRef.current = mode;
  categoryRef.current = category;
  difficultyRef.current = difficulty;
  tierRef.current = tier;
  pageRef.current = currentPage;
  historyFilterRef.current = historyFilter;
  historyPageRef.current = historyPage;

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (modeRef.current !== "qa") params.set("mode", modeRef.current);
      if (categoryRef.current !== "ALL") params.set("category", categoryRef.current);
      if (difficultyRef.current !== "ALL") params.set("difficulty", difficultyRef.current);
      if (tierRef.current !== "ALL") params.set("tier", tierRef.current);
      if (pageRef.current > 0) params.set("page", String(pageRef.current));
      if (modeRef.current === "history") {
        if (historyFilterRef.current !== "ALL") params.set("historyFilter", historyFilterRef.current);
        if (historyPageRef.current > 0) params.set("historyPage", String(historyPageRef.current));
      }
      const qs = params.toString();
      router.replace(`/practice${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [mode, category, difficulty, tier, currentPage, historyFilter, historyPage, router]);

  // If there's a questionId param, show nothing while the redirect runs
  if (searchParams.get("questionId")) {
    return null;
  }

  const handleSelectQuestion = (question: { id: number }) => {
    if (mode === "interview") {
      router.push(`/practice/interview/setup/${question.id}`);
    } else if (mode === "behavioral-interview") {
      router.push(`/practice/interview/setup/${question.id}?category=BEHAVIORAL`);
    } else {
      router.push(`/practice/${question.id}?mode=${mode}`);
    }
  };

  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode);
    setCategory("ALL");
    setDifficulty("ALL");
    setTier("ALL");
    setCurrentPage(0);
  };

  return (
    <QuestionBrowser
      onSelectQuestion={handleSelectQuestion}
      category={category}
      setCategory={setCategory}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      tier={tier}
      setTier={setTier}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      mode={mode}
      onModeChange={handleModeChange}
      historyFilter={historyFilter}
      setHistoryFilter={setHistoryFilter}
      historyPage={historyPage}
      setHistoryPage={setHistoryPage}
    />
  );
}
