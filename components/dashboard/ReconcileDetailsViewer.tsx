"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { formatINR, formatPeriod } from "@/lib/utils";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender
} from "@tanstack/react-table";
import {
  FileDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  ArrowRightLeft
} from "lucide-react";

interface ReconcileDetailsViewerProps {
  jobId: string;
  setActiveTab?: (tab: string) => void;
}

interface ReconResultRow {
  id: string;
  category: "MATCHED" | "AMOUNT_MISMATCH" | "IN_BOOKS_NOT_2B" | "IN_2B_NOT_BOOKS" | "POSSIBLE_MATCH";
  supplierGstin: string;
  supplierName: string;
  invoiceNo: string;
  purchaseRegister: { igst: number; cgst: number; sgst: number; total: number } | null;
  gstr2b: { igst: number; cgst: number; sgst: number; total: number } | null;
  diff: { igst: number; cgst: number; sgst: number; total: number } | null;
  matchConfidence: number | null;
}

export default function ReconcileDetailsViewer({ jobId, setActiveTab }: ReconcileDetailsViewerProps) {
  const router = useRouter();
  // Page states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch job details
  const { data: jobRes, isLoading: isJobLoading } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/${jobId}`);
      return res.data;
    },
  });

  // 2. Fetch matching results
  const { data: resultsRes, isLoading: isResultsLoading } = useQuery({
    queryKey: ["jobs", jobId, "results", { page, limit, selectedCategory, search, sortBy, order }],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/reconcile/${jobId}/results`, {
        params: {
          page,
          limit,
          category: selectedCategory || undefined,
          search: search.trim() || undefined,
          sortBy,
          order,
        },
      });
      return res.data;
    },
  });

  const job = jobRes?.data;
  const results: ReconResultRow[] = resultsRes?.data || [];
  const pagination = resultsRes?.pagination || { totalPages: 1, total: 0 };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  // 3. Export Excel Report
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await api.get(`${API_URL}/api/reconcile/${jobId}/export`, {
        responseType: "blob",
      });
      
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `GST_Audit_Report_${jobId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export Excel report:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Columns definition using TanStack Table helpers
  const columnHelper = createColumnHelper<ReconResultRow>();
  const columns = [
    columnHelper.accessor("supplierName", {
      header: () => (
        <button onClick={() => handleSort("supplierName")} className="flex items-center gap-1 hover:text-foreground font-bold cursor-pointer">
          Supplier <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: (info) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-foreground text-[11px] truncate max-w-[150px]">{info.getValue() || "Supplier"}</span>
          <span className="font-mono text-[8px] text-muted-foreground mt-0.5">{info.row.original.supplierGstin}</span>
        </div>
      ),
    }),
    columnHelper.accessor("invoiceNo", {
      header: () => (
        <button onClick={() => handleSort("invoiceNo")} className="flex items-center gap-1 hover:text-foreground font-bold cursor-pointer">
          Invoice No <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: (info) => <span className="font-mono font-bold text-[11px]">{info.getValue()}</span>,
    }),
    columnHelper.accessor("purchaseRegister", {
      header: () => <span className="font-extrabold text-right block uppercase text-[8px] tracking-widest text-muted-foreground">Ledger Books</span>,
      cell: (info) => {
        const val = info.getValue();
        return val ? (
          <div className="text-right text-[11px]">
            <span className="font-mono font-bold tracking-tight text-foreground">{formatINR(val.total)}</span>
            {(val.igst !== 0 || val.cgst !== 0) && (
              <span className="block text-[8px] text-muted-foreground mt-0.5 font-mono">
                {val.igst > 0 ? `I:${formatINR(val.igst)}` : `C/S:${formatINR(val.cgst)}`}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground block text-right font-mono text-[10px]">—</span>
        );
      },
    }),
    columnHelper.accessor("gstr2b", {
      header: () => <span className="font-extrabold text-right block uppercase text-[8px] tracking-widest text-muted-foreground">Portal 2B</span>,
      cell: (info) => {
        const val = info.getValue();
        return val ? (
          <div className="text-right text-[11px]">
            <span className="font-mono font-bold tracking-tight text-foreground">{formatINR(val.total)}</span>
            {(val.igst !== 0 || val.cgst !== 0) && (
              <span className="block text-[8px] text-muted-foreground mt-0.5 font-mono">
                {val.igst > 0 ? `I:${formatINR(val.igst)}` : `C/S:${formatINR(val.cgst)}`}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground block text-right font-mono text-[10px]">—</span>
        );
      },
    }),
    columnHelper.accessor("diff", {
      header: () => <span className="font-extrabold text-right block uppercase text-[8px] tracking-widest text-muted-foreground">Diff</span>,
      cell: (info) => {
        const val = info.getValue();
        if (!val || val.total === 0) return <span className="text-success text-[11px] font-mono font-bold block text-right">₹0.00</span>;
        
        const details = [];
        if (val.igst !== 0) details.push(`I:${formatINR(val.igst)}`);
        if (val.cgst !== 0) details.push(`C:${formatINR(val.cgst)}`);
        
        return (
          <div className="text-right font-mono text-[11px] font-bold text-destructive tracking-tight leading-tight">
            <span>{formatINR(val.total)}</span>
            {details.length > 0 && (
              <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">
                {details.join(" | ")}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Status",
      cell: (info) => {
        const cat = info.getValue();
        const config = {
          MATCHED: "bg-compliance-success-bg text-compliance-success border-compliance-success/20",
          AMOUNT_MISMATCH: "bg-compliance-warn-bg text-compliance-warn border-compliance-warn/20",
          IN_BOOKS_NOT_2B: "bg-compliance-alert-bg text-compliance-alert border-compliance-alert/20",
          IN_2B_NOT_BOOKS: "bg-compliance-info-bg text-compliance-info border-compliance-info/20",
          POSSIBLE_MATCH: "bg-amber-50 text-amber-800 border-amber-100",
        };
        return (
          <span className={`inline-flex px-1.5 py-0.2 rounded-sm text-[8px] font-bold uppercase border ${config[cat] || "bg-muted text-muted-foreground"}`}>
            {cat.replace(/_/g, " ")}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getRowBgColor = (category: string) => {
    switch (category) {
      case "MATCHED":
        return "border-l-2 border-l-success bg-compliance-success-bg/10 hover:bg-compliance-success-bg/20";
      case "AMOUNT_MISMATCH":
        return "border-l-2 border-l-warn bg-compliance-warn-bg/10 hover:bg-compliance-warn-bg/20";
      case "IN_BOOKS_NOT_2B":
        return "border-l-2 border-l-alert bg-compliance-alert-bg/10 hover:bg-compliance-alert-bg/20";
      case "IN_2B_NOT_BOOKS":
        return "border-l-2 border-l-info bg-compliance-info-bg/10 hover:bg-compliance-info-bg/20";
      case "POSSIBLE_MATCH":
        return "border-l-2 border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/15";
      default:
        return "";
    }
  };

  const categories = [
    { value: "", label: "All" },
    { value: "MATCHED", label: "Matched" },
    { value: "AMOUNT_MISMATCH", label: "Diffs" },
    { value: "IN_BOOKS_NOT_2B", label: "Books Only" },
    { value: "IN_2B_NOT_BOOKS", label: "2B Only" },
    { value: "POSSIBLE_MATCH", label: "Fuzzy" },
  ];

  if (isJobLoading) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-sm">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground mb-1.5" />
        <p className="text-[9px] text-muted-foreground font-semibold">Loading matching rows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      
      {/* Title & Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card border border-border rounded-sm">
        <div>
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
            <BookOpen className="h-4 w-4 text-primary" /> Audit run: {jobId.slice(0, 8)}
          </h2>
          <p className="text-[9px] text-muted-foreground mt-1.5">
            Audit filing period: <span className="font-semibold text-foreground">{job ? formatPeriod(job.period) : ""}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/reconcile/new")}
            className="px-2.5 py-1.5 border border-border bg-background hover:bg-accent text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
          >
            Back to history
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExporting || isResultsLoading}
            className="flex items-center gap-1 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-sm shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Exporting
              </>
            ) : (
              <>
                Export report <FileDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics breakdown row (High-Density) */}
      {job && job.status === "done" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-card border border-border rounded-sm flex items-center gap-2.5 select-none">
            <div className="h-7 w-7 rounded-sm bg-compliance-success-bg text-compliance-success flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wider leading-none">Matched ITC</p>
              <h4 className="text-xs font-bold text-success mt-1">{formatINR(job.summary?.itcMatched)}</h4>
            </div>
          </div>
          
          <div className="p-3 bg-card border border-border rounded-sm flex items-center gap-2.5 select-none">
            <div className="h-7 w-7 rounded-sm bg-compliance-warn-bg text-compliance-warn flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wider leading-none">Tax Mismatch</p>
              <h4 className="text-xs font-bold text-warn mt-1">{job.summary?.amountMismatchCount || 0} rows</h4>
            </div>
          </div>

          <div className="p-3 bg-card border border-border rounded-sm flex items-center gap-2.5 select-none">
            <div className="h-7 w-7 rounded-sm bg-compliance-alert-bg text-compliance-alert flex items-center justify-center shrink-0">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wider leading-none">Books Only</p>
              <h4 className="text-xs font-bold text-alert mt-1">{job.summary?.inBooksNot2bCount || 0} rows</h4>
            </div>
          </div>

          <div className="p-3 bg-card border border-border rounded-sm flex items-center gap-2.5 select-none">
            <div className="h-7 w-7 rounded-sm bg-compliance-info-bg text-compliance-info flex items-center justify-center shrink-0">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wider leading-none">GSTR-2B Only</p>
              <h4 className="text-xs font-bold text-info mt-1">{job.summary?.in2bNotBooksCount || 0} rows</h4>
            </div>
          </div>
        </div>
      )}

      {/* Main Table view */}
      <div className="p-4 bg-card border border-border rounded-sm space-y-3">
        {/* Filters and local search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-0.5 bg-muted/40 p-0.5 rounded-sm border border-border">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setSelectedCategory(c.value);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === c.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoice or supplier..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-border bg-background text-[11px] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Invoice Grid Table */}
        {isResultsLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground mb-1.5" />
            <p className="text-[9px] text-muted-foreground font-semibold">Running database matching queries...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-border rounded-sm bg-muted/15">
            <AlertCircle className="h-6 w-6 text-muted-foreground/45 mx-auto mb-1.5" />
            <p className="text-[10px] font-bold text-foreground">No invoices match category filters</p>
          </div>
        ) : (
          <div className="border border-border rounded-sm overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-muted/40 border-b border-border">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border/40">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors ${getRowBgColor(row.original.category)}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-2.5 text-xs align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-2.5 border-t border-border bg-muted/15 flex items-center justify-between gap-3 text-[10px] font-bold text-muted-foreground select-none">
              <span>
                Showing <span className="text-foreground font-mono">{results.length}</span> of <span className="text-foreground font-mono">{pagination.total}</span> rows
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 border border-border rounded-sm hover:bg-accent text-foreground disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span>
                  Page <span className="text-foreground font-mono">{page}</span> of <span className="text-foreground font-mono">{pagination.totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-1 border border-border rounded-sm hover:bg-accent text-foreground disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
