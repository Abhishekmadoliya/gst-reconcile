import HeroSection from "@/components/landing/HeroSection";
import IntegrationsBar from "@/components/landing/IntegrationsBar";
import TimelineSection from "@/components/landing/TimelineSection";
import ComplianceStatsSection from "@/components/landing/ComplianceStatsSection";
import RiskCalculator from "@/components/landing/RiskCalculator";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CompetitorComparisonSection from "@/components/landing/CompetitorComparisonSection";
import SupplierMatrix from "@/components/landing/SupplierMatrix";
import PricingSection from "@/components/landing/PricingSection";
import LatestBlogsSection from "@/components/landing/LatestBlogsSection";
import FAQSection from "@/components/landing/FAQSection";

export default function Home() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TaxSolver",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": "Production-grade GSTR-2B reconciliation software for CA firms in India to automate ITC matching and eliminate DRC-01C notices.",
    "url": "https://taxsolver.in",
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR"
    },
    "featureList": [
      "GSTR-2B vs Purchase Register 15-second matching",
      "Fuzzy matching for invoice number typo resolution",
      "Automated WhatsApp supplier follow-ups",
      "DRC-01C notice risk and penalty calculator",
      "Direct GSP Sandbox.co.in API integration"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TaxSolver",
    "url": "https://taxsolver.in",
    "logo": "https://taxsolver.in/logo.png",
    "description": "India's premier GST reconciliation and tax compliance automation platform for Chartered Accountants, corporate finance teams, and SMEs.",
    "telephone": "+91-9310069214",
    "email": "abhishekmadoliya@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Badarpur",
      "addressLocality": "New Delhi",
      "postalCode": "110044",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9310069214",
        "contactType": "customer support",
        "email": "abhishekmadoliya@gmail.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    "sameAs": [
      "https://taxsolver.in",
      "https://twitter.com/taxsolver_in",
      "https://www.linkedin.com/company/taxsolver"
    ],
    "knowsAbout": [
      "GSTR-2B Reconciliation",
      "Input Tax Credit (ITC)",
      "DRC-01C Notice Compliance",
      "CGST Act Rule 88D",
      "Section 50 Interest Calculation",
      "Tally Prime GST Matching"
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* 1. Header (Sticky navigation, theme control, indicators) */}

      {/* Main content sections */}
      <main className="flex-1">

        {/* 2. Hero Section + Interactive Recon Sandbox Demo */}
        <HeroSection />

        <IntegrationsBar />

        {/* 3. Timeline section comparing VLOOKUP timeline with Autopilot */}
        <TimelineSection />

        <ComplianceStatsSection />

        {/* 4. DRC-01C Penalty and Notice Risk Diagnostic Calculator */}
        <RiskCalculator />

        <TargetAudienceSection />

        <TestimonialsSection />

        <CompetitorComparisonSection />

        {/* 5. Supplier Filing Compliance Matrix and Search Ledger */}
        <SupplierMatrix />

        {/* 6. Pricing Plans and CA Firm ROI Calculations */}
        <PricingSection />

        {/* Latest Blog Posts */}
        <LatestBlogsSection />

        {/* 7. Frequently Asked Compliance & Technical Questions */}
        <FAQSection />

      </main>

      {/* 8. Footer with legal disclaimer, links, and GSP partners */}
    </div>
  );
}
