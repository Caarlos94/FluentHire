"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type { ApiError } from "@/types/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      const apiError = err as ApiError;
      // If it's a 404 (email not found), still show success for security
      if (apiError.status === 404) {
        setIsSubmitted(true);
      } else {
        setError(
          apiError.error ||
            "Something went wrong. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel: gradient ── */}
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
            Don&apos;t worry, it happens to everyone.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-white/70">
            We&apos;ll help you get back into your account in no time.
          </p>
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

          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Check your inbox
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If this email is registered, we sent a password reset link.
                It may take a minute to arrive.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">
                  Reset your password
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
