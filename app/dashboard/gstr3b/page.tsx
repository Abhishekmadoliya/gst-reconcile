"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Building
} from "lucide-react";

export default function Gstr3bPage() {
  const { selectedGstinId } = useDashboardStore();
  const [isFiling, setIsFiling] = useState(false);
  const [filedARN, setFiledARN] = useState<string | null>(null);

  // Mock Table 4 Eligible ITC values
  const table4 = {
    importGoods: { igst: 120000, cgst: 0, sgst: 0 },
    importServices: { igst: 15000, cgst: 0, sgst: 0 },
    inwardRcm: { igst: 5000, cgst: 2500, sgst: 2500 },
    inwardIsd: { igst: 8000, cgst: 0, sgst: 0 },
    allOtherItc: { igst: 345000, cgst: 172500, sgst: 172500 },
  };

  const handleFileGstr3b = () => {
    setIsFiling(true);
    setTimeout(() => {
      setIsFiling(false);
      setFiledARN(`ARN-3B-${Math.floor(1000000 + Math.random() * 9000000)}`);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" /> GSTR-3B Tax Filing Assistant
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Draft and compute Table 4 (Eligible ITC) from GSTR-2B reconciled ledger values.
          </p>
        </div>
      </div>

      {filedARN && (
        <div className="p-4 bg-compliance-success-bg border border-success/20 rounded-sm text-xs text-success flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-extrabold uppercase">GSTR-3B successfully filed!</p>
              <p className="text-[10px] text-success/90 mt-0.5 font-mono">ARN ID: {filedARN}</p>
            </div>
          </div>
          <button
            onClick={() => setFiledARN(null)}
            className="text-[10px] font-bold uppercase underline cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Table 4: Eligible Input Tax Credit (ITC)
              </h3>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold">
                  <th className="p-3 text-[10px] uppercase font-bold text-muted-foreground">ITC Details</th>
                  <th className="p-3 text-right font-mono text-[10px] uppercase font-bold text-muted-foreground">IGST</th>
                  <th className="p-3 text-right font-mono text-[10px] uppercase font-bold text-muted-foreground">CGST</th>
                  <th className="p-3 text-right font-mono text-[10px] uppercase font-bold text-muted-foreground">SGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-muted/10">
                  <td className="p-3 font-semibold text-foreground">(A) ITC Available (whether in full or part)</td>
                  <td className="p-3 text-right font-mono"></td>
                  <td className="p-3 text-right font-mono"></td>
                  <td className="p-3 text-right font-mono"></td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-3 pl-6 text-muted-foreground">1. Import of goods</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importGoods.igst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importGoods.cgst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importGoods.sgst)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-3 pl-6 text-muted-foreground">2. Import of services</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importServices.igst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importServices.cgst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.importServices.sgst)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-3 pl-6 text-muted-foreground">3. Inward supplies liable to reverse charge</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardRcm.igst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardRcm.cgst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardRcm.sgst)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-3 pl-6 text-muted-foreground">4. Inward supplies from ISD</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardIsd.igst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardIsd.cgst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.inwardIsd.sgst)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-3 pl-6 text-muted-foreground">5. All other ITC</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.allOtherItc.igst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.allOtherItc.cgst)}</td>
                  <td className="p-3 text-right font-mono text-foreground">{formatINR(table4.allOtherItc.sgst)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Side summary panel */}
        <div className="p-4 bg-card border border-border rounded-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border">
              Filing Verification
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">
              Validate computed ledger values and sign off digitally to complete filings on GSP.
            </p>
          </div>

          <div className="p-3 rounded-sm bg-muted/30 border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Reconciled Period</span>
              <span className="font-bold font-mono">April 2026</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Filing Method</span>
              <span className="font-bold">OTP Handshake (EVC)</span>
            </div>
          </div>

          <button
            onClick={handleFileGstr3b}
            disabled={isFiling}
            className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isFiling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Filing Return
              </>
            ) : (
              <>
                File GSTR-3B via EVC <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
