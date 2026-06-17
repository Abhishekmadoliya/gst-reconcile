"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PlusCircle, 
  MessageSquareCode, 
  Check, 
  Send,
  Building,
  Calendar,
  Layers
} from "lucide-react";

interface MockInvoice {
  id: string;
  invoiceNo: string;
  supplierName: string;
  gstin: string;
  date: string;
  booksAmount: number;
  gstnAmount: number;
  status: "MATCHED" | "AMOUNT_MISMATCH" | "IN_BOOKS_NOT_2B" | "IN_2B_NOT_BOOKS";
  details?: string;
}

const mockInvoices: MockInvoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2026-081",
    supplierName: "Apex Steel Industries",
    gstin: "27AAAAA1111A1Z1",
    date: "12-Jun-2026",
    booksAmount: 145000,
    gstnAmount: 145000,
    status: "MATCHED"
  },
  {
    id: "2",
    invoiceNo: "TX-992",
    supplierName: "Rohan Logistics & Packing",
    gstin: "27BBBBB2222B2Z2",
    date: "10-Jun-2026",
    booksAmount: 48000,
    gstnAmount: 36000,
    status: "AMOUNT_MISMATCH",
    details: "IGST difference of ₹12,000 (Supplier reported lower taxable value)"
  },
  {
    id: "3",
    invoiceNo: "BL-2026-384",
    supplierName: "Creative Krafts Pvt Ltd",
    gstin: "27CCCCC3333C3Z3",
    date: "05-Jun-2026",
    booksAmount: 82500,
    gstnAmount: 0,
    status: "IN_BOOKS_NOT_2B",
    details: "Supplier did not file GSTR-1. ITC of ₹14,850 at risk."
  },
  {
    id: "4",
    invoiceNo: "GST-11029",
    supplierName: "Mahindra & Mahindra Ltd",
    gstin: "27DDDDD4444D4Z4",
    date: "28-May-2026",
    booksAmount: 0,
    gstnAmount: 94000,
    status: "IN_2B_NOT_BOOKS",
    details: "Unclaimed credit found in GSTR-2B. Add to books to claim ₹16,920."
  }
];

export default function ReconSandbox() {
  const [filter, setFilter] = useState<MockInvoice["status"] | "ALL">("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<MockInvoice | null>(mockInvoices[1]);
  const [whatsappSent, setWhatsappSent] = useState<string | null>(null);
  const [whatsappText, setWhatsappText] = useState("");

  const filteredInvoices = filter === "ALL" 
    ? mockInvoices 
    : mockInvoices.filter(inv => inv.status === filter);

  const getStatusBadge = (status: MockInvoice["status"]) => {
    switch (status) {
      case "MATCHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            Matched
          </span>
        );
      case "AMOUNT_MISMATCH":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            Diff Found
          </span>
        );
      case "IN_BOOKS_NOT_2B":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            Missing in GSTR-2B
          </span>
        );
      case "IN_2B_NOT_BOOKS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            Unclaimed in Books
          </span>
        );
    }
  };

  const handleSelectInvoice = (inv: MockInvoice) => {
    setSelectedInvoice(inv);
    setWhatsappSent(null);
    if (inv.status === "IN_BOOKS_NOT_2B") {
      setWhatsappText(
        `Hi team at ${inv.supplierName},\nWe are reconciling our accounts and noticed that Invoice #${inv.invoiceNo} dated ${inv.date} for ₹${inv.booksAmount.toLocaleString("en-IN")} is not reflecting in our GSTR-2B for June 2026. Please file your GSTR-1 immediately so we can claim the eligible ITC. Thank you!`
      );
    } else if (inv.status === "AMOUNT_MISMATCH") {
      setWhatsappText(
        `Hi team at ${inv.supplierName},\nThere is a mismatch in GST values for Invoice #${inv.invoiceNo}. In our books, the amount is ₹${inv.booksAmount.toLocaleString("en-IN")} but in GSTR-2B it is showing as ₹${inv.gstnAmount.toLocaleString("en-IN")}. Please double-check and correct your return. Thank you!`
      );
    } else {
      setWhatsappText("");
    }
  };

  const triggerWhatsappSend = (id: string) => {
    setWhatsappSent(id);
    setTimeout(() => {
      // Simulate close
    }, 3000);
  };

  return (
    <div id="demo" className="w-full bg-card border border-border rounded-xl shadow-lg p-5 font-sans transition-colors duration-200">
      {/* Dashboard Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" /> Matching Engine Sandbox
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Click rows below to simulate reconciliation & actions</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["ALL", "MATCHED", "AMOUNT_MISMATCH", "IN_BOOKS_NOT_2B", "IN_2B_NOT_BOOKS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-[11px] font-medium px-2 py-1 rounded transition-colors cursor-pointer border ${
                filter === tab 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {tab === "ALL" ? "All" : tab === "MATCHED" ? "Matched" : tab === "AMOUNT_MISMATCH" ? "Diff" : tab === "IN_BOOKS_NOT_2B" ? "Missing 2B" : "Unclaimed"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Invoice List */}
        <div className="lg:col-span-7 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => handleSelectInvoice(inv)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                selectedInvoice?.id === inv.id
                  ? "bg-secondary border-primary/50 shadow-sm"
                  : "bg-background border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    {inv.invoiceNo}
                    <span className="text-[10px] text-muted-foreground font-normal">{inv.date}</span>
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground mt-1 flex items-center gap-1">
                    <Building className="h-3 w-3" /> {inv.supplierName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-foreground">
                    ₹{(inv.booksAmount || inv.gstnAmount).toLocaleString("en-IN")}
                  </div>
                  <div className="mt-1">{getStatusBadge(inv.status)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel / Detail View */}
        <div className="lg:col-span-5 border border-border bg-background rounded-lg p-4 flex flex-col justify-between min-h-[300px]">
          {selectedInvoice ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="pb-3 border-b border-border">
                  <div className="text-xs font-mono text-muted-foreground">GSTIN: {selectedInvoice.gstin}</div>
                  <h4 className="text-xs font-bold text-foreground mt-1">{selectedInvoice.supplierName}</h4>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Purchase Book Value:</span>
                    <span className="font-semibold text-foreground">
                      {selectedInvoice.booksAmount > 0 ? `₹${selectedInvoice.booksAmount.toLocaleString("en-IN")}` : "Not in Books"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">GSTR-2B Filed Value:</span>
                    <span className="font-semibold text-foreground">
                      {selectedInvoice.gstnAmount > 0 ? `₹${selectedInvoice.gstnAmount.toLocaleString("en-IN")}` : "Not Found"}
                    </span>
                  </div>
                  {selectedInvoice.details && (
                    <div className="p-2.5 rounded bg-muted text-[11px] text-muted-foreground border-l-2 border-primary/40 leading-relaxed">
                      {selectedInvoice.details}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="mt-4 pt-3 border-t border-border">
                {selectedInvoice.status === "MATCHED" && (
                  <div className="flex items-center gap-2 text-success text-xs font-medium bg-success-bg p-2 rounded border border-success/10">
                    <Check className="h-4 w-4" /> Eligible ITC cleared to claim in GSTR-3B.
                  </div>
                )}

                {(selectedInvoice.status === "IN_BOOKS_NOT_2B" || selectedInvoice.status === "AMOUNT_MISMATCH") && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MessageSquareCode className="h-3 w-3" /> Auto-Generated Supplier Follow-up
                    </div>
                    <textarea
                      value={whatsappText}
                      onChange={(e) => setWhatsappText(e.target.value)}
                      className="w-full text-[11px] p-2 bg-muted border border-border rounded h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed text-foreground"
                    />
                    <button
                      onClick={() => triggerWhatsappSend(selectedInvoice.id)}
                      disabled={whatsappSent === selectedInvoice.id}
                      className="w-full flex items-center justify-center gap-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {whatsappSent === selectedInvoice.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Sent to WhatsApp Queue
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Send Follow-up Alert
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedInvoice.status === "IN_2B_NOT_BOOKS" && (
                  <div className="space-y-2">
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      This invoice was filed by the supplier but is missing in your ERP (Tally/Zoho). Claim this missing ITC now to avoid credit loss.
                    </div>
                    <button className="w-full h-8 bg-foreground text-background dark:bg-background dark:text-foreground border border-border hover:bg-muted/80 text-xs font-semibold rounded transition-colors cursor-pointer">
                      Auto-Inject to Purchase Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Calendar className="h-8 w-8 text-muted-foreground/60 stroke-[1]" />
              <p className="text-xs font-medium text-muted-foreground mt-2">Select an invoice row to view actions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
