"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatPeriod } from "@/lib/utils";
import {
  Calendar,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
  History,
  AlertCircle
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { selectedGstinId, setSelectedJobId } = useDashboardStore();

  const { data: jobsHistoryRes, isLoading } = useQuery({
    queryKey: ["jobs", "history", { gstinId: selectedGstinId }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/history`, {
        params: {
          page: 1,
          limit: 20,
          gstinId: selectedGstinId || undefined
        },
      });
      return res.data;
    },
    enabled: true
  });

  const jobs = jobsHistoryRes?.data || [];

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Reconciliation Job Audit History
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Access past reconciliation runs, matching statistics, and download generated audit ledger archives.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-card border border-border rounded-sm">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Loading history logs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-border rounded-sm bg-card max-w-md mx-auto">
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground/35 mx-auto mb-3" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">No history logs recorded</h3>
          <p className="text-[10px] text-muted-foreground mt-1 mb-4">
            Start by uploading a purchase register and running the Autopilot matcher.
          </p>
          <button
            onClick={() => router.push("/dashboard/reconcile/new")}
            className="px-3.5 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer hover:bg-primary/95 transition-colors"
          >
            Run Autopilot Matcher
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Filing Period</th>
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Run Date</th>
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Invoices</th>
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">At-Risk Count</th>
                <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {jobs.map((job: any) => {
                const matchedCount = job.summary?.matchedCount || 0;
                const mismatchCount = job.summary?.amountMismatchCount || 0;
                const totalInvoices = matchedCount + mismatchCount + (job.summary?.inBooksNot2bCount || 0) + (job.summary?.in2bNotBooksCount || 0);
                
                return (
                  <tr key={job.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold font-mono text-xs text-foreground">
                      {formatPeriod(job.period)}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">
                      {new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        job.status === "done"
                          ? "bg-compliance-success-bg text-compliance-success border-success/15"
                          : job.status === "failed"
                          ? "bg-compliance-alert-bg text-compliance-alert border-alert/15"
                          : "bg-compliance-info-bg text-compliance-info border-info/15 animate-pulse"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-foreground font-mono">
                      {totalInvoices}
                    </td>
                    <td className="p-4 text-xs font-bold text-warn font-mono">
                      {mismatchCount}
                    </td>
                    <td className="p-4 text-right">
                      {job.status === "done" ? (
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            router.push(`/dashboard/reconcile/${job.id}`);
                          }}
                          className="inline-flex items-center gap-1 bg-background border border-border hover:bg-accent text-primary text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm shadow-sm transition-colors cursor-pointer"
                        >
                          View Results <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">Processing...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
