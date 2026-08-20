"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, LayoutDashboard, MessageSquareText, User, CreditCard, Shield } from "lucide-react";
import { CreditBadge } from "@/components/credit-badge";

export function AppNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/dashboard" className="flex items-center gap-1 text-lg font-bold tracking-tight">
            <Image src="/logo-icon.png" alt="FluentHire logo" width={36} height={36} unoptimized className="dark:hidden" />
            <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={36} height={36} unoptimized className="hidden dark:block" />
            <span>Fluent<span className="text-gradient">Hire</span></span>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/practice" />}
            >
              <MessageSquareText className="size-4" />
              <span className="hidden sm:inline">Practice</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              <CreditCard className="size-4" />
              <span className="hidden sm:inline">Pricing</span>
            </Button>
            {user?.role === "ADMIN" && (
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/admin" />}
              >
                <Shield className="size-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <>
              <CreditBadge />
              <Link
                href="/profile"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline"
              >
                {user.firstName} {user.lastName}
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                className="sm:hidden"
                nativeButton={false}
                render={<Link href="/profile" />}
              >
                <User className="size-4" />
              </Button>
            </>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
            <LogOut className="size-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
