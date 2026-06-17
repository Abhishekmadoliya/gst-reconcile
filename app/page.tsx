import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import TimelineSection from "@/components/landing/TimelineSection";
import RiskCalculator from "@/components/landing/RiskCalculator";
import SupplierMatrix from "@/components/landing/SupplierMatrix";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      {/* 1. Header (Sticky navigation, theme control, indicators) */}
      <Header />

      {/* Main content sections */}
      <main className="flex-1">
        
        {/* 2. Hero Section + Interactive Recon Sandbox Demo */}
        <HeroSection />

        {/* 3. Timeline section comparing VLOOKUP timeline with Autopilot */}
        <TimelineSection />

        {/* 4. DRC-01C Penalty and Notice Risk Diagnostic Calculator */}
        <RiskCalculator />

        {/* 5. Supplier Filing Compliance Matrix and Search Ledger */}
        <SupplierMatrix />

        {/* 6. Pricing Plans and CA Firm ROI Calculations */}
        <PricingSection />

        {/* 7. Frequently Asked Compliance & Technical Questions */}
        <FAQSection />

      </main>

      {/* 8. Footer with legal disclaimer, links, and GSP partners */}
      <Footer />
    </div>
  );
}
