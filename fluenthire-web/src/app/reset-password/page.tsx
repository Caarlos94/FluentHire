"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type { ApiError } from "@/types/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.resetPassword(token!, password);
      setIsSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.error ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <>
      {/* Mobile logo */}
      <div className="mb-8 flex justify-center lg:hidden">
        <Link href="/" className="flex items-center gap-1 text-2xl font-bold tracking-tight">
          <Image src="/logo-icon.png" alt="FluentHire logo" width={36} height={36} unoptimized className="dark:hidden" />
          <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={36} height={36} unoptimized className="hidden dark:block" />
          <span>Fluent<span className="text-primary">Hire</span></span>
        </Link>
      </div>

      {isSuccess ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Password reset!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been reset. You can now log in.
          </p>
          <Link
            href="/login"
            className="btn-gradient mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium"
          >
            Go to Login
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Set your new password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {error}
                {error.toLowerCase().includes("expired") && (
                  <Link
                    href="/forgot-password"
                    className="mt-1 block font-medium underline"
                  >
                    Request a new link
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
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
    </>
  );
}

export default function ResetPasswordPage() {
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
            Almost there. Set your new password.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-white/70">
            Pick something strong and get back to practicing.
          </p>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} FluentHire
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
