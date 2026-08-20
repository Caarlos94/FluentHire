"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { AppNavbar } from "@/components/app-navbar";
import { ErrorBoundary } from "@/components/error-boundary";

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-6xl px-5 py-5">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
}
