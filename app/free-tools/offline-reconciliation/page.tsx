import type { Metadata } from "next";
import OfflineReconciliationClient from "./OfflineReconciliationClient";
import { ShieldCheck, HelpCircle, ShieldAlert, Zap, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Offline GSTR-2B Reconciliation Tool & Purchase Matcher | TaxSolver",
  description: "Reconcile GSTR-2B JSON or Excel downloaded from the GST portal against your purchase register spreadsheet. 100% free, offline, in-browser, and secure.",
  keywords: [
    "free GSTR 2B reconciliation tool",
    "offline GST reconciliation software",
    "GSTR-2B purchase register matching excel",
    "GST portal offline utility download",
    "ITC mismatch calculator India",
    "TaxSolver free tools"
  ],
  openGraph: {
    title: "Free Offline GSTR-2B Reconciliation Tool & Purchase Matcher | TaxSolver",
    description: "Reconcile GSTR-2B JSON or Excel downloaded from the GST portal against your purchase register spreadsheet. 100% free, offline, in-browser, and secure.",
    type: "website",
    url: "https://taxsolver.in/free-tools/offline-reconciliation",
  }
};

export default function OfflineReconciliationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      
      {/* 1. Tool Core Layout */}
      <main className="flex-1 w-full pt-16">
        
        {/* Title and Intro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Security Audit Passed: 100% Client-Side / In-Memory
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4">
            Free Offline GSTR-2B Reconciliation Tool
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Reconcile your books of accounts (Purchase Register) against GSTR-2B records instantly. 
            No portal credentials, no GSP API access, and no database logging. Secure, compliant, and lightning-fast.
          </p>
        </div>

        {/* Interactive Client Component Container */}
        <div className="max-w-7xl mx-auto pb-16">
          <OfflineReconciliationClient />
        </div>

        {/* ========================================================
            SEO ARTICLE SECTION (600+ words of structured text)
            ======================================================== */}
        <section className="border-t border-border bg-muted/20 py-16 print:hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight mb-6">
              Why CAs and Corporate Tax Teams Reconcile Offline
            </h2>
            
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
              
              <p>
                In the Indian GST regime, claiming <strong>Input Tax Credit (ITC)</strong> is strictly governed by 
                Section 16(2)(aa) of the CGST Act, 1917. This mandate stipulates that a taxpayer can only claim ITC 
                if the respective invoice has been uploaded by the supplier in their GSTR-1, thereby reflecting in the recipient's 
                <strong>GSTR-2B statement</strong>. Claiming ITC on mismatching or un-uploaded invoices results in automatic compliance 
                notices like the <strong>DRC-01C</strong>, coupled with interest penalties under Section 50 at 18% per annum.
              </p>

              {/* Grid Features */}
              <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
                <div className="border border-border bg-card p-4 rounded-xl flex gap-3">
                  <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase mb-1">Complete Data Privacy</h3>
                    <p className="text-[11px]">
                      Your transaction records, supplier GSTINs, and commercial purchase amounts remain completely local. 
                      Since we process data in-memory and perform matches statelessly, no sensitive finance logs are saved.
                    </p>
                  </div>
                </div>

                <div className="border border-border bg-card p-4 rounded-xl flex gap-3">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase mb-1">Zero Portal Downtime</h3>
                    <p className="text-[11px]">
                      Avoid portal failures and OTP timeouts. The GST network gets heavily congested around filing deadlines. 
                      Offline matching permits continuous operations independent of official portal server availability.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mt-8">How Our Fuzzy-Matching Engine Identifies Mismatches</h3>
              <p>
                Legacy reconciliation practices using Excel formulas like <code>VLOOKUP</code> or <code>INDEX/MATCH</code> suffer from high error rates due to 
                variations in invoice numbering systems. For instance, a supplier might record invoice <code>INV/123/25</code>, while the books ledger 
                registers it as <code>INV-123-25</code> or simply <code>123</code>.
              </p>
              <p>
                Our offline reconciliation engine resolves this by employing **Levensthein distance algorithms** and composite matching rules:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Invoice Number Normalization:</strong> Strips special characters, forward slashes, hyphens, and leading zeros to run string comparisons on core numbers.</li>
                <li><strong>Fuzzy Supplier Name Resolution:</strong> Matches supplier name profiles (e.g., <em>"M/S Reliance Industries Ltd"</em> vs <em>"Reliance Industries"</em>) if the GSTIN matches but names vary.</li>
                <li><strong>Date Range Tolerances:</strong> Automatically bridges date recording variances (e.g. shipping dates vs recording dates) within configured thresholds.</li>
                <li><strong>Rounding Tolerance:</strong> Adjusts for ₹1 or ₹10 rounding differences commonly occurring in SGST/CGST fraction calculations.</li>
              </ul>

              <h3 className="text-lg font-bold text-foreground mt-8">How to Export GSTR-2B and ERP Spreadsheets</h3>
              <p>
                To utilize the offline reconciliation matcher, export and upload two standard documents:
              </p>
              
              <div className="space-y-4 my-6 not-prose">
                <div className="p-4 border border-border bg-muted/40 rounded-lg">
                  <h4 className="text-xs font-bold text-foreground uppercase flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Document 1: Purchase Register
                  </h4>
                  <p className="text-xs leading-normal">
                    Export your purchase daybook or voucher journal from your ERP. We support exports from 
                    <strong> Tally Prime</strong> (GSTR-2 Annexure or Ledger Voucher), <strong>Zoho Books</strong>, 
                    <strong> Busy</strong>, <strong>SAP ERP</strong>, and custom Microsoft Excel templates. Ensure the columns include 
                    <em> Invoice No, Date, supplier GSTIN, Taxable Value, and SGST/CGST/IGST tax fields</em>.
                  </p>
                </div>

                <div className="p-4 border border-border bg-muted/40 rounded-lg">
                  <h4 className="text-xs font-bold text-foreground uppercase flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    Document 2: GSTR-2B Auto-Drafted Statement
                  </h4>
                  <p className="text-xs leading-normal">
                    Log in to the official <strong>GST Portal (gst.gov.in)</strong>. Go to <em>Services &gt; Returns &gt; Returns Dashboard</em>, select the filing month and financial year, and locate the GSTR-2B tile. 
                    Download either the <strong>JSON File</strong> or the <strong>Excel File</strong> and upload it directly. The parser handles multi-sheet workbook segments and credit notes automatically.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mt-8">Filing Accurate GSTR-3B and Maximizing ITC</h3>
              <p>
                Under CGST Rule 36(4), dynamic ITC claims are capped. By running regular weekly or monthly checks with our 
                offline auditor, Chartered Accountants and tax consultants can:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Identify suppliers who are collecting tax but neglecting to file their GSTR-1, permitting proactive supplier communication.</li>
                <li>Verify that no duplicate invoices are entered in the purchase ledger, avoiding double ITC claims that invite heavy audit queries.</li>
                <li>Generate clear reports to block payments or hold tax fractions for defaulting vendors until they upload missing vouchers.</li>
              </ul>
              <p>
                Ensure compliance, secure your tax credits, and run safe accounting workflows. Download the final reports as stylized 
                Excel sheets or print the mismatch sheets directly to PDF for client reviews.
              </p>

            </div>

            {/* Structured Data (Schema.org JSON-LD) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "TaxSolver Free Offline GSTR-2B Reconciliation Tool",
                  "operatingSystem": "Web Browser",
                  "applicationCategory": "BusinessApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                  },
                  "featureList": [
                    "Stateless GSTR-2B JSON and Excel parsing",
                    "ERP Purchase Register mapping",
                    "Levensthein distance invoice fuzzy-matching",
                    "Automatic Indian Rupees formatting",
                    "Styled Excel exports and printable PDF report card outputs"
                  ]
                })
              }}
            />

          </div>
        </section>

      </main>

    </div>
  );
}