"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { formatINR, formatPeriod } from "@/lib/utils";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building,
  Loader2,
  ArrowRight,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface OverviewTabProps {
  setActiveTab?: (tab: string) => void;
  setSelectedJobId?: (id: string | null) => void;
  selectedGstinId?: string | null;
}

export default function OverviewTab({ setActiveTab, setSelectedJobId, selectedGstinId }: OverviewTabProps) {
  const router = useRouter();
  const store = useDashboardStore();
  
  const activeGstinId = selectedGstinId !== undefined && selectedGstinId !== null ? selectedGstinId : store.selectedGstinId;
  const activeSetJobId = setSelectedJobId || store.setSelectedJobId;
  // 1. Fetch GSTIN list
  const { data: gstinsRes, isLoading: isGstinsLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  // 2. Fetch ITC analytics summary (firm-wide)
  const { data: itcSummaryRes, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["analytics", "itc-summary"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/analytics/itc-summary`);
      return res.data;
    },
  });

  // 3. Fetch Job History (client-specific filtered)
  const { data: jobsHistoryRes, isLoading: isJobsLoading } = useQuery({
    queryKey: ["jobs", "history", { gstinId: activeGstinId, limit: 5 }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/history`, {
        params: {
          page: 1,
          limit: 5,
          gstinId: activeGstinId || undefined
        },
      });
      return res.data;
    },
    enabled: !!activeGstinId
  });

  const gstins = gstinsRes?.data || [];
  const activeClient = gstins.find((g: any) => g.id === activeGstinId);
  const itcSummary = itcSummaryRes?.data || [];
  const recentJobs = jobsHistoryRes?.data || [];

  // Calculate client-specific metrics from recent jobs for higher contextual accuracy
  const clientJobs = recentJobs.filter((j: any) => j.status === "done");
  const latestJob = clientJobs[0] || null;

  // Totals (scope to active client if latest job is present, otherwise fallback to firm-wide or mock)
  const itcMatchedVal = latestJob ? latestJob.summary?.itcMatched || 0 : 0;
  const itcAtRiskVal = latestJob ? latestJob.summary?.itcAtRisk || 0 : 0;
  const itcUnclaimedVal = latestJob ? latestJob.summary?.itcUnclaimed || 0 : 0;

  const clientTotal = itcMatchedVal + itcAtRiskVal + itcUnclaimedVal;
  const matchedPct = clientTotal > 0 ? (itcMatchedVal * 100) / clientTotal : 0;
  const atRiskPct = clientTotal > 0 ? (itcAtRiskVal * 100) / clientTotal : 0;
  const unclaimedPct = clientTotal > 0 ? (itcUnclaimedVal * 100) / clientTotal : 0;

  // Graph Data
  const chartData = itcSummary.length > 0
    ? [...itcSummary].reverse().map((item: any) => ({
        name: formatPeriod(item.period),
        "Matched ITC": item.itcMatched,
        "At-Risk ITC": item.itcAtRisk,
        "Unclaimed ITC": item.itcUnclaimed,
      }))
    : [
        { name: "Jan 2026", "Matched ITC": 450000, "At-Risk ITC": 120000, "Unclaimed ITC": 25000 },
        { name: "Feb 2026", "Matched ITC": 520000, "At-Risk ITC": 98000, "Unclaimed ITC": 30000 },
        { name: "Mar 2026", "Matched ITC": 610000, "At-Risk ITC": 140000, "Unclaimed ITC": 15000 },
        { name: "Apr 2026", "Matched ITC": 580000, "At-Risk ITC": 75000, "Unclaimed ITC": 42000 },
        { name: "May 2026", "Matched ITC": 650000, "At-Risk ITC": 115000, "Unclaimed ITC": 20000 },
      ];

  const isLoading = isGstinsLoading || isAnalyticsLoading || (isJobsLoading && !!activeGstinId);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Top Notification if GSP not linked for active client */}
      {activeClient && activeClient.status !== "connected" && (
        <div className="p-3.5 bg-warn-bg text-warn border border-warn/15 rounded-sm flex items-center justify-between gap-3 text-xs leading-normal">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              GSP integration is pending for <span className="font-bold">{activeClient.tradeName || activeClient.legalName}</span>. Link Sandbox portal credentials to load GSTR-2B logs.
            </span>
          </div>
        </div>
      )}

      {/* High-Density Stats Grid (Sharp corners, flat 1px borders, data-rich meters) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: GSP status */}
        <div className="p-4 bg-card border border-border rounded-sm relative group select-none flex flex-col justify-between">
          <div>
            <p className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
              GSP Link Status
            </p>
            <h3 className="text-base font-bold font-sans text-foreground mt-2 flex items-center gap-1.5 uppercase tracking-wide">
              <span className={`h-2 w-2 rounded-full shrink-0 ${
                activeClient?.status === "connected"
                  ? "bg-compliance-success shadow-[0_0_4px_var(--compliance-success)]"
                  : "bg-muted-foreground/45"
              }`} />
              {activeClient?.status || "Pending"}
            </h3>
          </div>
          <p className="text-[9px] text-muted-foreground mt-3 font-mono border-t border-border/40 pt-2">
            {activeClient?.gstin || "No active GSP link"}
          </p>
        </div>

        {/* Card 2: Matched ITC */}
        <div className="p-4 bg-card border border-border rounded-sm relative group select-none flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
                Matched ITC (Ready)
              </p>
              {latestJob && (
                <span className="text-[8px] font-bold text-success bg-compliance-success-bg px-1 rounded-sm">
                  {matchedPct.toFixed(0)}%
                </span>
              )}
            </div>
            <h3 className="text-base font-mono font-bold text-success mt-2 tracking-tight">
              {latestJob ? formatINR(itcMatchedVal) : "₹0.00"}
            </h3>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-none h-1 overflow-hidden">
              <div className="bg-success h-full transition-all duration-300" style={{ width: `${latestJob ? matchedPct : 0}%` }}></div>
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 font-mono truncate">
              {latestJob ? `Run: ${latestJob.id.slice(0, 8)}` : "No matching run logged"}
            </p>
          </div>
        </div>

        {/* Card 3: At-Risk ITC */}
        <div className="p-4 bg-card border border-border rounded-sm relative group select-none flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
                At-Risk ITC (Errors)
              </p>
              {latestJob && (
                <span className="text-[8px] font-bold text-warn bg-warn-bg px-1 rounded-sm">
                  {atRiskPct.toFixed(0)}%
                </span>
              )}
            </div>
            <h3 className="text-base font-mono font-bold text-warn mt-2 tracking-tight">
              {latestJob ? formatINR(itcAtRiskVal) : "₹0.00"}
            </h3>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-none h-1 overflow-hidden">
              <div className="bg-warn h-full transition-all duration-300" style={{ width: `${latestJob ? atRiskPct : 0}%` }}></div>
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 font-mono truncate">
              {latestJob ? `${latestJob.summary?.amountMismatchCount || 0} discrepancy rows` : "No matching run logged"}
            </p>
          </div>
        </div>

        {/* Card 4: Unclaimed ITC */}
        <div className="p-4 bg-card border border-border rounded-sm relative group select-none flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
                Unclaimed ITC (2B Only)
              </p>
              {latestJob && (
                <span className="text-[8px] font-bold text-info bg-compliance-info-bg px-1 rounded-sm">
                  {unclaimedPct.toFixed(0)}%
                </span>
              )}
            </div>
            <h3 className="text-base font-mono font-bold text-info mt-2 tracking-tight">
              {latestJob ? formatINR(itcUnclaimedVal) : "₹0.00"}
            </h3>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-none h-1 overflow-hidden">
              <div className="bg-info h-full transition-all duration-300" style={{ width: `${latestJob ? unclaimedPct : 0}%` }}></div>
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 font-mono truncate">
              {latestJob ? `${latestJob.summary?.in2bNotBooksCount || 0} missing ledger rows` : "No matching run logged"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Graph & Table Block (Double Column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recharts Chart (Span 2) */}
        <div className="lg:col-span-2 p-4 bg-card border border-border rounded-sm">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Firm-wide Compliance Trend
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Aggregated monthly Input Tax Credit metrics.
            </p>
          </div>
          <div className="h-60 w-full text-[9px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMatched" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(value: any) => [formatINR(value), ""]} 
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "2px", color: "var(--foreground)", fontSize: "10px" }}
                />
                <Legend verticalAlign="top" height={28} />
                <Area type="monotone" dataKey="Matched ITC" stroke="#10b981" fillOpacity={1} fill="url(#colorMatched)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="At-Risk ITC" stroke="#fbbf24" fillOpacity={1} fill="url(#colorAtRisk)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Recent Jobs (Span 1) */}
        <div className="p-4 bg-card border border-border rounded-sm flex flex-col justify-between">
          <div>
            <div className="pb-2 border-b border-border mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Client History
              </h3>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Recent reconciliation runs for this client.
              </p>
            </div>

            {recentJobs.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border rounded-sm bg-muted/15">
                <FileSpreadsheet className="h-6 w-6 text-muted-foreground/35 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-foreground">No runs found</p>
                <button
                  onClick={() => router.push("/dashboard/reconcile/new")}
                  className="mt-2 text-[8px] uppercase font-bold text-primary hover:underline animate-none"
                >
                  Upload Ledger
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {recentJobs.map((job: any) => {
                  const matchedCount = job.summary?.matchedCount || 0;
                  const totalInvoices = matchedCount + (job.summary?.amountMismatchCount || 0) + (job.summary?.inBooksNot2bCount || 0) + (job.summary?.in2bNotBooksCount || 0);
                  
                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        if (job.status === "done") {
                          activeSetJobId(job.id);
                          router.push(`/dashboard/reconcile/${job.id}`);
                        }
                      }}
                      className={`p-2 border border-border rounded-sm text-left transition-all ${
                        job.status === "done" ? "hover:border-primary cursor-pointer bg-muted/10 hover:bg-muted/30" : "bg-muted/5"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold font-mono">{formatPeriod(job.period)}</span>
                        <span className={`text-[8px] font-bold px-1 rounded-sm border ${
                          job.status === "done"
                            ? "bg-compliance-success-bg text-compliance-success border-success/15"
                            : job.status === "failed"
                            ? "bg-compliance-alert-bg text-compliance-alert border-alert/15"
                            : "bg-compliance-info-bg text-compliance-info border-info/15 animate-pulse"
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[9px] text-muted-foreground">
                        <span>Matched: {matchedCount} / {totalInvoices} Invoices</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/dashboard/reconcile/new")}
            className="w-full flex items-center justify-center gap-1.5 h-8 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer mt-3 shadow-sm"
          >
            Upload Ledger <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
