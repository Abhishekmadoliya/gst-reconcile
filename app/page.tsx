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
import FAQSection from "@/components/landing/FAQSection";

export default function Home() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TaxSolver",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TaxSolver",
    "url": "https://taxsolver.in",
    "logo": "https://taxsolver.in/logo.png"
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

        {/* 7. Frequently Asked Compliance & Technical Questions */}
        <FAQSection />

      </main>

      {/* 8. Footer with legal disclaimer, links, and GSP partners */}
    </div>
  );
}
