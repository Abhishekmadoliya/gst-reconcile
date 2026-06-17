import ReconSandbox from "./ReconSandbox";
import { ShieldCheck, Zap, Database, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-16 lg:py-10 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-border bg-muted/40 rounded-md text-[10px] font-medium text-foreground/80 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Production-Grade GST Reconciliation Autopilot</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-foreground mt-4 tracking-tight leading-[1.15]">
              Say goodbye to manual VLOOKUPs. Reconcile in seconds.
            </h1>

            {/* Value description */}
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Automate the monthly GSTR-2B vs Purchase Register matching cycle.
              Automatically identify discrepancies, chase late-filing suppliers,
              and claim 100% of your eligible ITC with zero compliance leakage.
            </p>

            {/* Core benefits checklist */}
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5 text-xs text-foreground/80">
                <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Authorized GSP Connection:</strong> Certified API handshake via <strong>Sandbox.co.in</strong> and <strong>MasterGST</strong> to fetch live returns instantly.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground/80">
                <Database className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Normalizes All ERP Outputs:</strong> Auto-ingests Tally, Zoho Books, Busy, and custom Excel dumps. No manual column mapping required.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground/80">
                <Zap className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Auto-Draft WhatsApp alerts:</strong> Automatically chases suppliers with missing invoices in one click.
                </span>
              </li>
            </ul>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#pricing"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
              >
                View Plans & Try Free
              </a>
              <a
                href="#demo"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer gap-1.5"
              >
                Try Interactive Demo <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* GSP Badges / Trust */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Certified GSP Integrations & Security
              </p>
              <div className="flex items-center gap-4 mt-3 opacity-85">
                <div className="text-xs font-mono border border-border px-2.5 py-1 rounded bg-muted text-muted-foreground">
                  Sandbox.co.in API
                </div>
                <div className="text-xs font-mono border border-border px-2.5 py-1 rounded bg-muted text-muted-foreground">
                  MasterGST Node
                </div>
                <div className="text-xs font-mono border border-border px-2.5 py-1 rounded bg-muted text-muted-foreground">
                  AES-256 Encrypted
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Sandbox Column */}
          <div className="lg:col-span-7 w-full lg:sticky lg:top-24">
            <div className="rounded-xl overflow-hidden border border-border shadow-2xl bg-card">
              {/* Windows Window frame for layout aesthetics */}
              <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                <span className="text-[10px] font-mono text-muted-foreground ml-3">gst-recon-autopilot // dashboard</span>
              </div>
              <ReconSandbox />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
