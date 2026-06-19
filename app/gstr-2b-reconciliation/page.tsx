import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "What is GSTR-2B Reconciliation? Complete Guide (2025-26) | TaxSolver",
  description: "Learn what GSTR-2B is, why reconciliation with purchase registers matters, and how to fix ITC mismatches. The ultimate guide for CA firms in India.",
};

export default function GSTR2BGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">GSTR-2B Reconciliation Guide</span>
        </div>

        {/* Hero */}
        <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-6">
          What is GSTR-2B Reconciliation? The Complete Guide (2025–26)
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          GSTR-2B has fundamentally changed how Input Tax Credit (ITC) is claimed in India. This comprehensive guide covers everything Chartered Accountants and business owners need to know about GSTR-2B, matching it with purchase registers, and avoiding DRC-01C notices.
        </p>

        {/* Content */}
        <article className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-a:text-primary max-w-none">
          <h2>1. Understanding GSTR-2B</h2>
          <p>
            GSTR-2B is an auto-drafted Input Tax Credit (ITC) statement generated for every registered person based on the information furnished by their suppliers in their respective GSTR-1, GSTR-5, and GSTR-6 returns. Unlike GSTR-2A, which is dynamic and changes whenever a supplier uploads a past invoice, GSTR-2B is a <strong>static statement</strong>.
          </p>
          <p>
            It is generated on the 14th of every month and indicates exactly how much ITC is "Eligible" and "Ineligible" for that specific tax period. The GST department now mandates that your ITC claim in GSTR-3B must perfectly align with the eligible credit reflected in GSTR-2B.
          </p>

          <h2>2. Why is GSTR-2B Reconciliation Important?</h2>
          <p>
            Reconciliation is the process of comparing your internal purchase records (Tally, Zoho, SAP, or Excel) against the government's GSTR-2B statement. This step is critical because:
          </p>
          <ul>
            <li><strong>Preventing Tax Leakage:</strong> If you don't reconcile, you may miss claiming ITC for invoices your supplier filed, leading to direct cash loss.</li>
            <li><strong>Avoiding DRC-01C Notices:</strong> Rule 88D mandates that if your ITC claim in GSTR-3B exceeds the GSTR-2B balance by the prescribed margin, the portal automatically triggers a DRC-01C compliance notice.</li>
            <li><strong>Supplier Accountability:</strong> Reconciliation highlights which suppliers are collecting GST from you but failing to deposit it with the government.</li>
            <li><strong>Section 50 Penalties:</strong> Over-claiming ITC results in hefty interest penalties under Section 50 of the CGST Act.</li>
          </ul>

          <div className="my-10 p-6 bg-muted/40 border border-border rounded-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mt-0 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" /> Want to automate this?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stop matching invoices manually in Excel. TaxSolver connects directly to the GST portal and automatically reconciles 10,000+ invoices in seconds.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded shadow hover:bg-primary/90 transition-colors">
              Try TaxSolver Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <h2>3. Common GSTR-2B vs Purchase Register Mismatches</h2>
          <p>When you match your books against GSTR-2B, invoices typically fall into four categories:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="border border-border p-4 rounded-lg bg-card">
              <h4 className="text-success font-bold mt-0 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Matched Invoices
              </h4>
              <p className="text-xs text-muted-foreground mb-0">Invoice exists in both your books and GSTR-2B with matching values. Safe to claim 100% ITC.</p>
            </div>
            <div className="border border-amber-500/30 p-4 rounded-lg bg-amber-500/5">
              <h4 className="text-amber-500 font-bold mt-0">Amount Mismatch</h4>
              <p className="text-xs text-muted-foreground mb-0">Invoice exists in both, but the tax amount or taxable value differs. Usually due to typos or rounding errors.</p>
            </div>
            <div className="border border-destructive/30 p-4 rounded-lg bg-destructive/5">
              <h4 className="text-destructive font-bold mt-0">In Books, Not in 2B</h4>
              <p className="text-xs text-muted-foreground mb-0">You have the purchase invoice, but the supplier hasn't filed their GSTR-1. You cannot claim this ITC yet.</p>
            </div>
            <div className="border border-info/30 p-4 rounded-lg bg-info/5">
              <h4 className="text-info font-bold mt-0">In 2B, Not in Books</h4>
              <p className="text-xs text-muted-foreground mb-0">Supplier filed the invoice, but it's missing from your purchase register. You might be missing out on eligible ITC.</p>
            </div>
          </div>

          <h2>4. The Manual Reconciliation Problem</h2>
          <p>
            Traditionally, CAs and finance teams download the GSTR-2B JSON or Excel file from the portal, download their purchase register from Tally, and spend hours writing complex VLOOKUPs and pivot tables.
          </p>
          <p>
            This manual approach is broken for several reasons:
          </p>
          <ul>
            <li><strong>Invoice Number Typos:</strong> Your accountant might enter "INV/2024/001" while the supplier filed it as "INV-24-001". Excel VLOOKUP will fail, but the ITC is valid.</li>
            <li><strong>Cross-Period Invoices:</strong> An invoice from March might be filed by the supplier in May. Tracking this manually across months is a nightmare.</li>
            <li><strong>Time Consumption:</strong> For a firm managing 30+ clients, manual matching eats up over 120 billable hours every month.</li>
          </ul>

          <h2>5. Automating GSTR-2B Matching with TaxSolver</h2>
          <p>
            Using a dedicated GST reconciliation software like TaxSolver eliminates manual Excel work entirely.
            By integrating directly with GST Suvidha Providers (GSPs), TaxSolver fetches the live GSTR-2B data, ingests your raw ERP purchase register, and runs proprietary matching algorithms (including fuzzy matching for typos).
          </p>
          <p>
            The software automatically generates the finalized Table 4 figures for your GSTR-3B return, ensuring you never over-claim ITC and never trigger a DRC-01C notice.
          </p>
        </article>

      </main>

    </div>
  );
}
