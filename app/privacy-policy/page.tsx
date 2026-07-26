import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TaxSolver",
  description: "Privacy policy for TaxSolver GST Reconciliation Software. Learn how we handle, process, and protect your GST data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
        <div className="mb-8">
          <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">Last Updated: July 26, 2026</p>

        <article className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-a:text-primary max-w-none">
          <p>
            Welcome to TaxSolver ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal and financial data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, GST reconciliation software, and free offline tools.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> When you register for our 14-day free trial or subscribe to our services, we collect your name, email address, phone number, and firm/company details.</li>
            <li><strong>GST Data (for Cloud Software Users):</strong> If you connect our software to the GST portal via our GSP partners (Sandbox.co.in / MasterGST), we access your GSTR-2B, GSTR-1, GSTR-3B, and purchase register data strictly for reconciliation purposes.</li>
            <li><strong>Offline Tools Data:</strong> For our free offline tools (like the Offline GSTR-2B Reconciliation Tool), all data parsing and fuzzy-matching happen locally within your web browser. <strong>We do not upload, transmit, or store your GSTINs, JSON files, Excel sheets, or invoice data on our servers.</strong></li>
            <li><strong>Usage Data & Cookies:</strong> We collect non-personally identifiable information such as IP addresses, browser types, and usage patterns to improve our software's performance and security.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our GST reconciliation algorithms.</li>
            <li>To manage your subscription, billing, and customer support requests.</li>
            <li>To send you important compliance updates, due date reminders, and feature announcements.</li>
            <li>To comply with legal obligations and prevent fraudulent activities.</li>
          </ul>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>We do not sell, rent, or trade your personal or financial information to third parties. We may share information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We share necessary data with licensed GST Suvidha Providers (GSPs) solely to facilitate API connections with the GSTN portal.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement enterprise-grade security measures to protect your data. All cloud data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Our infrastructure is hosted on secure, ISO 27001 compliant cloud providers located in India.
          </p>

          <h2>5. Your Rights</h2>
          <p>Depending on your location and applicable data protection laws, you have the right to:</p>
          <ul>
            <li>Access, update, or delete the personal information we hold about you.</li>
            <li>Opt-out of marketing communications at any time.</li>
            <li>Request a copy of your data in a structured, machine-readable format.</li>
          </ul>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time to reflect changes in our practices or regulatory requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            <br />
            <strong>Email:</strong> privacy@taxsolver.in
          </p>
        </article>
      </main>
    </div>
  );
}
