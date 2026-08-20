"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { AppNavbar } from "@/components/app-navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto max-w-7xl px-5 py-5">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
}
