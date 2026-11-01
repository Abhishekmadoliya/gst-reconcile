"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatINR } from "@/lib/utils";
import {
  FileText,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Send,
  Building,
  Save,
  Edit2,
} from "lucide-react";

interface TaxRow {
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  total: number;
}

interface Gstr3bDraft {
  period: string;
  gstin: string;
  clientName: string;
  table4A: TaxRow;
  table4B1: TaxRow;
  table4D: TaxRow;
  itcNet: TaxRow;
  totalInvoices: number;
  categoryBreakdown: {
    matched: number;
    mismatch: number;
    headMismatch: number;
    missing2b: number;
    missing_books: number;
    possible: number;
    ineligible: number;
  };
}

type RowKey = "table4A" | "table4B1" | "table4D";
type TaxField = "igst" | "cgst" | "sgst" | "cess";

const ROW_LABELS: Record<RowKey, string> = {
  table4A: "4(A) Eligible ITC",
  table4B1: "4(B)(1) Ineligible — Sec 17(5)",
  table4D: "4(D) Not available — Missing in 2B",
};

const TAX_FIELDS: TaxField[] = ["igst", "cgst", "sgst", "cess"];

function computeTotal(row: Omit<TaxRow, "total">): number {
  return row.igst + row.cgst + row.sgst + row.cess;
}

function computeNetRow(
  table4A: TaxRow,
  table4B1: TaxRow,
  table4D: TaxRow
): TaxRow {
  const igst = table4A.igst - table4B1.igst - table4D.igst;
  const cgst = table4A.cgst - table4B1.cgst - table4D.cgst;
  const sgst = table4A.sgst - table4B1.sgst - table4D.sgst;
  const cess = table4A.cess - table4B1.cess - table4D.cess;
  return { igst, cgst, sgst, cess, total: igst + cgst + sgst + cess };
}

export default function Gstr3bPage() {
  const { selectedGstinId } = useDashboardStore();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filingMsg, setFilingMsg] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Editable form state
  const [formRows, setFormRows] = useState<Record<RowKey, TaxRow>>({
    table4A: { igst: 0, cgst: 0, sgst: 0, cess: 0, total: 0 },
    table4B1: { igst: 0, cgst: 0, sgst: 0, cess: 0, total: 0 },
    table4D: { igst: 0, cgst: 0, sgst: 0, cess: 0, total: 0 },
  });

  // Fetch GSTIN list
  const { data: gstinsRes } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  const gstins = gstinsRes?.data || [];

  // Fetch recent job history
  const { data: historyRes, isLoading: historyLoading } = useQuery({
    queryKey: ["reconcile-history", selectedGstinId],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/history`, {
        params: { gstinId: selectedGstinId, limit: 10 },
      });
      return res.data;
    },
    enabled: !!selectedGstinId,
  });

  const jobs = (historyRes?.data || []) as Array<{
    id: string;
    period: string;
    status: string;
    createdAt: string;
  }>;
  const completedJobs = jobs.filter((j) => j.status === "done");

  // Fetch GSTR-3B draft for selected job
  const {
    data: draftRes,
    isLoading: draftLoading,
    isError: draftError,
  } = useQuery({
    queryKey: ["gstr3b-draft", selectedJobId],
    queryFn: async () => {
      const res = await api.get(
        `${API_URL}/api/gstr3b/${selectedJobId}/draft`
      );
      return res.data;
    },
    enabled: !!selectedJobId,
  });

  const rawDraft = draftRes?.data?.draft || draftRes?.data || null;
  const draft: Gstr3bDraft | null = rawDraft;

  // Seed form rows when draft loads
  useEffect(() => {
    if (draft) {
      const initRow = (row?: any): TaxRow => {
        const igst = Number(row?.igst) || 0;
        const cgst = Number(row?.cgst) || 0;
        const sgst = Number(row?.sgst) || 0;
        const cess = Number(row?.cess) || 0;
        return {
          igst,
          cgst,
          sgst,
          cess,
          total: igst + cgst + sgst + cess,
        };
      };

      setFormRows({
        table4A: initRow(draft.table4A),
        table4B1: initRow(draft.table4B1),
        table4D: initRow(draft.table4D),
      });
      setFilingMsg(null);
      setSaveMsg(null);
    }
  }, [draft]);

  const handleFieldChange = useCallback(
    (rowKey: RowKey, field: TaxField, value: string) => {
      const numVal = parseFloat(value) || 0;
      setFormRows((prev) => {
        const updatedRow = { ...prev[rowKey], [field]: numVal };
        updatedRow.total = computeTotal(updatedRow);
        return { ...prev, [rowKey]: updatedRow };
      });
      setSaveMsg(null);
    },
    []
  );

  const netRow = computeNetRow(
    formRows.table4A,
    formRows.table4B1,
    formRows.table4D
  );

  // Save draft mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(
        `${API_URL}/api/gstr3b/${selectedJobId}/save`,
        {
          table4A: formRows.table4A,
          table4B1: formRows.table4B1,
          table4D: formRows.table4D,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setSaveMsg("Draft saved successfully.");
    },
    onError: () => {
      setSaveMsg("Failed to save draft. Try again.");
    },
  });

  // File GSTR-3B mutation
  const fileMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(
        `${API_URL}/api/gstr3b/${selectedJobId}/file`,
        {
          table4A: formRows.table4A,
          table4B1: formRows.table4B1,
          table4D: formRows.table4D,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setFilingMsg(
        data?.message || data?.data?.message || "GSTR-3B filed successfully."
      );
    },
    onError: () => {
      setFilingMsg("Filing failed. Please try again.");
    },
  });

  const currentGstin = gstins.find(
    (g: { id: string }) => g.id === selectedGstinId
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" /> GSTR-3B Tax
            Filing Assistant
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Draft and compute Table 4 ITC breakdown from reconciled job data.
          </p>
        </div>
      </div>

      {/* Period & GSTIN info + job selector */}
      <div className="p-4 bg-card border border-border rounded-sm">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" /> GSTIN
            </label>
            <p className="text-xs font-mono font-bold text-foreground">
              {currentGstin?.gstin || selectedGstinId || "—"}
            </p>
            {currentGstin?.tradeName && (
              <p className="text-[10px] text-muted-foreground">
                {currentGstin.tradeName}
              </p>
            )}
          </div>
          <div className="space-y-1 flex-1 min-w-[220px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Edit2 className="h-3 w-3" /> Select Completed Job
            </label>
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(e.target.value || null)}
              className="w-full h-9 px-3 text-xs font-mono bg-card border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">
                {historyLoading
                  ? "Loading jobs..."
                  : completedJobs.length === 0
                    ? "No completed jobs"
                    : "— Select a job —"}
              </option>
              {completedJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.period} — {job.id.slice(0, 8)}… (
                  {new Date(job.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          {draft && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Period
              </label>
              <p className="text-xs font-mono font-bold text-foreground">
                {draft.period || (draft as any).job?.period || "—"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading / error / empty */}
      {!selectedJobId && (
        <div className="p-12 text-center bg-card border border-border rounded-sm">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Select a completed reconciliation job to generate GSTR-3B draft
          </p>
        </div>
      )}

      {selectedJobId && draftLoading && (
        <div className="p-12 text-center bg-card border border-border rounded-sm">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Loading GSTR-3B draft...
          </p>
        </div>
      )}

      {selectedJobId && draftError && (
        <div className="p-6 text-center bg-card border border-border rounded-sm">
          <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Failed to load draft. Check that the job has completed processing.
          </p>
        </div>
      )}

      {/* Main content when draft is loaded */}
      {draft && !draftLoading && (
        <>
          {/* Warning banner */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
            <p className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
              Verify all values before filing. Filing is irreversible.
            </p>
          </div>

          {/* Filing success message */}
          {filingMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="font-bold uppercase">{filingMsg}</p>
              </div>
              <button
                onClick={() => setFilingMsg(null)}
                className="text-[10px] font-bold uppercase underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table 4 Grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Table 4: ITC Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/10">
                        <th className="p-3 text-[10px] uppercase font-bold text-muted-foreground">
                          Description
                        </th>
                        {["IGST", "CGST", "SGST", "Cess", "Total"].map(
                          (col) => (
                            <th
                              key={col}
                              className="p-3 text-right font-mono text-[10px] uppercase font-bold text-muted-foreground"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {(Object.keys(ROW_LABELS) as RowKey[]).map((rowKey) => (
                        <tr key={rowKey} className="hover:bg-muted/10">
                          <td className="p-3 font-semibold text-foreground whitespace-nowrap">
                            {ROW_LABELS[rowKey]}
                          </td>
                          {TAX_FIELDS.map((field) => (
                            <td key={field} className="p-3 text-right">
                              <input
                                type="number"
                                value={formRows[rowKey][field]}
                                onChange={(e) =>
                                  handleFieldChange(
                                    rowKey,
                                    field,
                                    e.target.value
                                  )
                                }
                                className="w-28 h-7 px-2 text-right text-xs font-mono bg-muted/20 border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </td>
                          ))}
                          <td className="p-3 text-right font-mono font-bold text-foreground">
                            {formatINR(formRows[rowKey].total)}
                          </td>
                        </tr>
                      ))}
                      {/* Net ITC row */}
                      <tr className="bg-primary/5 border-t-2 border-primary/20">
                        <td className="p-3 font-bold text-foreground">
                          Net ITC Available
                        </td>
                        {TAX_FIELDS.map((field) => (
                          <td
                            key={field}
                            className="p-3 text-right font-mono font-bold text-foreground"
                          >
                            {formatINR(netRow[field])}
                          </td>
                        ))}
                        <td className="p-3 text-right font-mono font-bold text-primary text-sm">
                          {formatINR(netRow.total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard
                  label="Total Invoices"
                  value={(draft.totalInvoices ?? 0).toLocaleString()}
                />
                <SummaryCard
                  label="Matched"
                  value={(
                    (draft.categoryBreakdown as any)?.MATCHED ??
                    draft.categoryBreakdown?.matched ??
                    0
                  ).toLocaleString()}
                  color="text-emerald-500"
                />
                <SummaryCard
                  label="Mismatch"
                  value={(
                    (draft.categoryBreakdown as any)?.AMOUNT_MISMATCH ??
                    draft.categoryBreakdown?.mismatch ??
                    0
                  ).toLocaleString()}
                  color="text-yellow-500"
                />
                <SummaryCard
                  label="Missing 2B"
                  value={(
                    (draft.categoryBreakdown as any)?.IN_BOOKS_NOT_2B ??
                    draft.categoryBreakdown?.missing2b ??
                    0
                  ).toLocaleString()}
                  color="text-red-400"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard
                  label="Head Mismatch"
                  value={(
                    (draft.categoryBreakdown as any)?.HEAD_MISMATCH ??
                    draft.categoryBreakdown?.headMismatch ??
                    0
                  ).toLocaleString()}
                  color="text-orange-400"
                />
                <SummaryCard
                  label="Missing Books"
                  value={(
                    (draft.categoryBreakdown as any)?.IN_2B_NOT_BOOKS ??
                    draft.categoryBreakdown?.missing_books ??
                    0
                  ).toLocaleString()}
                  color="text-blue-400"
                />
                <SummaryCard
                  label="Possible"
                  value={(
                    (draft.categoryBreakdown as any)?.POSSIBLE_MATCH ??
                    draft.categoryBreakdown?.possible ??
                    0
                  ).toLocaleString()}
                  color="text-cyan-400"
                />
                <SummaryCard
                  label="Ineligible"
                  value={(
                    (draft.categoryBreakdown as any)?.ineligible ??
                    0
                  ).toLocaleString()}
                  color="text-rose-400"
                />
              </div>
            </div>

            {/* Side panel: actions */}
            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-sm space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border">
                    Filing Actions
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">
                    Review and file your GSTR-3B return. Save overrides before
                    filing.
                  </p>
                </div>

                <div className="p-3 rounded-sm bg-muted/30 border border-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">
                      Period
                    </span>
                    <span className="font-bold font-mono">{draft.period}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">
                      Client
                    </span>
                    <span className="font-bold truncate max-w-[140px]">
                      {draft.clientName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">
                      Net ITC
                    </span>
                    <span className="font-bold font-mono text-primary">
                      {formatINR(netRow.total)}
                    </span>
                  </div>
                </div>

                {saveMsg && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    {saveMsg}
                  </p>
                )}

                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="w-full flex items-center justify-center gap-1.5 h-9 bg-muted/40 hover:bg-muted/60 border border-border text-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Draft
                    </>
                  )}
                </button>

                <button
                  onClick={() => fileMutation.mutate()}
                  disabled={fileMutation.isPending || !!filingMsg}
                  className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {fileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Filing
                      Return…
                    </>
                  ) : (
                    <>
                      File GSTR-3B <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-3 bg-card border border-border rounded-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`text-lg font-bold font-mono mt-1 ${color || "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
