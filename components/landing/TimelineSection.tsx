import { CalendarDays, AlertCircle, CheckCircle } from "lucide-react";

export default function TimelineSection() {
  return (
    <section className="py-16 border-b border-border bg-muted/30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Filing Cycle Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            How do you spend your monthly GST cycle?
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            The difference between running manual VLOOKUP calculations on Day 19 and automated audits on Day 14.
          </p>
        </div>

        {/* Timeline Grid comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Path A: The Manual Chaos */}
          <div className="border border-border bg-card rounded-xl p-6 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-border text-alert">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-sm font-bold text-foreground">The Manual Excel Grind (Day 14 - 20)</h3>
              </div>
              
              <div className="mt-6 space-y-6 relative border-l border-border pl-5 ml-2.5">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[9px] font-bold text-white">
                    14
                  </span>
                  <h4 className="text-xs font-bold text-foreground">GSTR-2B Released</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Log in to multiple client portal accounts. Manually download JSON files. Spend hours converting JSON to raw Excel rows.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[9px] font-bold text-white">
                    17
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Excel VLOOKUP Hell</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Run manual VLOOKUP models. Compare supplier GSTIN, Invoice Numbers, and Tax Heads. Deal with typos (e.g. `Apex Steel` vs `Apex Steel Ltd`) failing formulas.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[9px] font-bold text-white">
                    19
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Manual Supplier Chasing</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Identify mismatches and call/email suppliers. Realize they haven't filed, but since it's Day 19, they can't upload invoices in time for this cycle.
                  </p>
                </div>
                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[9px] font-bold text-white">
                    20
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Emergency Filing & Notice Risk</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    File GSTR-3B with estimated ITC figures. Claim unverified credits under client pressure, causing high risk of DRC-01C automated tax notices.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded">
              <CalendarDays className="h-4 w-4 text-alert shrink-0" />
              <span>Result: <strong>120 billable hours lost per CA firm</strong> every single year.</span>
            </div>
          </div>

          {/* Path B: The Autopilot Path */}
          <div className="border border-success/30 dark:border-success/20 bg-card rounded-xl p-6 relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-border text-success">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-sm font-bold text-foreground">The Autopilot Process (Day 14 - 16)</h3>
              </div>
              
              <div className="mt-6 space-y-6 relative border-l border-border pl-5 ml-2.5">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-white">
                    14
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Auto-Fetch & Instantly Reconcile</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    API connects to GSP and downloads GSTR-2B. Ingests client purchase register (XLS/CSV) and processes 10,000+ rows instantly.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-white">
                    15
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Automated Chaser Queue</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    System lists all "Missing in 2B" rows and auto-drafts WhatsApp reminders. Send reminders in bulk. Suppliers file GSTR-1 amendments same day.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-white">
                    16
                  </span>
                  <h4 className="text-xs font-bold text-foreground">1-Click GSTR-3B Generation</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Review and finalize reconciliation metrics. Download a perfectly reconciled GSTR-3B Table 4 with fully compliant figures.
                  </p>
                </div>
                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-white">
                    17
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Stress-Free Filing Completed</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    File tax returns days before the deadline. Zero DRC-01C risks, 100% maximized cash flow, and satisfied clients.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground bg-success-bg/30 p-3 rounded border border-success/10">
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
              <span>Result: <strong>Recon completed in minutes.</strong> Complete compliance and audit logs.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
