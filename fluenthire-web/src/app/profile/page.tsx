"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { OptionGrid } from "@/components/option-grid";
import {
  EXPERIENCE_OPTIONS,
  ROLE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Loader2,
  User,
  Settings,
  Lock,
  Info,
  Briefcase,
  Gauge,
  Code,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  DifficultyLevel,
  RoleType,
  ProgrammingLanguage,
  ApiError,
} from "@/types/api";

function SuccessMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </div>
  );
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  FREE: { label: "Free", color: "bg-muted text-muted-foreground" },
  INTERVIEW_STARTER: { label: "Interview Starter", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  INTERVIEW_PRO: { label: "Interview Pro", color: "bg-primary/10 text-primary" },
  INTERVIEW_INTENSIVE: { label: "Interview Intensive", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
};

function CreditHistoryTabs({ added, used }: {
  added: { type: string; amount: number; description: string; createdAt: string }[];
  used: { type: string; amount: number; description: string; createdAt: string }[];
}) {
  const [tab, setTab] = useState<"used" | "added">("used");
  const items = tab === "added" ? added : used;

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setTab("used")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            tab === "used" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sessions ({used.length})
        </button>
        <button
          onClick={() => setTab("added")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            tab === "added" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Credits Added ({added.length})
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-2">
          {tab === "added" ? "No credits added yet." : "No sessions yet."}
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((tx, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`inline-block size-2 rounded-full ${tx.amount > 0 ? "bg-green-500" : "bg-red-400"}`} />
                <span className="text-muted-foreground">{tx.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-medium ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscriptionSection({
  user,
  memberSince,
  open,
  onToggle,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  memberSince: string;
  open: boolean;
  onToggle: () => void;
}) {
  const plan = user.plan || "FREE";
  const isPaid = plan !== "FREE";
  const planStyle = PLAN_LABELS[plan] || PLAN_LABELS.FREE;

  const [subLoading, setSubLoading] = useState(true);
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [transactions, setTransactions] = useState<{ type: string; amount: number; description: string; createdAt: string }[]>([]);

  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subError, setSubError] = useState("");
  const [subSuccess, setSubSuccess] = useState("");

  // Fetch subscription details and credit transactions
  useEffect(() => {
    let canceled = false;

    // Fetch transactions for all users
    api.getCreditTransactions()
      .then((txs) => { if (!canceled) setTransactions(txs); })
      .catch(() => {});

    if (!isPaid) {
      setSubLoading(false);
      return;
    }
    api
      .getSubscription()
      .then((sub) => {
        if (canceled) return;
        if (sub.currentPeriodEnd) {
          const date = new Date(sub.currentPeriodEnd);
          if (!isNaN(date.getTime())) {
            setRenewalDate(
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );
          }
        }
        setCancelAtPeriodEnd(sub.cancelAtPeriodEnd);
      })
      .catch(() => {})
      .finally(() => { if (!canceled) setSubLoading(false); });
    return () => { canceled = true; };
  }, [isPaid]);

  // Auto-clear success
  useEffect(() => {
    if (subSuccess) {
      const t = setTimeout(() => setSubSuccess(""), 4000);
      return () => clearTimeout(t);
    }
  }, [subSuccess]);

  const handleManageBilling = async () => {
    setSubError("");
    setBillingLoading(true);
    try {
      const { checkoutUrl } = await api.createBillingPortalSession();
      if (!checkoutUrl || !checkoutUrl.startsWith("https://")) {
        throw new Error("Invalid billing portal URL.");
      }
      window.location.href = checkoutUrl;
      setTimeout(() => setBillingLoading(false), 10000);
    } catch (err) {
      const apiError = err as ApiError;
      setSubError(apiError?.error || "Failed to open billing portal.");
      setBillingLoading(false);
    }
  };

  const handleCancel = async () => {
    setSubError("");
    setCancelLoading(true);
    try {
      const sub = await api.cancelSubscription();
      setCancelAtPeriodEnd(true);
      if (sub.currentPeriodEnd) {
        setRenewalDate(
          new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      }
      setShowCancelConfirm(false);
      setSubSuccess("Your subscription will cancel at the end of the current billing period.");
    } catch (err) {
      const apiError = err as ApiError;
      setSubError(apiError.error || "Failed to cancel subscription.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <Card>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <span className="text-[15px] font-medium">Subscription & Billing</span>
        </div>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
      <CardContent className="space-y-4 pt-0">
        <ErrorMessage message={subError} />
        <SuccessMessage message={subSuccess} />

        {/* Plan overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="mt-1 text-lg font-semibold">{planStyle.label}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits Balance</p>
            <p className="mt-1 text-lg font-semibold">{user.credits}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {isPaid && renewalDate
                ? cancelAtPeriodEnd
                  ? "Access Until"
                  : "Next Renewal"
                : "Member Since"}
            </p>
            <p className="mt-1 text-lg font-semibold">
              {subLoading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : isPaid && renewalDate ? (
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  {renewalDate}
                </span>
              ) : (
                memberSince
              )}
            </p>
          </div>
        </div>

        {/* Canceling banner */}
        {isPaid && cancelAtPeriodEnd && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div className="text-sm">
              <p className="font-medium text-yellow-700 dark:text-yellow-300">
                Your subscription is set to cancel
              </p>
              <p className="text-muted-foreground">
                You&apos;ll keep access to {planStyle.label} features until {renewalDate}.
                To continue your plan, visit the billing portal.
              </p>
            </div>
          </div>
        )}

        {/* Actions for paid users */}
        {isPaid && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={billingLoading}
            >
              {billingLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="size-3.5" />
                  Manage Billing
                </>
              )}
            </Button>

            {!cancelAtPeriodEnd && (
              <>
                {showCancelConfirm ? (
                  <div className="flex flex-col items-stretch gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center">
                    <p className="text-xs text-muted-foreground">Cancel at period end?</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancel}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCancelConfirm(false)}
                      disabled={cancelLoading}
                    >
                      Keep Plan
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </>
            )}

          </div>
        )}

        {/* Upgrade prompt for free users */}
        {!isPaid && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex-1">
              <p className="text-sm font-medium">Want more interview credits?</p>
              <p className="text-xs text-muted-foreground">
                Upgrade to unlock more practice sessions and premium features.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              View Plans
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {/* Credit History */}
        {transactions.length > 0 && (() => {
          const added = transactions.filter((tx) => tx.amount > 0);
          const used = transactions.filter((tx) => tx.amount < 0);
          return (
          <div className="mt-2 border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium">Credit History</p>
            <CreditHistoryTabs added={added} used={used} />
          </div>
          );
        })()}
      </CardContent>
      )}
    </Card>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuth();

  // ── Personal Info ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState("");
  const [personalError, setPersonalError] = useState("");

  // ── Preferences ──
  const [nativeLanguage, setNativeLanguage] = useState<import("@/types/api").NativeLanguage | null>(null);
  const [englishLevel, setEnglishLevel] = useState<import("@/types/api").EnglishLevel | null>(null);
  const [communicationChallenges, setCommunicationChallenges] = useState<import("@/types/api").CommunicationChallenge[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<DifficultyLevel | null>(null);
  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [mainLanguage, setMainLanguage] = useState<ProgrammingLanguage | null>(null);
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState("");
  const [prefError, setPrefError] = useState("");

  // ── Password ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // ── Collapsible sections ──
  const [personalOpen, setPersonalOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── Delete Account ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Initialize form values from user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setNativeLanguage(user.nativeLanguage);
      setEnglishLevel(user.englishLevel);
      setCommunicationChallenges(user.communicationChallenges || []);
      setExperienceLevel(user.experienceLevel);
      setRoleType(user.roleType);
      setMainLanguage(user.mainLanguage);
    }
  }, [user]);

  // Auto-clear success messages
  useEffect(() => {
    if (personalSuccess) {
      const t = setTimeout(() => setPersonalSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [personalSuccess]);

  useEffect(() => {
    if (prefSuccess) {
      const t = setTimeout(() => setPrefSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [prefSuccess]);

  useEffect(() => {
    if (pwSuccess) {
      const t = setTimeout(() => setPwSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [pwSuccess]);

  // ── Handlers ──

  const handlePersonalSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setPersonalError("");
    setPersonalSuccess("");
    setPersonalLoading(true);
    try {
      await api.updatePersonalInfo({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      await refreshProfile();
      setPersonalSuccess("Personal information updated.");
    } catch (err) {
      const apiError = err as ApiError;
      setPersonalError(apiError.error || "Failed to update personal information.");
    } finally {
      setPersonalLoading(false);
    }
  };

  const handlePrefSave = async () => {
    if (!experienceLevel || !roleType || !mainLanguage) return;
    setPrefError("");
    setPrefSuccess("");
    setPrefLoading(true);
    try {
      await api.updatePreferences({
        nativeLanguage: nativeLanguage!,
        englishLevel: englishLevel!,
        communicationChallenges: communicationChallenges,
        experienceLevel,
        roleType,
        mainLanguage,
      });
      await refreshProfile();
      setPrefSuccess("Practice preferences updated.");
    } catch (err) {
      const apiError = err as ApiError;
      setPrefError(apiError.error || "Failed to update preferences.");
    } finally {
      setPrefLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setPwError("");
    setPwSuccess("");

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword, confirmPassword });
      setPwSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const apiError = err as ApiError;
      setPwError(apiError.error || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await api.deleteAccount();
      logout();
      router.push("/");
    } catch (err) {
      const apiError = err as ApiError;
      setDeleteError(apiError.error || "Failed to delete account.");
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and practice preferences.
        </p>
      </div>

      {/* ── Section 1: Personal Information ── */}
      <Card>
        <button
          onClick={() => setPersonalOpen(!personalOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span className="text-[15px] font-medium">Personal Information</span>
          </div>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${personalOpen ? "rotate-180" : ""}`} />
        </button>
        {personalOpen && (
          <CardContent className="space-y-4 pt-0">
            <ErrorMessage message={personalError} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePersonalSave}
                disabled={personalLoading || !firstName.trim() || !lastName.trim()}
                size="sm"
              >
                {personalLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <SuccessMessage message={personalSuccess} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Section 2: Practice Preferences ── */}
      <Card>
        <button
          onClick={() => setPrefOpen(!prefOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-muted-foreground" />
            <span className="text-[15px] font-medium">Practice Preferences</span>
          </div>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${prefOpen ? "rotate-180" : ""}`} />
        </button>
        {prefOpen && (
          <CardContent className="space-y-6 pt-0">
            <ErrorMessage message={prefError} />
            <div className="space-y-3">
              <Label className="gap-1.5">
                <Gauge className="size-4" />
                Experience Level
              </Label>
              <OptionGrid
                options={EXPERIENCE_OPTIONS}
                value={experienceLevel}
                onChange={setExperienceLevel}
              />
            </div>
            <div className="space-y-3">
              <Label className="gap-1.5">
                <Briefcase className="size-4" />
                Role Type
              </Label>
              <OptionGrid
                options={ROLE_OPTIONS}
                value={roleType}
                onChange={setRoleType}
              />
            </div>
            <div className="space-y-3">
              <Label className="gap-1.5">
                <Code className="size-4" />
                Main Technology
              </Label>
              <OptionGrid
                options={LANGUAGE_OPTIONS}
                value={mainLanguage}
                onChange={setMainLanguage}
                columns={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrefSave}
                disabled={prefLoading || !experienceLevel || !roleType || !mainLanguage}
                size="sm"
              >
                {prefLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
              <SuccessMessage message={prefSuccess} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Section 3: Change Password ── */}
      <Card>
        <button
          onClick={() => setPasswordOpen(!passwordOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            <span className="text-[15px] font-medium">Change Password</span>
          </div>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${passwordOpen ? "rotate-180" : ""}`} />
        </button>
        {passwordOpen && (
          <CardContent className="pt-0">
            {!user.hasPassword ? (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  You signed in with Google. Password management is not available
                  for Google-authenticated accounts.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ErrorMessage message={pwError} />
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePasswordSave}
                    disabled={
                      pwLoading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    size="sm"
                  >
                    {pwLoading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                  <SuccessMessage message={pwSuccess} />
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Section 4: Subscription & Billing ── */}
      <SubscriptionSection user={user} memberSince={memberSince} open={subOpen} onToggle={() => setSubOpen(!subOpen)} />

      {/* ── Section 5: Delete Account ── */}
      <Card className="border-destructive/30">
        <button
          onClick={() => setDeleteOpen(!deleteOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-destructive" />
            <span className="text-[15px] font-medium text-destructive">Delete Account</span>
          </div>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${deleteOpen ? "rotate-180" : ""}`} />
        </button>
        {deleteOpen && (
          <CardContent className="space-y-4 pt-0">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <ErrorMessage message={deleteError} />
            {showDeleteConfirm ? (
              <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">
                      Are you sure you want to delete your account?
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      This will permanently delete your profile, interview history,
                      practice responses, and all other data. If you have an active
                      subscription, it will be canceled immediately.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete My Account"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="size-3.5" />
                Delete Account
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
