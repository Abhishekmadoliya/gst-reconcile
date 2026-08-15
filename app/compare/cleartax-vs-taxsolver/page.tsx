import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Zap, ShieldCheck, Lock, HelpCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "ClearTax Alternative: ClearTax vs TaxSolver Comparison (2026) | TaxSolver",
  description: "Looking for a fast, affordable ClearTax alternative for GST reconciliation? Compare TaxSolver vs ClearTax on speed, pricing, offline privacy, and CA firm features.",
  keywords: [
    "ClearTax alternative",
    "ClearTax vs TaxSolver",
    "best GST reconciliation software for CAs",
    "ClearTax GST price",
    "MaxITC alternative",
    "offline GSTR-2B reconciliation software"
  ],
  alternates: {
    canonical: "https://taxsolver.in/compare/cleartax-vs-taxsolver",
  },
  openGraph: {
    title: "ClearTax Alternative: ClearTax vs TaxSolver Comparison (2026)",
    description: "Compare TaxSolver vs ClearTax on speed, pricing, in-memory offline security, and automated WhatsApp follow-ups.",
    type: "article",
    url: "https://taxsolver.in/compare/cleartax-vs-taxsolver",
    images: ["/og-image.jpg"],
  }
};

const comparisonFaqs = [
  {
    question: "Why are CA firms switching from ClearTax to TaxSolver?",
    answer: "Chartered Accountants choose TaxSolver for 3 main reasons: (1) 15-second high-speed matching engine that handles 100,000+ invoices without browser crashes, (2) 100% private in-browser offline reconciliation mode, and (3) Transparent flat pricing without enterprise quote lock-ins."
  },
  {
    question: "How does TaxSolver's pricing compare to ClearTax MaxITC?",
    answer: "ClearTax often charges upwards of ₹30,000 to ₹1,50,000+ annually with strict tier limitations. TaxSolver starts at just ₹999/month with unlimited client reconciliations and full GSP integration."
  },
  {
    question: "Can TaxSolver import raw Excel files from Tally Prime without column mapping?",
    answer: "Yes. TaxSolver's intelligent parser auto-detects Tally, Zoho, Busy, and SAP column configurations directly, unlike ClearTax which frequently requires template formatting."
  },
  {
    question: "Does TaxSolver support automated supplier chasing?",
    answer: "Yes. TaxSolver groups all missing 2B entries by supplier and auto-drafts WhatsApp reminders in one click so vendors upload missing invoices before filing deadlines."
  }
];

export default function ClearTaxComparePage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "TaxSolver GST Reconciliation Platform",
    "description": "Fast, privacy-first GST reconciliation software built specifically for CA firms and businesses in India as a high-performance alternative to ClearTax.",
    "brand": {
      "@type": "Brand",
      "name": "TaxSolver"
    },
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://taxsolver.in/compare/cleartax-vs-taxsolver"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": comparisonFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1 w-full pt-16">
        {/* Header Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-4">
            <Scale className="h-3.5 w-3.5" />
            ClearTax Alternative & Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight mb-6 leading-tight">
            ClearTax vs TaxSolver
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Looking for a modern, lightweight, and cost-effective ClearTax alternative? See why 250+ CA firms and tax professionals choose TaxSolver for automated GSTR-2B reconciliation.
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
              Try Free Offline Recon
            </Link>
          </div>
        </section>

        {/* Head to Head Comparison Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg text-left">
            <div className="bg-muted/40 p-6 border-b border-border">
              <h2 className="text-xl font-bold">Feature Comparison Matrix</h2>
              <p className="text-xs text-muted-foreground mt-1">Detailed feature breakdown between TaxSolver and ClearTax GST software.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-4 px-6 font-bold text-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">Capability</th>
                    <th className="py-4 px-6 font-bold text-primary uppercase tracking-wider text-[11px] w-1/3 text-left bg-primary/5 border-x border-border">TaxSolver.in</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">ClearTax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Matching Engine Speed</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>15 Seconds (10k+ rows)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>3 - 10 Minutes (Can hang on large files)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">100% In-Browser Offline Recon</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Available Free (No login needed)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-destructive align-middle">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>No (Cloud upload mandatory)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Pricing Transparency</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Flat ₹999/mo (No hidden tiers)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Custom enterprise quote (₹30k - ₹1.5L+)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Fuzzy Matching for Typo Invoices</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Advanced Levenshtein Distance</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Basic matching rules</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Automated WhatsApp Follow-ups</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>1-Click Auto-Draft WhatsApp</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Email only / Enterprise add-on</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">DRC-01C Penalty Diagnostic Tool</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Built-in Section 50 Calculator</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-destructive align-middle">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>No interactive risk tool</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">ERP Support (Tally, Zoho, Busy)</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Auto Column Detection</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-emerald-600 align-middle">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Supported</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why Switch Highlights */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20 text-left">
          <h2 className="text-2xl sm:text-3xl font-black font-sans mb-8">Why CA Firms Are Choosing TaxSolver</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-border bg-card rounded-xl">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold mb-2">10x Faster Ingestion</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ClearTax requires heavy page loads with bloated menus. TaxSolver is built on Next.js Turbopack, matching 10,000+ invoices in under 15 seconds.
              </p>
            </div>
            <div className="p-6 border border-border bg-card rounded-xl">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Client Data Privacy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need to reconcile without uploading sensitive financial data to external cloud servers? TaxSolver's offline tool runs statelessly in your browser cache.
              </p>
            </div>
            <div className="p-6 border border-border bg-card rounded-xl">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Notice-Free Assurance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reconciliation figures are automatically formatted into GSTR-3B Table 4 compliant schemas, eliminating automated DRC-01C notices under Rule 88D.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20 text-left border-t border-border pt-16">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {comparisonFaqs.map((faq, i) => (
              <div key={i} className="p-5 border border-border bg-card rounded-xl">
                <h4 className="text-xs sm:text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.question}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6 border-l border-border">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-muted/20 border-t border-border text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-3">Ready to upgrade your reconciliation workflow?</h2>
            <p className="text-xs text-muted-foreground mb-6">Switch from ClearTax to TaxSolver in under 2 minutes. No credit card required.</p>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all gap-2"
            >
              Get Started for Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
