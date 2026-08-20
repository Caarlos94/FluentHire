"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Star,
} from "lucide-react";
import type { ApiError } from "@/types/api";

const VALUE_PROPS = [
  "AI-powered feedback on every response",
  "Communication + Technical dual scoring",
  "Job description personalization",
  "200+ real interview questions",
];

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, googleLogin } = useAuth();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      await register({ firstName, lastName, email, password });
      router.push("/onboarding");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fields) {
        setFieldErrors(apiError.fields);
      } else {
        setError(apiError.error || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setError("");
    setIsGoogleLoading(true);

    try {
      await googleLogin(response.credential);
      router.push("/onboarding");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Google sign-up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel: gradient + value prop ── */}
      <div
        className="hidden w-1/2 flex-col justify-between p-12 text-white lg:flex"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.20 264), oklch(0.40 0.22 290))",
        }}
      >
        <Link href="/" className="flex items-center gap-1 text-2xl font-bold tracking-tight">
          <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={40} height={40} unoptimized />
          <span>Fluent<span className="text-white/70">Hire</span></span>
        </Link>

        <div>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight">
            Start communicating like a senior engineer — in English.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-white/70">
            Join developers across Latin America who are landing remote US jobs
            with better interview skills.
          </p>

          {/* Value props checklist */}
          <div className="mt-8 space-y-3">
            {VALUE_PROPS.map((prop) => (
              <div key={prop} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-white/80" />
                <span className="text-sm text-white/80">{prop}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-10 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              &ldquo;I used to prepare answers in Spanish first and then
              translate in my head. After a few sessions here I started thinking
              directly in English during practice. That was huge for me.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Image src="/1695435187051.jpeg" alt="Isaac Castillo" width={32} height={32} className="size-8 rounded-full object-cover" unoptimized />
              <div>
                <p className="text-sm font-medium">Isaac Castillo</p>
                <p className="text-xs text-white/60">
                  Software Engineer, Mexico
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} FluentHire
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-1 text-2xl font-bold tracking-tight">
              <Image src="/logo-icon.png" alt="FluentHire logo" width={36} height={36} unoptimized className="dark:hidden" />
              <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={36} height={36} unoptimized className="hidden dark:block" />
              <span>Fluent<span className="text-primary">Hire</span></span>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Free to start — no credit card required.
            </p>
          </div>

          {/* Google sign-up */}
          {isGoogleLoading ? (
            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium">
              <Loader2 className="size-4 animate-spin" />
              Signing up with Google...
            </div>
          ) : (
            <div className="flex justify-center [&>div]:w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-up failed. Please try again.")}
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Carlos"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  aria-invalid={!!fieldErrors.firstName}
                  className="h-11"
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Rodriguez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  aria-invalid={!!fieldErrors.lastName}
                  className="h-11"
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                className="h-11"
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.password}
                className="h-11"
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Start Practicing Free
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
