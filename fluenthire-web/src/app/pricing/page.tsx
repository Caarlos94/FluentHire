"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  Package,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api";

// ─── Plan data ──────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 3,
    description: "Try the platform and see if it's right for you.",
    cta: "Get Started",
    highlighted: false,
    showPerCredit: false,
    priceId: null,
    features: [
      "3 Live AI Interview credits on signup",
      "Unlimited Q&A practice",
      "Unlimited Think Out Loud practice",
      "AI-powered feedback",
      "Q&A question bank",
    ],
  },
  {
    id: "interview_starter",
    name: "Interview Starter",
    price: 9.99,
    credits: 5,
    description: "For active job seekers preparing for interviews.",
    cta: "Get Started",
    highlighted: false,
    showPerCredit: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
    features: [
      "5 Live AI Interview credits per month",
      "Everything in Free, plus:",
      "Behavioral interview practice",
      "Job description analysis",
      "Personalized question recommendations",
    ],
  },
  {
    id: "interview_pro",
    name: "Interview Pro",
    price: 19.99,
    credits: 14,
    description: "For serious preparation — land the role you want.",
    cta: "Get Started",
    highlighted: true,
    showPerCredit: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
    features: [
      "14 Live AI Interview credits per month",
      "Everything in Interview Starter, plus:",
      "Priority AI processing",
      "Unlimited job description analyses",
      "Advanced performance analytics",
    ],
  },
  {
    id: "interview_intensive",
    name: "Interview Intensive",
    price: 29.99,
    credits: 24,
    description: "Maximum practice for intensive preparation sprints.",
    cta: "Get Started",
    highlighted: false,
    showPerCredit: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_INTENSIVE!,
    features: [
      "24 Live AI Interview credits per month",
      "Everything in Interview Pro, plus:",
      "Priority support",
      "Best per-credit value on a subscription",
    ],
  },
];

const CREDIT_PACKS = [
  {
    id: "pack_3",
    credits: 3,
    price: 8.99,
    perCredit: 3.0,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PACK_3!,
  },
  {
    id: "pack_6",
    credits: 6,
    price: 14.99,
    perCredit: 2.5,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PACK_6!,
    popular: true,
  },
  {
    id: "pack_10",
    credits: 10,
    price: 22.99,
    perCredit: 2.3,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PACK_10!,
    bestValue: true,
  },
];

const FAQ = [
  {
    q: "What is an interview credit?",
    a: "Each credit lets you start one Live AI Interview session — either coding, behavioral, or system design. Q&A practice and Think Out Loud sessions are always free and don't cost credits.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time from your profile. When you upgrade, the change takes effect immediately. When you downgrade, you keep your current plan until the end of your billing period.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Credits reset at the start of each billing cycle. Unused credits do not roll over to the next month, so make the most of your sessions!",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You can still browse questions and review past feedback, but you won't be able to start new practice sessions until your credits renew, you upgrade your plan, or you purchase a credit pack.",
  },
  {
    q: "Can I buy credit packs without a subscription?",
    a: "Yes! Credit packs are available to all users. They're perfect if you need a few extra sessions without committing to a monthly plan. Subscribers can also buy packs for additional credits on top of their monthly allocation.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Free plan includes 3 Live AI Interview credits plus unlimited Q&A and Think Out Loud practice. When you're ready for more live interviews, upgrade to Interview Starter, Interview Pro, or Interview Intensive — no long-term commitment required.",
  },
  {
    q: "How do I cancel?",
    a: "You can cancel anytime from your profile page. Your plan stays active until the end of the current billing period — no partial charges, no hassle.",
  },
  {
    q: "What is your refund policy?",
    a: "Subscription payments are non-refundable — when you cancel, you keep access until the end of your billing period. Credit pack credits never expire. If a technical issue prevents you from completing a session, contact support@fluenthire.app within 7 days and we may restore the credit.",
  },
];

// ─── FAQ Item ───────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-border/60 last:border-0 transition-colors ${open ? "border-l-2 border-l-primary bg-muted/30 -mx-4 px-4" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors hover:text-primary"
      >
        {q}
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Pricing Card ───────────────────────────────────────────────────────────

function PricingCard({
  plan,
  isCurrentPlan,
  hasActiveSubscription,
  onSelect,
  loading,
}: {
  plan: (typeof PLANS)[number];
  isCurrentPlan: boolean;
  hasActiveSubscription: boolean;
  onSelect: (priceId: string) => void;
  loading: boolean;
}) {
  const isFree = plan.price === 0;
  const router = useRouter();

  // Subscriber clicking a different paid plan → send to profile to manage
  const isManageCase = hasActiveSubscription && !isCurrentPlan && !isFree;

  return (
    <Card
      className={`relative flex flex-col overflow-visible transition-all duration-200 ${
        plan.highlighted
          ? "ring-2 ring-primary bg-primary/[0.03] shadow-[0_0_30px_rgba(59,130,246,0.12)] scale-[1.02]"
          : "hover:ring-2 hover:ring-primary/40 hover:shadow-md"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
          <Badge className="gap-1 px-3 py-1 text-xs shadow-[0_0_12px_rgba(59,130,246,0.4)]">
            <Sparkles className="size-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">
              {isFree ? "Free" : `$${plan.price}`}
            </span>
            {!isFree && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Zap className="size-3.5 text-primary" />
            <span>
              <strong className="text-foreground">{plan.credits}</strong>{" "}
              {isFree ? "credits on signup" : "credits/month"}
            </span>
          </div>
          {!isFree && plan.showPerCredit !== false && (
            <div className="text-[12px] text-muted-foreground">
              ${(plan.price / plan.credits).toFixed(2)} per credit
            </div>
          )}
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* CTA */}
        <div className="mb-6">
          {isCurrentPlan ? (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              disabled
            >
              Current Plan
            </Button>
          ) : isManageCase ? (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => router.push("/profile")}
            >
              Manage Subscription
            </Button>
          ) : isFree ? (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              disabled
            >
              {hasActiveSubscription ? "Included" : "Current Plan"}
            </Button>
          ) : plan.highlighted ? (
            <button
              onClick={() => plan.priceId && onSelect(plan.priceId)}
              disabled={loading}
              className="btn-gradient flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                plan.cta
              )}
            </button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => plan.priceId && onSelect(plan.priceId)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                plan.cta
              )}
            </Button>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature) => {
            const isHeading = feature.endsWith(":");
            return (
              <li key={feature} className={`flex gap-2.5 text-sm ${isHeading ? "mt-1 border-t border-border/40 pt-3" : ""}`}>
                {isHeading ? (
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">
                    {feature}
                  </span>
                ) : (
                  <>
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [packLoading, setPackLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentPlan = user?.plan || "FREE";
  const hasActiveSubscription = currentPlan !== "FREE" && user?.subscriptionStatus === "ACTIVE";

  const handleBuyPack = async (priceId: string) => {
    if (!user) {
      router.push("/register");
      return;
    }
    setError("");
    setPackLoading(priceId);
    try {
      const { checkoutUrl } = await api.createCreditCheckoutSession(priceId);
      if (!checkoutUrl || !checkoutUrl.startsWith("https://")) {
        throw { error: "Invalid checkout URL received." } as ApiError;
      }
      window.location.href = checkoutUrl;
      setTimeout(() => setPackLoading(null), 10000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.error || "Failed to start checkout. Please try again.");
      setPackLoading(null);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    if (!user) {
      router.push("/register");
      return;
    }
    setError("");
    setLoading(priceId);
    try {
      const { checkoutUrl } = await api.createCheckoutSession(priceId);
      if (!checkoutUrl || !checkoutUrl.startsWith("https://")) {
        throw { error: "Invalid checkout URL received." } as ApiError;
      }
      window.location.href = checkoutUrl;
      // Reset loading after timeout in case navigation doesn't happen
      setTimeout(() => setLoading(null), 10000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.error || "Failed to start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* ── Header ── */}
      <div className="space-y-2">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple,{" "}
            <span className="text-gradient">transparent pricing</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Choose the plan that fits your interview preparation needs.
            <br className="hidden sm:block" />
            Upgrade or downgrade anytime — no commitments.
          </p>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-auto max-w-md rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Plans Grid ── */}
      <div className="grid gap-4 pt-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={plan.id === currentPlan.toLowerCase()}
            hasActiveSubscription={hasActiveSubscription}
            onSelect={handleSelectPlan}
            loading={loading === plan.priceId}
          />
        ))}
      </div>

      {/* ── Trust signals ── */}
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-lg border border-border/40 bg-muted/30 px-6 py-3.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          Cancel anytime
        </span>
        <span className="text-border">&middot;</span>
        <span className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-primary" />
          No hidden fees
        </span>
        <span className="text-border">&middot;</span>
        <span className="flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          Secure payment via Stripe
        </span>
      </div>

      {/* ── Refund policy notice ── */}
      <p className="text-center text-xs text-muted-foreground">
        Subscriptions are non-refundable. Credit pack credits never expire. Technical issues?{" "}
        <a href="mailto:support@fluenthire.app" className="text-primary hover:underline">
          Contact support
        </a>{" "}
        within 7 days for credit restoration.{" "}
        <a href="/terms#refund-policy" className="text-primary hover:underline">
          Full refund policy
        </a>
      </p>

      {/* ── Credit Packs ── */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Need more credits?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Buy credit packs anytime — no subscription required.
            Credits never expire.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={`relative flex flex-col overflow-visible transition-all duration-200 hover:shadow-md ${
                pack.popular
                  ? "ring-2 ring-primary bg-primary/[0.03] shadow-[0_0_30px_rgba(59,130,246,0.12)]"
                  : "hover:ring-2 hover:ring-primary/40"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="gap-1 px-2.5 py-0.5 text-xs shadow-sm">
                    Popular
                  </Badge>
                </div>
              )}
              {pack.bestValue && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs shadow-sm">
                    Best Value
                  </Badge>
                </div>
              )}
              <CardContent className="flex flex-1 flex-col items-center gap-4 pt-6">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="size-5" />
                  <span className="text-lg font-bold">
                    {pack.credits} Credits
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold tracking-tight">
                    ${pack.price}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${pack.perCredit.toFixed(2)} per credit
                  </p>
                </div>
                <Button
                  variant={pack.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleBuyPack(pack.priceId)}
                  disabled={packLoading === pack.priceId}
                >
                  {packLoading === pack.priceId ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {user && (
          <p className="text-center text-xs text-muted-foreground">
            Current balance:{" "}
            <strong className="text-foreground">{user.credits} {user.credits === 1 ? "credit" : "credits"}</strong>
          </p>
        )}
      </div>

      {/* ── FAQ ── */}
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-center text-xl font-semibold">
          Frequently Asked Questions
        </h2>
        <Card>
          <CardContent className="py-2">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
