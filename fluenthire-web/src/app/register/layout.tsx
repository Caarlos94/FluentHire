import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Free",
  description:
    "Create your free FluentHire account and start practicing English technical interviews with AI-powered feedback. No credit card required.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
