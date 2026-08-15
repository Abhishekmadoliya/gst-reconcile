import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us - Support & Sales | TaxSolver",
  description: "Get in touch with the TaxSolver team for enterprise integration support, custom GSP APIs, CA firm licensing, or assistance with GSTR-2B reconciliation.",
  keywords: ["contact TaxSolver", "CA tax software support", "GST reconciliation help", "enterprise GSP sales", "TaxSolver Delhi phone number"],
  alternates: {
    canonical: "https://taxsolver.in/contact-us",
  },
  openGraph: {
    title: "Contact Us - Support & Sales | TaxSolver",
    description: "Get in touch with the TaxSolver team for enterprise integration support, custom GSP APIs, CA firm licensing, or assistance with GSTR-2B reconciliation.",
    type: "website",
    url: "https://taxsolver.in/contact-us",
    images: ["/og-image.jpg"],
  }
};

export default function ContactUsPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact TaxSolver Support & Sales",
    "description": "Official contact page for TaxSolver GST reconciliation software support, sales, and enterprise licensing.",
    "url": "https://taxsolver.in/contact-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "TaxSolver",
      "url": "https://taxsolver.in",
      "telephone": "+91-9310069214",
      "email": "abhishekmadoliya@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Badarpur",
        "addressLocality": "New Delhi",
        "postalCode": "110044",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9310069214",
        "contactType": "customer service",
        "email": "abhishekmadoliya@gmail.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <main className="flex-1">
        <ContactUsClient />
      </main>
    </div>
  );
}
