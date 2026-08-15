import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RiskCalculator from "@/components/landing/RiskCalculator";
import Link from "next/link";
import { Calculator, ShieldAlert, CheckCircle2, Scale, ArrowRight, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Free GST ITC Mismatch & Section 50 Interest Calculator | TaxSolver",
  description: "Calculate your DRC-01C notice risk and potential Section 50 interest penalties for claiming excess ITC under GST. Free online calculator for CA firms and tax consultants.",
  keywords: [
    "free ITC calculator",
    "GST ITC mismatch calculator",
    "Section 50 interest calculator",
    "DRC-01C penalty estimator",
    "CGST Rule 88D tool",
    "TaxSolver free tools"
  ],
  alternates: {
    canonical: "https://taxsolver.in/free-tools/itc-calculator",
  },
  openGraph: {
    title: "Free GST ITC Mismatch & Section 50 Interest Calculator | TaxSolver",
    description: "Instant estimate of DRC-01C notice risk and Section 50 interest penalty under CGST Rule 88D.",
    type: "website",
    url: "https://taxsolver.in/free-tools/itc-calculator",
    images: ["/og-image.jpg"],
  }
};

const itcFaqs = [
  {
    question: "How is the 10% threshold under Rule 88D determined?",
    answer: "Rule 88D triggers automated notices when the Input Tax Credit claimed in GSTR-3B exceeds the eligible credit in GSTR-2B by more than 10% AND the absolute tax difference exceeds ₹1,00,000."
  },
  {
    question: "What is the interest rate under Section 50 for wrongful ITC utilization?",
    answer: "Interest is levied at 18% per annum under Section 50(3) of the CGST Act on the excess credit that has been utilized against output tax liability from the due date of filing until the date of payment."
  },
  {
    question: "Can I use this calculator for multiple GSTINs?",
    answer: "Yes, this free web utility is 100% unconstrained and runs client-side. You can evaluate monthly ITC volume and mismatch exposures for any number of clients or GSTINs."
  }
];

export default function ITCCalculatorPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TaxSolver Free ITC Mismatch & Section 50 Interest Calculator",
    "description": "Interactive compliance calculator to evaluate GSTR-2B vs 3B variance, DRC-01C notice trigger risks, and 18% Section 50 interest penalty exposures.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "url": "https://taxsolver.in/free-tools/itc-calculator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": itcFaqs.map(faq => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1 w-full pt-16">
        {/* Title Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-3">
            <Calculator className="h-3.5 w-3.5" />
            Compliance Diagnostic Utility
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4">
            Free GST ITC Mismatch & Interest Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quickly determine if your current GSTR-3B vs GSTR-2B variance will trigger an automated DRC-01C compliance notice, and estimate your Section 50 18% p.a. interest liability.
          </p>
        </div>

        {/* Standalone Tool Container */}
        <div className="max-w-7xl mx-auto pb-16">
          <RiskCalculator />
        </div>

        {/* SEO In-Depth Article Content */}
        <section className="border-t border-border bg-muted/20 py-16 text-left">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight mb-6">
              Understanding ITC Leakage, Rule 88D & Section 50 Penalties
            </h2>
            
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
              <p>
                Under the Indian GST framework, claiming <strong>Input Tax Credit (ITC)</strong> is subject to strict automated verification. In accordance with <strong>Section 16(2)(aa) of the CGST Act, 2017</strong>, a recipient can avail ITC only if the details of the invoice or debit note have been uploaded by the supplier in Form GSTR-1 and communicated to the recipient in Form GSTR-2B.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
                <div className="border border-border bg-card p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-alert" />
                    DRC-01C Notice Triggers
                  </h3>
                  <p className="text-xs">
                    GSTN automatically issues Form DRC-01C when GSTR-3B Table 4 claims exceed GSTR-2B values by <strong>&gt;10% or ₹1,00,000</strong>. Taxpayers must respond within 7 days.
                  </p>
                </div>

                <div className="border border-border bg-card p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-1 flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-primary" />
                    Section 50(3) Interest Rates
                  </h3>
                  <p className="text-xs">
                    Wrongful claim and utilization of ITC attracts mandatory interest at <strong>18% per annum</strong> calculated from the filing due date until settlement via Form DRC-03.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mt-8">How to Prevent Notice Penalties</h3>
              <p>
                Chartered Accountants and finance teams must implement regular monthly reconciliation before approving GSTR-3B numbers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Ingest Purchase Books:</strong> Match all vouchers from Tally Prime, Zoho Books, or SAP directly against the government's GSTR-2B JSON file.</li>
                <li><strong>Catch Invoice Typos:</strong> Use Levenshtein fuzzy string matching to bridge invoice numbering discrepancies (e.g. <code>INV-001</code> vs <code>INV/001</code>).</li>
                <li><strong>Automate Supplier Follow-ups:</strong> Immediately notify defaulting suppliers via WhatsApp or email to ensure they file their pending GSTR-1 before the 3B deadline.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-border text-left">
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {itcFaqs.map((faq, i) => (
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
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center border-t border-border">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want Full Automation for Your CA Firm?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-xs leading-relaxed">
            Move beyond manual calculations. TaxSolver automatically syncs your clients' GSTR-2B data through authorized GSPs and reconciles 10,000+ invoices in seconds.
          </p>
          <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors gap-2">
            Start Free 14-Day Trial <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

      </main>
    </div>
  );
}
