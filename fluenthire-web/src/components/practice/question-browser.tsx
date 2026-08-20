"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PracticeHistory } from "./practice-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Filter,
  Heart,
  Lightbulb,
  Loader2,
  MessageSquareText,
  Clock,
  Mic,
  RefreshCw,
} from "lucide-react";
import {
  type PracticeMode,
  CATEGORY_CONFIG,
  DIFFICULTY_COLOR,
  QA_CATEGORIES,
  DIFFICULTIES,
  TIERS,
  TECHNOLOGIES,
  ALGORITHM_CATEGORIES,
  TIER_COLOR,
  TIER_LABEL,
} from "./constants";
import type { QuestionResponse, QuestionCategory, DifficultyLevel, QuestionTier } from "@/types/api";

const BEHAVIORAL_INTERVIEW_ENABLED = true;


export function QuestionBrowser({
  onSelectQuestion,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  tier,
  setTier,
  currentPage,
  setCurrentPage,
  mode,
  onModeChange,
  historyFilter,
  setHistoryFilter,
  historyPage,
  setHistoryPage,
}: {
  onSelectQuestion: (question: QuestionResponse) => void;
  category: QuestionCategory | "ALL";
  setCategory: (cat: QuestionCategory | "ALL") => void;
  difficulty: DifficultyLevel | "ALL";
  setDifficulty: (diff: DifficultyLevel | "ALL") => void;
  tier: QuestionTier | "ALL";
  setTier: (t: QuestionTier | "ALL") => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  historyFilter: string;
  setHistoryFilter: (f: string) => void;
  historyPage: number;
  setHistoryPage: (p: number) => void;
}) {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attemptedIds, setAttemptedIds] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [technology, setTechnology] = useState("ALL");
  const [algorithmCategory, setAlgorithmCategory] = useState("ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadQuestions = useCallback(async (
    page: number,
    cat: QuestionCategory | "ALL",
    diff: DifficultyLevel | "ALL",
    t: QuestionTier | "ALL",
    m: PracticeMode,
    tech: string = "ALL",
    algoCat: string = "ALL"
  ) => {
    setIsLoading(true);
    setLoadError(false);
    try {
      // Think Out Loud and Interview always filter to CODING, Behavioral Interview always to BEHAVIORAL
      const effectiveCategory = (m === "think-out-loud" || m === "interview") ? "CODING" : m === "behavioral-interview" ? "BEHAVIORAL" : cat;
      const isBehavioral = effectiveCategory === "BEHAVIORAL";
      const isTechnical = effectiveCategory === "TECHNICAL_KNOWLEDGE";
      const isCoding = effectiveCategory === "CODING";
      const data = await api.getQuestions({
        category: effectiveCategory === "ALL" ? undefined : effectiveCategory,
        difficulty: !isBehavioral && diff !== "ALL" ? diff : undefined,
        tier: isBehavioral && t !== "ALL" ? t : undefined,
        tag: isTechnical && tech !== "ALL" ? tech : undefined,
        algorithmCategory: isCoding && algoCat !== "ALL" ? algoCat : undefined,
        page,
        size: 10,
      });
      setQuestions(data.content);
      setTotalPages(data.page.totalPages);
      setCurrentPage(data.page.number);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentPage]);


  // Load attempted question IDs per mode
  useEffect(() => {
    const responseMode = mode === "qa" ? "QA" as const
      : mode === "think-out-loud" ? "THINK_OUT_LOUD" as const
      : mode === "interview" || mode === "behavioral-interview" ? "INTERVIEW" as const
      : undefined;
    api.getAttemptedQuestionIds(responseMode).then((ids) => setAttemptedIds(new Set(ids))).catch(() => {});
  }, [mode]);

  // Load favorite question IDs
  useEffect(() => {
    api.getFavoriteQuestionIds().then((ids) => setFavoriteIds(new Set(ids))).catch(() => {});
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent | React.KeyboardEvent, questionId: number) => {
    e.stopPropagation();
    const prev = new Set(favoriteIds);
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
    try {
      await api.toggleFavoriteQuestion(questionId);
    } catch {
      setFavoriteIds(prev);
    }
  };

  // Reload when returning to browser or when filters change
  useEffect(() => {
    loadQuestions(currentPage, category, difficulty, tier, mode, technology, algorithmCategory);
  }, [category, difficulty, tier, mode, technology, algorithmCategory, loadQuestions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    loadQuestions(page, category, difficulty, tier, mode, technology, algorithmCategory);
  };

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => { onModeChange("qa"); setCategory("ALL"); setDifficulty("ALL"); setTier("ALL"); setTechnology("ALL"); setCurrentPage(0); }}
            className={`flex-1 rounded-md px-2 py-2.5 sm:px-4 sm:py-2 text-center text-sm font-medium transition-colors ${
              mode === "qa"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquareText className="size-4 sm:mr-1.5 inline" />
            <span className="hidden sm:inline">Q&A Practice</span>
          </button>
          <button
            onClick={() => { onModeChange("think-out-loud"); setCategory("ALL"); setDifficulty("ALL"); setTier("ALL"); setTechnology("ALL"); setCurrentPage(0); }}
            className={`flex-1 rounded-md px-2 py-2.5 sm:px-4 sm:py-2 text-center text-sm font-medium transition-colors ${
              mode === "think-out-loud"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lightbulb className="size-4 sm:mr-1.5 inline" />
            <span className="hidden sm:inline">Think Out Loud</span>
          </button>
          <button
            onClick={() => { onModeChange("interview"); setCategory("ALL"); setDifficulty("ALL"); setTier("ALL"); setTechnology("ALL"); setCurrentPage(0); }}
            className={`flex-1 rounded-md px-2 py-2.5 sm:px-4 sm:py-2 text-center text-sm font-medium transition-colors ${
              mode === "interview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="size-4 sm:mr-1.5 inline" />
            <span className="hidden sm:inline">Coding Interview</span>
          </button>
          {BEHAVIORAL_INTERVIEW_ENABLED && (
            <button
              onClick={() => { onModeChange("behavioral-interview"); setCategory("ALL"); setDifficulty("ALL"); setTier("ALL"); setTechnology("ALL"); setCurrentPage(0); }}
              className={`flex-1 rounded-md px-2 py-2.5 sm:px-4 sm:py-2 text-center text-sm font-medium transition-colors ${
                mode === "behavioral-interview"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BrainCircuit className="size-4 sm:mr-1.5 inline" />
              <span className="hidden sm:inline">Behavioral Interview</span>
            </button>
          )}
          <button
            onClick={() => { onModeChange("history"); }}
            className={`flex-1 rounded-md px-2 py-2.5 sm:px-4 sm:py-2 text-center text-sm font-medium transition-colors ${
              mode === ("history")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-4 sm:mr-1.5 inline" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {mode === "history" ? (
        <PracticeHistory
          modeFilter={historyFilter}
          setModeFilter={setHistoryFilter}
          currentPage={historyPage}
          setCurrentPage={setHistoryPage}
        />
      ) : (<>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "behavioral-interview"
            ? "Behavioral Interview"
            : mode === "interview"
              ? "Coding Interview"
              : mode === "think-out-loud"
                ? "Think Out Loud"
                : "Practice Questions"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "behavioral-interview"
            ? "Select a behavioral topic to start a live AI interview (1 credit). The AI will probe your experience using the STAR method."
            : mode === "interview"
              ? "Select a coding problem to start a live AI interview (1 credit). The AI interviewer will ask follow-up questions in real time."
              : mode === "think-out-loud"
                ? "Solve coding problems while explaining your reasoning — write code and talk through your approach."
                : "Pick a question, write your answer in English, and get AI feedback."}
        </p>
      </div>

      {/* Filters */}
      {(() => {
        const filterContent = (
          <div className="flex flex-wrap gap-3">
            {mode === "behavioral-interview" ? (
              /* Behavioral Interview: only tier filter (category is locked to BEHAVIORAL) */
              <div className="flex flex-wrap gap-1.5">
                {TIERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTier(t.value); setCurrentPage(0); }}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      tier === t.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (mode === "think-out-loud" || mode === "interview") ? (
              /* Think Out Loud / Interview: difficulty + algorithm category filters (locked to CODING) */
              <>
                <div className="flex flex-wrap gap-1.5">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => { setDifficulty(diff.value); setCurrentPage(0); }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        difficulty === diff.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
                <select
                  value={algorithmCategory}
                  onChange={(e) => { setAlgorithmCategory(e.target.value); setCurrentPage(0); }}
                  className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                >
                  {ALGORITHM_CATEGORIES.map((ac) => (
                    <option key={ac.value} value={ac.value}>{ac.label}</option>
                  ))}
                </select>
              </>
            ) : (
              /* Q&A: category + sub-filters */
              <>
                <div className="flex flex-wrap gap-1.5">
                  {QA_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setCategory(cat.value); setDifficulty("ALL"); setTier("ALL"); setTechnology("ALL"); setAlgorithmCategory("ALL"); setCurrentPage(0); }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        category === cat.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {category === "BEHAVIORAL" ? (
                  <div className="flex flex-wrap gap-1.5">
                    {TIERS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setTier(t.value); setCurrentPage(0); }}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          tier === t.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff.value}
                          onClick={() => { setDifficulty(diff.value); setCurrentPage(0); }}
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                            difficulty === diff.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                    {category === "TECHNICAL_KNOWLEDGE" && (
                      <select
                        value={technology}
                        onChange={(e) => { setTechnology(e.target.value); setCurrentPage(0); }}
                        className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                      >
                        {TECHNOLOGIES.map((tech) => (
                          <option key={tech.value} value={tech.value}>{tech.label}</option>
                        ))}
                      </select>
                    )}
                    {category === "CODING" && (
                      <select
                        value={algorithmCategory}
                        onChange={(e) => { setAlgorithmCategory(e.target.value); setCurrentPage(0); }}
                        className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                      >
                        {ALGORITHM_CATEGORIES.map((ac) => (
                          <option key={ac.value} value={ac.value}>{ac.label}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        );

        const activeFilterCount = [
          category !== "ALL" ? 1 : 0,
          difficulty !== "ALL" ? 1 : 0,
          tier !== "ALL" ? 1 : 0,
          technology !== "ALL" ? 1 : 0,
          algorithmCategory !== "ALL" ? 1 : 0,
        ].reduce((a, b) => a + b, 0);

        return (
          <>
            {/* Mobile: collapsible filters */}
            <div className="sm:hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Filter className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className={`ml-auto size-4 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-200 ${filtersOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="pt-3">
                    {filterContent}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: filters always visible */}
            <div className="hidden border-b border-border/40 pb-4 sm:block">
              {filterContent}
            </div>
          </>
        );
      })()}

      {/* Questions list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : loadError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm font-medium text-destructive">
              Failed to load questions. Please check your connection.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => loadQuestions(currentPage, category, difficulty, tier, mode, technology, algorithmCategory)}
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No questions found with these filters. Try changing the category or
              difficulty level.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {questions.map((question) => {
            const cat = CATEGORY_CONFIG[question.category] ?? CATEGORY_CONFIG.BEHAVIORAL;

            const diffLabel = question.tier
              ? (TIER_LABEL[question.tier] ?? question.tier)
              : question.difficulty;
            const diffBadgeColor = question.tier
              ? (TIER_COLOR[question.tier] ?? "text-muted-foreground")
              : (DIFFICULTY_COLOR[question.difficulty] ?? "text-muted-foreground");
            const catTextColor = cat.color.split(" ").find(c => c.startsWith("text-")) ?? "text-muted-foreground";
            const catBorderColor: Record<string, string> = {
              BEHAVIORAL: "border-l-cyan-500",
              SYSTEM_DESIGN: "border-l-purple-500",
              CODING: "border-l-blue-500",
              TECHNICAL_KNOWLEDGE: "border-l-orange-500",
            };

            return (
              <button
                key={question.id}
                onClick={() => onSelectQuestion(question)}
                className={`group w-full rounded-lg border border-border/60 border-l-4 ${catBorderColor[question.category] ?? "border-l-primary"} bg-card p-3 text-left transition-all hover:bg-muted/40 hover:ring-1 hover:ring-primary/40 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]`}
              >
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 text-sm font-medium leading-normal group-hover:text-primary">
                    {question.title}
                  </p>
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${diffBadgeColor}`}>
                    {diffLabel}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleToggleFavorite(e, question.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFavorite(e, question.id); } }}
                    aria-label={favoriteIds.has(question.id) ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={favoriteIds.has(question.id)}
                    className={`shrink-0 cursor-pointer rounded-md p-0.5 transition-colors ${
                      favoriteIds.has(question.id)
                        ? "text-rose-500"
                        : "text-muted-foreground/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart className={`size-4 ${favoriteIds.has(question.id) ? "fill-current" : ""}`} />
                  </div>
                  {attemptedIds.has(question.id) && (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className={`text-[12px] font-semibold ${catTextColor}`}>{cat.label}</span>
                  {question.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] text-muted-foreground/80">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-1 truncate text-[12px] text-muted-foreground">
                  {question.content.replace(/\s+/g, " ")}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ArrowLeft />
            Previous
          </Button>
          <span className="px-3 text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      )}
      </>)}
    </div>
  );
}
