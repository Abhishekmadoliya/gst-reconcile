"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { formatPeriod } from "@/lib/utils";
import {
  Upload,
  Building2,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  History,
  FileSpreadsheet
} from "lucide-react";

interface ReconcileQueueTabProps {
  setActiveTab?: (tab: string) => void;
  setSelectedJobId?: (id: string | null) => void;
  selectedGstinId?: string | null;
}

interface ActiveJobPoll {
  jobId: string;
  gstin: string;
  period: string;
  status: "pending" | "processing" | "done" | "failed";
  error: string | null;
  summary: any | null;
}

export default function ReconcileQueueTab({ setActiveTab, setSelectedJobId, selectedGstinId }: ReconcileQueueTabProps) {
  const router = useRouter();
  const store = useDashboardStore();
  
  const activeGstinId = selectedGstinId !== undefined && selectedGstinId !== null ? selectedGstinId : store.selectedGstinId;
  const activeSetJobId = setSelectedJobId || store.setSelectedJobId;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [selectedMonth, setSelectedMonth] = useState("04");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // App states
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePollJob, setActivePollJob] = useState<ActiveJobPoll | null>(null);

  // 1. Fetch GSTIN list
  const { data: gstinsRes, isLoading: isGstinsLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  // 2. Fetch past jobs list
  const { data: pastJobsRes, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["jobs", "history", { gstinId: activeGstinId, limit: 10 }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/history`, {
        params: {
          page: 1,
          limit: 10,
          gstinId: activeGstinId || undefined
        },
      });
      return res.data;
    },
    enabled: !!activeGstinId
  });

  const gstins = gstinsRes?.data || [];
  const activeClient = gstins.find((g: any) => g.id === activeGstinId);
  const pastJobs = pastJobsRes?.data || [];

  // 3. Polling Effect for running jobs
  useEffect(() => {
    if (!activePollJob || activePollJob.status === "done" || activePollJob.status === "failed") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`${API_URL}/api/reconcile/${activePollJob.jobId}`);
        const jobData = res.data?.data;

        if (jobData) {
          setActivePollJob((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status: jobData.status,
              error: jobData.error,
              summary: jobData.summary,
            };
          });

          // Invalidate cache on job updates
          if (jobData.status === "done" || jobData.status === "failed") {
            queryClient.invalidateQueries({ queryKey: ["jobs", "history"] });
            queryClient.invalidateQueries({ queryKey: ["analytics", "itc-summary"] });
          }
        }
      } catch (err) {
        console.error("Error polling job status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activePollJob, queryClient]);

  // Dropdown list options
  const months = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ];

  const years = ["2024", "2025", "2026"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
        setErrorMsg("Unsupported file format. Please upload .xlsx, .xls, or .csv sheets.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
        setErrorMsg("Unsupported file format. Please upload .xlsx, .xls, or .csv sheets.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReconcileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedGstinId) {
      setErrorMsg("Please select a GSTIN client from the Left Explorer panel.");
      return;
    }

    if (!selectedFile) {
      setErrorMsg("Please select or drag a purchase register file.");
      return;
    }

    setIsUploading(true);

    const period = `${selectedMonth}${selectedYear}`;
    const formData = new FormData();
    formData.append("gstinId", selectedGstinId);
    formData.append("period", period);
    formData.append("purchaseRegister", selectedFile);

    try {
      const res = await api.post(`${API_URL}/api/reconcile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data?.data;
      const gstinNumber = activeClient?.gstin || "Selected client";

      if (data) {
        setActivePollJob({
          jobId: data.jobId,
          gstin: gstinNumber,
          period: period,
          status: data.status || "pending",
          error: null,
          summary: null,
        });
        setSelectedFile(null);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || "Failed to start reconciliation job.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-left">
      {/* Upload Controls panel (Span 2) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="p-4 bg-card border border-border rounded-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Run Autopilot Audit
            </h3>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              Reconcile GSTR-2B logs against purchase registers.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 border border-alert/20 bg-alert-bg text-alert text-[10px] flex items-start gap-2 mt-3.5 rounded-sm">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleReconcileSubmit} className="space-y-4 mt-4">
            
            {/* Context selection info panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Selected client status (Disabled input) */}
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Active Client (Scope)
                </label>
                <div className="h-9 px-3 border border-border bg-muted/30 text-[11px] rounded-sm flex items-center font-bold text-foreground truncate">
                  {activeClient ? `${activeClient.tradeName || activeClient.legalName} [${activeClient.gstin}]` : "No Client Active"}
                </div>
              </div>

              {/* filing period selectors */}
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Audit Filing Period
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    disabled={isUploading || !!(activePollJob && activePollJob.status !== "done" && activePollJob.status !== "failed")}
                    className="flex-1 h-9 px-2 border border-border bg-background text-[11px] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={isUploading || !!(activePollJob && activePollJob.status !== "done" && activePollJob.status !== "failed")}
                    className="flex-1 h-9 px-2 border border-border bg-background text-[11px] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ingestion drag area (reduced padding) */}
            <div className="space-y-1">
              <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                Purchase Register Ledger Ingestion
              </label>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-border hover:border-primary/50 rounded-sm p-6 text-center bg-muted/20 hover:bg-muted/30 cursor-pointer transition-all"
                >
                  <Upload className="h-6 w-6 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-foreground">
                    Drag and drop purchase register Excel or CSV sheet
                  </p>
                  <p className="text-[8px] text-muted-foreground mt-0.5">
                    Expected columns: GSTIN, Invoice Number, Taxable Value, IGST, CGST, SGST (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-3 border border-border rounded-sm bg-muted/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 text-[11px]">
                    <div className="h-8 w-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary font-bold text-[9px] shrink-0">
                      DOC
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{selectedFile.name}</p>
                      <p className="text-[9px] text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-destructive/15 text-muted-foreground hover:text-destructive rounded-sm transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={isUploading || !selectedGstinId || !selectedFile || !!(activePollJob && activePollJob.status !== "done" && activePollJob.status !== "failed")}
              className="w-full flex items-center justify-center gap-1.5 h-9 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Ingesting Ledger Sheet...
                </>
              ) : (
                <>
                  Run Autopilot audit <Play className="h-3.5 w-3.5 fill-current" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Polling Job Progress Monitor Card (Sharp borders) */}
        {activePollJob && (
          <div className="p-4 bg-card border border-border rounded-sm text-left space-y-3 animate-in fade-in duration-200">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[8px] uppercase tracking-widest font-extrabold text-muted-foreground leading-none">
                  Active Audit Session
                </span>
                <h4 className="text-[10px] font-bold text-foreground font-mono mt-1">
                  Job ID: {activePollJob.jobId}
                </h4>
                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                  Client: {activePollJob.gstin} | Period: {formatPeriod(activePollJob.period)}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[8px] font-extrabold uppercase tracking-wider border ${
                activePollJob.status === "done"
                  ? "bg-compliance-success-bg text-compliance-success border-success/15"
                  : activePollJob.status === "failed"
                  ? "bg-compliance-alert-bg text-compliance-alert border-alert/15"
                  : "bg-compliance-info-bg text-compliance-info border-info/15 animate-pulse"
              }`}>
                {activePollJob.status}
              </span>
            </div>

            {(activePollJob.status === "pending" || activePollJob.status === "processing") && (
              <div className="space-y-1.5">
                <div className="w-full bg-muted rounded-none h-1 overflow-hidden">
                  <div className="bg-primary h-full rounded-none animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,var(--primary)_0%,var(--ring)_50%,var(--primary)_100%)] bg-[length:200%_100%]" style={{ width: "100%" }}></div>
                </div>
                <div className="flex justify-between text-[8px] text-muted-foreground">
                  <span className="flex items-center gap-1 leading-none font-semibold">
                    <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                    Running audit calculations in BullMQ queue...
                  </span>
                </div>
              </div>
            )}

            {activePollJob.status === "done" && (
              <div className="space-y-3">
                <div className="p-2.5 bg-compliance-success-bg border border-success/15 rounded-sm text-[10px] text-success flex items-start gap-1.5 leading-normal">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                  <div>
                    <h4 className="font-extrabold uppercase tracking-wide">Audit complete</h4>
                    <p className="text-[9px] text-success/90 mt-0.5">
                      Matched GSTR-2B against books. Check the results ledger for discrepancies.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center bg-muted/20 p-2.5 rounded-sm border border-border">
                  <div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Matched</p>
                    <p className="text-xs font-bold text-success mt-0.5">{activePollJob.summary?.matchedCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Diffs</p>
                    <p className="text-xs font-bold text-warn mt-0.5">{activePollJob.summary?.amountMismatchCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Books Only</p>
                    <p className="text-xs font-bold text-alert mt-0.5">{activePollJob.summary?.inBooksNot2bCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">2B Only</p>
                    <p className="text-xs font-bold text-info mt-0.5">{activePollJob.summary?.in2bNotBooksCount || 0}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    activeSetJobId(activePollJob.jobId);
                    router.push(`/dashboard/reconcile/${activePollJob.jobId}`);
                  }}
                  className="w-full flex items-center justify-center gap-1 h-8 border border-primary text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                >
                  Open results ledger <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {activePollJob.status === "failed" && (
              <div className="p-2.5 bg-compliance-alert-bg border border-alert/20 rounded-sm text-[10px] text-alert flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold uppercase">Worker process failed</h4>
                  <p className="text-[9px] text-alert/90 mt-0.5 leading-normal">
                    {activePollJob.error || "An unexpected parser error occurred."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History panel (Span 1) */}
      <div className="space-y-4">
        <div className="p-4 bg-card border border-border rounded-sm h-full flex flex-col justify-between">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1.5 pb-2 border-b border-border mb-3">
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Client Runs history
              </h3>
            </div>

            {isHistoryLoading ? (
              <div className="py-8 text-center flex-1 flex flex-col items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mb-1.5" />
                <p className="text-[9px] text-muted-foreground font-semibold">Loading history...</p>
              </div>
            ) : pastJobs.length === 0 ? (
              <div className="py-8 text-center flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-muted/10">
                <FileSpreadsheet className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-[9px] text-muted-foreground font-bold leading-tight">No runs recorded.</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1">
                {pastJobs.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      if (job.status === "done") {
                        activeSetJobId(job.id);
                        router.push(`/dashboard/reconcile/${job.id}`);
                      }
                    }}
                    className={`p-2 rounded-sm border text-left transition-all select-none ${
                      job.status === "done"
                        ? "border-border hover:border-primary bg-muted/10 hover:bg-muted/30 cursor-pointer"
                        : "border-border/60 bg-muted/5"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold font-mono">{formatPeriod(job.period)}</span>
                      <span className={`text-[7px] font-bold px-1 rounded-sm border ${
                        job.status === "done"
                          ? "bg-compliance-success-bg text-compliance-success border-success/15"
                          : job.status === "failed"
                          ? "bg-compliance-alert-bg text-compliance-alert border-alert/15"
                          : "bg-compliance-info-bg text-compliance-info border-info/15 animate-pulse"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    {job.status === "done" && (
                      <div className="flex justify-between items-center mt-1.5 text-[9px] text-muted-foreground">
                        <span>Matched: {job.summary?.matchedCount || 0} rows</span>
                        <span className="font-mono text-success font-bold">
                          {((job.summary?.matchedCount || 0) * 100 / (
                            (job.summary?.matchedCount || 0) + 
                            (job.summary?.amountMismatchCount || 0) + 
                            (job.summary?.inBooksNot2bCount || 0) + 
                            (job.summary?.in2bNotBooksCount || 0) || 1
                          )).toFixed(0)}% match
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
