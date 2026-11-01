"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Shield, Building2, Users, FileSpreadsheet, MessageSquare, Layers } from "lucide-react";
import { PRICING_PLANS, PRICING_ADDONS, formatINR } from "@/lib/pricing-plans";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  return (
    <section id="pricing" className="py-20 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            <Sparkles className="h-3 w-3" />
            Transparent Pricing Structured for ROI
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Stop Losing Working Capital to Mismatched ITC
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            Choose the plan that fits your practice or enterprise. Every tier includes our 3-tier GSTR-2B matching engine and direct portal fetch.
          </p>

          {/* Billing Switcher */}
          <div className="mt-7 inline-flex items-center p-1 bg-muted/60 border border-border rounded-xl">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual Billing
              <span className="ml-1.5 inline-block text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                Save ~25%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
          </div>

          {/* Complimentary Trial Announcement */}
          <div className="mt-6 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center max-w-xl mx-auto text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            ⚡ <strong>14-Day Complimentary Trial:</strong> All new accounts enroll into the <strong>Practitioner Tier free for 14 days</strong> with ₹0 charged and no card required.
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
            const monthlyEquivalent = billingCycle === "annual" ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border flex flex-col justify-between p-6 relative transition-all duration-200 bg-card ${
                  plan.popular
                    ? "border-primary shadow-xl ring-2 ring-primary/20 scale-100 lg:scale-[1.02] bg-gradient-to-b from-card via-card to-primary/[0.03]"
                    : "border-border shadow-sm hover:border-foreground/30 hover:shadow-md"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-primary text-primary-foreground shadow-md border border-primary-foreground/20 shrink-0 whitespace-nowrap">
                    {plan.badge || "Most Popular for CA Firms"}
                  </span>
                ) : plan.id === "practitioner" ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-600 text-white shadow-md border border-emerald-400/30 shrink-0 whitespace-nowrap">
                    14-Day Free Trial Tier
                  </span>
                ) : null}

                <div>
                  {/* Plan Header */}
                  <div className="pb-4 border-b border-border/70">
                    <h3 className="text-base font-extrabold text-foreground">{plan.name}</h3>
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

                    {/* Capacity Pills */}
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

                  {/* Features List */}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-foreground/85 leading-snug">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Area */}
                <div className="mt-8 space-y-3">
                  {plan.valueMath && (
                    <div className="p-2.5 rounded-lg bg-muted/40 text-[10px] text-muted-foreground font-medium border-l-2 border-primary/50 leading-relaxed">
                      {plan.valueMath}
                    </div>
                  )}

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
                </div>
              </div>
            );
          })}
        </div>

        {/* Add-ons Available at Checkout Showcase */}
        <div className="mt-14 border border-border/80 bg-card rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Flexible Add-ons (Customizable at Checkout)</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Outgrowing your plan? Add GSTIN slots, invoice recharges, or WhatsApp credits directly in your checkout cart.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start md:self-auto"
            >
              See full comparison matrix <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {PRICING_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="p-5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {addon.badge}
                  </span>
                  <span className="text-sm font-extrabold text-foreground">
                    {formatINR(addon.priceAnnual)}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-2">{addon.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  {addon.description}
                </p>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">Unit: {addon.unit}</span>
                  <span className="text-primary font-bold text-[10px]">+ Add in Checkout</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-10 p-4 rounded-xl border border-border/60 bg-muted/30 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground text-center">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>100% Tax Compliant &amp; GSTIN Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-primary" />
            <span>Eligible for 18% Input Tax Credit on TaxSolver Invoices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>Instant Razorpay Payment with Automated Tax Receipts</span>
          </div>
        </div>

      </div>
    </section>
  );
}
