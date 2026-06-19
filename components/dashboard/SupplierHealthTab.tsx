"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";
import {
  HeartPulse,
  Search,
  Loader2,
  AlertTriangle,
  Mail,
  Copy,
  CheckCircle2,
  X,
  UserCheck
} from "lucide-react";

interface SupplierHealthRow {
  supplierGstin: string;
  supplierName: string;
  totalInvoices: number;
  matchedCount: number;
  mismatchCount: number;
  missingCount: number;
  matchRate: number;
}

export default function SupplierHealthTab() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Chaser Modal states
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierHealthRow | null>(null);
  const [copied, setCopied] = useState(false);

  // 1. Fetch supplier health analytics
  const { data: healthRes, isLoading } = useQuery({
    queryKey: ["analytics", "supplier-health", { page, limit }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/analytics/supplier-health`, {
        params: { page, limit },
      });
      return res.data;
    },
  });

  const suppliers: SupplierHealthRow[] = healthRes?.data || [];

  // Filter local rows by search query
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierGstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return "text-success bg-compliance-success-bg border-success/20";
    if (rate >= 80) return "text-warn bg-warn-bg border-warn/20";
    return "text-alert bg-compliance-alert-bg border-alert/20";
  };

  const getComplianceBarColor = (rate: number) => {
    if (rate >= 95) return "bg-success";
    if (rate >= 80) return "bg-warn";
    return "bg-alert";
  };

  const getChaserTemplate = (supplier: SupplierHealthRow) => {
    return `Subject: URGENT: Input Tax Credit (ITC) Mismatch notice for invoices - ${supplier.supplierName}

Dear ${supplier.supplierName} Accounts Team,

We are writing to bring to your immediate attention a discrepancy identified during our routine GST reconciliation audit for the client portal under ${user?.firmName || "our firm"}. 

The matching records show that out of ${supplier.totalInvoices} invoice(s) raised by your firm under GSTIN: ${supplier.supplierGstin}, we have found matching records in our GSTR-2B portal for only ${supplier.matchedCount}. 
The remaining ${supplier.mismatchCount + supplier.missingCount} invoice(s) are either mismatching in tax values or have not been declared/filed in your GSTR-1, causing a direct Input Tax Credit (ITC) blockage.

Under Section 16(2)(aa) of the CGST Act, we cannot claim ITC unless the supplier declares the invoice in their GSTR-1 and it is reflected in our GSTR-2B. 

Please review your GSTR-1 filing logs for the recent periods immediately and ensure all pending invoices are uploaded and filed. We request you to reply with the amendment/filing verification ARN number as soon as possible.

Thank you for your prompt cooperation.

Best regards,
${user?.name || "Tax Compliance Auditor"}
${user?.firmName || "CA Associate Firm"}`;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Overview stats block (reduced padding, rounded-sm) */}
      <div className="p-4 bg-card border border-border rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <HeartPulse className="h-4 w-4 text-success animate-pulse" /> Supplier compliance ledger
          </h2>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Audit and rank supplier return filing compliance ratings based on mismatch records.
          </p>
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search supplier name or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 border border-border bg-background text-[11px] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center bg-card border border-border rounded-sm">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground mb-1.5" />
          <p className="text-[9px] text-muted-foreground font-semibold">Generating supplier list...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-sm bg-card">
          <UserCheck className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2.5" />
          <p className="text-[10px] font-bold text-foreground">100% Supplier Health</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            No discrepancy-causing suppliers found in current logs.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Supplier / GSTIN</th>
                  <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-center">Total Invoices</th>
                  <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-center">Audit Status</th>
                  <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Filing Rating</th>
                  <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSuppliers.map((row) => (
                  <tr key={row.supplierGstin} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          {row.supplierName || "Supplier Business"}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground mt-0.5 tracking-wider">
                          {row.supplierGstin}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center text-xs text-foreground font-semibold">
                      {row.totalInvoices}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2.5 text-[9px] font-mono">
                        <span className="text-success font-semibold">{row.matchedCount} M</span>
                        <span className="text-warn font-semibold">{row.mismatchCount} D</span>
                        <span className="text-alert font-semibold">{row.missingCount} X</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between">
                          <span className={`px-1 py-0.2 rounded-sm border text-[8px] leading-tight font-extrabold ${getComplianceColor(row.matchRate)}`}>
                            {row.matchRate}% match
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-none h-1 overflow-hidden">
                          <div
                            className={`h-full rounded-none ${getComplianceBarColor(row.matchRate)}`}
                            style={{ width: `${row.matchRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedSupplier(row)}
                        className="flex items-center gap-1 bg-background border border-border hover:bg-accent text-primary text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-sm shadow-sm transition-colors cursor-pointer ml-auto"
                      >
                        <Mail className="h-3 w-3" /> Draft chaser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chaser Email Modal Overlay (Sharp borders) */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-sm p-5 shadow-xl relative animate-in zoom-in-98 duration-200 flex flex-col max-h-[80vh]">
            <button
              onClick={() => setSelectedSupplier(null)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-1.5">
              <Mail className="h-4.5 w-4.5 text-primary" /> Compliance chaser notice
            </h3>
            <p className="text-[10px] text-muted-foreground mb-3 leading-normal">
              Notice template for <span className="font-bold text-foreground">{selectedSupplier.supplierName}</span>.
            </p>

            {/* Email Textbox area */}
            <div className="flex-1 overflow-y-auto border border-border rounded-sm bg-muted/40 p-3 font-mono text-[9px] text-foreground leading-relaxed whitespace-pre-wrap select-text mb-3 max-h-[350px]">
              {getChaserTemplate(selectedSupplier)}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="flex-1 py-1.5 border border-border hover:bg-accent text-[9px] font-bold uppercase rounded-sm transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleCopyText(getChaserTemplate(selectedSupplier))}
                className="flex-1 flex items-center justify-center gap-1 h-9 bg-primary hover:bg-primary/95 text-primary-foreground text-[9px] font-bold uppercase tracking-wider rounded-sm shadow transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Copied Text
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Notice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
