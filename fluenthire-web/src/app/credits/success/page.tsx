"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, Mic, LayoutDashboard } from "lucide-react";

export default function CreditPackSuccessPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshProfile } = useAuth();
  const [refreshed, setRefreshed] = useState(false);
  const [initialCredits] = useState(() => user?.credits ?? null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    // Poll profile until credits change from initial value
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setRefreshed(true);
        return;
      }
      await refreshProfile();
      attempts++;
    }, 2000);

    refreshProfile();

    return () => clearInterval(interval);
  }, [authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark as refreshed only when credits actually change
  useEffect(() => {
    if (user && initialCredits !== null && user.credits !== initialCredits) {
      setRefreshed(true);
    }
  }, [user?.credits]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading || !user || !refreshed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <CardContent className="py-10 text-center space-y-5">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Credits added!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You now have{" "}
                <span className="font-semibold text-primary">
                  {user.credits} Live AI Interview credit{user.credits !== 1 ? "s" : ""}
                </span>{" "}
                ready to use. Credit pack credits never expire — use them
                whenever you want.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="h-10 w-full"
                nativeButton={false}
                render={<Link href="/practice?mode=interview" />}
              >
                <Mic className="size-4" />
                Start a Live Interview
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                <LayoutDashboard className="size-4" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
