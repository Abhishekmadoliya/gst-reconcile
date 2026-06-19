"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import {
  CreditCard,
  Check,
  Building,
  Loader2,
  FileSpreadsheet,
  Download
} from "lucide-react";

export default function BillingPage() {
  const { data: gstinsRes, isLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  const gstinsCount = gstinsRes?.data?.length || 0;
  const maxGstinsLimit = 20; // CA Starter quota limit
  const quotaPct = Math.min((gstinsCount * 100) / maxGstinsLimit, 100);

  const plans = [
    {
      name: "Solo Filer",
      price: "₹999",
      period: "month",
      features: ["1 GSTIN limit", "Uncapped invoice matches", "Excel imports & reports", "Standard GSP syncs"],
      active: false,
    },
    {
      name: "CA Starter",
      price: "₹4,999",
      period: "month",
      features: ["Up to 20 GSTIN profiles", "Realtime sandbox OTP syncs", "Color-coded LED status dashboards", "AI-drafted compliance chasers"],
      active: true,
    },
    {
      name: "CA Pro",
      price: "₹19,999",
      period: "month",
      features: ["Up to 200 GSTIN profiles", "Priority BullMQ matchers", "Bulk supplier notifications", "Dedicated account API access"],
      active: false,
    },
  ];

  const invoices = [
    { id: "INV-2026-004", date: "01-Apr-2026", amount: "₹4,999.00", status: "Paid" },
    { id: "INV-2026-003", date: "01-Mar-2026", amount: "₹4,999.00", status: "Paid" },
    { id: "INV-2026-002", date: "01-Feb-2026", amount: "₹4,999.00", status: "Paid" },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="h-4.5 w-4.5 text-primary" /> Subscription & Billing Ledger
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Manage your firm's subscription plans, invoice logs, and connected client quota limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan tiers and usage cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quota progress */}
          <div className="p-5 bg-card border border-border rounded-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Active Connected GSTIN Quota</span>
              <span className="font-bold text-foreground font-mono">{gstinsCount} / {maxGstinsLimit} clients</span>
            </div>
            <div className="w-full bg-muted rounded-none h-2 overflow-hidden border border-border/20">
              <div
                className={`h-full transition-all duration-300 ${
                  quotaPct > 90 ? "bg-alert" : quotaPct > 70 ? "bg-warn" : "bg-success"
                }`}
                style={{ width: `${quotaPct}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-muted-foreground">
              You are currently utilizing <span className="font-bold">{quotaPct.toFixed(0)}%</span> of your firm's CA Starter quota.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-4 bg-card border rounded-sm flex flex-col justify-between relative overflow-hidden ${
                  plan.active ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {plan.active && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm">
                    Active
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{plan.name}</h4>
                  <div className="mt-2.5 flex items-baseline">
                    <span className="text-lg font-bold font-mono text-foreground">{plan.price}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[10px] text-muted-foreground">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-1.5 leading-relaxed">
                        <Check className="h-3 w-3 text-success shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {!plan.active && (
                  <button
                    onClick={() => alert("Redirecting to Razorpay checkout portal...")}
                    className="w-full mt-5 py-1.5 border border-border hover:border-primary text-[9px] font-bold uppercase rounded-sm transition-colors cursor-pointer"
                  >
                    Select Plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invoice table */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border">
              Billing History
            </h3>
          </div>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-2.5 border border-border rounded-sm bg-muted/10 text-xs"
              >
                <div>
                  <p className="font-mono font-bold text-foreground">{inv.id}</p>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{inv.date}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-mono font-bold text-foreground">{inv.amount}</span>
                  <button
                    onClick={() => alert(`Downloading invoice PDF ${inv.id}`)}
                    className="p-1 hover:bg-accent border border-border text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                    title="Download receipt"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
