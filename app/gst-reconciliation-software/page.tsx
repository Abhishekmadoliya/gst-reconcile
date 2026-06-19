import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CompetitorComparisonSection from "@/components/landing/CompetitorComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Best GST Reconciliation Software for CA Firms in India (2026)",
  description: "Compare the best GSTR-2B reconciliation software. See why modern CA firms choose TaxSolver over ClearTax, LEDGERS, and Excel VLOOKUPs.",
};

export default function SoftwareLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">

      <main className="flex-1 w-full">

        {/* Commercial Hero */}
        <section className="py-20 border-b border-border bg-muted/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight mb-6">
              The Best GST Reconciliation Software for CA Firms
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Stop fighting with Excel VLOOKUPs and legacy software that crashes on large files. TaxSolver is built for speed, accuracy, and scale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all cursor-pointer">
                Start Free 14-Day Trial
              </Link>
              <Link href="/demo" className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-sm font-bold text-foreground hover:bg-muted transition-all cursor-pointer gap-2">
                Watch Live Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> No Credit Card Required</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Setup in 2 Minutes</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Direct GSP Integration</span>
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <CompetitorComparisonSection />

        {/* Differentiators Section */}
        <section className="py-20 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why switch to TaxSolver?</h2>
                <div className="space-y-6">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-bold text-lg mb-2">High-Performance Matching Engine</h3>
                    <p className="text-muted-foreground text-sm">Legacy desktop software hangs when processing more than 5,000 rows. TaxSolver’s cloud infrastructure processes 100,000+ invoices in under 3 minutes.</p>
                  </div>
                  <div className="border-l-2 border-border pl-4 opacity-75 hover:opacity-100 hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">Smart Fuzzy Matching</h3>
                    <p className="text-muted-foreground text-sm">Invoice number typos? "INV-001" vs "INV/001"? Our AI-assisted fuzzy matching algorithm catches human errors that VLOOKUP misses, recovering more ITC.</p>
                  </div>
                  <div className="border-l-2 border-border pl-4 opacity-75 hover:opacity-100 hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">Automated Supplier Follow-ups</h3>
                    <p className="text-muted-foreground text-sm">Stop manually emailing suppliers for missing invoices. TaxSolver groups missing 2B entries by vendor and drafts WhatsApp messages automatically.</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-xl border border-border p-8 shadow-xl flex items-center justify-center min-h-[400px]">
                {/* Visual placeholder for software UI */}
                <div className="w-full space-y-4">
                  <div className="h-10 bg-card rounded border border-border w-full flex items-center px-4 justify-between">
                    <span className="h-3 w-32 bg-muted-foreground/20 rounded"></span>
                    <span className="h-4 w-12 bg-success/20 rounded"></span>
                  </div>
                  <div className="h-10 bg-card rounded border border-border w-full flex items-center px-4 justify-between">
                    <span className="h-3 w-48 bg-muted-foreground/20 rounded"></span>
                    <span className="h-4 w-12 bg-success/20 rounded"></span>
                  </div>
                  <div className="h-10 bg-card border-2 border-primary/50 rounded w-full flex items-center px-4 justify-between relative shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                    <span className="h-3 w-40 bg-foreground/80 rounded"></span>
                    <span className="h-4 w-16 bg-amber-500/20 text-amber-500 text-[9px] font-bold flex items-center justify-center rounded">FUZZY MATCH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

      </main>

    </div>
  );
}
