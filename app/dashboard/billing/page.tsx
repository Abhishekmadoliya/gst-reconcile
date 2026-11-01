"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { PRICING_PLANS, formatINR, Plan } from "@/lib/pricing-plans";
import {
  CreditCard,
  Check,
  Building,
  Loader2,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Clock,
  Gift,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface FirmProfile {
  id: string;
  name: string;
  plan: string;
  gstinLimit: number;
  invoiceBalance: number;
  whatsappCredits: number;
  billingCycle: "annual" | "monthly";
  billingStatus: string;
  subscriptionExpiresAt?: string | null;
  createdAt?: string | null;
}

interface PaymentOrderRow {
  id: string;
  orderNumber: string;
  invoiceNumber: string | null;
  planName: string;
  billingCycle: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export default function BillingPage() {
  const [cycleToggle, setCycleToggle] = useState<"annual" | "monthly">("annual");

  // 1. Fetch Firm Profile (Plan, Quotas, Limits, Status)
  const { data: firmRes, isLoading: isFirmLoading } = useQuery<{ success: boolean; data: FirmProfile }>({
    queryKey: ["settings", "firm"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/settings/firm`);
      return res.data;
    },
  });

  // 2. Fetch Connected GSTINs
  const { data: gstinsRes, isLoading: isGstinsLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  // 3. Fetch Billing / Payment Orders History
  const { data: ordersRes, isLoading: isOrdersLoading } = useQuery<{ success: boolean; data: PaymentOrderRow[] }>({
    queryKey: ["payments", "orders"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/payments/orders`);
      return res.data;
    },
  });

  const firm = firmRes?.data;
  const gstins = gstinsRes?.data || [];
  const orders = ordersRes?.data || [];

  const gstinsCount = gstins.length;
  const maxGstinsLimit = firm?.gstinLimit || 5;
  const quotaPct = Math.min(Math.round((gstinsCount * 100) / maxGstinsLimit), 100);

  const activePlanId = firm?.plan?.toLowerCase() || "practitioner";
  const isTrial = firm?.billingStatus === "trialing";

  // Calculate Trial timeline
  const trialExpiryTime = firm?.subscriptionExpiresAt
    ? new Date(firm.subscriptionExpiresAt).getTime()
    : firm?.createdAt
    ? new Date(firm.createdAt).getTime() + 14 * 86400000
    : Date.now() + 14 * 86400000;

  const trialDaysRemaining = Math.max(
    0,
    Math.ceil((trialExpiryTime - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const trialDaysPassed = Math.min(14, Math.max(1, 14 - trialDaysRemaining));
  const trialProgressPct = Math.round((trialDaysPassed / 14) * 100);

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP TRIAL OR SUBSCRIPTION STATUS BANNER */}
      {isTrial ? (
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white dark:text-black">
                  <Gift className="h-3 w-3" /> 14-Day Complimentary Evaluation
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <Clock className="h-3 w-3" /> {trialDaysRemaining} days remaining
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                Your firm is currently evaluating TaxSolver on the Practitioner Plan
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Full complimentary access to the 3-Tier Reconciliation Engine, 5 Client GSTIN slots, and 3,000 monthly invoices.{" "}
                <strong className="text-foreground">No credit card has been charged.</strong> Activate a paid subscription below anytime to ensure uninterrupted access.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <Link
                href={`/checkout?plan=practitioner&billing=${cycleToggle}`}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Activate Practitioner ({formatINR(cycleToggle === "annual" ? 9999 : 1199)}/{cycleToggle === "annual" ? "yr" : "mo"})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/checkout?plan=growth&billing=${cycleToggle}`}
                className="px-3 py-2 border border-border hover:border-primary text-foreground hover:text-primary text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Upgrade to Growth Desk</span>
              </Link>
            </div>
          </div>

          {/* Trial Progress Bar */}
          <div className="pt-2 border-t border-amber-500/20">
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1">
              <span>Trial Evaluation Timeline: <strong className="text-foreground">Day {trialDaysPassed} of 14</strong></span>
              <span>{trialDaysRemaining} days remaining until evaluation ends</span>
            </div>
            <div className="w-full bg-amber-500/20 rounded-none h-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${trialProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
                <ShieldCheck className="h-3 w-3" /> Active Paid Subscription
              </span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                Billed {firm?.billingCycle || "Annual"}
              </span>
            </div>
            <h2 className="text-base font-bold text-foreground">
              {firm?.name || "Your Firm"} &bull; {firm?.plan ? firm.plan.toUpperCase() : "PRACTITIONER"} TIER
            </h2>
            <p className="text-xs text-muted-foreground">
              Statutory enterprise compliance active. Entitlement quotas: {firm?.gstinLimit} GSTINs, {firm?.invoiceBalance ? firm.invoiceBalance.toLocaleString("en-IN") : "3,000"} monthly invoices.
            </p>
          </div>
          <Link
            href="/checkout?plan=growth&billing=annual"
            className="px-3.5 py-2 border border-border hover:border-primary text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1 text-foreground hover:text-primary shrink-0"
          >
            <span>Upgrade Quotas / Add-ons</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 2. QUOTA & BALANCE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* GSTIN Quota Progress Card */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-primary" /> Active Client GSTINs
            </span>
            <span className="font-bold text-foreground font-mono">
              {gstinsCount} / {maxGstinsLimit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-none h-2 overflow-hidden border border-border/20">
            <div
              className={`h-full transition-all duration-300 ${
                quotaPct > 90 ? "bg-red-500" : quotaPct > 70 ? "bg-yellow-500" : "bg-emerald-500"
              }`}
              style={{ width: `${quotaPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground flex justify-between">
            <span>Utilization: <strong className="text-foreground">{quotaPct}%</strong></span>
            <span>{maxGstinsLimit - gstinsCount} slots remaining</span>
          </p>
        </div>

        {/* Invoices Credit Balance */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Monthly Invoices Available
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-foreground">
              {firm?.invoiceBalance ? firm.invoiceBalance.toLocaleString("en-IN") : "3,000"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Invoices</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isTrial ? "Full quota allocated for trial period" : "Fast O(1) indexed matching with multi-line aggregation"}
          </p>
        </div>

        {/* WhatsApp Notification Credits */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-500" /> Automated Vendor Follow-up Credits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-foreground">
              {firm?.whatsappCredits !== undefined ? firm.whatsappCredits.toLocaleString("en-IN") : "0"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Credits</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isTrial ? "Available upon activating Growth Desk or add-on packs" : "Dispatches automated compliance reminders & notices"}
          </p>
        </div>
      </div>

      {/* 3. PLANS GRID & STATUTORY INVOICES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan tiers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Subscription Plans & Upgrades
            </h3>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 border border-border rounded-sm text-[10px]">
              <button
                type="button"
                onClick={() => setCycleToggle("monthly")}
                className={`px-2.5 py-1 font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                  cycleToggle === "monthly" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycleToggle("annual")}
                className={`px-2.5 py-1 font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  cycleToggle === "annual" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Annual <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 rounded-xs">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRICING_PLANS.map((plan: Plan) => {
              const isPlanMatch =
                activePlanId === plan.id ||
                (activePlanId === "ca_starter" && plan.id === "growth") ||
                (activePlanId === "ca_pro" && plan.id === "corporate") ||
                (activePlanId === "solo" && plan.id === "practitioner");

              const price = cycleToggle === "annual" ? plan.priceAnnual : plan.priceMonthly;
              const periodLabel = cycleToggle === "annual" ? "year" : "month";

              const isTrialActiveTier = isPlanMatch && isTrial;
              const isPaidActiveTier = isPlanMatch && !isTrial;

              return (
                <div
                  key={plan.id}
                  className={`p-4 bg-card border rounded-sm flex flex-col justify-between relative overflow-hidden transition-all ${
                    isTrialActiveTier
                      ? "border-amber-500/60 shadow-xs bg-amber-500/2"
                      : isPaidActiveTier
                      ? "border-emerald-500/60 shadow-xs bg-emerald-500/2"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {/* Badges */}
                  {isTrialActiveTier && (
                    <span className="absolute top-2 right-2 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-xs tracking-wider flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> Trial Evaluation Tier
                    </span>
                  )}
                  {isPaidActiveTier && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-xs tracking-wider flex items-center gap-1">
                      <Check className="h-2.5 w-2.5" /> Current Subscribed Plan
                    </span>
                  )}
                  {plan.badge && !isPlanMatch && (
                    <span className="absolute top-2 right-2 bg-muted text-foreground text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-xs border border-border">
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      {plan.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {plan.tagline}
                    </p>

                    <div className="mt-3 flex items-baseline">
                      <span className="text-xl font-bold font-mono text-foreground">
                        {formatINR(price)}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1 font-mono">
                        /{periodLabel} + GST
                      </span>
                    </div>

                    {isTrialActiveTier && (
                      <p className="text-[9.5px] text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
                        Evaluating for ₹0 during 14-day trial
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-sans">Clients:</span>
                        <strong className="text-foreground">{plan.gstinDisplay}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-sans">Capacity:</span>
                        <strong className="text-foreground">{plan.invoiceDisplay}</strong>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
                      {plan.features.slice(0, 5).map((feat) => (
                        <li key={feat} className="flex items-start gap-1.5 leading-snug">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40">
                    {isPaidActiveTier ? (
                      <div className="w-full py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Subscribed & Active</span>
                      </div>
                    ) : isTrialActiveTier ? (
                      <Link
                        href={`/checkout?plan=${plan.id}&billing=${cycleToggle}`}
                        className="w-full flex items-center justify-center gap-1 py-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Activate Practitioner ({formatINR(price)})</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?plan=${plan.id}&billing=${cycleToggle}`}
                        className="w-full flex items-center justify-center gap-1 py-1.5 border border-border hover:border-primary text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer text-foreground hover:text-primary bg-card hover:bg-muted/20"
                      >
                        <span>{plan.cta || `Upgrade to ${plan.name}`}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice & Order History */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" /> Tax Invoices & Orders
            </h3>
            <span className="text-[9px] font-mono font-bold text-muted-foreground">
              {orders.length} Records
            </span>
          </div>

          {isOrdersLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[10px] uppercase font-bold">Loading billing history…</span>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-2.5">
              {orders.map((inv) => (
                <div
                  key={inv.id}
                  className="p-2.5 border border-border rounded-sm bg-muted/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-foreground">
                        {inv.invoiceNumber || inv.orderNumber}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-mono">
                        {new Date(inv.paidAt || inv.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-foreground">
                        {formatINR(inv.totalAmount)}
                      </p>
                      <span className="inline-block text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {inv.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                    <span className="capitalize">{inv.planName} ({inv.billingCycle})</span>
                    <Link
                      href={`/checkout?plan=${inv.planName.toLowerCase()}`}
                      className="text-primary hover:underline flex items-center gap-0.5 text-[9px] uppercase font-bold"
                    >
                      Receipt <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : isTrial ? (
            <div className="p-3.5 border border-dashed border-amber-500/40 rounded-sm bg-amber-500/5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> Evaluation Voucher
                </span>
                <span className="text-[8px] font-mono font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-xs border border-amber-500/30">
                  COMPLIMENTARY
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/30 pt-2 font-mono">
                <div className="flex justify-between">
                  <span>Trial Period:</span>
                  <strong className="text-foreground">14 Days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Amount Charged:</span>
                  <strong className="text-foreground">₹0.00 (Zero Card Charged)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Entitlement Quota:</span>
                  <strong className="text-foreground">5 GSTINs · 3,000 Invoices</strong>
                </div>
                <div className="flex justify-between">
                  <span>Billing Status:</span>
                  <strong className="text-amber-600 dark:text-amber-400">Trial Active ({trialDaysRemaining}d left)</strong>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed pt-1 border-t border-border/20">
                All statutory GST Tax Invoices (with your firm's GSTIN for input tax credit claims) will be generated and archived here once you activate a paid plan.
              </p>

              <Link
                href={`/checkout?plan=practitioner&billing=${cycleToggle}`}
                className="w-full flex items-center justify-center gap-1 py-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                <span>Activate Paid Plan</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                No Past Billing Transactions
              </p>
              <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                All statutory GST invoices will be generated and archived here upon plan purchase.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Browse Plan Pricing <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. TRIAL & BILLING CLARIFICATION SECTION */}
      <div className="p-4 bg-card border border-border rounded-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-3">
          <HelpCircle className="h-3.5 w-3.5 text-primary" /> Frequently Asked Billing & Trial Questions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold text-foreground">Is my credit card charged during trial?</h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              No credit card is required. You get a full 14-day evaluation with 5 GSTIN slots and 3,000 invoices completely complimentary.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold text-foreground">What happens when the 14-day trial ends?</h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Your client data and past reconciliation workpapers remain 100% safe. You can activate Practitioner or Growth Desk at any time to resume running new audits.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold text-foreground">Can my firm claim GST Input Tax Credit?</h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Yes! All paid invoices are statutory B2B Tax Invoices with GST breakdown (IGST/CGST/SGST), enabling full ITC claims for your practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
