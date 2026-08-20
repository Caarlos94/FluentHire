import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fluenthire.app";

export const metadata: Metadata = {
  title: {
    default:
      "English Interview Practice for Developers | FluentHire",
    template: "%s | FluentHire",
  },
  description:
    "Practice technical interviews in English with AI feedback. Get scored on communication clarity and technical depth. Built for LATAM developers. Start free today.",
  keywords: [
    "english interview practice",
    "technical interview coaching",
    "LATAM developers",
    "remote US jobs",
    "interview english",
    "coding interview practice",
    "AI interview feedback",
    "developer interview preparation",
    "non-native english developers",
    "remote software engineer jobs",
    "entrevista en ingles programador",
    "practicar entrevista tecnica ingles",
    "trabajo remoto estados unidos",
    "english for developers",
    "system design interview practice",
    "behavioral interview practice english",
    "think out loud coding interview",
  ],
  authors: [{ name: "FluentHire" }],
  creator: "FluentHire",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "FluentHire",
    title: "FluentHire — Ace Your Coding Interview in English",
    description:
      "You have the technical skills. Your English doesn't match them — yet. Practice with AI feedback and land the remote US job you deserve.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluentHire — Ace Your Coding Interview in English",
    description:
      "Practice technical interviews in English with AI feedback. Built for LATAM developers targeting remote US jobs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
