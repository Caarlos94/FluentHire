"use client";

import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth";
import { FeedbackButton } from "@/components/feedback-button";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en">
        <AuthProvider>
          {children}
          <FeedbackButton />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
