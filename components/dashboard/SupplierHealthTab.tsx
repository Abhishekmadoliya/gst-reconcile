"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";
import { formatINR } from "@/lib/utils";
import {
  HeartPulse,
  Search,
  Loader2,
  AlertTriangle,
  Mail,
  Copy,
  CheckCircle2,
  X,
  UserCheck,
  Send,
  Eye,
  RefreshCw,
  Clock,
  ShieldAlert,
  Building2,
  Check,
  Edit2
} from "lucide-react";

interface SupplierDiscrepancyRow {
  supplierGstin: string;
  supplierName: string;
  totalInvoices: number;
  matchedCount: number;
  mismatchCount: number;
  missingCount: number;
  atRiskTax: number;
  contactEmail: string | null;
  contactPhone: string | null;
  contactPerson: string | null;
  lastFollowUpStatus: string | null;
  lastFollowUpAt: string | null;
}

interface FollowUpLogItem {
  id: string;
  supplierGstin: string;
  supplierName: string;
  recipientEmail: string;
  channel: string;
  subject: string;
  messageBodyHtml: string | null;
  status: string;
  invoiceCount: number;
  totalDiscrepancyAmount: number;
  invoiceNumbers: string[] | null;
  sentAt: string;
}

interface DiscrepancyInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string | null;
  purchaseRegister: { total: number } | null;
  gstr2b: { total: number } | null;
  diff: { total: number } | null;
  category: string;
  followUpStatus: string;
}
export default function SupplierHealthTab() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Navigation states
  const [activeTab, setActiveTab] = useState<"suppliers" | "history">("suppliers");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Selected supplier for follow-up modal
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDiscrepancyRow | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [ccUser, setCcUser] = useState(true);
  const [modalView, setModalView] = useState<"form" | "preview">("form");

  // Inline email editing state
  const [editingGstin, setEditingGstin] = useState<string | null>(null);
  const [inlineEmail, setInlineEmail] = useState("");

  // Viewing history log modal
  const [viewingLog, setViewingLog] = useState<FollowUpLogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Fetch Summary Metrics
  const { data: summaryRes } = useQuery({
    queryKey: ["follow-ups", "summary"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/follow-ups/summary`);
      return res.data;
    },
  });

  const summary = summaryRes?.data || {
    totalSuppliersWithDiscrepancy: 0,
    totalAtRiskTax: 0,
    totalNoticesDispatched: 0,
    totalResolved: 0,
  };

  // 2. Fetch Suppliers with Discrepancies
  const { data: suppliersRes, isLoading: isSuppliersLoading, refetch: refetchSuppliers } = useQuery({
    queryKey: ["follow-ups", "suppliers", { page, limit, search: searchQuery }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/follow-ups/suppliers`, {
        params: { page, limit, search: searchQuery || undefined },
      });
      return res.data;
    },
  });

  const suppliers: SupplierDiscrepancyRow[] = suppliersRes?.data || [];

  // 3. Fetch Dispatched History Logs
  const { data: historyRes, isLoading: isHistoryLoading, refetch: refetchHistory } = useQuery({
    queryKey: ["follow-ups", "history", { page: 1, limit: 30 }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/follow-ups/history`, {
        params: { page: 1, limit: 30 },
      });
      return res.data;
    },
    enabled: activeTab === "history",
  });

  const historyLogs: FollowUpLogItem[] = historyRes?.data || [];

  // 4. Fetch discrepancy invoices when modal is open
  const { data: invoicesRes, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["follow-ups", "invoices", selectedSupplier?.supplierGstin],
    queryFn: async () => {
      if (!selectedSupplier) return [];
      const res = await api.get(`${API_URL}/api/follow-ups/suppliers/${selectedSupplier.supplierGstin}/invoices`);
      return res.data?.data || [];
    },
    enabled: !!selectedSupplier,
  });

  const discrepancyInvoices: DiscrepancyInvoice[] = invoicesRes || [];

  // 5. Send Follow-up Notice Mutation
  const sendNoticeMutation = useMutation({
    mutationFn: async (payload: {
      supplierGstin: string;
      recipientEmail: string;
      contactPerson?: string;
      customNotes?: string;
      ccUser?: boolean;
    }) => {
      const res = await api.post(`${API_URL}/api/follow-ups/send`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      setToastMessage({
        type: "success",
        text: data.data?.message || "Compliance notice dispatched successfully and audit copy sent to your email.",
      });
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      setSelectedSupplier(null);
      setTimeout(() => setToastMessage(null), 6000);
    },
    onError: (err: any) => {
      setToastMessage({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to dispatch follow-up email notice.",
      });
      setTimeout(() => setToastMessage(null), 6000);
    },
  });

  // 6. Save Contact Email Mutation
  const saveContactMutation = useMutation({
    mutationFn: async ({ gstin, email }: { gstin: string; email: string }) => {
      const res = await api.post(`${API_URL}/api/follow-ups/suppliers/${gstin}/contact`, { email });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-ups", "suppliers"] });
      setEditingGstin(null);
      setToastMessage({ type: "success", text: "Supplier contact email updated." });
      setTimeout(() => setToastMessage(null), 3000);
    },
    onError: (err: any) => {
      setToastMessage({ type: "error", text: err.response?.data?.error?.message || "Failed to update email." });
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  // 7. Mark Resolved Mutation
  const resolveMutation = useMutation({
    mutationFn: async (logId: string) => {
      const res = await api.post(`${API_URL}/api/follow-ups/${logId}/resolve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      setToastMessage({ type: "success", text: "Discrepancy marked as resolved." });
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  const handleOpenNoticeModal = (supplier: SupplierDiscrepancyRow) => {
    setSelectedSupplier(supplier);
    setRecipientEmail(supplier.contactEmail || "");
    setContactPerson(supplier.contactPerson || "");
    setCustomNotes("");
    setCcUser(true);
    setModalView("form");
  };

  const handleSendNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      setToastMessage({ type: "error", text: "Please provide a valid recipient email address." });
      return;
    }

    sendNoticeMutation.mutate({
      supplierGstin: selectedSupplier.supplierGstin,
      recipientEmail: recipientEmail.trim(),
      contactPerson: contactPerson.trim() || undefined,
      customNotes: customNotes.trim() || undefined,
      ccUser,
    });
  };

  const getStatusBadge = (status: string | null, date: string | null) => {
    if (status === "resolved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> Resolved
        </span>
      );
    }
    if (status === "sent") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <Clock className="h-3 w-3" /> Notice Sent {date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
        <AlertTriangle className="h-3 w-3" /> Action Required
      </span>
    );
  };
  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-3 rounded border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            Vendor Follow-up & Compliance Command Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-generate and dispatch formal GST ITC Discrepancy notices (Section 16(2)(aa)) to defaulting suppliers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "suppliers"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active Discrepancies ({summary.totalSuppliersWithDiscrepancy})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "history"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Trail & Logs ({summary.totalNoticesDispatched})
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-rose-500/20 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Blocked / At-Risk ITC</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2 font-mono">
            {formatINR(summary.totalAtRiskTax)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            Subject to DRC-01C notice if unfiled
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Suppliers Requiring Action</span>
            <Building2 className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2 font-mono">
            {summary.totalSuppliersWithDiscrepancy}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            Vendors with unfiled/mismatched invoices
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Notices Dispatched</span>
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2 font-mono">
            {summary.totalNoticesDispatched}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            Legal notices delivered via email
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Settled / Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            {summary.totalResolved}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            Verified filed or credit settled
          </div>
        </div>
      </div>

      {/* TAB 1: ACTIVE SUPPLIERS WITH DISCREPANCIES */}
      {activeTab === "suppliers" && (
        <div className="space-y-4">
          {/* Search & Actions Bar */}
          <div className="p-3 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search supplier name or GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => refetchSuppliers()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border bg-background hover:bg-accent rounded-md transition-colors text-foreground cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh List
            </button>
          </div>

          {/* Supplier Table */}
          {isSuppliersLoading ? (
            <div className="p-12 text-center bg-card border border-border rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Scanning discrepancy records...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-lg bg-card">
              <UserCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-foreground">100% Supplier Compliance</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                No active ITC discrepancies or unfiled supplier invoices detected across your recent reconciliation jobs.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Supplier / GSTIN</th>
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Contact Email</th>
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">At-Risk ITC</th>
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-center">Invoices</th>
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Audit Status</th>
                      <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {suppliers.map((row) => (
                      <tr key={row.supplierGstin} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{row.supplierName}</div>
                          <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{row.supplierGstin}</div>
                        </td>

                        <td className="p-3">
                          {editingGstin === row.supplierGstin ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="email"
                                value={inlineEmail}
                                onChange={(e) => setInlineEmail(e.target.value)}
                                placeholder="vendor@domain.com"
                                className="px-2 py-1 text-xs border border-primary bg-background rounded focus:outline-none w-44"
                              />
                              <button
                                onClick={() => saveContactMutation.mutate({ gstin: row.supplierGstin, email: inlineEmail })}
                                disabled={saveContactMutation.isPending}
                                className="p-1 bg-primary text-primary-foreground rounded hover:opacity-90 cursor-pointer"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={() => setEditingGstin(null)} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              <span className={row.contactEmail ? "text-foreground font-medium" : "text-muted-foreground italic text-[11px]"}>
                                {row.contactEmail || "No email on file"}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingGstin(row.supplierGstin);
                                  setInlineEmail(row.contactEmail || "");
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-primary transition-opacity cursor-pointer"
                                title="Edit Email"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <span className="font-bold text-rose-600 font-mono">{formatINR(row.atRiskTax)}</span>
                        </td>

                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="text-amber-600 font-semibold">{row.mismatchCount} Diff</span>
                            <span>•</span>
                            <span className="text-rose-600 font-semibold">{row.missingCount} Missing</span>
                          </div>
                        </td>

                        <td className="p-3">
                          {getStatusBadge(row.lastFollowUpStatus, row.lastFollowUpAt)}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenNoticeModal(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                          >
                            <Mail className="h-3.5 w-3.5" /> Prepare Notice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      {/* TAB 2: AUDIT TRAIL & NOTICE LOGS */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dispatched Legal Notices Log ({historyLogs.length})
            </h2>
            <button
              onClick={() => refetchHistory()}
              className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border rounded hover:bg-accent cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {isHistoryLoading ? (
            <div className="p-12 text-center bg-card border border-border rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-lg bg-card">
              <Mail className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs font-bold text-foreground">No Follow-up Notices Dispatched Yet</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Notices sent to suppliers will appear here with full delivery timestamps and audit copies.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Date / Time</th>
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Supplier</th>
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Recipient Email</th>
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">Discrepancy</th>
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-center">Status</th>
                    <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono text-[11px] text-muted-foreground">
                        {new Date(log.sentAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{log.supplierName}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{log.supplierGstin}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-blue-600 font-medium">
                        {log.recipientEmail}
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-bold text-rose-600 font-mono">{formatINR(log.totalDiscrepancyAmount)}</div>
                        <div className="text-[10px] text-muted-foreground">{log.invoiceCount} invoice(s)</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingLog(log)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded hover:bg-secondary/80 cursor-pointer"
                          >
                            <Eye className="h-3 w-3" /> View Notice
                          </button>
                          {log.status !== "resolved" && (
                            <button
                              onClick={() => resolveMutation.mutate(log.id)}
                              disabled={resolveMutation.isPending}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold rounded hover:bg-emerald-500/20 cursor-pointer"
                            >
                              <Check className="h-3 w-3" /> Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DISPATCH NOTICE MODAL */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-2xl rounded-lg p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedSupplier(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                Issue Statutory ITC Discrepancy Notice
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Dispatching to <strong className="text-foreground">{selectedSupplier.supplierName}</strong> ({selectedSupplier.supplierGstin})
            </p>

            {/* Toggle Modal View: Form vs Preview */}
            <div className="flex gap-2 border-b border-border pb-2 mb-4">
              <button
                type="button"
                onClick={() => setModalView("form")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  modalView === "form" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Notice Setup & Details
              </button>
              <button
                type="button"
                onClick={() => setModalView("preview")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  modalView === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Email Preview
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {modalView === "form" ? (
                <form id="notice-form" onSubmit={handleSendNoticeSubmit} className="space-y-4">
                  {/* Summary Callout */}
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-rose-600 uppercase">Blocked / At-Risk Tax</div>
                      <div className="text-lg font-black text-rose-600 font-mono">
                        {formatINR(selectedSupplier.atRiskTax)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Discrepancy Invoices</div>
                      <div className="text-sm font-black text-foreground font-mono">
                        {selectedSupplier.mismatchCount + selectedSupplier.missingCount} invoices
                      </div>
                    </div>
                  </div>

                  {/* Recipient Email */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Recipient Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="accounts@vendor.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      Supplier finance, taxation, or billing department email.
                    </span>
                  </div>

                  {/* Contact Person Name */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Contact Person (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Accounts Manager"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Custom Notes */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Auditor Instructions / Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Please amend in GSTR-1 before the 20th to avoid credit reversal."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* CC Me Checkbox */}
                  <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-md border border-border/80">
                    <input
                      type="checkbox"
                      id="cc-me"
                      checked={ccUser}
                      onChange={(e) => setCcUser(e.target.checked)}
                      className="rounded text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="cc-me" className="text-xs font-medium text-foreground cursor-pointer">
                      Send an audit confirmation report to my email (<strong>{user?.email}</strong>)
                    </label>
                  </div>

                  {/* Discrepancy Invoices List */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Invoices to be attached ({discrepancyInvoices.length})
                    </div>
                    {isInvoicesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <div className="border border-border rounded-md overflow-hidden max-h-40 overflow-y-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-muted/40 border-b border-border">
                            <tr>
                              <th className="p-2 font-bold">Invoice No</th>
                              <th className="p-2 font-bold">Date</th>
                              <th className="p-2 font-bold text-right">Tax (₹)</th>
                              <th className="p-2 font-bold">Audit Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {discrepancyInvoices.map((inv) => (
                              <tr key={inv.id}>
                                <td className="p-2 font-mono font-semibold">{inv.invoiceNo}</td>
                                <td className="p-2 text-muted-foreground">{inv.invoiceDate || "—"}</td>
                                <td className="p-2 font-mono text-rose-600 text-right font-bold">
                                  {formatINR(inv.purchaseRegister?.total || inv.diff?.total || 0)}
                                </td>
                                <td className="p-2 text-[10px]">
                                  <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 font-semibold border border-rose-500/20">
                                    {inv.category}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                /* Live Preview Tab */
                <div className="border border-border rounded-md bg-slate-900 p-4 text-slate-100 font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto space-y-3">
                  <div className="border-b border-slate-700 pb-2 text-slate-400">
                    <div><strong>TO:</strong> {recipientEmail || "accounts@vendor.com"}</div>
                    <div><strong>SUBJECT:</strong> URGENT: GST ITC Discrepancy & GSTR-1 Declaration Notice</div>
                    <div><strong>LEGAL CITATION:</strong> Section 16(2)(aa) of CGST Act, 2017 & Rule 36(4)</div>
                  </div>
                  <div className="text-slate-300">
                    <p>Dear Sir/Madam,</p>
                    <p>
                      During the routine GST reconciliation audit for our client, we have identified{" "}
                      <strong>{discrepancyInvoices.length} invoice(s)</strong> aggregating to{" "}
                      <span className="text-rose-400 font-bold">{formatINR(selectedSupplier.atRiskTax)}</span> in Input Tax Credit that are missing from GSTR-2B or reflect discrepancies.
                    </p>
                    <p>Under Section 16(2)(aa), ITC cannot be claimed unless filed in your GSTR-1.</p>
                    {customNotes && (
                      <p className="p-2 bg-slate-800 rounded border border-slate-700 text-amber-300">
                        <strong>Auditor Note:</strong> {customNotes}
                      </p>
                    )}
                    <p>Please verify against your outward sales register and furnish the GSTR-1 ARN.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 border border-border text-xs font-bold rounded-md hover:bg-accent text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="notice-form"
                disabled={sendNoticeMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              >
                {sendNoticeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Dispatching Notice...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Dispatch Compliance Notice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PAST SENT NOTICE MODAL */}
      {viewingLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-2xl rounded-lg p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <button
              onClick={() => setViewingLog(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-sm font-bold text-foreground mb-1">
              Dispatched Legal Notice Copy
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Sent to <strong>{viewingLog.recipientEmail}</strong> on {new Date(viewingLog.sentAt).toLocaleString("en-IN")}
            </p>

            <div className="flex-1 overflow-y-auto border border-border rounded-md bg-muted/20 p-4">
              {viewingLog.messageBodyHtml ? (
                <div
                  className="prose dark:prose-invert max-w-none text-xs"
                  dangerouslySetInnerHTML={{ __html: viewingLog.messageBodyHtml }}
                />
              ) : (
                <p className="text-xs text-muted-foreground italic">No HTML body archived for this record.</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-4">
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold rounded-md hover:bg-secondary/80 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
