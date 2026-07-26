import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TaxSolver",
  description: "Terms and conditions for using TaxSolver's GST reconciliation software and free tools.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
        <div className="mb-8">
          <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">Last Updated: July 26, 2026</p>

        <article className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-a:text-primary max-w-none">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the TaxSolver website and software services (the "Service") operated by TaxSolver ("us", "we", or "our").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2>1. Use of the Service</h2>
          <p>
            TaxSolver provides software tools to assist Indian businesses and Chartered Accountants in reconciling Input Tax Credit (ITC) with GSTR-2B data. You agree to use the Service only for lawful purposes and in accordance with these Terms.
          </p>

          <h2>2. No Tax or Legal Advice</h2>
          <p>
            The content, calculators, and reconciliation results provided by TaxSolver are for informational and utility purposes only. <strong>We do not provide tax, legal, or accounting advice.</strong> The final responsibility for filing accurate GST returns, claiming eligible ITC, and responding to DRC-01C notices rests solely with the taxpayer and their authorized representatives.
          </p>

          <h2>3. Limitation of Liability</h2>
          <p>
            TaxSolver attempts to match invoices using advanced fuzzy-matching algorithms; however, we do not guarantee 100% accuracy due to potential discrepancies in source data (ERP exports and portal JSONs).
          </p>
          <p>
            In no event shall TaxSolver, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation:
          </p>
          <ul>
            <li>Penalties levied by the GST Department or any tax authority (e.g., Section 50 interest, late fees).</li>
            <li>Loss of Input Tax Credit (ITC).</li>
            <li>Business interruption or loss of data.</li>
          </ul>

          <h2>4. Reliance on the GST Portal</h2>
          <p>
            Our API integrations and offline parsing tools rely on the data structures and uptime of the official GSTN portal (gst.gov.in). TaxSolver is not responsible for portal downtime, API timeouts, or unannounced schema changes made by the GST Network.
          </p>

          <h2>5. Subscriptions and Payments</h2>
          <p>
            Certain parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (e.g., annually). 
            If you begin a 14-day free trial, you are not obligated to purchase a subscription. At the end of the trial period, your account will be paused unless a payment method is added.
          </p>

          <h2>6. Data Accuracy and Offline Tools</h2>
          <p>
            For our free offline tools, data is processed locally in your browser. We are not liable for errors caused by corrupted files, unsupported ERP formats, or browser limitations. You are responsible for safeguarding any sensitive data downloaded from the GST portal to your local machine.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the courts in India.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <strong>Email:</strong> legal@taxsolver.in
          </p>
        </article>
      </main>
    </div>
  );
}
