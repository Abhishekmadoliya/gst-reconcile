"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  HelpCircle, 
  Building2, 
  FileSpreadsheet, 
  Users, 
  Zap, 
  Calculator,
  Lock,
  ChevronDown,
  Clock,
  ExternalLink
} from "lucide-react";
import { PRICING_PLANS, PRICING_ADDONS, formatINR } from "@/lib/pricing-plans";

export default function PricingClient() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { isAuthenticated, user } = useAuthStore();

  // Fetch Firm Profile for Trial / Subscription status
  const { data: firmRes } = useQuery<{
    success: boolean;
    data: {
      id: string;
      name: string;
      plan: string;
      billingStatus: string;
      subscriptionExpiresAt?: string | null;
      createdAt?: string | null;
    };
  }>({
    queryKey: ["settings", "firm"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/settings/firm`);
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const firm = firmRes?.data;
  const isTrial = firm?.billingStatus === "trialing";
  const trialExpiryTime = firm?.subscriptionExpiresAt
    ? new Date(firm.subscriptionExpiresAt).getTime()
    : firm?.createdAt
    ? new Date(firm.createdAt).getTime() + 14 * 86400000
    : Date.now() + 14 * 86400000;
  const trialDaysRemaining = Math.max(
    0,
    Math.ceil((trialExpiryTime - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const faqs = [
    {
      q: "Can my firm claim 18% Input Tax Credit (ITC) on this TaxSolver subscription?",
      a: "Yes, absolutely. TaxSolver provides standard GST tax invoices with your firm's GSTIN included. You can claim full 18% ITC on your GSTR-3B filings under HSN/SAC code 998313 (Information Technology and Cloud Software Services)."
    },
    {
      q: "What happens if our CA practice outgrows the 25 GSTIN limit on Growth Desk?",
      a: "You do NOT need to upgrade to the Corporate plan immediately. You can simply add 'Additional GSTIN Buckets' (packs of 5 GSTINs for ₹5,000/year, i.e., ₹1,000/GSTIN/yr) at any time during checkout or directly from your firm settings."
    },
    {
      q: "Do unused invoice volumes roll over to the next month?",
      a: "Yes. In the Growth Desk and Corporate plans, extra invoice recharges have full rollover validity throughout your 1-year active subscription cycle so you never lose paid credits during off-peak tax periods."
    },
    {
      q: "How does the Automated Vendor Follow-up System work?",
      a: "When a reconciliation run detects missing or mismatched invoices, TaxSolver automatically compiles an itemized discrepancy schedule citing Section 16(2)(aa) of the CGST Act, 2017 and Rule 36(4). You can review and dispatch statutory notices to the supplier's registered email with one click, and track response status in real-time."
    },
    {
      q: "What payment methods are supported via Razorpay?",
      a: "We support all major Indian business payment channels via Razorpay: Corporate Net Banking (all major banks), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Corporate credit lines."
    }
  ];

  const comparisonRows = [
    {
      category: "Reconciliation & Matching Engine",
      items: [
        { name: "GSTR-2B vs Purchase Register Matching", practitioner: true, growth: true, corporate: true, enterprise: true },
        { name: "Direct Portal OTP Auto-fetch", practitioner: true, growth: true, corporate: true, enterprise: true },
        { name: "Multi-line Invoice Aggregation (Different tax rates)", practitioner: true, growth: true, corporate: true, enterprise: true },
        { name: "CDNR Credit & Debit Note Negative Matching", practitioner: true, growth: true, corporate: true, enterprise: true },
        { name: "Place of Supply / Head Mismatch (IGST vs CGST/SGST)", practitioner: false, growth: true, corporate: true, enterprise: true },
        { name: "Section 17(5) Ineligible Blocked ITC Filter", practitioner: false, growth: true, corporate: true, enterprise: true },
        { name: "Custom Tolerance & Fuzzy Number Matching", practitioner: false, growth: false, corporate: true, enterprise: true },
      ]
    },
    {
      category: "Vendor Communication & Compliance Desk",
      items: [
        { name: "Statutory PDF / Excel Notice Generator", practitioner: true, growth: true, corporate: true, enterprise: true },
        { name: "Automated Section 16(2)(aa) Email Notice Dispatch", practitioner: false, growth: true, corporate: true, enterprise: true },
        { name: "Real-time CA Audit Event Notifications", practitioner: false, growth: true, corporate: true, enterprise: true },
        { name: "Supplier Health Scorecard & At-Risk ITC Ranking", practitioner: false, growth: true, corporate: true, enterprise: true },
        { name: "Multi-stage Escalation & Payment Hold Rules", practitioner: false, growth: false, corporate: true, enterprise: true },
        { name: "Automated WhatsApp Autopilot (Meta Cloud API)", practitioner: false, growth: "Add-on", corporate: "Add-on", enterprise: true },
      ]
    },
    {
      category: "Limits, Team & Infrastructure",
      items: [
        { name: "Included Client GSTINs", practitioner: "5 GSTINs", growth: "25 GSTINs", corporate: "75 GSTINs", enterprise: "Unlimited" },
        { name: "Monthly Invoices Reconciled", practitioner: "3,000 / mo", growth: "20,000 / mo", corporate: "75,000 / mo", enterprise: "2,00,000+ / mo" },
        { name: "User Seats (CA + Article Trainees)", practitioner: "1 Seat", growth: "3 Seats", corporate: "8 Seats (RBAC)", enterprise: "Unlimited" },
        { name: "Statutory Audit Trail Retention", practitioner: "6 Months", growth: "2 Years", corporate: "7 Years", enterprise: "Permanent" },
        { name: "ERP Integrations (Tally, SAP, Zoho Books)", practitioner: false, growth: "Tally Prime", corporate: "Tally, SAP, Zoho", enterprise: "Custom Webhooks" },
        { name: "Support Channel", practitioner: "Email", growth: "Priority WhatsApp & Email", corporate: "Dedicated Account Mgr", enterprise: "24x7 Dedicated Architect" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Hero Header */}
      <section className="pt-16 pb-12 border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            <Sparkles className="h-3 w-3" />
            CA Firm &amp; Corporate Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Plans Designed to Eliminate ITC Leakage
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
            From solo practitioners to national enterprise networks. Transparent pricing with zero hidden fees and instant Razorpay activation.
          </p>

          {/* Billing Toggle Switch */}
          <div className="mt-8 inline-flex items-center p-1 bg-muted/60 border border-border rounded-xl">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual Billing
              <span className="ml-2 inline-block text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full">
                Save ~25%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic User Subscription / Trial Status Banner */}
        {isAuthenticated && isTrial ? (
          <div className="mb-10 p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 shadow-sm text-left animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Your Active Subscription Status: 14-Day Free Evaluation
                </div>
                <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  You are evaluating the <span className="text-amber-600 dark:text-amber-400">Practitioner Plan</span> — {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'} remaining
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  Your practice currently has full access to <strong>5 Client GSTIN slots</strong> and <strong>3,000 monthly reconciliation credits</strong> at ₹0. You can lock in annual rates or upgrade to the multi-seat <strong>Growth Desk</strong> at any point during your trial.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/billing"
                  className="px-4 py-2.5 rounded-xl bg-card hover:bg-muted text-xs font-bold border border-border text-foreground transition-all cursor-pointer shadow-xs"
                >
                  View Firm Usage &amp; Credits
                </Link>
                <Link
                  href="/checkout?plan=growth&billing=annual"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Upgrade to Growth Desk</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : isAuthenticated && firm ? (
          <div className="mb-10 p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-card to-emerald-500/5 shadow-sm text-left animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Active Subscribed Account
                </div>
                <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Your Firm is Subscribed to <span className="text-emerald-600 dark:text-emerald-400 uppercase">{firm.plan}</span>
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  Your statutory tax invoices and active subscription credits are managed under your firm portal. Need more GSTIN slots or invoice recharges? Add them modularly below.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/billing"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Manage Subscription in Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 p-4 rounded-xl border border-primary/25 bg-primary/5 text-center max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-primary uppercase tracking-wider text-[10px] bg-primary/10 px-2 py-0.5 rounded">
                <Sparkles className="h-3 w-3" /> 14-Day Free Trial
              </span>
              <span className="text-foreground font-semibold">
                All new accounts automatically receive full access to the <strong>Practitioner Tier</strong> free for 14 days. Zero upfront fee. No credit card required.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
            const monthlyEquivalent = billingCycle === "annual" ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;

            const isCurrentTrial = isTrial && plan.id === "practitioner";
            const isSubscribedPlan = !isTrial && firm?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border flex flex-col justify-between p-6 relative transition-all duration-200 bg-card ${
                  isCurrentTrial
                    ? "border-amber-500/80 ring-2 ring-amber-500/25 shadow-xl bg-gradient-to-b from-card via-card to-amber-500/[0.04]"
                    : isSubscribedPlan
                    ? "border-emerald-500/80 ring-2 ring-emerald-500/25 shadow-xl bg-gradient-to-b from-card via-card to-emerald-500/[0.04]"
                    : plan.popular
                    ? "border-primary shadow-xl ring-2 ring-primary/20 scale-100 lg:scale-[1.02] bg-gradient-to-b from-card via-card to-primary/[0.03]"
                    : "border-border shadow-sm hover:border-foreground/30 hover:shadow-md"
                }`}
              >
                {/* Badges */}
                {isCurrentTrial ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-600 text-white shadow-md border border-amber-400/30 flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <Clock className="h-3 w-3" /> Your Current Trial Tier ({trialDaysRemaining}d)
                  </span>
                ) : isSubscribedPlan ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-600 text-white shadow-md border border-emerald-400/30 flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <ShieldCheck className="h-3 w-3" /> Active Subscribed Plan
                  </span>
                ) : plan.popular ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-primary text-primary-foreground shadow-md border border-primary-foreground/20 shrink-0 whitespace-nowrap">
                    {plan.badge || "Most Popular for CA Firms"}
                  </span>
                ) : null}

                <div>
                  <div className="pb-4 border-b border-border/70">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-foreground">{plan.name}</h3>
                      {plan.id === "practitioner" && (
                        <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          14d Trial Tier
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 min-h-[38px] leading-relaxed">
                      {plan.tagline}
                    </p>
                    
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-foreground tracking-tight">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        /{billingCycle === "annual" ? "year" : "month"}
                      </span>
                    </div>

                    {billingCycle === "annual" && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        Equivalent to {formatINR(monthlyEquivalent)}/mo
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-[10px] font-semibold text-foreground/80">
                      <div className="bg-muted/50 px-2 py-1 rounded border border-border/60">
                        {plan.gstinDisplay}
                      </div>
                      <div className="bg-muted/50 px-2 py-1 rounded border border-border/60">
                        {plan.seatsDisplay}
                      </div>
                      <div className="col-span-2 bg-muted/50 px-2 py-1 rounded border border-border/60 truncate">
                        {plan.invoiceDisplay}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-foreground/85 leading-snug">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 space-y-3">
                  {plan.valueMath && (
                    <div className="p-2.5 rounded-lg bg-muted/40 text-[10px] text-muted-foreground font-medium border-l-2 border-primary/50 leading-relaxed">
                      {plan.valueMath}
                    </div>
                  )}

                  {/* Dynamic CTA depending on auth and subscription state */}
                  {isSubscribedPlan ? (
                    <Link
                      href="/dashboard/billing"
                      className="w-full flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-bold rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Current Active Plan</span>
                    </Link>
                  ) : isCurrentTrial ? (
                    <div className="space-y-2">
                      <Link
                        href={`/checkout?plan=practitioner&billing=${billingCycle}`}
                        className="w-full flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-md"
                      >
                        <span>Lock In Annual Plan</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <p className="text-[10px] text-center text-muted-foreground font-medium">
                        Active in Trial &bull; {trialDaysRemaining} days remaining
                      </p>
                    </div>
                  ) : !isAuthenticated ? (
                    <Link
                      href={plan.id === "practitioner" ? "/register" : `/checkout?plan=${plan.id}&billing=${billingCycle}`}
                      className={`w-full flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer shadow-sm ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/25 hover:shadow-md"
                          : "border border-border bg-card hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{plan.id === "practitioner" ? "Start 14-Day Free Trial" : plan.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout?plan=${plan.id}&billing=${billingCycle}`}
                      className={`w-full flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer shadow-sm ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/25 hover:shadow-md"
                          : "border border-border bg-card hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{isTrial ? `Upgrade to ${plan.name}` : plan.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add-on Packs Section */}
      <section className="py-12 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded">
              Modular Expansion
            </span>
            <h2 className="text-2xl font-bold text-foreground mt-2">
              Flexible Add-ons for Scaling Practices
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Add-ons can be selected alongside any base plan during checkout or activated later as your client volume grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                    {addon.badge}
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    {formatINR(addon.priceAnnual)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mt-3">{addon.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {addon.description}
                </p>
                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Unit: {addon.unit}</span>
                  <Link
                    href={`/checkout?plan=growth&billing=annual`}
                    className="text-primary font-bold hover:underline"
                  >
                    Add at Checkout &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Feature Comparison Matrix */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-foreground">
            Complete Feature Comparison Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Compare matching capabilities, vendor follow-up tools, and audit security across all plans.
          </p>
        </div>

        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="p-4 font-bold text-foreground w-1/3">Feature / Capability</th>
                  <th className="p-4 font-bold text-foreground text-center">Practitioner</th>
                  <th className="p-4 font-bold text-primary text-center bg-primary/5">Growth Desk</th>
                  <th className="p-4 font-bold text-foreground text-center">Corporate Shield</th>
                  <th className="p-4 font-bold text-foreground text-center">Enterprise GSP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((cat, catIdx) => (
                  <Fragment key={catIdx}>
                    <tr className="bg-muted/30 border-y border-border">
                      <td colSpan={5} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-foreground/80">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, itemIdx) => (
                      <tr key={itemIdx} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-medium text-foreground/90">{item.name}</td>
                        
                        {/* Practitioner */}
                        <td className="p-3.5 text-center">
                          {typeof item.practitioner === "boolean" ? (
                            item.practitioner ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="font-semibold text-foreground/80">{item.practitioner}</span>
                          )}
                        </td>

                        {/* Growth Desk */}
                        <td className="p-3.5 text-center bg-primary/[0.03]">
                          {typeof item.growth === "boolean" ? (
                            item.growth ? (
                              <Check className="h-4 w-4 text-primary mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold text-primary">{item.growth}</span>
                          )}
                        </td>

                        {/* Corporate Shield */}
                        <td className="p-3.5 text-center">
                          {typeof item.corporate === "boolean" ? (
                            item.corporate ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="font-semibold text-foreground/80">{item.corporate}</span>
                          )}
                        </td>

                        {/* Enterprise GSP */}
                        <td className="p-3.5 text-center">
                          {typeof item.enterprise === "boolean" ? (
                            item.enterprise ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold text-foreground">{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="text-center mb-10">
          <HelpCircle className="h-6 w-6 text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Billing Questions</h2>
          <p className="text-xs text-muted-foreground mt-1">Everything you need to know about subscriptions, tax invoices, and limits.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-border rounded-xl bg-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-foreground hover:bg-muted/30 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Security Banner */}
      <section className="py-12 bg-muted/40 border-t border-border text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>TLS 1.3 / AES-256 GCM Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Licensed GSP Infrastructure (Sandbox / MasterGST)</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>18% ITC Claim Eligible on Tax Invoices</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

