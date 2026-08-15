import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import IntegrationsBar from "@/components/landing/IntegrationsBar";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Link from "next/link";
import { ArrowRight, Download, UploadCloud, Zap, LineChart, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Tally Prime GSTR-2B Reconciliation Software | TaxSolver",
  description: "Seamlessly integrate your Tally Prime purchase register with TaxSolver for automated GSTR-2B reconciliation. No manual column mapping required.",
  keywords: [
    "Tally Prime GST reconciliation",
    "Tally purchase register matching",
    "GSTR-2B Tally software",
    "automate Tally GST reconciliation"
  ],
  alternates: {
    canonical: "https://taxsolver.in/integrations/tally",
  },
  openGraph: {
    title: "Tally Prime GSTR-2B Reconciliation Software | TaxSolver",
    description: "Seamlessly integrate your Tally Prime purchase register with TaxSolver for automated GSTR-2B reconciliation.",
    type: "website",
    url: "https://taxsolver.in/integrations/tally",
    images: ["/og-image.jpg"],
  }
};

export default function TallyIntegrationPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Reconcile Tally Prime Purchase Register with GSTR-2B",
    "description": "Step-by-step instructions to export your purchase vouchers from Tally Prime and match them with government GSTR-2B data using TaxSolver.",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "1. Export Purchase Register from Tally Prime",
        "text": "Open Tally Prime > Display More Reports > Statutory Reports > GST Reports > GSTR-2 or Purchase Register, and export as an Excel (.xlsx) file."
      },
      {
        "@type": "HowToStep",
        "name": "2. Ingest File into TaxSolver",
        "text": "Upload the raw Tally spreadsheet into TaxSolver. The intelligent parser automatically detects Tally's column headers without manual mapping."
      },
      {
        "@type": "HowToStep",
        "name": "3. Run Automated Reconciliation",
        "text": "TaxSolver pulls live GSTR-2B data via licensed GSP and runs deterministic and fuzzy matching in under 3 minutes."
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TaxSolver Tally Prime GST Reconciliation Connector",
    "operatingSystem": "Web / Windows / Mac",
    "applicationCategory": "BusinessApplication",
    "description": "Connector and intelligent parser for Tally Prime purchase registers to match GSTR-2B returns automatically.",
    "url": "https://taxsolver.in/integrations/tally"
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <main className="flex-1 w-full">
        {/* Tally Hero */}
        <section className="py-20 border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="flex items-center justify-center h-12 w-12 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <LineChart className="h-8 w-8" />
              </span>
              <span className="text-muted-foreground/40 text-xl font-bold">+</span>
              <span className="flex items-center justify-center bg-foreground text-background h-10 w-10 rounded font-sans font-bold text-lg">
                TS
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight mb-6">
              Automated GSTR-2B Reconciliation for Tally Prime
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Export your purchase register from Tally and drop it straight into TaxSolver. No manual formatting, no column mapping, just instant results.
            </p>
            <div className="flex justify-center">
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all gap-2">
                Connect Tally with TaxSolver <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-20 bg-background border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">How the integration works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-muted border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Download className="h-8 w-8 text-foreground/70" />
                </div>
                <h3 className="font-bold text-xl mb-3">1. Export from Tally</h3>
                <p className="text-muted-foreground text-sm">Simply export your monthly or quarterly Purchase Register from Tally Prime as an Excel (.xlsx) file.</p>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="hidden md:block absolute top-8 -left-8 -right-8 h-[2px] bg-border z-0"></div>
                <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm z-10">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">2. Drop into TaxSolver</h3>
                <p className="text-muted-foreground text-sm">Upload the raw Tally file. Our parser automatically detects Tally's column structure—no manual mapping required.</p>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="hidden md:block absolute top-8 -left-8 -right-8 h-[2px] bg-border z-0"></div>
                <div className="h-16 w-16 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm z-10">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-bold text-xl mb-3">3. Instant Match</h3>
                <p className="text-muted-foreground text-sm">TaxSolver fetches GSTR-2B via GSP and matches it against your Tally data in under 3 minutes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Integrations */}
        <IntegrationsBar />

        {/* Testimonials */}
        <TestimonialsSection />

      </main>
    </div>
  );
}
