"use client";

import { Monitor } from "lucide-react";

export function DesktopRequiredMessage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <Monitor className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium">Desktop Required</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        This mode requires a larger screen. Please switch to a desktop or laptop to continue.
      </p>
    </div>
  );
}
