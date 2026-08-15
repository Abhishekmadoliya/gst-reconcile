import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, BookOpen, AlertTriangle, Scale, Clock, Sparkles, HelpCircle, FileSpreadsheet } from "lucide-react";

export const metadata: Metadata = {
  title: "What is GSTR-2B Reconciliation? Complete Guide (2025-26) | TaxSolver",
  description: "Learn what GSTR-2B is, why reconciliation with purchase registers matters, and how to fix ITC mismatches. The ultimate guide for CA firms in India.",
  keywords: [
    "GSTR-2B reconciliation",
    "what is GSTR-2B",
    "ITC mismatch",
    "DRC-01C notice",
    "purchase register matching",
    "GST rule 88D",
  ],
  alternates: {
    canonical: "https://taxsolver.in/gstr-2b-reconciliation",
  },
  openGraph: {
    title: "What is GSTR-2B Reconciliation? Complete Guide (2025-26) | TaxSolver",
    description: "Learn what GSTR-2B is, why reconciliation with purchase registers matters, and how to fix ITC mismatches. The ultimate guide for CA firms in India.",
    type: "article",
    url: "https://taxsolver.in/gstr-2b-reconciliation",
    images: ["/og-image.jpg"],
  },
};

export default function GSTR2BGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What is GSTR-2B Reconciliation? The Complete Guide (2025–26)",
    "description": "Learn what GSTR-2B is, why reconciliation with purchase registers matters, and how to fix ITC mismatches.",
    "author": {
      "@type": "Organization",
      "name": "TaxSolver"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TaxSolver",
      "logo": {
        "@type": "ImageObject",
        "url": "https://taxsolver.in/logo.png"
      }
    },
    "datePublished": "2025-01-10",
    "dateModified": "2026-08-15"
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full text-left">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">GSTR-2B Reconciliation Guide</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            Compliance Mastery Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight mb-6 leading-tight text-foreground">
            What is GSTR-2B Reconciliation? The Complete Guide (2025–26)
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            GSTR-2B has fundamentally changed how Input Tax Credit (ITC) is claimed in India. This comprehensive guide covers everything Chartered Accountants and business owners need to know about GSTR-2B, matching it with purchase registers, and avoiding automated DRC-01C notices.
          </p>
        </div>

        {/* Structured Sections */}
        <div className="space-y-12 text-foreground">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 border-b border-border pb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black shrink-0">1</span>
              Understanding GSTR-2B
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              GSTR-2B is an auto-drafted Input Tax Credit (ITC) statement generated for every registered person based on the information furnished by their suppliers in their respective GSTR-1, GSTR-5, and GSTR-6 returns. Unlike GSTR-2A, which is dynamic and changes whenever a supplier uploads a past invoice, GSTR-2B is a <strong className="text-foreground">static statement</strong>.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              It is generated on the 14th of every month and indicates exactly how much ITC is "Eligible" and "Ineligible" for that specific tax period. The GST department mandates that your ITC claim in GSTR-3B must perfectly align with the eligible credit reflected in GSTR-2B under <strong className="text-foreground">Section 16(2)(aa)</strong> of the CGST Act.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 border-b border-border pb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black shrink-0">2</span>
              Why is GSTR-2B Reconciliation Important?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Reconciliation is the process of comparing your internal purchase records (Tally, Zoho, SAP, or Excel) against the government's GSTR-2B statement. This step is critical because:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Preventing Tax Leakage
                </h4>
                <p className="text-xs text-muted-foreground">Unclaimed vendor invoices mean lost cash flow that cannot be recovered after the annual filing cutoff.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" /> Avoiding DRC-01C Notices
                </h4>
                <p className="text-xs text-muted-foreground">Rule 88D automatically generates DRC-01C notices if your GSTR-3B ITC exceeds GSTR-2B by over 10%.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary shrink-0" /> Supplier Accountability
                </h4>
                <p className="text-xs text-muted-foreground">Pinpoint non-compliant vendors who collect GST but fail to deposit it with the government.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-destructive shrink-0" /> Stopping Section 50 Interest
                </h4>
                <p className="text-xs text-muted-foreground">Wrongful utilization of excess ITC accrues an 18% per annum mandatory statutory interest charge.</p>
              </div>
            </div>
          </section>

          {/* Callout Banner */}
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Automate GSTR-2B Matching in 15 Seconds
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Stop matching invoices manually in Excel. TaxSolver connects directly with GSTN and matches 10,000+ invoices in seconds.
              </p>
            </div>
            <Link
              href="/free-tools/offline-reconciliation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg shadow hover:bg-primary/90 transition-all shrink-0"
            >
              Try Free Offline Tool <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 border-b border-border pb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black shrink-0">3</span>
              Common GSTR-2B vs Purchase Register Mismatches
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              When you match your books against GSTR-2B, invoice line items typically classify into four distinct compliance categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="border border-emerald-500/30 p-5 rounded-xl bg-emerald-500/5">
                <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4" /> 1. Matched Invoices
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Invoice numbers, GSTINs, and tax values match exactly in both your purchase register and GSTR-2B. 100% safe to claim in GSTR-3B Table 4(A)(5).
                </p>
              </div>
              <div className="border border-amber-500/30 p-5 rounded-xl bg-amber-500/5">
                <h4 className="text-xs font-bold text-amber-600 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" /> 2. Amount / Tax Head Mismatches
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The invoice exists in both records, but taxable value, IGST vs CGST/SGST heads, or rounding differences cause variance.
                </p>
              </div>
              <div className="border border-destructive/30 p-5 rounded-xl bg-destructive/5">
                <h4 className="text-xs font-bold text-destructive flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" /> 3. In Books, Not in GSTR-2B
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You possess the purchase invoice, but the supplier failed to file their GSTR-1 return. You cannot claim this ITC until the supplier files.
                </p>
              </div>
              <div className="border border-primary/30 p-5 rounded-xl bg-primary/5">
                <h4 className="text-xs font-bold text-primary flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-4 w-4" /> 4. In GSTR-2B, Not in Books
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The supplier filed the invoice on the portal, but it has not been recorded in your accounting books yet (potential unbooked eligible ITC).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 border-b border-border pb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black shrink-0">4</span>
              The Problem with Manual Excel VLOOKUP Matching
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Traditionally, tax teams download raw GSTR-2B Excel sheets and spend days creating complex multi-column VLOOKUPs. This legacy approach fails because:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pl-4 list-disc">
              <li><strong>Invoice Formatting Typos:</strong> An accountant entering <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">INV/25/089</code> will fail a strict VLOOKUP against the supplier's <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">INV-089</code>, even though the ITC is 100% legitimate.</li>
              <li><strong>Cross-Period Invoices:</strong> Invoices from prior tax quarters filed late by suppliers get lost without multi-period historical scanning.</li>
              <li><strong>Excessive Billable Hours:</strong> Managing 30+ client GSTINs manually consumes over 120 hours each monthly filing cycle.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 border-b border-border pb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black shrink-0">5</span>
              Automating GSTR-2B Reconciliation with TaxSolver
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              TaxSolver eliminates manual reconciliation by combining direct GSP portal connectivity with intelligent fuzzy-matching algorithms:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pl-4 list-disc">
              <li><strong>Instant ERP Ingestion:</strong> Ingests raw purchase registers exported directly from Tally Prime, Busy, Zoho Books, or SAP.</li>
              <li><strong>Levenshtein Fuzzy Typos Engine:</strong> Automatically reconciles invoices with slashes, hyphens, and leading zero variations.</li>
              <li><strong>1-Click WhatsApp Chaser:</strong> Auto-groups missing 2B entries by supplier and creates pre-filled WhatsApp follow-up messages.</li>
              <li><strong>Audit-Ready Export:</strong> Formats final reconciled figures directly into GSTR-3B Table 4 compliant worksheets.</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
