// Interview session types

export type InterviewFormat = "QUICK" | "STANDARD";
export type InterviewCategory = "CODING" | "BEHAVIORAL";
export type InterviewPersonality = "SUPPORTIVE" | "PROFESSIONAL" | "CHALLENGING";
export type SpeakingSpeed = "SLOW" | "NORMAL" | "FAST";
export type FocusArea = "BALANCED" | "COMMUNICATION" | "TECHNICAL_DEPTH";

export const INTERVIEWER_PERSONALITIES: Record<
  InterviewPersonality,
  { name: string; description: string }
> = {
  SUPPORTIVE: {
    name: "Supportive",
    description: "Warm and encouraging. Gives hints when you're stuck. Great for building confidence.",
  },
  PROFESSIONAL: {
    name: "Professional",
    description: "Neutral and structured. A standard interview experience with no hand-holding.",
  },
  CHALLENGING: {
    name: "Challenging",
    description: "Tough but fair. Pushes back on your answers and expects precision.",
  },
};

export const SPEAKING_SPEEDS: Record<
  SpeakingSpeed,
  { label: string; description: string }
> = {
  SLOW: {
    label: "Slower",
    description: "Clear and deliberate. Pauses between sentences.",
  },
  NORMAL: {
    label: "Normal",
    description: "Natural conversational pace.",
  },
  FAST: {
    label: "Faster",
    description: "Brisk and efficient. Simulates time pressure.",
  },
};

export const FOCUS_AREAS: Record<
  FocusArea,
  { label: string; description: string }
> = {
  BALANCED: {
    label: "Balanced",
    description: "Equal attention to all skills.",
  },
  COMMUNICATION: {
    label: "Communication",
    description: "Focus on clarity, structure, and how I explain my thinking.",
  },
  TECHNICAL_DEPTH: {
    label: "Technical Depth",
    description: "Push harder on complexity, optimization, and trade-offs.",
  },
};

export type InterviewSessionState =
  | "IDLE"
  | "CONNECTING"
  | "CONNECTED"
  | "INTRO"
  | "CODING"
  | "FOLLOW_UP"
  | "ENDING"
  | "COMPLETED";

export interface ConversationMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: number;
}

export interface RealtimeSessionResponse {
  sessionId: string;
  ephemeralToken: string;
  expiresAt: string;
}

export interface CreditBalanceResponse {
  credits: number;
}

export interface CreditTransactionResponse {
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface InterviewProblemResult {
  id: number;
  questionId: number;
  questionTitle: string;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  feedback: string;
  communicationFeedback: string | null;
  clarityStructureScore: number | null;
  clarityStructureFeedback: string | null;
  grammarVocabularyScore: number | null;
  grammarVocabularyFeedback: string | null;
  fillerFluencyScore: number | null;
  fillerFluencyFeedback: string | null;
  technicalFeedback: string | null;
  problemSolvingFeedback: string | null;
  improvedResponse: string | null;
  focusTip: string | null;
  codeFeedback: string | null;
  codeSubmitted: string;
}

export interface InterviewSessionResult {
  sessionId: string;
  format: InterviewFormat;
  category?: InterviewCategory;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  overallFeedback: string;
  problems: InterviewProblemResult[];
  durationSeconds: number;
}

export interface InterviewAttemptSummary {
  sessionId: string;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  format: string;
  createdAt: string;
}

export interface InterviewHistoryItem {
  sessionId: string;
  format: string;
  category: string;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  questionTitle: string;
  questionId: number;
  questionTitles: string[];
  questionIds: number[];
  createdAt: string;
  durationSeconds: number;
}

export interface RealtimeUsageTurn {
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  inputAudioTokens: number;
  outputAudioTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
}

export interface InterviewSessionCompleteRequest {
  transcript: ConversationMessage[];
  codeSnapshots: { questionId: number; code: string; language: string }[];
  realtimeUsage?: RealtimeUsageTurn[];
}

// Format config
export const INTERVIEW_FORMATS: Record<
  InterviewFormat,
  { label: string; duration: number; problems: number; description: string }
> = {
  QUICK: {
    label: "Quick",
    duration: 900, // 15 min
    problems: 1,
    description: "Solve the problem and get brief follow-up questions on complexity and edge cases.",
  },
  STANDARD: {
    label: "Standard",
    duration: 1500, // 25 min
    problems: 1,
    description: "Simulates a real interview round — solve, optimize, handle edge cases, and discuss alternatives.",
  },
};

export const BEHAVIORAL_FORMATS: Record<
  InterviewFormat,
  { label: string; duration: number; problems: number; description: string }
> = {
  QUICK: {
    label: "Quick",
    duration: 600, // 10 min
    problems: 1,
    description: "Share a specific experience and get follow-up questions using the STAR method.",
  },
  STANDARD: {
    label: "Standard",
    duration: 1200, // 20 min
    problems: 2,
    description: "Two behavioral topics — the AI probes each for specifics, learnings, and reflective thinking.",
  },
};
