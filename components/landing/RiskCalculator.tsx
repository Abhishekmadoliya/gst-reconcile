"use client";

import { useState } from "react";
import { ShieldAlert, IndianRupee, Calculator, Info } from "lucide-react";

export default function RiskCalculator() {
  const [itcVolume, setItcVolume] = useState<number>(2500000); // 25 Lakhs default
  const [mismatchRate, setMismatchRate] = useState<number>(8); // 8% default
  const [daysDelayed, setDaysDelayed] = useState<number>(90); // 90 days delay default

  const itcAtRisk = (itcVolume * mismatchRate) / 100;
  // Interest under Section 50 of CGST Act is 18% p.a.
  const interestPenalty = (itcAtRisk * 0.18 * daysDelayed) / 365;

  const getRiskStatus = () => {
    // GST portal triggers DRC-01C if mismatch is >10% or absolute difference exceeds ₹1,00,000
    if (mismatchRate >= 10 || itcAtRisk >= 100000) {
      return {
        label: "CRITICAL RISK",
        color: "text-alert bg-alert-bg border-alert/20",
        message: "GSTN system automatically triggers a DRC-01C compliance notice for this discrepancy. Reply required within 7 days or GSTIN suspension will occur."
      };
    } else if (mismatchRate >= 5 || itcAtRisk >= 50000) {
      return {
        label: "ELEVATED RISK",
        color: "text-warn bg-warn-bg border-warn/20",
        message: "Close to automated notice triggers. Scrutiny probability is high during annual GST 9/9C filings."
      };
    } else {
      return {
        label: "LOW RISK",
        color: "text-success bg-success-bg border-success/20",
        message: "Discrepancy is within safe marginal thresholds. Standard monitoring recommended."
      };
    }
  };

  const riskStatus = getRiskStatus();

  return (
    <section id="risk-calculator" className="py-16 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Compliance Diagnostic
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            DRC-01C Notice Risk & Penalty Calculator
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate your exposure to Section 50 interest penalties and automated GSTN compliance notices.
          </p>
        </div>

        {/* Calculator Widget Card */}
        <div className="border border-border bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Calculator className="h-4 w-4" /> Compliance Risk Matrix
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Section 50 CGST Act // DRC-01C rules</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Input Sliders Column */}
            <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-border space-y-6">
              
              {/* Slider 1: Monthly ITC */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1">
                    Client's Monthly ITC Volume
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">
                    ₹{itcVolume.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={itcVolume}
                  onChange={(e) => setItcVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>₹1 Lakh</span>
                  <span>₹50 Lakhs</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              {/* Slider 2: Estimated Mismatch */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-foreground">
                    Estimated Supplier Mismatch Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">
                    {mismatchRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={mismatchRate}
                  onChange={(e) => setMismatchRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1% (Optimized)</span>
                  <span>10% (Trigger threshold)</span>
                  <span>25% (Extreme risk)</span>
                </div>
              </div>

              {/* Slider 3: Days Delay */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-foreground">
                    Avg. Resolution Delay (Days)
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">
                    {daysDelayed} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="365"
                  step="15"
                  value={daysDelayed}
                  onChange={(e) => setDaysDelayed(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>15 Days</span>
                  <span>90 Days (1 Qtr)</span>
                  <span>365 Days (1 Yr)</span>
                </div>
              </div>

            </div>

            {/* Right Output Calculations Column */}
            <div className="md:col-span-5 p-6 bg-muted/20 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Metric 1 */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Total ITC at Risk
                  </div>
                  <div className="text-xl font-bold text-foreground mt-1 flex items-center">
                    <IndianRupee className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                    {itcAtRisk.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    Sec 50 Interest Penalty (18% p.a.)
                    <span className="cursor-help" title="Interest under Section 50 of CGST Act on wrongful ITC utilization is 18% per annum.">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </div>
                  <div className="text-base font-bold text-alert mt-1 flex items-center">
                    <IndianRupee className="h-4 w-4 text-alert/70 shrink-0" />
                    {interestPenalty.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                </div>

                {/* Risk Level Alert */}
                <div className={`p-3 rounded-lg border flex flex-col gap-1 ${riskStatus.color}`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    {riskStatus.label}
                  </div>
                  <p className="text-[10px] leading-normal opacity-90 mt-0.5">
                    {riskStatus.message}
                  </p>
                </div>
              </div>

              {/* Bottom Notice explanation */}
              <div className="text-[9px] text-muted-foreground leading-relaxed mt-4 pt-3 border-t border-border">
                * GST Portal triggers automated Form <strong>DRC-01C</strong> warnings when GSTR-3B ITC claims exceed GSTR-2B values by <strong>&gt;10% or ₹1,00,000</strong>. Reconciling prevents interest penalties entirely.
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
