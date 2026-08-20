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

const PLAN_DISPLAY: Record<string, { name: string; credits: number }> = {
  INTERVIEW_STARTER: { name: "Interview Starter", credits: 5 },
  INTERVIEW_PRO: { name: "Interview Pro", credits: 14 },
  INTERVIEW_INTENSIVE: { name: "Interview Intensive", credits: 24 },
};

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshProfile } = useAuth();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    // Poll profile until the webhook processes and plan updates from FREE
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      await refreshProfile();
      attempts++;
    };

    const interval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setRefreshed(true); // Show whatever we have after timeout
        return;
      }
      await poll();
    }, 2000);

    // Initial fetch
    poll();

    return () => clearInterval(interval);
  }, [authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark as refreshed once the plan actually updates
  useEffect(() => {
    if (user && user.plan !== "FREE") {
      setRefreshed(true);
    }
  }, [user]);

  if (authLoading || !user || !refreshed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const planInfo = PLAN_DISPLAY[user.plan] ?? { name: user.plan, credits: 0 };

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
                You&apos;re on the {planInfo.name} plan!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You now have{" "}
                <span className="font-semibold text-primary">
                  {user.credits} Live AI Interview credit{user.credits !== 1 ? "s" : ""}
                </span>{" "}
                ready to use. Each session gives you real-time feedback on your
                communication and technical skills.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{planInfo.credits} credits</span>{" "}
              will be added to your account every month.
              Q&A and Think Out Loud practice remain free and unlimited.
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
