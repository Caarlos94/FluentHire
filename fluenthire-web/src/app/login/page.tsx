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
  Star,
} from "lucide-react";
import type { ApiError } from "@/types/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, googleLogin } = useAuth();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Invalid email or password. Please try again.");
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
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Google login failed. Please try again.");
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
            Practice makes progress. Keep improving your interview English.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-white/70">
            Every practice session brings you closer to the remote job you
            deserve.
          </p>

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
              &ldquo;My English made me feel like a junior even though I have 4
              years of experience. That gap was killing my confidence more than
              I admitted to myself.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Image src="/1723685103397.jpeg" alt="Carlos Islas" width={32} height={32} className="size-8 rounded-full object-cover" unoptimized />
              <div>
                <p className="text-sm font-medium">Carlos Islas</p>
                <p className="text-xs text-white/60">Software Engineer, Mexico</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Log in to continue practicing.
            </p>
          </div>

          {/* Google sign-in */}
          {isGoogleLoading ? (
            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium">
              <Loader2 className="size-4 animate-spin" />
              Signing in with Google...
            </div>
          ) : (
            <div className="flex justify-center [&>div]:w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed. Please try again.")}
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
