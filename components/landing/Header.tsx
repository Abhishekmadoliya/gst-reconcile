"use client";

import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, User } from "lucide-react";
import TaxSolverLogo from "../logos/v1";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo and navigation links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-mono font-semibold tracking-tight text-lg text-foreground hover:opacity-95 transition-opacity">
            <TaxSolverLogo size={28} />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/free-tools/offline-reconciliation" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Try Free GST Reconciliation <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link href="/gst-due-date-calender" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              GST Due Date Calender <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link href="/free-tools/itc-calculator" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              ITC Calculator <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link href="/blog" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-4">

          {/* Active GSP indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 border border-border bg-muted/40 rounded-md text-[9px] uppercase tracking-wider text-foreground/80 font-bold">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="hidden lg:inline">GSP: Sandbox.co.in</span>
            <span className="lg:hidden">Sandbox</span>
          </div>

          <ThemeToggle />

          {/* Conditional auth layout */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User Profile display */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-bold text-foreground truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">
                  {user.firmName || "CA Firm"}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors cursor-pointer"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
