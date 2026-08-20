"use client";

import { AppNavbar } from "@/components/app-navbar";
import { LandingNavbar } from "@/components/landing-navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/lib/auth";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user ? <AppNavbar /> : <LandingNavbar />}
      <main className={`mx-auto max-w-6xl px-5 py-5 ${!user ? "pt-20" : ""}`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
