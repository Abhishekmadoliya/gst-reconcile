import ReconSandbox from "./ReconSandbox";
import Link from "next/link";
import { ShieldCheck, Zap, Database, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-14 lg:py-16 border-b border-border bg-gradient-to-b from-muted/20 via-background to-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Value Proposition Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/25 bg-primary/10 rounded-full text-[11px] font-bold text-primary tracking-wide w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>GSTR-2B Reconciliation Software &bull; 14-Day Free Evaluation</span>
            </div>

            {/* Main Product Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans text-foreground mt-4 tracking-tight leading-[1.12]">
              GSTR-2B Reconciliation Software Built for Indian CA Firms
            </h1>

            {/* Value description */}
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Match 10,000+ purchase invoices against GST portal GSTR-2B data in under 15 seconds. Detect ITC mismatches, eliminate DRC-01C notices &amp; Section 50 penalties, and automate supplier discrepancy notices.
            </p>

            {/* Free Trial Callout Banner */}
            <div className="mt-5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>14-Day Free Trial:</strong> Full <strong>Practitioner Tier</strong> access included at ₹0. Reconcile up to 5 Client GSTINs and 3,000 monthly invoices with zero upfront commitment.
              </span>
            </div>

            {/* Core benefits checklist */}
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5 text-xs text-foreground/85">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Authorized GSP Portal Fetch:</strong> Live OTP &amp; direct JSON return handshake via licensed GSP pipelines (Sandbox.co.in &amp; MasterGST).
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground/85">
                <Database className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Seamless ERP Normalization:</strong> One-click import for Tally Prime, Busy, Zoho Books, SAP, and custom Excel purchase registers.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground/85">
                <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Section 16(2)(aa) Vendor Follow-ups:</strong> Auto-draft statutory discrepancy schedules and dispatch email/WhatsApp recovery notices in 1 click.
                </span>
              </li>
            </ul>

            {/* High-Converting CTA Buttons */}
            <div className="mt-8 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all cursor-pointer gap-2"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  View Plan Pricing
                </Link>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Instant activation
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* Trust and Technical Infrastructure */}
            <div className="mt-8 pt-5 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Government Certified GSP Network &bull; Bank-Grade Security
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <div className="text-[11px] font-mono border border-border/80 px-2.5 py-1 rounded-lg bg-card text-foreground/80 shadow-xs">
                  Sandbox.co.in API
                </div>
                <div className="text-[11px] font-mono border border-border/80 px-2.5 py-1 rounded-lg bg-card text-foreground/80 shadow-xs">
                  MasterGST Node
                </div>
                <div className="text-[11px] font-mono border border-border/80 px-2.5 py-1 rounded-lg bg-card text-foreground/80 shadow-xs">
                  AES-256-GCM Encrypted
                </div>
                <div className="text-[11px] font-mono border border-border/80 px-2.5 py-1 rounded-lg bg-card text-foreground/80 shadow-xs">
                  GSTIN Validation API
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Sandbox Column */}
          <div className="lg:col-span-7 w-full lg:sticky lg:top-24">
            <div id="demo" className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
              {/* Windows Window frame for layout aesthetics */}
              <div className="bg-muted px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                  <span className="text-[10px] font-mono text-muted-foreground ml-2">
                    taxsolver // gstr-2b-reconcile-engine
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Live Sandbox Mode
                </span>
              </div>
              <ReconSandbox />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
