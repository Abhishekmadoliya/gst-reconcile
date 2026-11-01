"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useRef, useEffect } from "react";
import { LogOut, Sparkles, ArrowRight, ChevronDown, Wrench, Calculator, Calendar, FileSpreadsheet, FileText, Scale } from "lucide-react";
import TaxSolverLogo from "../logos/v1";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide the marketing header on dashboard workspace and auth pages
  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding"
  ) {
    return null;
  }

  const freeTools = [
    {
      title: "Offline Reconciliation",
      description: "100% private in-browser GSTR-2B matcher",
      href: "/free-tools/offline-reconciliation",
      icon: <FileSpreadsheet className="h-4 w-4 text-primary" />
    },
    {
      title: "ITC Mismatch Calculator",
      description: "Calculate Section 50 interest exposure",
      href: "/free-tools/itc-calculator",
      icon: <Calculator className="h-4 w-4 text-emerald-500" />
    },
    {
      title: "GST Due Date Calendar",
      description: "FY 2026-27 compliance cutoffs & reminders",
      href: "/gst-due-date-calender",
      icon: <Calendar className="h-4 w-4 text-indigo-500" />
    },
    {
      title: "Late Fee & Interest Calculator",
      description: "CGST/SGST late fees & 18% p.a. interest",
      href: "/gst-late-fee-calculator",
      icon: <Scale className="h-4 w-4 text-amber-500" />
    },
    {
      title: "GST Invoice Generator",
      description: "Generate compliant tax invoices & print PDF",
      href: "/invoice-generator",
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      title: "DRC-01C Notice Guide",
      description: "Rule 88D 7-day reply procedure & DRC-03",
      href: "/drc-01c-notice",
      icon: <Wrench className="h-4 w-4 text-purple-500" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo and primary navigation links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono font-semibold tracking-tight text-lg text-foreground hover:opacity-95 transition-opacity"
          >
            <TaxSolverLogo size={28} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/gstr-2b-reconciliation"
              className={`text-xs font-medium transition-colors hover:text-foreground relative py-1 ${
                pathname === "/gstr-2b-reconciliation"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              GSTR-2B Engine
            </Link>

            <Link
              href="/pricing"
              className={`text-xs font-medium transition-colors hover:text-foreground relative py-1 ${
                pathname === "/pricing"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Pricing
              <span className="ml-1.5 inline-block text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                14d Free
              </span>
            </Link>

            {/* Free Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`text-xs font-medium transition-colors hover:text-foreground inline-flex items-center gap-1 py-1 cursor-pointer ${
                  pathname.startsWith("/free-tools") || pathname === "/gst-due-date-calender" || pathname === "/gst-late-fee-calculator" || pathname === "/invoice-generator" || pathname === "/drc-01c-notice"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <span>Free Tools</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="grid grid-cols-1 gap-1">
                    {freeTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/70 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-md bg-muted/80 border border-border/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary/30">
                          {tool.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {tool.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/compare/cleartax-vs-taxsolver"
              className={`text-xs font-medium transition-colors hover:text-foreground relative py-1 ${
                pathname.startsWith("/compare")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Compare
            </Link>

            <Link
              href="/blog"
              className={`text-xs font-medium transition-colors hover:text-foreground relative py-1 ${
                pathname.startsWith("/blog")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Blog
            </Link>
          </nav>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Conditional auth layout */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User Profile display */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-bold text-foreground truncate max-w-[130px]">
                  {user.name}
                </span>
                <span className="text-[9px] text-muted-foreground truncate max-w-[130px]">
                  {user.firmName || "CA Firm"}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <span>Try 14 Days Free</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
