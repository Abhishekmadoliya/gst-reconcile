"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, RefreshCw, UserPlus, X, Sparkles, Building2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";

interface SetupChecklistProps {
  hasGstin?: boolean;
  hasRecon?: boolean;
  setActiveTab?: (tab: string) => void;
}

export default function SetupChecklist({ hasGstin = true, hasRecon = false, setActiveTab }: SetupChecklistProps) {
  const { user } = useAuthStore();
  const { selectedGstinId } = useDashboardStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Calculate completed steps
  const steps = [
    {
      id: "gstin",
      title: "First GSTIN Registered",
      description: "Active business entity loaded into firm workspace",
      done: Boolean(hasGstin || selectedGstinId),
      action: "/dashboard/gstins",
      actionText: "Manage GSTINs",
    },
    {
      id: "recon",
      title: "Run First Reconciliation",
      description: "Match purchase books with GSTR-2B records or run demo",
      done: hasRecon,
      action: "/dashboard/reconcile/new",
      actionText: "Launch Recon",
    },
    {
      id: "gsp",
      title: "Link GSP for 1-Click Auto-Fetch",
      description: "Authorize direct government portal GSTR-2B sync via OTP",
      done: false,
      action: "/dashboard/gstins",
      actionText: "Link GSP",
    },
    {
      id: "team",
      title: "Invite Articles / Tax Team",
      description: "Collaborate across multi-client audit files",
      done: false,
      action: "/dashboard/settings",
      actionText: "Team Settings",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // If all completed, hide
  if (completedCount === steps.length) return null;

  return (
    <div className="mb-6 rounded-xl border border-primary/20 bg-card p-5 shadow-xs relative text-left">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3 w-3" /> Workspace Setup Checklist
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Complete your firm onboarding ({completedCount}/{steps.length} completed)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Follow these quick steps to fully automate your GSTR-2B discrepancy audits.
          </p>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
          title="Dismiss setup guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5 mb-5 overflow-hidden">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-lg border transition-all ${
              step.done
                ? "bg-success-bg/10 border-success/20 text-foreground"
                : "bg-background/80 border-border hover:border-primary/40 text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {step.done ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-xs font-bold truncate ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {step.title}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {step.description}
            </p>
            {!step.done ? (
              <Link
                href={step.action}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <span>{step.actionText}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <span className="text-[10px] font-semibold text-success uppercase tracking-wider">
                Completed
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
