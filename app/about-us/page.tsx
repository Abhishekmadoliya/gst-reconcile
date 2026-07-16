import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  Users,
  Lock,
  Search,
  ArrowRight,
  Database
} from "lucide-react";

export const metadata: Metadata = {
  title: "About TaxSolver - Smart GST Reconciliation Platform",
  description: "Learn how TaxSolver helps Chartered Accountants, corporate finance teams, and SMEs automate GSTR-2B reconciliation, audit ITC discrepancies, and manage CGST compliance.",
  keywords: ["about TaxSolver", "GST reconciliation engine", "CA audit tool history", "GSP tax compliance software"],
  alternates: {
    canonical: "https://taxsolver.in/about-us",
  },
  openGraph: {
    title: "About TaxSolver - Smart GST Reconciliation Platform",
    description: "Learn how TaxSolver helps Chartered Accountants, corporate finance teams, and SMEs automate GSTR-2B reconciliation, audit ITC discrepancies, and manage CGST compliance.",
    type: "website",
    url: "https://taxsolver.in/about-us",
  }
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card/30 to-background border-b border-border/50 py-20 md:py-28 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.06),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary mb-4">
              <Cpu className="h-3 w-3" />
              Our Core Technology
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground">
              Reconciling compliance with autopilot
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              TaxSolver is an enterprise-grade reconciliation and tax auditing utility built for Chartered Accountants, corporate tax teams, and growing businesses in India. We eliminate manual VLOOKUP errors, reduce filing time from hours to seconds, and protect your Input Tax Credit (ITC) from tax leakage.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy & Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight">
              Solving the complexity of GSTR-2B matching
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              With the introduction of strict CGST rules, claiming Input Tax Credit (ITC) has become a compliance bottleneck. Claiming ITC on missing or incorrect supplier invoices leads to costly demand notices (like DRC-01C), while failing to reconcile registers results in unclaimed cash blockages.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              TaxSolver was engineered to bridge this gap. By offering a free browser-based offline reconciliation tool alongside a full-featured GSP-connected cloud dashboard, we enable tax teams of any size to perform audits securely and easily.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border bg-card/30 rounded-xl p-5 shadow-xs">
              <span className="text-2xl md:text-3xl font-black text-primary block">15 Sec</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">Average Run Time</span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Processes thousands of invoice entries in seconds.</p>
            </div>
            
            <div className="border border-border bg-card/30 rounded-xl p-5 shadow-xs">
              <span className="text-2xl md:text-3xl font-black text-emerald-500 block">100%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">Private Sandbox</span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Offline uploads run entirely in your local browser cache.</p>
            </div>

            <div className="border border-border bg-card/30 rounded-xl p-5 shadow-xs">
              <span className="text-2xl md:text-3xl font-black text-primary block">₹0</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">Cost for Offline Tool</span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Free matching utilities available for small tax teams.</p>
            </div>

            <div className="border border-border bg-card/30 rounded-xl p-5 shadow-xs">
              <span className="text-2xl md:text-3xl font-black text-indigo-500 block">SOC-2</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">Data Security</span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">End-to-end encrypted tunnels for all API transactions.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-20 bg-muted/20 border-t border-b border-border/50 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black font-sans tracking-tight mb-4">
              Engineered for absolute accuracy
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              TaxSolver combines multiple algorithmic modules to deliver precise discrepancy detection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Fuzzy Matching Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Handles spelling differences in supplier names, invoice numbering prefixes, and round-off discrepancies automatically using multi-key scoring models.
              </p>
            </div>

            {/* 2 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Privacy-First Offline Matcher</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reconcile your books spreadsheet against GSTR-2B JSON locally in your browser memory. Your private client financial data never leaves your workspace.
              </p>
            </div>

            {/* 3 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Licensed GSP Core</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integrates directly with government-authorized GST API networks (GSPs) to pull authentic live invoice details for GSTR-2B, GSTR-3B, and GSTR-1.
              </p>
            </div>

            {/* 4 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Supplier Filing Grades</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track supplier filing frequency and grade their reliability, giving you instant insight into which suppliers are lagging behind on tax compliance.
              </p>
            </div>

            {/* 5 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Notice Risk Diagnostics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluate your books mismatch percentage against strict GSTR-3B filing margins to assess notice risks under CGST Rule 88C and Rule 88D.
              </p>
            </div>

            {/* 6 */}
            <div className="space-y-4">
              <div className="h-10 w-10 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold">Compliance-Ready Reports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate itemized reports categorized cleanly into amount mismatches, missing items, and unclaimed values, exportable directly to Excel or PDF.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Safety and Infrastructure Reassurance */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-left">
        <div className="border border-border/80 bg-card/40 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_right_bottom,rgba(16,185,129,0.03),transparent)]"></div>
          
          <div className="relative max-w-2xl">
            <h3 className="text-lg md:text-xl font-bold mb-3">Enterprise-Grade Security Architecture</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              TaxSolver is built using cloud configurations matching banking-level guidelines. We support multi-tenant CA client workspaces, dynamic audit tracking logs, and direct database queries that guarantee your business and supplier data is always secure, isolated, and private.
            </p>
            <div className="flex gap-4">
              <Link
                href="/free-tools/offline-reconciliation"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
              >
                Use Offline Recon
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-5 text-xs font-semibold transition-all"
              >
                Talk to Support
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
