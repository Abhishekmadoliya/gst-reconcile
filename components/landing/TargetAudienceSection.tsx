import { Building2, Briefcase, Landmark } from "lucide-react";

export default function TargetAudienceSection() {
  const segments = [
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "CA Firms",
      painPoint: "Managing 30+ client GSTINs across different ERPs.",
      solution: "Multi-client dashboard, standardized import from Tally/Zoho/Busy, and automated supplier chasing to save 120+ billable hours."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Corporate Finance Teams",
      painPoint: "High volume of invoices leading to millions in unclaimed ITC.",
      solution: "High-performance matching engine handling 10,000+ rows instantly. Identify exactly which supplier is blocking your working capital."
    },
    {
      icon: <Landmark className="h-6 w-6 text-primary" />,
      title: "SME Business Owners",
      painPoint: "Getting surprise DRC-01C notices for ITC mismatch.",
      solution: "Prevent compliance risks before they happen. Connect directly to your GSP, reconcile automatically, and sleep peacefully."
    }
  ];

  return (
    <section className="w-full py-16 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground">
            Built for scale. Designed for accuracy.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Whether you manage one business or a hundred, TaxSolver adapts to your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((segment, idx) => (
            <div key={idx} className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                {segment.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{segment.title}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">The Problem</p>
                  <p className="text-sm text-foreground/80">{segment.painPoint}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">How TaxSolver Helps</p>
                  <p className="text-sm text-foreground/80">{segment.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
