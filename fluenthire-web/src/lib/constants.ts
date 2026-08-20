import type { CommunicationChallenge, DifficultyLevel, EnglishLevel, NativeLanguage, RoleType, ProgrammingLanguage } from "@/types/api";

export const NATIVE_LANGUAGE_OPTIONS: {
  value: NativeLanguage;
  label: string;
}[] = [
  { value: "SPANISH", label: "🇪🇸 Spanish" },
  { value: "PORTUGUESE", label: "🇧🇷 Portuguese" },
  { value: "OTHER", label: "🌍 Other" },
];

export const ENGLISH_LEVEL_OPTIONS: {
  value: EnglishLevel;
  label: string;
  description: string;
}[] = [
  { value: "BEGINNER", label: "Beginner", description: "I can have basic conversations but struggle in interviews" },
  { value: "INTERMEDIATE", label: "Intermediate", description: "I communicate okay but freeze under pressure" },
  { value: "ADVANCED", label: "Advanced", description: "I'm fluent but want to polish my interview English" },
];

export const CHALLENGE_OPTIONS: {
  value: CommunicationChallenge;
  label: string;
}[] = [
  { value: "GRAMMAR", label: "Grammar mistakes" },
  { value: "FILLER_WORDS", label: "Filler words (um, like...)" },
  { value: "VOCABULARY", label: "Limited vocabulary" },
  { value: "STRUCTURING_ANSWERS", label: "Structuring my answers" },
  { value: "THINKING_ALOUD", label: "Thinking out loud in English" },
  { value: "SPEED_UNDER_PRESSURE", label: "Speed & fluency under pressure" },
];

export const EXPERIENCE_OPTIONS: {
  value: DifficultyLevel;
  label: string;
  description: string;
}[] = [
  { value: "JUNIOR", label: "Junior", description: "0–2 years" },
  { value: "MID", label: "Mid-Level", description: "2–5 years" },
  { value: "SENIOR", label: "Senior", description: "5+ years" },
];

export const ROLE_OPTIONS: {
  value: RoleType;
  label: string;
  description: string;
}[] = [
  { value: "BACKEND", label: "Backend", description: "APIs, databases, services" },
  { value: "FRONTEND", label: "Frontend", description: "UI, React, CSS" },
  { value: "FULLSTACK", label: "Fullstack", description: "End-to-end development" },
  { value: "DEVOPS", label: "DevOps", description: "CI/CD, infra, cloud" },
];

export const LANGUAGE_OPTIONS: {
  value: ProgrammingLanguage;
  label: string;
}[] = [
  { value: "JAVA", label: "Java" },
  { value: "PYTHON", label: "Python" },
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "TYPESCRIPT", label: "TypeScript" },
  { value: "REACT", label: "React" },
  { value: "NODE_JS", label: "Node.js" },
  { value: "CSHARP", label: "C#" },
  { value: "GO", label: "Go" },
  { value: "RUST", label: "Rust" },
  { value: "AWS", label: "AWS" },
  { value: "SQL", label: "SQL" },
  { value: "RUBY", label: "Ruby" },
  { value: "PHP", label: "PHP" },
  { value: "CPP", label: "C/C++" },
];
