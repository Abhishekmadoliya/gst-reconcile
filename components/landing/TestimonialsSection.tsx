import Link from "next/link";
import { ShieldCheck, Cpu, Lock, CheckCircle2, FileSpreadsheet, ArrowRight, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
  const architecturalPillars = [
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: "In-Browser Web Worker Parsing",
      badge: "Zero-Latency Engine",
      description: "Match 20,000+ line purchase registers against GSTR-2B in under 15 seconds. High-performance multi-threaded processing runs in your browser without Excel freezing or row limits.",
      linkText: "Try Free Offline Recon",
      linkHref: "/free-tools/offline-reconciliation"
    },
    {
      icon: <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Zero Cloud Ledger Storage for Offline Tools",
      badge: "Privacy Guarantee",
      description: "When using our free offline tool, purchase registers and GSTR-2B JSON files are parsed in local device memory. No client ledger rows are stored on remote databases.",
      linkText: "Read Security Architecture",
      linkHref: "/about-us"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Section 16(2)(aa) & Rule 88D Compliance",
      badge: "Statutory Defense",
      description: "Categorizes every mismatch into actionable buckets: Exact Matches, Tolerance Typo Matches, Missing in 2B (Supplier Default), and Ineligible Section 17(5) items before filing GSTR-3B.",
      linkText: "DRC-01C Notice Guide",
      linkHref: "/drc-01c-notice"
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Standardized CA Audit Workpapers",
      badge: "One-Click Export",
      description: "Export clean, multi-tab audit workpapers ready for client review and GST assessment records, complete with mismatch tags, supplier GSTINs, and head-wise tax splits.",
      linkText: "View Pricing Plans",
      linkHref: "/pricing"
    }
  ];

  return (
    <section className="w-full py-20 bg-muted/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built For Precision Compliance</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-sans text-foreground tracking-tight">
            Why Tax Professionals Rely on TaxSolver Architecture
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Engineered specifically for Indian Chartered Accountants, tax consultants, and enterprise finance teams who demand deterministic accuracy and data privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {architecturalPillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="group relative bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {pillar.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <Link
                  href={pillar.linkHref}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:underline group/link"
                >
                  {pillar.linkText}
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 14-day trial callout banner */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              14-Day Free Trial &bull; Practitioner Tier Access
            </h4>
            <p className="text-sm text-muted-foreground">
              Enroll now with ₹0 payment and no credit card required. Experience multi-client reconciliation instantly.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors"
            >
              Compare Plans
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
