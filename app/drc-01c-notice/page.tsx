import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RiskCalculator from "@/components/landing/RiskCalculator";
import Link from "next/link";
import { AlertTriangle, Clock, FileText } from "lucide-react";

export const metadata = {
  title: "DRC-01C Notice: What It Is & How to Respond | TaxSolver",
  description: "Received a DRC-01C notice for ITC mismatch? Learn why you got it, how to calculate the Section 50 interest, and the exact process to reply within the 7-day window.",
};

export default function DRC01CNoticePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">

      <main className="flex-1 w-full">
        {/* Notice Alert Header */}
        <section className="bg-destructive/10 border-b border-destructive/20 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-destructive/20 text-destructive mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4 text-destructive">
              DRC-01C Notice Guide
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about the GST portal's automated compliance notice for ITC mismatches between GSTR-2B and GSTR-3B.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">

          <article className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-a:text-primary max-w-none">
            <h2>What is a DRC-01C Notice?</h2>
            <p>
              Under <strong>Rule 88D of the CGST Rules</strong>, the GST portal automatically compares the Input Tax Credit (ITC) you claimed in your GSTR-3B return with the eligible ITC reflected in your auto-drafted GSTR-2B statement.
            </p>
            <p>
              If the ITC claimed in GSTR-3B exceeds the ITC available in GSTR-2B by a specific percentage or amount (as prescribed by the council), the portal automatically issues an intimation in <strong>Part A of Form GST DRC-01C</strong>.
            </p>

            <div className="my-8 p-6 bg-card border border-destructive/30 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-destructive/10 p-3 rounded-full text-destructive shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mt-0 mb-2">The 7-Day Deadline</h3>
                <p className="text-sm text-muted-foreground mb-0">
                  Once the DRC-01C notice is issued, the taxpayer has exactly <strong>7 days</strong> to respond in Part B of the form. Failure to respond will result in the immediate blocking of your GSTR-1 for the subsequent tax period, preventing you from conducting business.
                </p>
              </div>
            </div>

            <h2>How to Reply to a DRC-01C Notice</h2>
            <p>When you receive the notice, you have two options to resolve it in Part B:</p>

            <ol>
              <li>
                <strong>Pay the excess ITC claimed along with interest:</strong> If the excess claim was a mistake, you must reverse the ITC and pay the associated penalty interest under Section 50 using Form GST DRC-03.
              </li>
              <li>
                <strong>Provide a valid explanation:</strong> If the ITC claim is legitimate, you must provide a reason. Acceptable reasons typically include:
                <ul>
                  <li>ITC not claimed in previous tax periods due to omission.</li>
                  <li>ITC claimed for import of goods (which doesn't reflect in 2B).</li>
                  <li>Typographical errors in GSTR-3B.</li>
                </ul>
              </li>
            </ol>

            <h2>Calculate Your Risk & Penalty</h2>
            <p>
              Use our free diagnostic tool below to see if your current filing variance will trigger a DRC-01C notice, and calculate the potential Section 50 interest penalty if you are forced to reverse the ITC.
            </p>
          </article>
        </section>

        {/* Re-use the RiskCalculator component here */}
        <div className="bg-muted/30 py-8 border-y border-border">
          <RiskCalculator />
        </div>

        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Never Receive a DRC-01C Again</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            The easiest way to deal with DRC-01C notices is to prevent them entirely. TaxSolver automates your GSTR-2B reconciliation to ensure your GSTR-3B claim is 100% accurate, every single month.
          </p>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all">
            Automate Reconciliation with TaxSolver
          </Link>
        </section>

      </main>

    </div>
  );
}
