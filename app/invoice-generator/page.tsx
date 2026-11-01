import type { Metadata } from "next";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "Free GST Invoice Generator Online | Create & Print Tax Invoices | TaxSolver",
  description: "Create professional, GST-compliant tax invoices online for free. Auto-calculates CGST, SGST, IGST, and cess. Download and print PDF invoices instantly with custom branding.",
  keywords: [
    "GST invoice generator",
    "free invoice generator India",
    "online tax invoice maker",
    "GST bill generator",
    "create GST invoice PDF",
    "tax invoice template India",
    "free GST billing software"
  ],
  alternates: {
    canonical: "https://taxsolver.in/invoice-generator",
  },
  openGraph: {
    title: "Free GST Invoice Generator Online | Create & Print Tax Invoices | TaxSolver",
    description: "Generate compliant GST tax invoices with auto CGST, SGST & IGST calculation. Free online tool by TaxSolver.",
    type: "website",
    url: "https://taxsolver.in/invoice-generator",
    images: ["/og-image.jpg"],
  }
};

export default function InvoiceGeneratorPage() {
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TaxSolver Free GST Invoice Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Free web-based GST invoice generator tool to create, calculate taxes, and print PDF tax invoices compliant with Indian GST laws.",
    "featureList": [
      "Auto CGST and SGST tax calculation",
      "IGST and Cess support",
      "Company logo upload and custom color themes",
      "Number-to-words currency formatting in Indian Rupees",
      "Print-ready PDF export"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
      />
      <InvoiceGeneratorClient />
    </>
  );
}
