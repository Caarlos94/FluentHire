"use client";

import { AppNavbar } from "@/components/app-navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/lib/auth";

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-lg font-bold tracking-tight">
          Fluent<span className="text-primary">Hire</span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log In
          </a>
          <a
            href="/register"
            className="btn-gradient inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm font-medium"
          >
            Sign Up
          </a>
        </div>
      </nav>
    </header>
  );
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user ? <AppNavbar /> : <LandingNavbar />}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
