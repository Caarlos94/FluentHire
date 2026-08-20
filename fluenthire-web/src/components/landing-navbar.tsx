"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          <Image src="/logo-icon.png" alt="FluentHire logo" width={44} height={44} unoptimized className="dark:hidden" />
          <Image src="/logo-icon-dark.png" alt="FluentHire logo" width={44} height={44} unoptimized className="hidden dark:block" />
          <span>Fluent<span className="text-gradient">Hire</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Desktop buttons */}
          <Button variant="ghost" size="lg" nativeButton={false} render={<Link href="/login" />} className="hidden md:inline-flex">
            Log In
          </Button>
          <Link
            href="/register"
            className="btn-gradient hidden h-9 items-center gap-1.5 rounded-full px-5 text-sm font-medium md:inline-flex"
          >
            Start Practicing Free
            <ArrowRight className="size-4" />
          </Link>

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setOpen(!open)}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed left-0 right-0 top-16 z-50 border-b border-border bg-background px-6 pb-6 pt-4 shadow-lg transition-all duration-200 md:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex gap-4 px-3">
          <Link
            href="/terms"
            onClick={() => setOpen(false)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
        </div>

        <div className="mt-4 border-t border-border pt-4 space-y-3">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Log In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="btn-gradient flex h-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium"
          >
            Start Practicing Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
