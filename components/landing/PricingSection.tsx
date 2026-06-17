import { Check, ArrowRight } from "lucide-react";

interface PlanField {
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  valueMath?: string;
}

const plans: PlanField[] = [
  {
    name: "Solo Filer",
    price: "₹999",
    billing: "per month",
    description: "Ideal for individual business owners managing compliance for a single GSTIN.",
    features: [
      "1 Registered GSTIN",
      "Auto-fetch GSTR-2B via GSP",
      "Purchase Register CSV / Excel parsing",
      "Core 4-category matching engine",
      "Unlimited Excel reconciliation reports",
      "Manual WhatsApp follow-up copy-paste"
    ],
    cta: "Start Solo Plan",
    popular: false
  },
  {
    name: "CA Starter",
    price: "₹4,999",
    billing: "per month",
    description: "Designed for growing CA firms and tax consultants managing client portfolios.",
    features: [
      "Up to 20 Client GSTINs (₹250/GSTIN)",
      "Multi-client dashboard with portfolio view",
      "Direct API sync via Sandbox.co.in",
      "Automated WhatsApp / Email follow-up queues",
      "Auto-prefilled GSTR-3B Table 4 drafts",
      "Historical data cache (30-day lookup)",
      "Email and chat customer support"
    ],
    cta: "Start CA Starter Free Trial",
    popular: true,
    valueMath: "Saves ~40 hours of manual Excel work per month. ROI: 18x equivalent billable time."
  },
  {
    name: "CA Pro",
    price: "₹19,999",
    billing: "per month",
    description: "For established accounting firms with high-volume GST client profiles.",
    features: [
      "Up to 200 Client GSTINs (₹100/GSTIN)",
      "Prioritized background worker queue (BullMQ)",
      "API webhook integration (custom webhooks)",
      "Dedicated account manager",
      "Advanced vendor filing frequency analysis",
      "Bulk export Excel reconciliation reports",
      "Custom brand white-label options"
    ],
    cta: "Contact Sales for CA Pro",
    popular: false,
    valueMath: "Custom onboarding and dedicated client migration assistance."
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Simple Subscriptions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            Transparent Pricing Structured Around GSTINs
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            No hidden fees. Every plan includes certified GSP secure connections and unlimited matching calculations.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl border flex flex-col justify-between p-6 relative transition-all duration-200 bg-card ${
                plan.popular
                  ? "border-primary shadow-lg scale-100 md:scale-[1.02]"
                  : "border-border shadow-sm hover:border-muted-foreground/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground border border-primary">
                  Most Popular for CA Firms
                </span>
              )}

              <div>
                {/* Plan Header */}
                <div className="pb-4 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground font-medium">/{plan.billing}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-foreground/80">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action and ROI Math */}
              <div className="mt-8 space-y-3">
                {plan.valueMath && (
                  <div className="p-2.5 rounded bg-muted text-[10px] text-muted-foreground font-medium border-l border-primary/30 leading-normal">
                    {plan.valueMath}
                  </div>
                )}
                <button
                  className={`w-full flex items-center justify-center h-10 px-4 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow"
                      : "border border-border bg-background hover:bg-muted text-foreground"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CA Firm Value Math Callout Card */}
        <div className="mt-12 p-6 border border-border bg-muted/40 rounded-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-1.5 max-w-2xl text-left">
            <h4 className="text-xs font-bold text-foreground">Are you a CA Firm managing over 200 clients?</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We offer customized volume tiers, enterprise API access, and private white-labeled subdomains for clients to upload purchase books themselves. Save days of coordination.
            </p>
          </div>
          <button className="flex items-center gap-1 bg-foreground text-background dark:bg-background dark:text-foreground hover:bg-muted/95 text-xs font-bold px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer">
            Request Enterprise Quote <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
