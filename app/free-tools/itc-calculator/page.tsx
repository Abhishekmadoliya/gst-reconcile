import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import RiskCalculator from "@/components/landing/RiskCalculator";

export const metadata = {
  title: "Free GST ITC Mismatch & Section 50 Interest Calculator | TaxSolver",
  description: "Calculate your DRC-01C notice risk and potential Section 50 interest penalties for claiming excess ITC under GST. A free tool for CA firms.",
};

export default function ITCCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">

      <main className="flex-1 w-full pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight mb-4">
            Free ITC Penalty Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quickly determine if your current GSTR-3B vs GSTR-2B variance will trigger a DRC-01C compliance notice, and estimate the mandatory 18% Section 50 interest penalty.
          </p>
        </div>

        {/* Standalone Tool Container */}
        <div className="max-w-7xl mx-auto pb-20">
          <RiskCalculator />
        </div>

      </main>

    </div>
  );
}
