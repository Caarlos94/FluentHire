"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or refresh the page.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-muted-foreground/70">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RotateCcw className="size-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}
