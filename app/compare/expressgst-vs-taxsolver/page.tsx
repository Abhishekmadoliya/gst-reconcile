import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Zap, ShieldCheck, Lock, HelpCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "ExpressGST Alternative: ExpressGST vs TaxSolver Comparison (2026) | TaxSolver",
  description: "Comparing ExpressGST (KDK Software) vs TaxSolver for GST reconciliation? Discover why tax professionals prefer TaxSolver for 15-second speed, interactive sandbox demo, and free offline tools.",
  keywords: [
    "ExpressGST alternative",
    "ExpressGST vs TaxSolver",
    "KDK software GST reconciliation",
    "smart reconciliation alternative",
    "best GST software India"
  ],
  alternates: {
    canonical: "https://taxsolver.in/compare/expressgst-vs-taxsolver",
  },
  openGraph: {
    title: "ExpressGST Alternative: ExpressGST vs TaxSolver Comparison (2026)",
    description: "Compare ExpressGST and TaxSolver on reconciliation speed, fuzzy matching, and in-browser offline tools.",
    type: "article",
    url: "https://taxsolver.in/compare/expressgst-vs-taxsolver",
    images: ["/og-image.jpg"],
  }
};

const comparisonFaqs = [
  {
    question: "What is the key difference between TaxSolver and ExpressGST?",
    answer: "While ExpressGST (KDK Softwares) requires desktop setups and complex portal credential syncs, TaxSolver is a 100% modern cloud-native SaaS that also includes a free in-memory offline reconciliation sandbox with fuzzy invoice typo matching."
  },
  {
    question: "Can TaxSolver calculate Section 50 interest penalties like ExpressGST?",
    answer: "Yes, TaxSolver features an interactive real-time DRC-01C diagnostic calculator that evaluates GSTR-3B vs 2B discrepancy percentages and computes exact 18% p.a. interest liability under Rule 88D."
  },
  {
    question: "Does TaxSolver require software installation?",
    answer: "No. TaxSolver works directly in your web browser on Windows, Mac, or Linux without installing any desktop packages."
  }
];

export default function ExpressGSTComparePage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "TaxSolver vs ExpressGST",
    "description": "High-performance GST reconciliation software comparison for CA firms and corporate finance teams.",
    "brand": {
      "@type": "Brand",
      "name": "TaxSolver"
    },
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://taxsolver.in/compare/expressgst-vs-taxsolver"
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
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-4">
            <Scale className="h-3.5 w-3.5" />
            ExpressGST Alternative & Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight mb-6 leading-tight">
            ExpressGST vs TaxSolver
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Looking for a faster, cloud-native alternative to ExpressGST? See how TaxSolver streamlines GSTR-2B reconciliation with zero desktop installs and 15-second matching.
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

        {/* Feature Comparison Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg text-left">
            <div className="bg-muted/40 p-6 border-b border-border">
              <h2 className="text-xl font-bold">ExpressGST vs TaxSolver Comparison</h2>
              <p className="text-xs text-muted-foreground mt-1">Comparing user experience, algorithms, and compliance workflows.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="py-4 px-6 font-bold text-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">Feature</th>
                    <th className="py-4 px-6 font-bold text-primary uppercase tracking-wider text-[11px] w-1/3 text-left bg-primary/5 border-x border-border">TaxSolver.in</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-wider text-[11px] w-1/3 text-left">ExpressGST (KDK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Deployment</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>100% Web Cloud / Browser</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Hybrid Cloud / Desktop</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Free In-Browser Offline Recon</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Yes (Client-side memory)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-destructive align-middle">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>No free offline tool</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Fuzzy Invoice Typo Engine</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Automated Levenshtein Resolution</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Standard exact/tolerance matching</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold align-middle">Free GST Due Date & Late Fee Tools</td>
                    <td className="py-4 px-6 bg-primary/5 font-bold text-emerald-600 align-middle border-x border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Included Free</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground align-middle">
                      <span>Requires registration/login</span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
      </main>
    </div>
  );
}
