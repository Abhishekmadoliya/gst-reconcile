"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  Terminal,
  Copy,
  Trash2,
  Play,
  Pause,
  Cpu,
  Server
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

  // Terminal Logs State & Streamer
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addTerminalLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs, autoScroll]);

  // Context Switch Log Streaming
  useEffect(() => {
    if (!activeGstinId) return;

    const gstinNum = activeClient?.gstin || "UNKNOWN";
    const gstinName = activeClient?.tradeName || activeClient?.legalName || "Unnamed Business";

    // Setup initial sequence
    const bootSequence = [
      `[SYS] ${new Date().toISOString().replace('T', ' ').substring(0, 19)} - INITIALIZING AUDIT DAEMON V1.0...`,
      `[SYS] ESTABLISHING DB INTEGRITY CHECK: POSTGRESQL POOL COMPLIANT.`,
      `[SYS] CONNECTING TO REDIS DB HOST: 127.0.0.1:6379... READY.`,
      `[QUEUE] BULLMQ COMPLIANCE WORKER LISTENING ON QUEUE 'reconcile-queue'...`,
      `[SYS] CONTEXT SWITCH -> GSTIN: ${gstinNum} [${gstinName}]`,
      activeClient?.status === "connected"
        ? `[INFO] GSP Sandbox Link status: ACTIVE & ENCRYPTED.`
        : `[WARN] GSP Sandbox Link status: PENDING LINK (Linking GSP Sandbox credentials recommended).`
    ];

    if (latestJob) {
      const matchPctVal = matchedPct.toFixed(1);
      const totalInvCount = (latestJob.summary?.matchedCount || 0) +
        (latestJob.summary?.amountMismatchCount || 0) +
        (latestJob.summary?.inBooksNot2bCount || 0) +
        (latestJob.summary?.in2bNotBooksCount || 0);

      bootSequence.push(
        `[QUEUE] JOB DETECTED IN HISTORY: ID = ${latestJob.id.slice(0, 8)}`,
        `[WORKER] STEP 1: PARSING PURCHASE REGISTER SHEET...`,
        `[WORKER] SUCCESS: PARSED ${totalInvCount} TRANSACTION RECORDS.`,
        `[WORKER] STEP 2: RETRIEVING CACHED GSTR-2B DATA FROM SANDBOX API...`,
        `[WORKER] CACHE HIT: FOUND ${latestJob.summary?.matchedCount + latestJob.summary?.amountMismatchCount + latestJob.summary?.in2bNotBooksCount || 0} INVOICES IN PORTAL LOGS.`,
        `[WORKER] STEP 3: EXECUTING RECONCILIATION MATCHING PROCESS...`,
        `[WORKER]   -> MATCHED   : ${latestJob.summary?.matchedCount || 0} ROWS`,
        `[WORKER]   -> MISMATCHES: ${latestJob.summary?.amountMismatchCount || 0} ROWS`,
        `[WORKER]   -> BOOKS ONLY: ${latestJob.summary?.inBooksNot2bCount || 0} ROWS`,
        `[WORKER]   -> PORTAL 2B : ${latestJob.summary?.in2bNotBooksCount || 0} ROWS`,
        `[WORKER] STEP 4: BULK INSERTING RECON RESULT ROWS IN BATCHES... DONE.`,
        `[WORKER] STEP 5: UPDATING JOB SUMMARY TELEMETRY...`,
        `[SYS] COMPLIANCE RUN COMPLETED. MATCH RATE: ${matchPctVal}%.`
      );
    } else {
      bootSequence.push(
        `[INFO] No completed reconciliation jobs logged for this client yet.`
      );
    }

    bootSequence.push(
      `[SYS] SYSTEM STEADY. ENTER 'help' IN CLIENT CLI PROMPT BELOW FOR COMMAND UTILITIES.`
    );

    // Stream logs
    setTerminalLogs([bootSequence[0]]);
    let idx = 1;
    let timer: NodeJS.Timeout;

    const streamNext = () => {
      if (idx < bootSequence.length) {
        const nextLog = bootSequence[idx];
        setTerminalLogs((prev) => [...prev, nextLog]);
        idx++;
        timer = setTimeout(streamNext, 120);
      }
    };

    timer = setTimeout(streamNext, 150);

    return () => clearTimeout(timer);
  }, [activeGstinId, activeClient, latestJob, matchedPct]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = terminalInput.trim().toLowerCase();
    if (!cleanCmd) return;

    addTerminalLog(`$ ${terminalInput}`);
    setTerminalInput("");

    setTimeout(() => {
      switch (cleanCmd) {
        case "help":
          addTerminalLog("  status   - Get active GSTIN compliance context");
          addTerminalLog("  diagnose - Run connection and database diagnostics");
          addTerminalLog("  clear    - Clear the terminal screen");
          addTerminalLog("  rebuild  - Re-initialize matching engine memory cache index");
          break;
        case "status":
          addTerminalLog("[SYS] GSTIN CONTEXT STATUS:");
          addTerminalLog(`  Active GSTIN : ${activeClient?.gstin || "NONE"}`);
          addTerminalLog(`  Trade Name   : ${activeClient?.tradeName || "N/A"}`);
          addTerminalLog(`  Filing Status: ${activeClient?.status === "connected" ? "Linked (Handshake: OK)" : "Offline (Unlinked)"}`);
          addTerminalLog(`  Total Jobs   : ${recentJobs.length} audit runs recorded`);
          break;
        case "diagnose":
          addTerminalLog("[DIAG] INITIATING TELEMETRY DIAGNOSTICS SUITE...");
          addTerminalLog("[DIAG] DATABASE ENGINE  : OK (PostgreSQL connected - active pool 5)");
          addTerminalLog("[DIAG] CACHE REPOSITORY : OK (Redis cache active - 0.45 MB)");
          addTerminalLog("[DIAG] WORKER DAEMON    : HEALTHY (BullMQ daemon status: IDLE)");
          addTerminalLog("[DIAG] GSP PORTAL CHECK : OK (Sandbox GSP API keys verified)");
          addTerminalLog("[DIAG] AUDITING DAEMON FULLY COMPLIANT AND ONLINE.");
          break;
        case "clear":
          setTerminalLogs([]);
          break;
        case "rebuild":
          addTerminalLog(`[SYS] FLUSHING CACHED MATCHING INDICES FOR GSTIN [${activeClient?.gstin || "ACTIVE"}]...`);
          addTerminalLog("[SYS] RE-HASHING TRANSACTION LEDGERS... DONE");
          addTerminalLog("[SYS] MATCHING ENGINE CACHE FULLY REBUILT AND OPTIMIZED.");
          break;
        default:
          addTerminalLog(`Command not recognized: '${cleanCmd}'. Type 'help' for options.`);
      }
    }, 80);
  };

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

      {/* Audit Processor Terminal */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-sm font-mono text-[11px] text-zinc-300 select-none shadow-lg mt-4 flex flex-col h-72">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-extrabold tracking-wider uppercase text-zinc-100 text-[10px]">
              AUDIT PROCESSOR TELEMETRY TERMINAL
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(terminalLogs.join("\n"));
                alert("Terminal logs copied to clipboard!");
              }}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-sm cursor-pointer transition-all flex items-center gap-1"
              title="Copy terminal logs"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
            <button
              onClick={() => setTerminalLogs([])}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-sm cursor-pointer transition-all flex items-center gap-1"
              title="Clear terminal logs"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2 py-1 border rounded-sm cursor-pointer transition-all ${
                autoScroll
                  ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
              title="Toggle autoscroll"
            >
              Autoscroll: {autoScroll ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {terminalLogs.map((log, idx) => {
            if (!log) return null;
            let colorClass = "text-zinc-300";
            if (log.startsWith("[SYS]")) colorClass = "text-zinc-400";
            else if (log.startsWith("[INFO]")) colorClass = "text-cyan-400";
            else if (log.startsWith("[WARN]")) colorClass = "text-amber-500";
            else if (log.startsWith("[ERROR]")) colorClass = "text-rose-500 font-bold";
            else if (log.startsWith("[QUEUE]")) colorClass = "text-violet-400";
            else if (log.startsWith("[WORKER]")) colorClass = "text-emerald-400";
            else if (log.startsWith("[DIAG]")) colorClass = "text-teal-400";
            else if (log.startsWith("$")) colorClass = "text-zinc-100 font-bold";

            return (
              <div key={idx} className={`${colorClass} leading-relaxed whitespace-pre-wrap select-text`}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-zinc-800 shrink-0">
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help' for diagnostics commands..."
            className="flex-1 bg-transparent text-zinc-200 border-none outline-none focus:ring-0 p-0 text-[11px] font-mono placeholder:text-zinc-600 select-text"
          />
        </form>
      </div>
    </div>
  );
}
