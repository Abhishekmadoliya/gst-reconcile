"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { formatINR } from "@/lib/utils";
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileDown,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  TrendingUp,
  AlertCircle,
  ArrowRightLeft,
  X,
  FileText
} from "lucide-react";

interface TaxBreakdown {
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  total: number;
}

interface ReconResultRow {
  category: "MATCHED" | "AMOUNT_MISMATCH" | "IN_BOOKS_NOT_2B" | "IN_2B_NOT_BOOKS" | "POSSIBLE_MATCH";
  supplierGstin: string;
  supplierName: string;
  invoiceNo: string;
  invoiceDate: string;
  purchaseRegister: TaxBreakdown | null;
  gstr2b: TaxBreakdown | null;
  diff: TaxBreakdown | null;
  matchConfidence: number | null;
}

interface ReconciliationSummary {
  matchedCount: number;
  amountMismatchCount: number;
  inBooksNot2bCount: number;
  in2bNotBooksCount: number;
  possibleMatchCount: number;
  itcMatched: number;
  itcAtRisk: number;
  itcUnclaimed: number;
}

interface ReconciliationResponse {
  summary: ReconciliationSummary;
  results: ReconResultRow[];
  warnings: {
    purchaseRegister: string[];
    gstr2b: string[];
  };
  errors: {
    purchaseRegister: string[];
    gstr2b: string[];
  };
}

export default function OfflineReconciliationClient() {
  // Upload States
  const [purchaseFile, setPurchaseFile] = useState<File | null>(null);
  const [gstr2bFile, setGstr2bFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result States
  const [reconData, setReconData] = useState<ReconciliationResponse | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal State
  const [selectedRow, setSelectedRow] = useState<ReconResultRow | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Drag and drop states
  const [dragActivePR, setDragActivePR] = useState(false);
  const [dragActive2B, setDragActive2B] = useState(false);

  // Handle file drops
  const handleDrag = (e: React.DragEvent, type: "pr" | "2b") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === "pr") setDragActivePR(true);
      else setDragActive2B(true);
    } else if (e.type === "dragleave") {
      if (type === "pr") setDragActivePR(false);
      else setDragActive2B(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "pr" | "2b") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "pr") setDragActivePR(false);
    else setDragActive2B(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === "pr") setPurchaseFile(file);
      else setGstr2bFile(file);
    }
  };

  // Run offline reconciliation
  const handleReconcile = async () => {
    if (!purchaseFile || !gstr2bFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStep("Uploading spreadsheets...");

    const formData = new FormData();
    formData.append("purchaseRegister", purchaseFile);
    formData.append("gstr2b", gstr2bFile);

    try {
      setTimeout(() => setProcessStep("Parsing Purchase Register & extracting invoices..."), 1000);
      setTimeout(() => setProcessStep("Ingesting GSTR-2B data structures..."), 2200);
      setTimeout(() => setProcessStep("Running multi-key & fuzzy-matching algorithms..."), 3500);

      const response = await axios.post(`${API_URL}/api/offline-reconcile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setReconData(response.data.data);
      } else {
        setErrorMessage(response.data.error?.message || "Reconciliation failed");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error?.message ||
        err.message ||
        "An error occurred while reconciling. Please ensure files are valid formats."
      );
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  // Export results to Excel
  const handleExportExcel = async () => {
    if (!reconData) return;
    setIsExportingExcel(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/offline-reconcile/export/excel`,
        {
          results: reconData.results,
          summary: reconData.summary,
          gstin: "OFFLINE_AUDIT",
          period: "ALL",
          firmName: "Offline Audit Client",
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Offline_GST_Reconciliation_Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Excel export failed:", err);
      alert("Failed to export Excel report. Please try again.");
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Reset and upload new files
  const handleReset = () => {
    setPurchaseFile(null);
    setGstr2bFile(null);
    setReconData(null);
    setFilterCategory("");
    setSearchTerm("");
    setCurrentPage(1);
    setErrorMessage(null);
  };

  // Filter and Search logic
  const filteredResults = (reconData?.results || []).filter((row) => {
    const matchesCategory = filterCategory === "" || row.category === filterCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      row.supplierName.toLowerCase().includes(searchLower) ||
      row.supplierGstin.toLowerCase().includes(searchLower) ||
      row.invoiceNo.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Compute stats for summary
  const totalPurchaseInvoices = (reconData?.results || []).filter(
    (r) => r.category !== "IN_2B_NOT_BOOKS"
  ).length;

  const totalBooksItc = (reconData?.results || []).reduce(
    (acc, r) => acc + (r.purchaseRegister?.total || 0),
    0
  );
  const totalGstr2bItc = (reconData?.results || []).reduce(
    (acc, r) => acc + (r.gstr2b?.total || 0),
    0
  );
  const itcDifference = totalBooksItc - totalGstr2bItc;

  // Category badges configuration
  const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    MATCHED: { label: "Matched", color: "text-emerald-500 border-emerald-500/20", bg: "bg-emerald-500/10" },
    AMOUNT_MISMATCH: { label: "Amount Mismatch", color: "text-amber-500 border-amber-500/20", bg: "bg-amber-500/10" },
    IN_BOOKS_NOT_2B: { label: "Missing in 2B", color: "text-rose-500 border-rose-500/20", bg: "bg-rose-500/10" },
    IN_2B_NOT_BOOKS: { label: "Unclaimed (2B)", color: "text-blue-500 border-blue-500/20", bg: "bg-blue-500/10" },
    POSSIBLE_MATCH: { label: "Possible Match", color: "text-purple-500 border-purple-500/20", bg: "bg-purple-500/10" },
  };

  return (
    <div className="w-full">
      {/* ========================================================
          UPLOAD VIEW (Shown only when no reconciliation data loaded)
          ======================================================== */}
      {!reconData && !isProcessing && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 print:hidden">
          <div className="border border-border bg-card/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl">
            
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl border border-rose-500/25 bg-rose-500/10 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-rose-500">Processing Error</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              
              {/* 1. Purchase Register File Upload */}
              <div
                onDragEnter={(e) => handleDrag(e, "pr")}
                onDragOver={(e) => handleDrag(e, "pr")}
                onDragLeave={(e) => handleDrag(e, "pr")}
                onDrop={(e) => handleDrop(e, "pr")}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors duration-200 bg-muted/25 ${
                  dragActivePR ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <input
                  type="file"
                  id="purchase-upload"
                  accept=".xlsx,.xls,.csv"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPurchaseFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="p-4 bg-background border border-border rounded-xl mb-4 shadow-sm">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-1">Upload Purchase Register</h3>
                <p className="text-[11px] text-muted-foreground text-center mb-4 max-w-[200px]">
                  Drag and drop your Excel (.xlsx) or CSV export here
                </p>
                
                {purchaseFile ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[150px]">{purchaseFile.name}</span>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Select File</span>
                )}
              </div>

              {/* 2. GSTR-2B File Upload */}
              <div
                onDragEnter={(e) => handleDrag(e, "2b")}
                onDragOver={(e) => handleDrag(e, "2b")}
                onDragLeave={(e) => handleDrag(e, "2b")}
                onDrop={(e) => handleDrop(e, "2b")}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors duration-200 bg-muted/25 ${
                  dragActive2B ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <input
                  type="file"
                  id="gstr2b-upload"
                  accept=".xlsx,.xls,.json,.csv"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setGstr2bFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="p-4 bg-background border border-border rounded-xl mb-4 shadow-sm">
                  <FileJson className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-1">Upload GSTR-2B File</h3>
                <p className="text-[11px] text-muted-foreground text-center mb-4 max-w-[200px]">
                  Drag and drop portal JSON or Excel download here
                </p>

                {gstr2bFile ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[150px]">{gstr2bFile.name}</span>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Select File</span>
                )}
              </div>

            </div>

            {/* Run Action */}
            <div className="flex justify-center">
              <button
                onClick={handleReconcile}
                disabled={!purchaseFile || !gstr2bFile}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/95 disabled:opacity-50 disabled:shadow-none hover:translate-y-[-1px] transition-all cursor-pointer animate-pulse"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Start Free Auto-Reconciliation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PROCESSING VIEW (Interactive loader)
          ======================================================== */}
      {isProcessing && (
        <div className="max-w-md mx-auto px-4 text-center print:hidden py-16">
          <div className="border border-border bg-card rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-primary animate-spin mb-6" />
            <h3 className="text-lg font-bold mb-2">Analyzing Invoices</h3>
            <p className="text-sm text-muted-foreground mb-4">{processStep}</p>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-2/3 rounded-full animate-pulse"></div>
            </div>
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono mt-6">
              Data processed entirely in-memory
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          RESULTS VIEW (Summary & Discrepancies)
          ======================================================== */}
      {reconData && !isProcessing && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Toolbar (Hidden during Print) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
            <div className="text-left">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Reconciliation Complete
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Processed {totalPurchaseInvoices} purchase register invoices against {reconData.results.length} total matched entries.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Upload Different Files
              </button>
              <button
                onClick={handleExportExcel}
                disabled={isExportingExcel}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileDown className="h-3.5 w-3.5" />
                {isExportingExcel ? "Generating Excel..." : "Excel Report"}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                PDF Summary
              </button>
            </div>
          </div>

          {/* Warnings Alert Banner (Hidden during Print) */}
          {(reconData.warnings.purchaseRegister.length > 0 || reconData.warnings.gstr2b.length > 0) && (
            <div className="mb-6 p-4 border border-amber-500/20 bg-amber-500/10 rounded-xl flex items-start gap-3 print:hidden">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-bold text-amber-500">File Ingestion Warnings</h4>
                <ul className="text-[11px] text-muted-foreground mt-1.5 space-y-1 list-disc pl-4">
                  {reconData.warnings.purchaseRegister.map((w, idx) => (
                    <li key={`pr-warn-${idx}`}>{w}</li>
                  ))}
                  {reconData.warnings.gstr2b.map((w, idx) => (
                    <li key={`g2b-warn-${idx}`}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 1. Summary Cards Dashboard */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            {/* Box 1: Total Purchase Invoices */}
            <div className="border border-border bg-card/50 rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Books Purchase Invoices
              </span>
              <span className="text-2xl font-black">{totalPurchaseInvoices}</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Found in Books Ledger</span>
              </div>
            </div>

            {/* Box 2: Fully Matched Invoices */}
            <div className="border border-border bg-card/50 rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider block mb-1">
                Fully Matched Invoices
              </span>
              <span className="text-2xl font-black text-emerald-500">
                {reconData.summary.matchedCount}
              </span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500/80">
                <CheckCircle2 className="h-3 w-3" />
                <span>GSTIN, Inv No & Amounts Match</span>
              </div>
            </div>

            {/* Box 3: Total ITC Impact */}
            <div className="border border-border bg-card/50 rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Total ITC as per Books
              </span>
              <span className="text-xl font-bold">{formatINR(totalBooksItc)}</span>
              <div className="flex items-center gap-1 mt-2.5 text-[10px] text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>ITC Value of Invoices</span>
              </div>
            </div>

            {/* Box 4: Total Discrepancy Amount */}
            <div className="border border-border bg-card/50 rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block mb-1">
                ITC Difference / Variance
              </span>
              <span className={`text-xl font-bold ${itcDifference !== 0 ? "text-rose-500" : "text-emerald-500"}`}>
                {formatINR(Math.abs(itcDifference))}
              </span>
              <div className="flex items-center gap-1 mt-2.5 text-[10px] text-muted-foreground">
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>{itcDifference >= 0 ? "Excess claimed in Books" : "Unclaimed ITC in 2B"}</span>
              </div>
            </div>

          </div>

          {/* 2. Detailed Discrepancy Breakdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 print:hidden">
            
            {/* All */}
            <button
              onClick={() => { setFilterCategory(""); setCurrentPage(1); }}
              className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                filterCategory === ""
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All Entries ({reconData.results.length})
            </button>

            {/* Matched */}
            <button
              onClick={() => { setFilterCategory("MATCHED"); setCurrentPage(1); }}
              className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                filterCategory === "MATCHED"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Matched ({reconData.summary.matchedCount})
            </button>

            {/* Amount Mismatch */}
            <button
              onClick={() => { setFilterCategory("AMOUNT_MISMATCH"); setCurrentPage(1); }}
              className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                filterCategory === "AMOUNT_MISMATCH"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Amount Mismatch ({reconData.summary.amountMismatchCount})
            </button>

            {/* Missing in GSTR-2B */}
            <button
              onClick={() => { setFilterCategory("IN_BOOKS_NOT_2B"); setCurrentPage(1); }}
              className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                filterCategory === "IN_BOOKS_NOT_2B"
                  ? "border-rose-500 bg-rose-500/10 text-rose-500"
                  : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Missing in 2B ({reconData.summary.inBooksNot2bCount})
            </button>

            {/* Unclaimed GSTR-2B */}
            <button
              onClick={() => { setFilterCategory("IN_2B_NOT_BOOKS"); setCurrentPage(1); }}
              className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                filterCategory === "IN_2B_NOT_BOOKS"
                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                  : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Unclaimed in 2B ({reconData.summary.in2bNotBooksCount})
            </button>

          </div>

          {/* 3. Discrepancy Table */}
          <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm print:hidden">
            
            {/* Search Bar */}
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Supplier GSTIN, Name, or Invoice No..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-0 outline-0 ring-0 text-xs w-full placeholder:text-muted-foreground text-foreground"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Supplier GSTIN & Name</th>
                    <th className="px-6 py-4">Invoice Details</th>
                    <th className="px-6 py-4 text-right">Books Total</th>
                    <th className="px-6 py-4 text-right">2B Total</th>
                    <th className="px-6 py-4 text-right">Difference</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((row, idx) => {
                      const cat = CATEGORY_CONFIG[row.category] || CATEGORY_CONFIG.MATCHED;
                      const diffAmount = (row.purchaseRegister?.total || 0) - (row.gstr2b?.total || 0);

                      return (
                        <tr key={`recon-row-${idx}`} className="hover:bg-muted/30 transition-colors">
                          
                          {/* Category Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold ${cat.color} ${cat.bg}`}>
                              {cat.label}
                            </span>
                          </td>

                          {/* Supplier Details */}
                          <td className="px-6 py-4">
                            <div className="font-bold font-mono">{row.supplierGstin || "N/A"}</div>
                            <div className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5" title={row.supplierName}>
                              {row.supplierName || "Unknown Supplier"}
                            </div>
                          </td>

                          {/* Invoice Details */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold">{row.invoiceNo}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{row.invoiceDate}</div>
                          </td>

                          {/* Books total */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {row.purchaseRegister ? formatINR(row.purchaseRegister.total) : "—"}
                          </td>

                          {/* 2B total */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {row.gstr2b ? formatINR(row.gstr2b.total) : "—"}
                          </td>

                          {/* Difference */}
                          <td className={`px-6 py-4 text-right whitespace-nowrap font-semibold ${
                            diffAmount > 1 ? "text-rose-500" : diffAmount < -1 ? "text-blue-500" : "text-emerald-500"
                          }`}>
                            {diffAmount !== 0 ? formatINR(diffAmount) : "₹0.00"}
                          </td>

                          {/* Action Viewer */}
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRow(row)}
                              className="inline-flex items-center justify-center p-1.5 border border-border bg-background hover:bg-muted rounded-md text-foreground transition-colors cursor-pointer"
                              title="View Tax Breakdown"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-xs">
                        No discrepancies found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredResults.length)} of{" "}
                  {filteredResults.length} records
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-semibold px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================
              PRINTABLE REPORT (Visible only during window.print())
              ======================================================== */}
          <div className="hidden print:block text-left text-black font-sans leading-normal">
            
            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-6">
              <h1 className="text-2xl font-bold uppercase tracking-tight">GST ITC Reconciliation Audit Report</h1>
              <p className="text-[10px] text-gray-600 mt-1">
                TaxSolver Free Offline Reconciliation Tool • Generated on: {new Date().toLocaleString("en-IN")}
              </p>
            </div>

            {/* Summary Dashboard Block */}
            <div className="grid grid-cols-2 gap-4 border border-black p-4 rounded-md mb-6">
              <div>
                <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Invoice Summary</h3>
                <div className="text-xs space-y-1">
                  <div>Total Purchase Register Invoices: <strong>{totalPurchaseInvoices}</strong></div>
                  <div>Fully Matched Invoices: <strong>{reconData.summary.matchedCount}</strong></div>
                  <div>Amount Mismatches: <strong>{reconData.summary.amountMismatchCount}</strong></div>
                  <div>Missing In GSTR-2B: <strong>{reconData.summary.inBooksNot2bCount}</strong></div>
                  <div>Unclaimed in GSTR-2B: <strong>{reconData.summary.in2bNotBooksCount}</strong></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">ITC Financial Summary</h3>
                <div className="text-xs space-y-1">
                  <div>Total ITC as per Books: <strong>{formatINR(totalBooksItc)}</strong></div>
                  <div>Total ITC as per GSTR-2B: <strong>{formatINR(totalGstr2bItc)}</strong></div>
                  <div className="border-t border-gray-300 pt-1 mt-1 text-sm font-black">
                    Discrepancy / Difference: {formatINR(itcDifference)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mismatch Tables */}
            <h2 className="text-sm font-bold uppercase mb-3">Itemized Discrepancy Report (Mismatches & Missing)</h2>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 border-b border-black font-bold">
                  <th className="border-r border-black p-2">Status</th>
                  <th className="border-r border-black p-2">Supplier GSTIN & Name</th>
                  <th className="border-r border-black p-2">Invoice No & Date</th>
                  <th className="border-r border-black p-2 text-right">Books Total</th>
                  <th className="border-r border-black p-2 text-right">2B Total</th>
                  <th className="p-2 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400">
                {reconData.results
                  .filter((r) => r.category !== "MATCHED")
                  .map((row, idx) => {
                    const diffVal = (row.purchaseRegister?.total || 0) - (row.gstr2b?.total || 0);
                    const catLabel = CATEGORY_CONFIG[row.category]?.label || row.category;
                    return (
                      <tr key={`print-row-${idx}`}>
                        <td className="border-r border-black p-2 font-bold">{catLabel}</td>
                        <td className="border-r border-black p-2">
                          <div>{row.supplierGstin}</div>
                          <div className="text-[8px] text-gray-600 font-normal">{row.supplierName}</div>
                        </td>
                        <td className="border-r border-black p-2">
                          <div>{row.invoiceNo}</div>
                          <div className="text-[8px] text-gray-600 font-normal">{row.invoiceDate}</div>
                        </td>
                        <td className="border-r border-black p-2 text-right">
                          {row.purchaseRegister ? formatINR(row.purchaseRegister.total) : "—"}
                        </td>
                        <td className="border-r border-black p-2 text-right">
                          {row.gstr2b ? formatINR(row.gstr2b.total) : "—"}
                        </td>
                        <td className="p-2 text-right font-bold">
                          {formatINR(diffVal)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

          </div>

        </div>
      )}

      {/* ========================================================
          MODAL: TAX BREAKDOWN DETAILS (Hidden during Print)
          ======================================================== */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 print:hidden">
          <div className="bg-card border border-border rounded-xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedRow(null)}
              className="absolute top-4 right-4 p-1 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header info */}
            <div className="mb-6 pr-6">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest block mb-1">
                Discrepancy Details
              </span>
              <h3 className="text-base font-bold truncate text-left">{selectedRow.supplierName || "Unknown Supplier"}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono text-left">{selectedRow.supplierGstin || "No GSTIN"}</p>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 border border-border rounded-lg mb-6 text-xs">
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Invoice Number</span>
                <span className="font-bold">{selectedRow.invoiceNo}</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Invoice Date</span>
                <span className="font-bold">{selectedRow.invoiceDate || "N/A"}</span>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1 text-left">
                Tax breakdown Comparison
              </h4>
              
              <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-muted-foreground text-right border-b border-border pb-2">
                <div className="text-left">Component</div>
                <div>Books Ledger</div>
                <div>GSTR-2B</div>
                <div>Difference</div>
              </div>

              {/* IGST */}
              <div className="grid grid-cols-4 gap-2 text-xs text-right">
                <div className="text-left font-semibold text-muted-foreground">IGST</div>
                <div>{selectedRow.purchaseRegister ? formatINR(selectedRow.purchaseRegister.igst) : "—"}</div>
                <div>{selectedRow.gstr2b ? formatINR(selectedRow.gstr2b.igst) : "—"}</div>
                <div className="font-bold text-foreground">
                  {formatINR((selectedRow.purchaseRegister?.igst || 0) - (selectedRow.gstr2b?.igst || 0))}
                </div>
              </div>

              {/* CGST */}
              <div className="grid grid-cols-4 gap-2 text-xs text-right">
                <div className="text-left font-semibold text-muted-foreground">CGST</div>
                <div>{selectedRow.purchaseRegister ? formatINR(selectedRow.purchaseRegister.cgst) : "—"}</div>
                <div>{selectedRow.gstr2b ? formatINR(selectedRow.gstr2b.cgst) : "—"}</div>
                <div className="font-bold text-foreground">
                  {formatINR((selectedRow.purchaseRegister?.cgst || 0) - (selectedRow.gstr2b?.cgst || 0))}
                </div>
              </div>

              {/* SGST */}
              <div className="grid grid-cols-4 gap-2 text-xs text-right">
                <div className="text-left font-semibold text-muted-foreground">SGST</div>
                <div>{selectedRow.purchaseRegister ? formatINR(selectedRow.purchaseRegister.sgst) : "—"}</div>
                <div>{selectedRow.gstr2b ? formatINR(selectedRow.gstr2b.sgst) : "—"}</div>
                <div className="font-bold text-foreground">
                  {formatINR((selectedRow.purchaseRegister?.sgst || 0) - (selectedRow.gstr2b?.sgst || 0))}
                </div>
              </div>

              {/* Cess */}
              <div className="grid grid-cols-4 gap-2 text-xs text-right">
                <div className="text-left font-semibold text-muted-foreground">CESS</div>
                <div>{selectedRow.purchaseRegister ? formatINR(selectedRow.purchaseRegister.cess) : "—"}</div>
                <div>{selectedRow.gstr2b ? formatINR(selectedRow.gstr2b.cess) : "—"}</div>
                <div className="font-bold text-foreground">
                  {formatINR((selectedRow.purchaseRegister?.cess || 0) - (selectedRow.gstr2b?.cess || 0))}
                </div>
              </div>

              {/* Total */}
              <div className="grid grid-cols-4 gap-2 text-xs text-right font-black border-t border-border pt-2 text-foreground">
                <div className="text-left">TOTAL</div>
                <div>{selectedRow.purchaseRegister ? formatINR(selectedRow.purchaseRegister.total) : "—"}</div>
                <div>{selectedRow.gstr2b ? formatINR(selectedRow.gstr2b.total) : "—"}</div>
                <div className={`${
                  ((selectedRow.purchaseRegister?.total || 0) - (selectedRow.gstr2b?.total || 0)) !== 0
                    ? "text-rose-500"
                    : "text-emerald-500"
                }`}>
                  {formatINR((selectedRow.purchaseRegister?.total || 0) - (selectedRow.gstr2b?.total || 0))}
                </div>
              </div>

            </div>

            {/* Actions panel */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRow(null)}
                className="px-4 py-2 border border-border bg-background hover:bg-muted text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
