"use client";

import { useState } from "react";
import { Search, ShieldCheck, AlertTriangle, XCircle, FileText, Check } from "lucide-react";

interface SupplierCompliance {
  id: string;
  name: string;
  gstin: string;
  onTimeRate: number;
  itcOutstanding: number;
  avgDelayDays: number;
  status: "GOOD" | "AVERAGE" | "POOR";
}

const mockSuppliers: SupplierCompliance[] = [
  {
    id: "s1",
    name: "Apex Steel Industries",
    gstin: "27AAAAA1111A1Z1",
    onTimeRate: 98,
    itcOutstanding: 0,
    avgDelayDays: 1,
    status: "GOOD"
  },
  {
    id: "s2",
    name: "Mahindra & Mahindra Ltd",
    gstin: "27DDDDD4444D4Z4",
    onTimeRate: 92,
    itcOutstanding: 0,
    avgDelayDays: 3,
    status: "GOOD"
  },
  {
    id: "s3",
    name: "Rohan Logistics & Packing",
    gstin: "27BBBBB2222B2Z2",
    onTimeRate: 74,
    itcOutstanding: 12000,
    avgDelayDays: 9,
    status: "AVERAGE"
  },
  {
    id: "s4",
    name: "Creative Krafts Pvt Ltd",
    gstin: "27CCCCC3333C3Z3",
    onTimeRate: 48,
    itcOutstanding: 82500,
    avgDelayDays: 22,
    status: "POOR"
  },
  {
    id: "s5",
    name: "Dev Enterprises",
    gstin: "27EEEEE5555E5Z5",
    onTimeRate: 35,
    itcOutstanding: 145000,
    avgDelayDays: 28,
    status: "POOR"
  }
];

export default function SupplierMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "GOOD" | "AVERAGE" | "POOR">("ALL");
  const [reportGenerated, setReportGenerated] = useState<string | null>(null);

  const filteredSuppliers = mockSuppliers.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sup.gstin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || sup.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getComplianceBadge = (status: SupplierCompliance["status"]) => {
    switch (status) {
      case "GOOD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            High Reliability (90%+)
          </span>
        );
      case "AVERAGE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            Avg Reliability (70-90%)
          </span>
        );
      case "POOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            Poor Reliability (&lt;70%)
          </span>
        );
    }
  };

  const handleGenerateReport = (id: string) => {
    setReportGenerated(id);
    setTimeout(() => {
      setReportGenerated(null);
    }, 3000);
  };

  return (
    <section id="suppliers" className="py-16 border-b border-border bg-muted/30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Supplier Ledger Audit
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            The Supplier Filing Compliance Matrix
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track which vendors file late, mismatch records, and stall your ITC. Rate supplier compliance to negotiate better payment terms.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="bg-card border border-border rounded-xl shadow-md overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-border bg-muted/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendor or GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
              />
            </div>
            
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(["ALL", "GOOD", "AVERAGE", "POOR"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer border ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:text-foreground border-border"
                  }`}
                >
                  {status === "ALL" ? "All Vendors" : status === "GOOD" ? "90%+" : status === "AVERAGE" ? "70-90%" : "<70%"}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Grid list */}
          <div className="divide-y divide-border">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((sup) => (
                <div key={sup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{sup.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded bg-muted">
                        {sup.gstin}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span>On-Time Rate: <strong className="text-foreground">{sup.onTimeRate}%</strong></span>
                      <span>Avg Delay: <strong className="text-foreground">{sup.avgDelayDays} Days</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">ITC at Risk / Delayed</div>
                      <div className={`text-xs font-bold ${sup.itcOutstanding > 0 ? "text-alert" : "text-success"}`}>
                        {sup.itcOutstanding > 0 ? `₹${sup.itcOutstanding.toLocaleString("en-IN")}` : "Nil"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>{getComplianceBadge(sup.status)}</div>
                      <button
                        onClick={() => handleGenerateReport(sup.id)}
                        className="p-1.5 rounded border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Generate Vendor Report"
                      >
                        {reportGenerated === sup.id ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No vendors match your search or filters.
              </div>
            )}
          </div>

          {/* Supplier matrix insights footer */}
          <div className="p-3 bg-muted/20 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Powered by Sandbox.co.in GSTR-2A/2B filing frequency tracking.</span>
            <span>Tip: Deduct ITC-at-risk amount from vendor payments until returns are filed.</span>
          </div>

        </div>
      </div>
    </section>
  );
}
