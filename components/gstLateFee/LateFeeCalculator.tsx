"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Calculator,
  Calendar,
  IndianRupee,
  Info,
  AlertTriangle,
  Receipt,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  calculateGstLateFeeAndInterest,
  getDefaultDueDate,
  type GstReturnType,
  type InterestScenario,
} from "@/lib/gstLateFeeCalc";
import Link from "next/link";

const RETURN_TYPES: GstReturnType[] = ["GSTR-3B", "GSTR-1", "GSTR-4", "GSTR-7", "GSTR-9"];

const NIL_ELIGIBLE: GstReturnType[] = ["GSTR-3B", "GSTR-1", "GSTR-4"];
const TAX_ENABLED_RETURNS: GstReturnType[] = ["GSTR-3B"];

function formatDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getMonthInputFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getFYOptions(): string[] {
  const now = new Date();
  const currentFYStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: 6 }, (_, i) => currentFYStart - 2 + i).map(
    (y) => `${y}-${y + 1}`
  );
}

function fyStartYearFromLabel(label: string): number {
  return parseInt(label.split("-")[0], 10);
}

export default function LateFeeCalculator() {
  // --- Form state ---
  const [returnType, setReturnType] = useState<GstReturnType>("GSTR-3B");
  const [periodMonth, setPeriodMonth] = useState<string>(getMonthInputFromDate(new Date()));
  const [fyLabel, setFYLabel] = useState<string>(getFYOptions()[2]);
  const [frequency, setFrequency] = useState<"monthly" | "quarterly">("monthly");
  const [dueDateStr, setDueDateStr] = useState<string>("");
  const [filingDateStr, setFilingDateStr] = useState<string>(formatDateInput(new Date()));
  const [isNil, setIsNil] = useState(false);
  const [cgst, setCgst] = useState<string>("");
  const [sgst, setSgst] = useState<string>("");
  const [igst, setIgst] = useState<string>("");
  const [itcOffset, setItcOffset] = useState<string>("");
  const [turnover, setTurnover] = useState<string>("20000000");
  const [interestScenario, setInterestScenario] = useState<InterestScenario>("normal");

  const isAnnualReturn = returnType === "GSTR-9" || returnType === "GSTR-4";

  // Auto-fill default due date when inputs change
  const deriveDefaultDueDate = useCallback((): Date => {
    if (isAnnualReturn) {
      const fyStart = fyStartYearFromLabel(fyLabel);
      return returnType === "GSTR-9"
        ? new Date(fyStart + 1, 11, 31) // 31 Dec
        : new Date(fyStart + 1, 5, 30); // 30 June
    }
    const period = parseDateInput(`${periodMonth}-01`);
    return getDefaultDueDate(returnType, period, frequency);
  }, [isAnnualReturn, fyLabel, returnType, periodMonth, frequency]);

  useEffect(() => {
    setDueDateStr(formatDateInput(deriveDefaultDueDate()));
  }, [deriveDefaultDueDate]);

  // Update frequency default when return type changes
  useEffect(() => {
    if (returnType === "GSTR-1") setFrequency("monthly");
  }, [returnType]);

  const result = useMemo(() => {
    const dueDate = parseDateInput(dueDateStr || formatDateInput(new Date()));
    const filingDate = parseDateInput(filingDateStr);
    return calculateGstLateFeeAndInterest({
      returnType,
      dueDate,
      filingDate,
      isNil: isNil && NIL_ELIGIBLE.includes(returnType),
      cgst: Number(cgst) || 0,
      sgst: Number(sgst) || 0,
      igst: Number(igst) || 0,
      itcOffset: Number(itcOffset) || 0,
      turnover: Number(turnover) || 0,
      interestScenario,
    });
  }, [
    returnType,
    dueDateStr,
    filingDateStr,
    isNil,
    cgst,
    sgst,
    igst,
    itcOffset,
    turnover,
    interestScenario,
  ]);

  const showTaxFields = TAX_ENABLED_RETURNS.includes(returnType) && !isNil;

  return (
    <section className="py-10 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Compliance Calculator
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            GST Late Fee & Interest Calculator
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
            Estimate late fee (Section 47) and interest (Section 50) for delayed GST returns.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="border border-border bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Calculator className="h-4 w-4" />
              Late Fee + Interest Estimator
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              Section 47 & 50 CGST Act
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Inputs */}
            <div className="md:col-span-5 p-5 border-b md:border-b-0 md:border-r border-border space-y-5">
              {/* Return Type */}
              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block">
                  GST Return Type
                </label>
                <select
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value as GstReturnType)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {RETURN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div className={isAnnualReturn ? "col-span-2" : "col-span-1"}>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">
                    {isAnnualReturn ? "Financial Year" : "Tax Period"}
                  </label>
                  {isAnnualReturn ? (
                    <select
                      value={fyLabel}
                      onChange={(e) => setFYLabel(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {getFYOptions().map((fy) => (
                        <option key={fy} value={fy}>
                          FY {fy}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="month"
                      value={periodMonth}
                      onChange={(e) => setPeriodMonth(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  )}
                </div>

                {!isAnnualReturn && returnType === "GSTR-1" && (
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1.5 block">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as "monthly" | "quarterly")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDateStr}
                    onChange={(e) => setDueDateStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Auto-filled; edit for extensions or QRMP dates.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Filing Date
                  </label>
                  <input
                    type="date"
                    value={filingDateStr}
                    onChange={(e) => setFilingDateStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* NIL + Turnover */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNil}
                      onChange={(e) => setIsNil(e.target.checked)}
                      disabled={!NIL_ELIGIBLE.includes(returnType)}
                      className="h-4 w-4 accent-primary disabled:opacity-40"
                    />
                    <span className="text-xs font-bold text-foreground">NIL Return</span>
                  </label>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Turnover (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={turnover}
                    onChange={(e) => setTurnover(e.target.value)}
                    placeholder="Annual turnover"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Tax Liability (only for returns where interest matters) */}
              {showTaxFields && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">
                      Tax Liability (₹)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min="0"
                        value={cgst}
                        onChange={(e) => setCgst(e.target.value)}
                        placeholder="CGST"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <input
                        type="number"
                        min="0"
                        value={sgst}
                        onChange={(e) => setSgst(e.target.value)}
                        placeholder="SGST"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <input
                        type="number"
                        min="0"
                        value={igst}
                        onChange={(e) => setIgst(e.target.value)}
                        placeholder="IGST"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                      ITC Offset (₹)
                      <span
                        className="cursor-help"
                        title="Portal computes interest only on the cash-ledger portion after reducing ITC offset."
                      >
                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={itcOffset}
                      onChange={(e) => setItcOffset(e.target.value)}
                      placeholder="ITC used to offset liability"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interestScenario === "excess-itc"}
                      onChange={(e) =>
                        setInterestScenario(e.target.checked ? "excess-itc" : "normal")
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    Use 24% rate — excess / wrongful ITC claimed
                  </label>
                </div>
              )}

              {!showTaxFields && !isNil && (
                <div className="text-[10px] text-muted-foreground bg-muted/40 p-2.5 rounded-md leading-relaxed">
                  Interest is calculated only for returns involving late tax payment. For{" "}
                  {returnType}, this calculator shows late fee only.
                </div>
              )}
            </div>

            {/* Outputs */}
            <div className="md:col-span-7 p-5 bg-muted/20 flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-4">
                <Receipt className="h-4 w-4" /> Estimated Liability
              </div>

              {result.warning && (
                <div className="mb-4 p-3 rounded-lg border flex items-start gap-2 text-alert bg-alert-bg border-alert/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-normal">{result.warning}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Days Delayed
                  </div>
                  <div className="text-xl font-bold text-foreground mt-1">
                    {result.daysDelayed}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Late Fee
                  </div>
                  <div className="text-xl font-bold text-foreground mt-1 flex items-center">
                    <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                    {result.lateFee.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </div>
                  {result.lateFee.wasCapped && (
                    <div className="text-[9px] text-warn mt-1">{result.lateFee.capNote}</div>
                  )}
                </div>
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    Interest
                    <span
                      className="cursor-help"
                      title="Interest is computed on the cash-ledger portion of tax liability after ITC offset."
                    >
                      <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </div>
                  <div className="text-xl font-bold text-foreground mt-1 flex items-center">
                    <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                    {result.interest.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1">
                    {result.interest.ratePercent > 0 ? `@ ${result.interest.ratePercent}%` : "—"}
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold opacity-90 tracking-wider">
                    Total Payable
                  </div>
                  <div className="text-2xl font-bold mt-1 flex items-center">
                    <IndianRupee className="h-5 w-5 shrink-0" />
                    {result.grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Late fee split */}
              <div className="bg-card border border-border rounded-lg p-3 mb-3">
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                  Late Fee Split (CGST / SGST)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground">CGST</span>
                    <div className="text-base font-bold text-foreground flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {result.lateFee.cgst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">SGST</span>
                    <div className="text-base font-bold text-foreground flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {result.lateFee.sgst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                {result.lateFee.wasCapped && (
                  <div className="mt-2 text-[10px] text-warn font-medium">
                    {result.lateFee.capNote}
                  </div>
                )}
              </div>

              {/* Challan split */}
              {result.grandTotal > 0 && (
                <div className="bg-card border border-border rounded-lg p-3 mb-3">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                    Challan-Ready Split
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "CGST", value: result.challan.cgst },
                      { label: "SGST", value: result.challan.sgst },
                      { label: "IGST", value: result.challan.igst },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                        <div className="text-base font-bold text-foreground flex items-center">
                          <IndianRupee className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mt-auto p-3 rounded-lg border border-info/20 bg-info-bg text-info">
                <p className="text-xs font-semibold leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer + References */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-[11px] text-muted-foreground leading-relaxed bg-muted/40 rounded-lg p-3 border border-border">
            <strong>Disclaimer:</strong> Indicative estimate only. Verify the final amount on the
            GST portal before payment — the portal&apos;s auto-computation is authoritative. Rules
            last verified: <strong>26 Jul 2026</strong>.
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed bg-muted/40 rounded-lg p-3 border border-border">
            • Late fee is charged from the day after the due date to the filing date, inclusive.
            <br />
            • Interest is computed on the net cash-ledger portion after ITC offset.
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-foreground">
            Avoid late fees next time — reconcile before you file.
          </div>
          <Link
            href="/gst-reconciliation-software"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Explore TaxSolver Reconciliation
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
