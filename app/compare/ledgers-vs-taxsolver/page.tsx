import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Zap, ShieldCheck, Lock, HelpCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "LEDGERS Alternative: LEDGERS vs TaxSolver Comparison (2026) | TaxSolver",
  description: "Comparing LEDGERS (IndiaFilings) vs TaxSolver for GSTR-2B reconciliation? See why tax professionals choose TaxSolver for faster matching, fuzzy typo engines, and zero lock-in.",
  keywords: [
    "LEDGERS alternative",
    "LEDGERS vs TaxSolver",
    "IndiaFilings GST reconciliation",
    "best GST reconciliation software",
    "GSTR-2B matching tool"
  ],
  alternates: {
    canonical: "https://taxsolver.in/compare/ledgers-vs-taxsolver",
  },
  openGraph: {
    title: "LEDGERS Alternative: LEDGERS vs TaxSolver Comparison (2026)",
    description: "Compare LEDGERS and TaxSolver on GSTR-2B matching speed, vendor follow-ups, and data privacy.",
    type: "article",
    url: "https://taxsolver.in/compare/ledgers-vs-taxsolver",
    images: ["/og-image.jpg"],
  }
};

export default function LedgersComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1 w-full pt-16">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-4">
            <Scale className="h-3.5 w-3.5" />
            LEDGERS Alternative & Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight mb-6 leading-tight">
            LEDGERS vs TaxSolver
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Need a focused, high-speed reconciliation autopilot rather than an all-in-one accounting suite? See how TaxSolver outperforms LEDGERS for CA firm reconciliation workflows.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all gap-2"
            >
              Start Free 14-Day Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/free-tools/offline-reconciliation"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-xs font-bold text-foreground hover:bg-muted transition-all"
            >
              Try Free Offline Tool
            </Link>
          </div>
        </section>

        {/* Feature Matrix */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg text-left">
            <div className="bg-muted/40 p-6 border-b border-border">
              <h2 className="text-xl font-bold">LEDGERS vs TaxSolver Capability Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-4 px-6 font-bold text-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">Feature</th>
                    <th className="py-4 px-6 font-bold text-primary uppercase tracking-wider text-[11px] w-1/3 text-left bg-primary/5 border-x border-border">TaxSolver.in</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">LEDGERS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Specialization</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Deep GSTR-2B Autopilot</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>General Accounting Suite</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Fuzzy Typo Matching</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Yes (Handles INV-01 vs INV/01)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-destructive align-middle">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>Strict exact matching only</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">100% In-Browser Offline Mode</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Free client-side sandbox</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-destructive align-middle">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>No</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
