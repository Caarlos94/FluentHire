import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquareText,
  BrainCircuit,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle2,
  Globe,
  Zap,
  ChevronDown,
  Lock,
  Mic,
  ShieldCheck,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing-navbar";
import { AnimatedStep } from "@/components/animated-step";
import { AnimatedScoreCircle } from "@/components/animated-score-circle";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fluenthire.app";

// ─── JSON-LD Structured Data ────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FluentHire",
  url: SITE_URL,
  description:
    "AI-powered English interview practice for software developers targeting remote US jobs.",
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FluentHire",
  url: SITE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "AI-powered English interview practice platform for software developers. Practice behavioral, system design, and coding think-out-loud questions with instant AI feedback on communication clarity and technical depth.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier with 3 interview credits plus unlimited Q&A practice",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is FluentHire for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FluentHire is built for non-native English-speaking software developers — especially from Latin America — who want to land remote US jobs but struggle with English communication during technical interviews.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from Pramp or Interviewing.io?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Those platforms assume you're already fluent in English. FluentHire specifically analyzes your English communication quality alongside technical depth, and helps you improve both dimensions.",
      },
    },
    {
      "@type": "Question",
      name: "Is FluentHire free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — you get 3 free interview credits plus unlimited Q&A and Think Out Loud practice, no credit card required. For more live interviews, we offer Interview Starter ($9.99/mo, 5 credits), Interview Pro ($19.99/mo, 14 credits), and Interview Intensive ($29.99/mo, 24 credits) plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I practice on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FluentHire works in any modern browser, including mobile. However, for the best experience — especially with voice input and the code editor — we recommend using a laptop or desktop, just like a real interview setting.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to see improvement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most developers notice a difference in their confidence and structure after 5–10 practice sessions. The AI feedback helps you identify patterns quickly — like filler words or missing tradeoff discussions — so you improve faster than practicing alone.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. You can cancel your subscription at any time from your account settings — no questions asked, no hidden fees. You'll keep access until the end of your billing period.",
      },
    },
  ],
};

// ─── Static Score Circle (server-safe, no client JS) ────────────────────────

function StaticScoreCircle({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 40;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative size-20 md:size-24">
        <svg className="size-20 md:size-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="currentColor" strokeWidth="6"
            className="text-muted-foreground/12"
          />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="currentColor" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="text-emerald-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold">{score}</span>
        </div>
      </div>
      <span className="text-xs md:text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold text-emerald-500">Excellent</span>
    </div>
  );
}

// ─── Hero Mockup ─────────────────────────────────────────────────────────────

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Glow behind the mockup */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-primary/8 blur-2xl" />

      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
        {/* Title bar */}
        <div className="border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-red-400/60" />
            <div className="size-2.5 rounded-full bg-yellow-400/60" />
            <div className="size-2.5 rounded-full bg-green-400/60" />
            <span className="ml-3 text-xs text-muted-foreground">
              fluenthire.app — Interview Report
            </span>
          </div>
        </div>

        {/* Report content */}
        <div className="px-6 pt-6 pb-5">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold">Interview Complete</h3>
            <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">QUICK</span>
              <span>12m 24s</span>
              <span>·</span>
              <span>1 problem</span>
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-500">
              Great score! You&apos;re communicating like a senior engineer.
            </p>
          </div>

          {/* Score circles */}
          <div className="mt-5 flex justify-center gap-6 md:gap-8">
            <AnimatedScoreCircle score={88} label="Communication" delay={300} />
            <AnimatedScoreCircle score={85} label="Technical" delay={500} />
            <AnimatedScoreCircle score={92} label="Problem Solving" delay={700} />
          </div>

          {/* Focus tip (peek) */}
          <div className="mt-5 rounded-lg border-l-2 border-primary/50 bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="size-4 text-primary" />
              What to Focus On
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add a brief complexity analysis at the end — mention time
              and space complexity to show complete technical awareness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      {/* Rich gradient background */}
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left column — text content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full px-4 py-1.5 text-sm shadow-sm">
              <Zap className="size-3.5 text-primary" />
              Practice one question — get instant AI feedback
            </Badge>

            {/* WHO/WHY/WHAT headline with gradient keyword */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl md:leading-[1.1]">
              Ace Your Next{" "}
              <span className="text-gradient">
                Coding
              </span>{" "}
              Interview in English{" "}
              <span className="text-muted-foreground">Without Freezing Up</span>
            </h1>

            {/* PAS + judgment-free messaging */}
            <div className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              <p>
                You have the technical skills.
                But when the interviewer asks &ldquo;Tell me about a time you...&rdquo;
                — your English doesn&apos;t match your skills{" "}
                <span className="font-medium text-foreground italic">yet</span>.
                {" "}Practice in a{" "}
                <span className="font-medium text-foreground">private, judgment-free space</span>
                {" "}with instant AI feedback on your communication, technical depth, and problem-solving skills.
              </p>
            </div>

            {/* Salary anchor — above CTA for motivation */}
            <p className="mt-8 text-base md:text-lg font-medium text-muted-foreground text-center lg:text-left">
              LATAM devs who practice target{" "}
              <span className="font-bold text-foreground">$80K–150K remote US roles</span>
            </p>

            {/* CTA button */}
            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/register"
                className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-base font-medium"
              >
                Start Practicing Free
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-lg border border-border/40 bg-muted/30 px-5 py-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                Free to start — no credit card
              </span>
              <span className="hidden text-border sm:inline">&middot;</span>
              <span className="flex items-center gap-1.5">
                <Lock className="size-4 text-primary" />
                Private &amp; judgment-free
              </span>
            </div>
          </div>

          {/* Right column — product mockup */}
          <div className="w-full flex-shrink-0 lg:w-[440px]">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof / Stats ────────────────────────────────────────────────────

function Stats() {
  const stats = [
    { value: "$80K–150K", label: "That's 2–3× the local LATAM salary" },
    { value: "200+", label: "Real interview questions" },
    { value: "3 Modes", label: "Q&A, Think Out Loud & Live Interview" },
    { value: "3 Scores", label: "Communication, Technical & Problem Solving" },
  ];

  return (
    <section className="border-y border-border/40 bg-muted/35 py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-gradient text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Problem Section (PAS: Agitation) ────────────────────────────────────────

function Problem() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">The Problem</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            You&apos;re Not Losing Jobs to Better Developers —{" "}
            <span className="text-gradient">You&apos;re Losing Them to Better English</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            You can architect distributed systems, debug race conditions, and
            ship production code. But none of that matters if you can&apos;t
            explain it clearly in English during a 45-minute interview.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Globe,
              title: "The Language Gap",
              description:
                "Existing tools like Pramp and Interviewing.io assume you're already fluent. Duolingo doesn't understand tech context. Nothing bridges the gap between English learning and tech interview prep.",
            },
            {
              icon: MessageSquareText,
              title: "The Confidence Trap",
              description:
                "You know the answer but freeze translating it. Fillers creep in, structured thinking sounds disorganized. And there's nowhere to practice privately without judgment.",
            },
            {
              icon: TrendingUp,
              title: "The Salary Gap",
              description:
                "LATAM devs earn $30K–70K locally. Remote US roles pay $80K–150K. The only barrier isn't skill — it's communication in the interview.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-base font-medium"
          >
            Start Closing the Gap — Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Solution Section ────────────────────────────────────────────────────────

function SolutionQA() {
  return (
    <div className="flex flex-col p-4 sm:p-5 min-h-[487px]">
      {/* Question header */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-semibold">Tell me about a time you had to push back on a technical decision</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Describe a situation where you disagreed with a teammate or manager on a technical approach. How did you handle it, and what was the outcome?
        </p>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">behavioral</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">conflict resolution</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">leadership</span>
        </div>
      </div>

      {/* Coaching tip */}
      <div className="mt-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 px-4 py-3">
        <p className="text-xs font-semibold text-yellow-500">STAR Method</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Structure your answer: <span className="font-semibold text-yellow-500/80">Situation</span> (set the scene) → <span className="font-semibold text-yellow-500/80">Task</span> (your responsibility) → <span className="font-semibold text-yellow-500/80">Action</span> (what you did) → <span className="font-semibold text-yellow-500/80">Result</span> (the outcome with metrics).
        </p>
      </div>

      {/* Answer area */}
      <div className="mt-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Your Answer</p>
          <p className="text-xs text-muted-foreground">87 words · 87/5,000</p>
        </div>
        <div className="relative mt-1.5 rounded-lg border border-border bg-background/50 p-3 flex-1">
          <p className="text-xs text-muted-foreground pr-6 leading-relaxed">
            <span className="font-semibold text-yellow-500/70">[S]</span> At my previous company, the lead engineer proposed migrating our monolith to microservices mid-sprint to fix scaling issues.{" "}
            <span className="font-semibold text-yellow-500/70">[T]</span> As the backend developer owning the payment service, I needed to ensure we didn&apos;t introduce downtime during peak season.{" "}
            <span className="font-semibold text-yellow-500/70">[A]</span> I presented data showing our bottleneck was a single database query, not architecture. I proposed indexing and caching instead, with a proof-of-concept in two days.{" "}
            <span className="font-semibold text-yellow-500/70">[R]</span> The team adopted my approach — response times dropped 70% and we avoided a risky rewrite.
          </p>
          <Mic className="absolute right-3 bottom-3 size-4 text-muted-foreground/40" />
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-3 rounded-lg bg-primary/20 py-2.5 text-center">
        <p className="text-xs font-medium text-primary">◇ Submit &amp; Get AI Feedback</p>
      </div>
    </div>
  );
}

function SolutionThinkOutLoud() {
  return (
    <div className="grid gap-0 md:grid-cols-[280px_1fr] min-h-[487px]">
      {/* Left: problem panel */}
      <div className="border-b border-border p-4 md:border-b-0 md:border-r">
        <div className="rounded-xl border border-primary/30 bg-muted/30 p-3">
          <p className="text-sm font-semibold">Counting number of 1 bits</p>
          <div className="mt-2 rounded-lg bg-background/50 p-2.5">
            <p className="text-xs text-muted-foreground">
              Given an integer, how would you count the number of 1 bits in its binary representation?
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 px-3 py-2.5">
          <p className="text-xs font-semibold text-yellow-500">Coaching Tip</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Think out loud! Walk through your approach step by step. Discuss data structures and edge cases.
          </p>
        </div>
      </div>

      {/* Right: code editor + approach */}
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Language:</span>
            <span className="rounded border border-border px-2 py-0.5 font-medium text-foreground">Java ▾</span>
          </div>
          <span>↻ Reset</span>
        </div>
        {/* Code editor mockup */}
        <div className="mt-2 flex-1 rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed whitespace-pre">
          <p><span className="text-muted-foreground/40"> 1</span>{"  "}<span className="text-blue-400">class</span> <span className="text-emerald-400">Solution</span> {"{"}</p>
          <p><span className="text-muted-foreground/40"> 2</span>{"      "}<span className="text-blue-400">public int</span> <span className="text-yellow-300">hammingWeight</span>(<span className="text-blue-400">int</span> n) {"{"}</p>
          <p><span className="text-muted-foreground/40"> 3</span>{"          "}<span className="text-blue-400">int</span> count = <span className="text-orange-400">0</span>;</p>
          <p><span className="text-muted-foreground/40"> 4</span>{"          "}<span className="text-purple-400">while</span> (n != <span className="text-orange-400">0</span>) {"{"}</p>
          <p><span className="text-muted-foreground/40"> 5</span>{"              "}count += n & <span className="text-orange-400">1</span>;</p>
          <p><span className="text-muted-foreground/40"> 6</span>{"              "}n {">>>"}= <span className="text-orange-400">1</span>;</p>
          <p><span className="text-muted-foreground/40"> 7</span>{"          "}{"}"}</p>
          <p><span className="text-muted-foreground/40"> 8</span>{"          "}<span className="text-purple-400">return</span> count;</p>
          <p><span className="text-muted-foreground/40"> 9</span>{"      "}{"}"}</p>
          <p><span className="text-muted-foreground/40">10</span>{"  "}{"}"}</p>
        </div>
        {/* Approach area */}
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Explain Your Approach</p>
          <div className="relative mt-1 rounded-lg border border-border bg-background/50 p-2.5 min-h-[36px]">
            <p className="text-xs text-muted-foreground pr-6">
              I check each bit one by one using a brute force approach. I use bitwise AND with 1 to check the last bit, then unsigned right shift to move to the next. This runs in O(32) time since integers are 32 bits.
            </p>
            <Mic className="absolute right-2.5 bottom-2.5 size-4 text-muted-foreground/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionLiveInterview() {
  return (
    <div className="min-h-[420px]">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          ⏱ 29:41
        </span>
        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
          Problem 1/1
        </span>
        <span className="text-xs text-muted-foreground">Validating parentheses in a string</span>
        <span className="ml-auto rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">
          End Interview
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_320px]">
        {/* Left: code editor */}
        <div className="border-b border-border md:border-b-0 md:border-r">
          <div className="h-full border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed whitespace-pre">
            <p><span className="text-muted-foreground/40"> 1</span>{"  "}<span className="text-blue-400">class</span> <span className="text-emerald-400">Solution</span> {"{"}</p>
            <p><span className="text-muted-foreground/40"> 2</span>{"      "}<span className="text-blue-400">public boolean</span> <span className="text-yellow-300">isValid</span>(<span className="text-blue-400">String</span> s) {"{"}</p>
            <p><span className="text-muted-foreground/40"> 3</span>{"          "}Stack{"<"}Character{">"} stack = <span className="text-purple-400">new</span> Stack{"<>"}();</p>
            <p><span className="text-muted-foreground/40"> 4</span>{"          "}<span className="text-purple-400">for</span> (<span className="text-blue-400">char</span> c : s.toCharArray()) {"{"}</p>
            <p><span className="text-muted-foreground/40"> 5</span>{"              "}<span className="text-purple-400">if</span> (c == <span className="text-orange-400">&apos;(&apos;</span> || c == <span className="text-orange-400">&apos;[&apos;</span> || c == <span className="text-orange-400">{"'{'"}</span>)</p>
            <p><span className="text-muted-foreground/40"> 6</span>{"                  "}stack.push(c);</p>
            <p><span className="text-muted-foreground/40"> 7</span>{"              "}<span className="text-purple-400">else if</span> (stack.isEmpty())</p>
            <p><span className="text-muted-foreground/40"> 8</span>{"                  "}<span className="text-purple-400">return</span> <span className="text-orange-400">false</span>;</p>
            <p><span className="text-muted-foreground/40"> 9</span>{"              "}<span className="text-purple-400">else</span> {"{"}</p>
            <p><span className="text-muted-foreground/40">10</span>{"                  "}<span className="text-blue-400">char</span> top = stack.pop();</p>
            <p><span className="text-muted-foreground/40">11</span>{"                  "}<span className="text-purple-400">if</span> (!matches(top, c)) <span className="text-purple-400">return</span> <span className="text-orange-400">false</span>;</p>
            <p><span className="text-muted-foreground/40">12</span>{"              "}{"}"}</p>
            <p><span className="text-muted-foreground/40">13</span>{"          "}{"}"}</p>
            <p><span className="text-muted-foreground/40">14</span>{"          "}<span className="text-purple-400">return</span> stack.isEmpty();</p>
            <p><span className="text-muted-foreground/40">15</span>{"      "}{"}"}</p>
            <p><span className="text-muted-foreground/40">16</span>{"  "}{"}"}</p>
          </div>
        </div>

        {/* Right: conversation panel */}
        <div className="p-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <BrainCircuit className="size-3.5" />
            AI Interviewer
            <Mic className="ml-auto size-3.5 text-muted-foreground" />
          </div>
          {/* AI message — left aligned */}
          <div className="mr-8 rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs leading-relaxed">What would you do if the stack is empty when you encounter a closing bracket?</p>
          </div>
          {/* User message — right aligned */}
          <div className="ml-8 rounded-lg bg-primary/15 px-3 py-2">
            <p className="text-xs leading-relaxed">That would mean there&apos;s no matching opening bracket, so I would return false immediately.</p>
          </div>
          {/* AI message */}
          <div className="mr-8 rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs leading-relaxed">Exactly. And when you finish processing all characters — what should the stack look like?</p>
          </div>
          {/* User message */}
          <div className="ml-8 rounded-lg bg-primary/15 px-3 py-2">
            <p className="text-xs leading-relaxed">The stack should be empty. If there are still opening brackets left, they were never closed.</p>
          </div>
          {/* AI message */}
          <div className="mr-8 rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs leading-relaxed">Perfect. Now, what&apos;s the time complexity?</p>
          </div>
          {/* Recording indicator — full width */}
          <div className="rounded-lg bg-primary/15 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              ...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Solution() {
  return (
    <section className="bg-muted/35 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">The Solution</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            Three Ways to Practice English Interviews.{" "}
            <span className="text-primary">One Goal: Get Hired.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you need to nail behavioral interview questions, think through coding
            problems out loud, or simulate a full AI mock interview — FluentHire
            has you covered with instant feedback on every response.
          </p>
        </div>

        {/* Mode tabs + mockup — wrapped in solution-tabs for CSS :has() switching */}
        <div className="solution-tabs mx-auto mt-12 max-w-4xl">
          {/* Hidden radios — must be inside .solution-tabs for :has() to work */}
          <input type="radio" name="solution-mode" id="mode-qa" className="sr-only" />
          <input type="radio" name="solution-mode" id="mode-think" defaultChecked className="sr-only" />
          <input type="radio" name="solution-mode" id="mode-live" className="sr-only" />

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: "mode-qa", icon: MessageSquareText, title: "Q&A Practice" },
              { id: "mode-think", icon: BrainCircuit, title: "Think Out Loud" },
              { id: "mode-live", icon: Zap, title: "Coding Interview" },
            ].map((mode) => (
              <label
                key={mode.id}
                htmlFor={mode.id}
                className="solution-tab flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <mode.icon className="size-4" />
                {mode.title}
              </label>
            ))}
          </div>

          {/* Mockup container */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-400/60" />
                <div className="size-3 rounded-full bg-yellow-400/60" />
                <div className="size-3 rounded-full bg-green-400/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  fluenthire.app — Practice Session
                </span>
              </div>
            </div>

            {/* All 3 panels — CSS :has() switches visibility */}
            <div className="solution-panel" data-panel="qa">
              <SolutionQA />
            </div>
            <div className="solution-panel" data-panel="think">
              <SolutionThinkOutLoud />
            </div>
            <div className="solution-panel" data-panel="live">
              <SolutionLiveInterview />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Features Section ────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            AI-Powered Interview Practice to{" "}
            <span className="text-gradient">Sound Confident and Clear in English</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you&apos;re preparing for your first US interview or your tenth
            — built for developers who think in one language and interview in another.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Job Description Personalization",
              description: "Paste any job posting and get questions tailored to that exact role, tech stack, and seniority level.",
            },
            {
              icon: BrainCircuit,
              title: "AI-Powered Rewriting",
              description: "See how a senior engineer would phrase your exact answer — side by side — and learn why it sounds more professional.",
            },
            {
              icon: Mic,
              title: "Voice Input with AI Transcription",
              description: "Speak your answer like a real interview. AI transcription converts your speech to text automatically.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="btn-gradient inline-flex h-11 items-center gap-2 rounded-full px-7 text-sm font-medium"
          >
            Try Your First Interview Question Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "I used to prepare answers in Spanish first and then translate in my head. After a few sessions here I started thinking directly in English during practice. That was huge for me.",
    name: "Isaac Castillo",
    role: "Software Engineer",
    country: "🇲🇽",
    flag: "🇲🇽",
    rating: 5,
    avatar: "/1695435187051.jpeg",
  },
  {
    quote:
      "Took me 4 tries to get through a coding answer without freezing. Fifth time felt almost natural. That\u2019s the thing \u2014 you just need reps.",
    name: "Matías Fernández",
    role: "Full Stack Developer",
    country: "Argentina",
    flag: "🇦🇷",
    rating: 5,
    avatar: "/uifaces-popular-avatar.jpg",
  },
  {
    quote:
      "My English made me feel like a junior even though I have 4 years of experience. That gap was killing my confidence more than I admitted to myself.",
    name: "Carlos Islas",
    role: "Software Engineer",
    country: "Mexico",
    flag: "🇲🇽",
    rating: 5,
    avatar: "/1723685103397.jpeg",
  },
];

function Testimonials() {
  return (
    <section className="bg-muted/35 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">Real Results</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            Developers Who Practiced.{" "}
            <span className="text-primary">Then Got Hired.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3">
                {"avatar" in t && t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={58}
                    height={58}
                    className="size-[58px] rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {t.flag}
                  </div>
                )}
                <div>
                  <p className="mb-1 text-sm font-semibold text-foreground">{t.name} <span className="text-sm">{t.flag}</span></p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Set Up Your Profile",
      description:
        "Tell us your experience level, role type, and main technology. Optionally paste a job description for personalized practice.",
    },
    {
      step: "2",
      title: "Choose Your Practice Mode",
      description:
        "Pick a question and write or speak your answer. Practice behavioral questions with the STAR method, walk through coding problems with Think Out Loud mode, or jump into a live AI-powered mock interview.",
    },
    {
      step: "3",
      title: "Get Instant AI Analysis",
      description:
        "Receive scores for communication and technical depth, detailed feedback on what to improve, and a model answer showing how a senior engineer would respond.",
    },
    {
      step: "4",
      title: "Practice, Improve, Repeat",
      description:
        "Submit multiple attempts, track your progress over time, and build confidence before your real interview.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            From Nervous to Confident in{" "}
            <span className="text-primary">4 Simple Steps</span>
          </h2>
        </div>

        <div className="relative mt-12">
          {/* Connector line */}
          <div className="absolute top-8 left-8 hidden h-[calc(100%-4rem)] w-px bg-border/50 md:left-1/2 md:block" />

          <div className="grid gap-8 md:gap-12">
            {steps.map((item, i) => (
              <AnimatedStep
                key={item.step}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 120}
              >
                <div
                  className={`relative flex flex-col items-start gap-6 md:flex-row md:items-center ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      i % 2 === 1 ? "md:text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-3 ${
                        i % 2 === 1 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">
                        {item.step}
                      </span>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                    </div>
                    <p className="mt-2 max-w-md text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Center dot with pulse ring */}
                  <div className="relative hidden shrink-0 md:block">
                    <div className="size-4 rounded-full border-4 border-primary bg-background" />
                    <div className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
                  </div>

                  <div className="hidden flex-1 md:block" />
                </div>
              </AnimatedStep>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="btn-gradient inline-flex h-11 items-center gap-2 rounded-full px-7 text-sm font-medium"
          >
            Start Your Interview Preparation Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

function FAQ() {
  const faqs: { question: string; answer: string; pricingLink?: boolean }[] = [
    {
      question: "Who is FluentHire for?",
      answer:
        "FluentHire is built for non-native English-speaking software developers — especially from Latin America — who want to land remote US jobs but struggle with English communication during technical interviews.",
    },
    {
      question: "How is this different from Pramp or Interviewing.io?",
      answer:
        "Those platforms assume you're already fluent in English. FluentHire specifically analyzes your English communication quality alongside technical depth, and helps you improve both dimensions.",
    },
    {
      question: "Is FluentHire free?",
      answer:
        "Yes — you get 3 free interview credits plus unlimited Q&A and Think Out Loud practice, no credit card required. For more live interviews, we offer Interview Starter ($9.99/mo, 5 credits), Interview Pro ($19.99/mo, 14 credits), and Interview Intensive ($29.99/mo, 24 credits) plans.",
      pricingLink: true,
    },
    {
      question: "Can I practice on my phone?",
      answer:
        "FluentHire works in any modern browser, including mobile. However, for the best experience — especially with voice input and the code editor — we recommend using a laptop or desktop, just like a real interview setting.",
    },
    {
      question: "How long does it take to see improvement?",
      answer:
        "Most developers notice a difference in their confidence and structure after 5–10 practice sessions. The AI feedback helps you identify patterns quickly — like filler words or missing tradeoff discussions — so you improve faster than practicing alone.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, absolutely. You can cancel your subscription at any time from your account settings — no questions asked, no hidden fees. You'll keep access until the end of your billing period.",
    },
  ];

  return (
    <section id="faq" className="bg-muted/35 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
            Common Questions About English Interview Practice
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border/60 bg-card"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-left font-medium">
                {faq.question}
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
                {faq.pricingLink && (
                  <>
                    {" "}
                    <Link href="/pricing" className="text-primary hover:underline">
                      See all plans
                    </Link>
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTV Section ──────────────────────────────────────────────────────

function FinalCTV() {
  return (
    <section
      className="py-20 text-white md:py-28"
      style={{
        background: "linear-gradient(135deg, oklch(0.35 0.20 264), oklch(0.40 0.22 290))",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-[44px]">
          Your Next Interview Could Change Your Career
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Stop losing opportunities to communication barriers. Start practicing
          today and walk into your next interview with confidence.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-medium text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="sm:hidden">Start Practicing Free</span>
            <span className="hidden sm:inline">Start Practicing Free — No Card Required</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-lg font-bold tracking-tight">
            <Image src="/logo-icon.png" alt="FluentHire logo" width={32} height={32} unoptimized className="dark:hidden" />
            <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={32} height={32} unoptimized className="hidden dark:block" />
            <span>Fluent<span className="text-gradient">Hire</span></span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered interview coaching for developers.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms#refund-policy" className="transition-colors hover:text-foreground">
            Refunds
          </Link>
          <a href="mailto:support@fluenthire.app" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FluentHire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingNavbar />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <Solution />
        <Features />
        <Testimonials />
        <HowItWorks />
        <FAQ />
        <FinalCTV />
      </main>
      <Footer />
    </>
  );
}
