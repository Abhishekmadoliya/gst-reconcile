import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import LateFeeCalculator from "@/components/gstLateFee/LateFeeCalculator";

export const metadata: Metadata = {
  title: "GST Late Fee & Interest Calculator 2025-26 | Free Tool | TaxSolver",
  description:
    "Free GST late fee calculator for GSTR-3B, GSTR-1, GSTR-4, GSTR-7 and GSTR-9. Estimate Section 47 late fee and Section 50 interest instantly with turnover-based caps.",
  keywords: [
    "GST late fee calculator",
    "GSTR-3B penalty calculator 2026",
    "GST interest calculator",
    "Section 47 late fee",
    "Section 50 interest",
    "GSTR late fee per day",
    "GST NIL return late fee",
    "TaxSolver free tools",
  ],
  openGraph: {
    title: "GST Late Fee & Interest Calculator 2025-26 | TaxSolver",
    description:
      "Estimate GST late fee and interest in seconds. Mobile-first calculator with live results, challan split, and turnover-based caps.",
    type: "website",
    url: "https://taxsolver.in/gst-late-fee-calculator",
  },
};

export default function GstLateFeeCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1 w-full pt-12 md:pt-16">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-3">
            <Calculator className="h-3.5 w-3.5" />
            Free GST Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4">
            GST Late Fee & Interest Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Instant estimate of late fee and interest for GSTR-3B, GSTR-1, GSTR-4, GSTR-7 and
            GSTR-9. Auto-fills due dates, applies turnover caps, and gives you a challan-ready
            split.
          </p>
        </div>

        {/* Tool */}
        <LateFeeCalculator />

        {/* Structured Data (Schema.org JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GST Late Fee & Interest Calculator",
              "description": "Instant estimate of late fee and interest for GSTR-3B, GSTR-1, GSTR-4, GSTR-7 and GSTR-9.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "All",
              "url": "https://taxsolver.in/gst-late-fee-calculator",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              }
            })
          }}
        />
      </main>
    </div>
  );
}
