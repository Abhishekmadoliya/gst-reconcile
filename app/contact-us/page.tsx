import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us - Support & Sales | TaxSolver",
  description: "Get in touch with the TaxSolver team for enterprise integration support, custom GSP APIs, CA firm licensing, or assistance with GSTR-2B reconciliation.",
  keywords: ["contact TaxSolver", "CA tax software support", "GST reconciliation help", "enterprise GSP sales"],
  alternates: {
    canonical: "https://taxsolver.in/contact-us",
  },
  openGraph: {
    title: "Contact Us - Support & Sales | TaxSolver",
    description: "Get in touch with the TaxSolver team for enterprise integration support, custom GSP APIs, CA firm licensing, or assistance with GSTR-2B reconciliation.",
    type: "website",
    url: "https://taxsolver.in/contact-us",
  }
};

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex-1">
        <ContactUsClient />
      </main>
    </div>
  );
}
