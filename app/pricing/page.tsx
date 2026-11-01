import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing Plans: GSTR-2B Reconciliation Software for CA Firms | TaxSolver",
  description: "Transparent GST reconciliation software pricing starting with a 14-day free trial on Practitioner tier. Includes automated supplier chasing, GSP sync, and GSTR-3B draft.",
  keywords: [
    "GST reconciliation software pricing",
    "GSTR-2B software cost",
    "CA firm GST tool price",
    "TaxSolver plans",
    "ClearTax alternative price",
    "ITC matching tool cost India"
  ],
  alternates: {
    canonical: "https://taxsolver.in/pricing",
  },
  openGraph: {
    title: "Pricing Plans: GSTR-2B Reconciliation Software for CA Firms | TaxSolver",
    description: "Transparent GST reconciliation pricing with 14-day free trial on Practitioner tier. Compare Practitioner, Growth Desk, and Corporate Shield.",
    type: "website",
    url: "https://taxsolver.in/pricing",
    images: ["/og-image.jpg"],
  }
};

const faqs = [
  {
    q: "Can my firm claim 18% Input Tax Credit (ITC) on this TaxSolver subscription?",
    a: "Yes, absolutely. TaxSolver provides standard GST tax invoices with your firm's GSTIN included. You can claim full 18% ITC on your GSTR-3B filings under HSN/SAC code 998313 (Information Technology and Cloud Software Services)."
  },
  {
    q: "What happens if our CA practice outgrows the 25 GSTIN limit on Growth Desk?",
    a: "You do NOT need to upgrade to the Corporate plan immediately. You can simply add 'Additional GSTIN Buckets' (packs of 5 GSTINs for ₹5,000/year, i.e., ₹1,000/GSTIN/yr) at any time during checkout or directly from your firm settings."
  },
  {
    q: "Do unused invoice volumes roll over to the next month?",
    a: "Yes. In the Growth Desk and Corporate plans, extra invoice recharges have full rollover validity throughout your 1-year active subscription cycle so you never lose paid credits during off-peak tax periods."
  },
  {
    q: "How does the Automated Vendor Follow-up System work?",
    a: "When a reconciliation run detects missing or mismatched invoices, TaxSolver automatically compiles an itemized discrepancy schedule citing Section 16(2)(aa) of the CGST Act, 2017 and Rule 36(4). You can review and dispatch statutory notices to the supplier's registered email with one click, and track response status in real-time."
  },
  {
    q: "What payment methods are supported via Razorpay?",
    a: "We support all major Indian business payment channels via Razorpay: Corporate Net Banking (all major banks), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Corporate credit lines."
  }
];

export default function PricingPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "TaxSolver GSTR-2B Reconciliation Software",
    "description": "Enterprise-grade GSTR-2B automated reconciliation software for Indian Chartered Accountants and corporate finance teams.",
    "brand": {
      "@type": "Brand",
      "name": "TaxSolver"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "999",
      "highPrice": "129999",
      "offerCount": "4",
      "offers": [
        {
          "@type": "Offer",
          "name": "Practitioner Tier (14-Day Free Trial Available)",
          "price": "9999",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": "https://taxsolver.in/pricing"
        },
        {
          "@type": "Offer",
          "name": "Growth Desk Tier",
          "price": "24999",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": "https://taxsolver.in/pricing"
        },
        {
          "@type": "Offer",
          "name": "Corporate Shield Tier",
          "price": "59999",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": "https://taxsolver.in/pricing"
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient />
    </>
  );
}
