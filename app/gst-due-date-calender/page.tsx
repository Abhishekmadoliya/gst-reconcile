import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import CalenderClient from "@/components/dueDateCalender/calenderClient";

export const metadata: Metadata = {
  title: "GST Due Date Calendar 2025-26 | Free Tool for CA Firms | TaxSolver",
  description:
    "Interactive GST due date calendar covering GSTR-1, GSTR-3B, CMP-08, GSTR-4, GSTR-7, GSTR-9, GSTR-9C and PMT-06. Includes CBIC extension overrides for accurate compliance planning.",
  keywords: [
    "GST due date calendar",
    "GSTR-1 due date",
    "GSTR-3B due date",
    "GSTR-9 due date",
    "QRMP due dates",
    "CBIC extension",
    "GST compliance calendar",
    "TaxSolver free tools",
  ],
  openGraph: {
    title: "GST Due Date Calendar 2025-26 | Free Tool for CA Firms | TaxSolver",
    description:
      "Stay compliant with a complete GST due date calendar. Filter by return type, category, turnover bracket, and state group.",
    type: "website",
    url: "https://taxsolver.in/gst-due-date-calender",
  },
};

export default function GstDueDateCalenderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1 w-full pt-12 md:pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-3">
            <Calendar className="h-3.5 w-3.5" />
            Compliance Calendar
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4">
            GST Due Date Calendar
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Track all your GST return due dates in one place. Filter by return
            type, taxpayer category, turnover bracket, and state group. Base
            rules are updated automatically; CBIC extensions are reflected as overrides.
          </p>
        </div>

        <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
          <CalenderClient />
        </div>

        {/* Structured Data (Schema.org JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GST Due Date Calendar 2025-26",
              "description": "Interactive GST due date calendar covering GSTR-1, GSTR-3B, CMP-08, GSTR-4, GSTR-7, GSTR-9, GSTR-9C and PMT-06.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "url": "https://taxsolver.in/gst-due-date-calender",
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
