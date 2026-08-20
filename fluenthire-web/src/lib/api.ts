import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ProfileResponse,
  ProfileRequest,
  UpdatePersonalInfoRequest,
  ChangePasswordRequest,
  JobDescriptionRequest,
  JobDescriptionAnalysisResponse,
  QuestionResponse,
  UserResponseRequest,
  UserResponseResponse,
  AnalysisResponse,
  QuestionHistoryResponse,
  ProgressResponse,
  RevenueResponse,
  ProductHealthResponse,
  GrowthResponse,
  ApiCostsResponse,
  SessionRatingsResponse,
  Page,
  DifficultyLevel,
  QuestionCategory,
  QuestionTier,
  ResponseMode,
  WordTimestamp,
  SessionRatingResponse,
  FeedbackRequest,
  FeedbackResponse,
  FeedbackCategory,
  ApiError,
} from "@/types/api";
import type {
  CreditBalanceResponse,
  CreditTransactionResponse,
  InterviewAttemptSummary,
  InterviewCategory,
  InterviewFormat,
  InterviewHistoryItem,
  InterviewSessionCompleteRequest,
  InterviewSessionResult,
  RealtimeSessionResponse,
} from "@/types/interview";

interface SubscriptionResponse {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private handleUnauthorized(): never {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && token) {
        this.handleUnauthorized();
      }

      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: "An unexpected error occurred",
      }));
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async googleLogin(idToken: string): Promise<AuthResponse> {
    return this.request("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return this.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // User Profile
  async getProfile(): Promise<ProfileResponse> {
    return this.request("/api/users/profile");
  }

  async updateOnboarding(data: ProfileRequest): Promise<ProfileResponse> {
    return this.request("/api/users/onboarding", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateJobDescription(
    data: JobDescriptionRequest
  ): Promise<JobDescriptionAnalysisResponse> {
    return this.request("/api/users/job-description", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getJobDescriptionAnalysis(): Promise<JobDescriptionAnalysisResponse> {
    return this.request("/api/users/job-description/analysis");
  }

  // Profile editing
  async updatePersonalInfo(data: UpdatePersonalInfoRequest): Promise<ProfileResponse> {
    return this.request("/api/users/profile/personal-info", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updatePreferences(data: ProfileRequest): Promise<ProfileResponse> {
    return this.request("/api/users/profile/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.request("/api/users/profile/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(): Promise<void> {
    return this.request("/api/users/account", {
      method: "DELETE",
    });
  }

  // Questions
  async getQuestions(params?: {
    category?: QuestionCategory;
    difficulty?: DifficultyLevel;
    tier?: QuestionTier;
    tag?: string;
    algorithmCategory?: string;
    page?: number;
    size?: number;
  }): Promise<Page<QuestionResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.difficulty) searchParams.set("difficulty", params.difficulty);
    if (params?.tier) searchParams.set("tier", params.tier);
    if (params?.tag) searchParams.set("tag", params.tag);
    if (params?.algorithmCategory) searchParams.set("algorithmCategory", params.algorithmCategory);
    if (params?.page !== undefined)
      searchParams.set("page", String(params.page));
    if (params?.size !== undefined)
      searchParams.set("size", String(params.size));

    const query = searchParams.toString();
    return this.request(`/api/questions${query ? `?${query}` : ""}`);
  }

  async getQuestion(id: number): Promise<QuestionResponse> {
    return this.request(`/api/questions/${id}`);
  }

  async getRecommendedQuestions(): Promise<QuestionResponse[]> {
    return this.request("/api/questions/recommended");
  }

  async getJobRecommendedQuestions(): Promise<QuestionResponse[]> {
    return this.request("/api/questions/recommended/job");
  }

  async getAttemptedQuestionIds(mode?: ResponseMode): Promise<number[]> {
    const params = mode ? `?mode=${mode}` : "";
    return this.request(`/api/responses/attempted${params}`);
  }

  async getFavoriteQuestionIds(): Promise<number[]> {
    return this.request("/api/questions/favorites");
  }

  async getFavoriteQuestions(): Promise<QuestionResponse[]> {
    return this.request("/api/questions/favorites/details");
  }

  async toggleFavoriteQuestion(questionId: number): Promise<{ favorited: boolean }> {
    return this.request(`/api/questions/${questionId}/favorite`, {
      method: "PATCH",
    });
  }

  // Responses
  async submitResponse(
    data: UserResponseRequest
  ): Promise<UserResponseResponse> {
    return this.request("/api/responses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }


  // Analysis
  async analyzeResponse(id: number): Promise<AnalysisResponse> {
    return this.request(`/api/responses/${id}/analyze`, {
      method: "POST",
    });
  }

  async getAnalysis(id: number): Promise<AnalysisResponse> {
    return this.request(`/api/responses/${id}/analysis`);
  }

  // History & Progress
  async getQuestionHistory(
    questionId: number,
    mode?: ResponseMode
  ): Promise<QuestionHistoryResponse> {
    const params = mode ? `?mode=${mode}` : "";
    return this.request(`/api/responses/question/${questionId}/history${params}`);
  }

  async getProgress(): Promise<ProgressResponse> {
    return this.request("/api/responses/progress");
  }

  // Speech
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const token = this.getToken();

    const formData = new FormData();
    const ext = audioBlob.type.includes("webm") ? "webm" : "mp4";
    formData.append("audio", audioBlob, `recording.${ext}`);

    const response = await fetch(`${API_URL}/api/speech/transcribe`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (response.status === 401 && token) this.handleUnauthorized();
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: "Transcription failed",
      }));
      throw new Error(error.error);
    }

    const data: { text: string } = await response.json();
    return data.text;
  }

  async getTtsAudio(analysisId: number): Promise<string> {
    const token = this.getToken();

    const response = await fetch(`${API_URL}/api/speech/tts/${analysisId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.status === 401 && token) this.handleUnauthorized();
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: "Failed to load audio",
      }));
      throw new Error(error.error);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // Subscriptions
  async getSubscription(): Promise<SubscriptionResponse> {
    return this.request("/api/subscriptions/current");
  }

  async createCheckoutSession(priceId: string): Promise<{ checkoutUrl: string }> {
    return this.request("/api/subscriptions/checkout", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
  }

  async createBillingPortalSession(): Promise<{ checkoutUrl: string }> {
    return this.request("/api/subscriptions/billing-portal", { method: "POST" });
  }

  async cancelSubscription(): Promise<SubscriptionResponse> {
    return this.request("/api/subscriptions/cancel", { method: "POST" });
  }

  // Credit Packs
  async createCreditCheckoutSession(priceId: string): Promise<{ checkoutUrl: string }> {
    return this.request("/api/credits/checkout", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
  }

  // Credits
  async getCredits(): Promise<CreditBalanceResponse> {
    return this.request("/api/users/credits");
  }

  async getCreditTransactions(): Promise<CreditTransactionResponse[]> {
    return this.request("/api/credits/transactions");
  }

  // Feature Votes
  async getFeatureVote(featureName: string): Promise<{ userVote: boolean | null }> {
    return this.request(`/api/features/vote/${featureName}`);
  }

  async submitFeatureVote(featureName: string, vote: boolean): Promise<{ vote: boolean; featureName: string }> {
    return this.request("/api/features/vote", {
      method: "PUT",
      body: JSON.stringify({ featureName, vote }),
    });
  }

  // Session Ratings
  async submitSessionRating(userResponseId: number, rating: number, feedback?: string): Promise<SessionRatingResponse> {
    return this.request("/api/ratings", {
      method: "POST",
      body: JSON.stringify({ userResponseId, rating, feedback }),
    });
  }

  async getSessionRating(userResponseId: number): Promise<SessionRatingResponse | null> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/api/ratings/response/${userResponseId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.status === 204) return null;
    if (!response.ok) return null;
    return response.json();
  }

  async submitInterviewRating(sessionId: string, rating: number, feedback?: string): Promise<SessionRatingResponse> {
    const params = new URLSearchParams({ sessionId, rating: String(rating) });
    if (feedback) params.set("feedback", feedback);
    return this.request(`/api/ratings/interview?${params}`, {
      method: "POST",
    });
  }

  async getInterviewRating(sessionId: string): Promise<SessionRatingResponse | null> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/api/ratings/interview-session/${sessionId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.status === 204) return null;
    if (!response.ok) return null;
    return response.json();
  }

  // Realtime Interview
  async createRealtimeSession(
    format: InterviewFormat,
    questionIds: number[],
    category?: InterviewCategory,
    personality?: string,
    speakingSpeed?: string,
    focusArea?: string,
  ): Promise<RealtimeSessionResponse> {
    return this.request("/api/realtime/session", {
      method: "POST",
      body: JSON.stringify({ format, questionIds, category, personality, speakingSpeed, focusArea }),
    });
  }

  async completeInterviewSession(
    sessionId: string,
    data: InterviewSessionCompleteRequest
  ): Promise<InterviewSessionResult> {
    return this.request(`/api/interview-sessions/${sessionId}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getInterviewSession(sessionId: string): Promise<InterviewSessionResult> {
    return this.request(`/api/interview-sessions/${sessionId}`);
  }

  async getInterviewAttempts(questionId: number): Promise<InterviewAttemptSummary[]> {
    return this.request(`/api/interview-sessions/questions/${questionId}/attempts`);
  }

  async getInterviewHistory(page = 0, size = 50): Promise<Page<InterviewHistoryItem>> {
    return this.request(`/api/interview-sessions?page=${page}&size=${size}`);
  }

  // Admin Dashboard
  async getRevenueData(): Promise<RevenueResponse> {
    return this.request("/api/admin/dashboard/revenue");
  }

  async getProductHealthData(): Promise<ProductHealthResponse> {
    return this.request("/api/admin/dashboard/product-health");
  }

  async getGrowthData(): Promise<GrowthResponse> {
    return this.request("/api/admin/dashboard/growth");
  }

  async getApiCostsData(): Promise<ApiCostsResponse> {
    return this.request("/api/admin/dashboard/api-costs");
  }

  async getSessionRatingsData(): Promise<SessionRatingsResponse> {
    return this.request("/api/admin/dashboard/session-ratings");
  }

  // Feedback
  async submitFeedback(data: FeedbackRequest): Promise<void> {
    return this.request("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAdminFeedbacks(category?: FeedbackCategory): Promise<FeedbackResponse[]> {
    const params = category ? `?category=${category}` : "";
    return this.request(`/api/admin/feedback${params}`);
  }

  async getTtsTimestamps(analysisId: number): Promise<WordTimestamp[] | null> {
    const token = this.getToken();

    const response = await fetch(
      `${API_URL}/api/speech/tts/${analysisId}/timestamps`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );

    if (response.status === 401 && token) this.handleUnauthorized();
    if (response.status === 204) return null;
    if (!response.ok) return null;

    return response.json();
  }

  async getInterviewResultTtsAudio(resultId: number): Promise<string> {
    const token = this.getToken();

    const response = await fetch(`${API_URL}/api/speech/tts/interview-result/${resultId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.status === 401 && token) this.handleUnauthorized();
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: "Failed to load audio",
      }));
      throw new Error(error.error);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async getInterviewResultTtsTimestamps(resultId: number): Promise<WordTimestamp[] | null> {
    const token = this.getToken();

    const response = await fetch(
      `${API_URL}/api/speech/tts/interview-result/${resultId}/timestamps`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );

    if (response.status === 401 && token) this.handleUnauthorized();
    if (response.status === 204) return null;
    if (!response.ok) return null;

    return response.json();
  }
}

export const api = new ApiClient();
