"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Briefcase,
  Code,
  Gauge,
  FileText,
  CheckCircle2,
  Globe,
  MessageSquareText,
  Mic,
  AlertCircle,
} from "lucide-react";
import { OptionGrid } from "@/components/option-grid";
import {
  EXPERIENCE_OPTIONS,
  ROLE_OPTIONS,
  LANGUAGE_OPTIONS,
  NATIVE_LANGUAGE_OPTIONS,
  ENGLISH_LEVEL_OPTIONS,
  CHALLENGE_OPTIONS,
} from "@/lib/constants";
import type {
  DifficultyLevel,
  RoleType,
  ProgrammingLanguage,
  NativeLanguage,
  EnglishLevel,
  CommunicationChallenge,
  ApiError,
} from "@/types/api";

// ─── Multi-select grid (for communication challenges) ───────────────────────

function MultiSelectGrid<T extends string>({
  options,
  value,
  onChange,
  max = 3,
}: {
  options: { value: T; label: string }[];
  value: Set<T>;
  onChange: (value: Set<T>) => void;
  max?: number;
}) {
  const toggle = (v: T) => {
    const next = new Set(value);
    if (next.has(v)) {
      next.delete(v);
    } else if (next.size < max) {
      next.add(v);
    }
    onChange(next);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggle(option.value)}
          className={`rounded-lg border px-3 py-3 text-center text-sm transition-colors ${
            value.has(option.value)
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border hover:border-primary/30 hover:bg-muted/50"
          }`}
        >
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, refreshProfile } = useAuth();

  const isJdMode = searchParams.get("step") === "jd";
  const [step, setStep] = useState(isJdMode ? 2 : 0);
  const [hasStarted, setHasStarted] = useState(isJdMode);

  // Route protection: redirect if not logged in or already onboarded (only on initial load)
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.onboardingCompleted && !hasStarted && !isJdMode) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router, hasStarted, isJdMode]);

  // Step 0: Language profile
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage | null>(null);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel | null>(null);
  const [challenges, setChallenges] = useState<Set<CommunicationChallenge>>(new Set());

  // Step 1: Technical profile
  const [experienceLevel, setExperienceLevel] = useState<DifficultyLevel | null>(null);
  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [mainLanguage, setMainLanguage] = useState<ProgrammingLanguage | null>(null);

  // Step 2: Job description
  const [jobDescription, setJobDescription] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isLanguageComplete = nativeLanguage && englishLevel && challenges.size > 0;
  const isProfileComplete = experienceLevel && roleType && mainLanguage;

  const handleLanguageContinue = () => {
    if (!isLanguageComplete) return;
    setError("");
    setStep(1);
  };

  const handleProfileSubmit = async () => {
    if (!isLanguageComplete || !isProfileComplete) return;

    setError("");
    setIsLoading(true);

    try {
      await api.updateOnboarding({
        nativeLanguage: nativeLanguage!,
        englishLevel: englishLevel!,
        communicationChallenges: Array.from(challenges),
        experienceLevel: experienceLevel!,
        roleType: roleType!,
        mainLanguage: mainLanguage!,
      });
      await refreshProfile();
      setHasStarted(true);
      setShowCelebration(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobDescriptionSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      await api.updateJobDescription({ jobDescription });
      await refreshProfile();
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to analyze job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isJdMode) {
      router.push("/dashboard");
      return;
    }
    setError("");
    if (step === 1) {
      setStep(0);
    }
  };

  const JD_MIN_WORDS = 50;
  const jdWordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;
  const isJdTooShort = jdWordCount < JD_MIN_WORDS;

  if (authLoading || !user || (user.onboardingCompleted && !hasStarted && !isJdMode)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {!showCelebration && (
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl font-bold tracking-tight">
              <Image src="/logo-icon.png" alt="FluentHire logo" width={36} height={36} unoptimized className="dark:hidden" />
              <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={36} height={36} unoptimized className="hidden dark:block" />
              <span>Fluent<span className="text-primary">Hire</span></span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {isJdMode
                ? "Add a job description to get personalized recommendations."
                : step === 0
                  ? "Let\u2019s personalize your experience."
                  : "A few quick questions so we can match you with the right practice."}
            </p>

            {/* Step indicator */}
            {!isJdMode && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {[0, 1].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/40" : "w-8 bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Celebration: Free credits ── */}
        {showCelebration && (
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <CardContent className="py-10 text-center space-y-5">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Mic className="size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">You&apos;re all set!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You have <span className="font-semibold text-primary">3 free Live AI Interview credits</span> waiting for you.
                  Practice Q&A questions for free, then use your credits to try a real-time AI interview.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="h-10 w-full"
                  nativeButton={false}
                  render={<Link href="/practice?mode=interview" />}
                >
                  <Mic className="size-4" />
                  Try a Live Interview
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-full"
                  nativeButton={false}
                  render={<Link href="/dashboard" />}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 0: Language Profile ── */}
        {step === 0 && !showCelebration && (
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Your English Journey</CardTitle>
              <CardDescription>
                This helps us give you feedback that actually matches where you
                are — not generic advice.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <Globe className="size-4" />
                  Native Language
                </Label>
                <OptionGrid
                  options={NATIVE_LANGUAGE_OPTIONS}
                  value={nativeLanguage}
                  onChange={setNativeLanguage}
                  columns={3}
                />
              </div>

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <MessageSquareText className="size-4" />
                  English Comfort Level
                </Label>
                <OptionGrid
                  options={ENGLISH_LEVEL_OPTIONS}
                  value={englishLevel}
                  onChange={setEnglishLevel}
                />
              </div>

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <AlertCircle className="size-4" />
                  What do you struggle with most?
                </Label>
                <p className="text-center text-xs text-muted-foreground">
                  Pick up to 3 — we&apos;ll prioritize these in your feedback.
                </p>
                <MultiSelectGrid
                  options={CHALLENGE_OPTIONS}
                  value={challenges}
                  onChange={setChallenges}
                  max={3}
                />
              </div>

              <Button
                className="h-10 w-full"
                disabled={!isLanguageComplete}
                onClick={handleLanguageContinue}
              >
                Continue
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Step 1: Technical Profile ── */}
        {step === 1 && !showCelebration && (
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Tell Us About You</CardTitle>
              <CardDescription>
                This helps us recommend the right questions and tailor feedback
                to your level.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <Gauge className="size-4" />
                  Experience Level
                </Label>
                <OptionGrid
                  options={EXPERIENCE_OPTIONS}
                  value={experienceLevel}
                  onChange={setExperienceLevel}
                />
              </div>

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <Briefcase className="size-4" />
                  Role Type
                </Label>
                <OptionGrid
                  options={ROLE_OPTIONS}
                  value={roleType}
                  onChange={setRoleType}
                />
              </div>

              <div className="space-y-3">
                <Label className="justify-center gap-1.5">
                  <Code className="size-4" />
                  Main Technology
                </Label>
                <OptionGrid
                  options={LANGUAGE_OPTIONS}
                  value={mainLanguage}
                  onChange={setMainLanguage}
                  columns={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="h-10 flex-1 text-muted-foreground"
                  onClick={handleBack}
                >
                  <ArrowLeft />
                  Back
                </Button>

                <Button
                  className="h-10 flex-1"
                  disabled={!isProfileComplete || isLoading}
                  onClick={handleProfileSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: Job Description ── */}
        {step === 2 && (
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg">
                Paste a Job Description
              </CardTitle>
              <CardDescription>
                We&apos;ll extract technologies, seniority level, and
                responsibilities to personalize your practice questions and
                feedback.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder={"Paste the full job posting here...\n\nExample:\nWe are looking for a Senior Backend Engineer to join our platform team. You will design and build scalable APIs using Java/Spring Boot, work with PostgreSQL and Redis, and collaborate with cross-functional teams..."}
                  value={jobDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 5000) {
                      setJobDescription(e.target.value);
                    }
                  }}
                  maxLength={5000}
                  className="min-h-48"
                />
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isJdTooShort && jdWordCount > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
                    {isJdTooShort && jdWordCount > 0
                      ? `${JD_MIN_WORDS - jdWordCount} more word${JD_MIN_WORDS - jdWordCount !== 1 ? "s" : ""} needed. Paste the full job posting for best results.`
                      : "Tip: The more detail you include, the better we can personalize your experience."}
                  </p>
                  <p className={`shrink-0 text-xs ${
                    jobDescription.length > 4500
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}>
                    {jdWordCount} word{jdWordCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="h-10 w-full"
                  disabled={!jobDescription.trim() || isJdTooShort || isLoading}
                  onClick={handleJobDescriptionSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 />
                      Analyze & Continue
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="h-10 w-full"
                  disabled={isLoading}
                  onClick={() => {
                    if (isJdMode) router.push("/dashboard");
                  }}
                >
                  <ArrowLeft />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
