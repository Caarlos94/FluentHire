import { BrainCircuit, Code, MessageSquareText, Target } from "lucide-react";
import type { QuestionCategory, DifficultyLevel, QuestionTier } from "@/types/api";

export type PracticeMode = "qa" | "think-out-loud" | "interview" | "behavioral-interview" | "history";

export const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof MessageSquareText }
> = {
  BEHAVIORAL: { label: "Behavioral", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", icon: MessageSquareText },
  SYSTEM_DESIGN: { label: "System Design", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: BrainCircuit },
  CODING: { label: "Coding", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Code },
  TECHNICAL_KNOWLEDGE: { label: "Technical", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", icon: Target },
};

export const DIFFICULTY_COLOR: Record<string, string> = {
  JUNIOR: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MID: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  SENIOR: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const CATEGORIES: { value: QuestionCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "CODING", label: "Coding" },
  { value: "TECHNICAL_KNOWLEDGE", label: "Technical" },
];

export const QA_CATEGORIES: { value: QuestionCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "CODING", label: "Coding" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "TECHNICAL_KNOWLEDGE", label: "Technical" },
];

export const DIFFICULTIES: { value: DifficultyLevel | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Levels" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-Level" },
  { value: "SENIOR", label: "Senior" },
];

export const TIERS: { value: QuestionTier | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Tiers" },
  { value: "MUST_KNOW", label: "Must Know" },
  { value: "COMMONLY_ASKED", label: "Commonly Asked" },
  { value: "REMOTE_SPECIFIC", label: "Remote-Specific" },
];

export const TECHNOLOGIES: { value: string; label: string }[] = [
  { value: "ALL", label: "All Technologies" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "aws", label: "AWS" },
  { value: "sql", label: "SQL" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "cpp", label: "C/C++" },
];

export const ALGORITHM_CATEGORIES: { value: string; label: string }[] = [
  { value: "ALL", label: "All Patterns" },
  { value: "ARRAYS_AND_HASH_MAPS", label: "Arrays & Hash Maps" },
  { value: "STRINGS", label: "Strings" },
  { value: "TWO_POINTERS_AND_SORTING", label: "Two Pointers" },
  { value: "STACKS_AND_QUEUES", label: "Stacks & Queues" },
  { value: "BINARY_SEARCH", label: "Binary Search" },
  { value: "LINKED_LISTS", label: "Linked Lists" },
  { value: "TREES", label: "Trees" },
  { value: "GRAPHS_AND_MATRIX", label: "Graphs & Matrix" },
  { value: "DYNAMIC_PROGRAMMING", label: "Dynamic Programming" },
  { value: "BACKTRACKING", label: "Backtracking" },
  { value: "HEAPS_AND_PRIORITY_QUEUES", label: "Heaps & Queues" },
  { value: "TRIES", label: "Tries" },
  { value: "INTERVALS", label: "Intervals" },
  { value: "BIT_MANIPULATION", label: "Bit Manipulation" },
  { value: "GREEDY", label: "Greedy" },
];

export const TIER_COLOR: Record<string, string> = {
  MUST_KNOW: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  COMMONLY_ASKED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  REMOTE_SPECIFIC: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

export const TIER_LABEL: Record<string, string> = {
  MUST_KNOW: "MUST KNOW",
  COMMONLY_ASKED: "COMMONLY ASKED",
  REMOTE_SPECIFIC: "REMOTE-SPECIFIC",
};

export const COACHING_TIPS: Record<string, string> = {
  BEHAVIORAL:
    "Use the STAR method: Situation \u2192 Task \u2192 Action \u2192 Result. Be specific about YOUR role and include metrics when possible.",
  CODING:
    "Think out loud! Start by clarifying the problem, then walk through your approach step by step. Discuss data structures, tradeoffs, and edge cases \u2014 the process matters more than the perfect answer.",
  SYSTEM_DESIGN:
    "Start with requirements and constraints, then sketch the high-level architecture. Dive into key components, discuss tradeoffs, and address scalability. Structure your thinking clearly.",
  TECHNICAL_KNOWLEDGE:
    "Explain the concept clearly, then give a real example from your experience. Discuss tradeoffs and when you would or wouldn\u2019t use this approach.",
};

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  BEHAVIORAL:
    "Describe a specific situation from your experience. Start with the context, then explain what you did and the results...",
  CODING:
    "Start by restating the problem, then walk through your thought process step by step. Explain why you chose each approach...",
  SYSTEM_DESIGN:
    "Start with the requirements, then describe your high-level architecture. Walk through each component...",
  TECHNICAL_KNOWLEDGE:
    "Explain the concept in your own words, then give a concrete example from your experience...",
};

export function getPracticeUrl(questionId: number, mode: string): string {
  if (mode === "interview" || mode === "INTERVIEW") return `/practice/interview/setup/${questionId}`;
  if (mode === "behavioral-interview") return `/practice/interview/setup/${questionId}?category=BEHAVIORAL`;
  if (mode === "think-out-loud" || mode === "THINK_OUT_LOUD") return `/practice/${questionId}?mode=think-out-loud`;
  return `/practice/${questionId}?mode=qa`;
}
