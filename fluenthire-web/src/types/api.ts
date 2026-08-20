// Auth
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

// User Profile
export type NativeLanguage = "SPANISH" | "PORTUGUESE" | "FRENCH" | "MANDARIN" | "HINDI" | "JAPANESE" | "KOREAN" | "GERMAN" | "ARABIC" | "RUSSIAN" | "ITALIAN" | "OTHER";
export type EnglishLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CommunicationChallenge = "GRAMMAR" | "FILLER_WORDS" | "VOCABULARY" | "STRUCTURING_ANSWERS" | "THINKING_ALOUD" | "SPEED_UNDER_PRESSURE";

export interface ProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
  nativeLanguage: NativeLanguage | null;
  englishLevel: EnglishLevel | null;
  communicationChallenges: CommunicationChallenge[] | null;
  experienceLevel: DifficultyLevel | null;
  roleType: RoleType | null;
  mainLanguage: ProgrammingLanguage | null;
  onboardingCompleted: boolean;
  hasJobDescription: boolean;
  hasJobDescriptionAnalysis: boolean;
  credits: number;
  createdAt: string | null;
  hasPassword: boolean;
  plan: string;
  subscriptionStatus: string | null;
  role: "ADMIN" | "USER" | null;
}

export interface UpdatePersonalInfoRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileRequest {
  nativeLanguage: NativeLanguage;
  englishLevel: EnglishLevel;
  communicationChallenges: CommunicationChallenge[];
  experienceLevel: DifficultyLevel;
  roleType: RoleType;
  mainLanguage: ProgrammingLanguage;
}

export interface JobDescriptionRequest {
  jobDescription: string;
}

export interface JobDescriptionAnalysisResponse {
  id: number;
  jobTitle: string;
  seniorityLevel: DifficultyLevel;
  roleType: RoleType;
  technologies: string[];
  keyResponsibilities: string[];
  softSkills: string[];
  companyType: string;
  analyzedAt: string;
}

// Questions
export interface QuestionExample {
  input: string;
  output: string;
}

export interface QuestionResponse {
  id: number;
  title: string;
  content: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  tier: QuestionTier | null;
  tags: string[];
  examples: QuestionExample[] | null;
  createdAt: string;
  methodName: string | null;
  methodParams: string | null;
  returnType: string | null;
  algorithmCategory: string | null;
}

// Responses
export type ResponseMode = "QA" | "THINK_OUT_LOUD" | "INTERVIEW";

export interface UserResponseRequest {
  questionId: number;
  originalResponse: string;
  mode?: ResponseMode;
}

export interface UserResponseResponse {
  id: number;
  questionId: number;
  questionTitle: string;
  originalResponse: string;
  attemptNumber: number;
  mode: string;
  hasAnalysis: boolean;
  createdAt: string;
}

// Analysis
export interface AnalysisResponse {
  id: number;
  userResponseId: number;
  questionTitle: string;
  originalResponse: string;
  attemptNumber: number;
  communicationScore: number;
  communicationFeedback: string;
  clarityStructureScore: number | null;
  clarityStructureFeedback: string | null;
  grammarVocabularyScore: number | null;
  grammarVocabularyFeedback: string | null;
  fillerFluencyScore: number | null;
  fillerFluencyFeedback: string | null;
  technicalScore: number;
  technicalFeedback: string;
  improvedResponse: string;
  focusTip: string | null;
  codeFeedback: string | null;
  createdAt: string;
}

// Session Rating
export interface SessionRatingResponse {
  id: number;
  userResponseId: number;
  rating: number;
  feedback: string | null;
  createdAt: string;
}

// Progress
export interface AttemptSummary {
  responseId: number;
  attemptNumber: number;
  communicationScore: number | null;
  technicalScore: number | null;
  analyzed: boolean;
  createdAt: string;
}

export interface QuestionHistoryResponse {
  questionId: number;
  questionTitle: string;
  category: string;
  mode: string;
  totalAttempts: number;
  latestCommunicationScore: number | null;
  latestTechnicalScore: number | null;
  latestProblemSolvingScore: number | null;
  communicationImprovement: number | null;
  technicalImprovement: number | null;
  attempts: AttemptSummary[];
}

export interface ProgressResponse {
  totalQuestionsAttempted: number;
  totalResponses: number;
  totalAnalyses: number;
  averageCommunicationScore: number | null;
  averageTechnicalScore: number | null;
  questionProgress: QuestionHistoryResponse[];
}

// Pagination (Spring Data VIA_DTO format)
export interface Page<T> {
  content: T[];
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

// Error
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  fields?: Record<string, string>;
}

// Word timestamp for karaoke text
export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

// Enums
export type DifficultyLevel = "JUNIOR" | "MID" | "SENIOR";
export type RoleType = "BACKEND" | "FRONTEND" | "FULLSTACK" | "DEVOPS";
export type QuestionCategory = "BEHAVIORAL" | "SYSTEM_DESIGN" | "CODING" | "TECHNICAL_KNOWLEDGE";
export type QuestionTier = "MUST_KNOW" | "COMMONLY_ASKED" | "REMOTE_SPECIFIC";
export type Plan = "FREE" | "INTERVIEW_STARTER" | "INTERVIEW_PRO" | "INTERVIEW_INTENSIVE";

export type ProgrammingLanguage =
  | "JAVA" | "PYTHON" | "JAVASCRIPT" | "TYPESCRIPT"
  | "CSHARP" | "GO" | "RUBY" | "PHP"
  | "REACT" | "NODE_JS" | "AWS" | "SQL" | "RUST" | "CPP";

// Feedback
export type FeedbackCategory = "BUG" | "FEATURE_REQUEST" | "GENERAL";

export interface FeedbackRequest {
  feedback: string;
  feedbackCategory: FeedbackCategory;
  pageUrl: string;
}

export interface FeedbackResponse {
  id: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  feedback: string;
  feedbackCategory: FeedbackCategory;
  pageUrl: string;
  createdAt: string;
}

// Admin Dashboard
export interface RevenueResponse {
  firstName: string;
  lastName: string;
  mrr: number;
  interviewStarterRevenue: number;
  interviewProRevenue: number;
  interviewIntensiveRevenue: number;
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  paidUsersInterviewStarterPlan: number;
  paidUsersInterviewProPlan: number;
  paidUsersInterviewIntensivePlan: number;
  conversionRate: number;
  newUsersLast24Hours: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  churnRate: number;
  canceledThisMonth: number;
  creditsConsumedToday: number;
  estimatedApiCostToday: number;
}

export interface ProductHealthResponse {
  dau: number;
  wau: number;
  mau: number;
  avgSessionsPerUser: number;
  qaSessionsLast30Days: number;
  liveInterviewsLast30Days: number;
  avgInterviewDurationMinutes: number;
  avgQaCommunicationScore: number;
  avgQaTechnicalScore: number;
  avgInterviewCommunicationScore: number;
  avgInterviewTechnicalScore: number;
  avgInterviewProblemSolvingScore: number;
  onboardingCompletionRate: number;
  jdUploadRate: number;
  creditUtilizationRate: number;
  creditsGrantedThisPeriod: number;
  creditsUsedThisPeriod: number;
}

export interface QuestionScoreDto {
  questionId: number;
  title: string;
  avgScore: number;
}

export interface GrowthResponse {
  experienceLevelDistribution: Record<string, number>;
  roleTypeDistribution: Record<string, number>;
  mainLanguageDistribution: Record<string, number>;
  categoryPopularity: Record<string, number>;
  highestScoredQuestions: QuestionScoreDto[];
  lowestScoredQuestions: QuestionScoreDto[];
  emailRegistrations: number;
  googleRegistrations: number;
  totalCancellations: number;
  avgDaysBeforeCancel: number;
  peakUsageHours: Record<string, number>;
  interviewFormatDistribution: Record<string, number>;
  interviewCategoryDistribution: Record<string, number>;
}

export interface AggregatedCostDto {
  groupKey: string;
  requestCount: number;
  totalCost: number;
  avgCostPerRequest: number;
  avgClaudeCost: number;
  avgRealtimeCost: number;
  avgCacheRate: number;
  exactCostCount: number;
  estimatedCostCount: number;
}

export interface InterviewSessionCostDto {
  category: string;
  realtimeCost: number;
  claudeCost: number;
  totalCost: number;
  exactCost: boolean;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  cacheRate: number;
  durationSeconds: number;
  timestamp: string;
}

export interface ApiCostsResponse {
  byFeature: Record<string, AggregatedCostDto>;
  byCategory: Record<string, AggregatedCostDto>;
  byFeatureAndCategory: Record<string, AggregatedCostDto>;
  totalCostUsd: number;
  totalRequests: number;
  interviewSessions: InterviewSessionCostDto[];
}

export interface SessionRatingsResponse {
  avgRatingQaPractice: number;
  totalQaPracticeRatings: number;
  avgRatingInterview: number;
  totalInterviewRatings: number;
  avgRatingInterviewCoding: number;
  totalInterviewCodingRatings: number;
  avgRatingInterviewBehavioral: number;
  totalInterviewBehavioralRatings: number;
  lowRatings: LowRatingEntry[];
}

export interface LowRatingEntry {
  id: number;
  rating: number;
  feedback: string | null;
  mode: string;
  category: string | null;
  userFirstName: string;
  userEmail: string;
  createdAt: string;
}
