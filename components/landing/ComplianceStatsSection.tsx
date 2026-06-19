import { AlertTriangle, IndianRupee, TrendingUp } from "lucide-react";

export default function ComplianceStatsSection() {
  const stats = [
    {
      icon: <IndianRupee className="h-6 w-6 text-primary" />,
      value: "₹45,000 Cr",
      label: "ITC Goes Unclaimed Annually",
      description: "Indian businesses lose thousands of crores every year due to manual matching errors and missing invoices in GSTR-2B."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      value: "3x Increase",
      label: "In DRC-01C Notices (FY2025)",
      description: "The GST department has drastically ramped up automated notices for ITC mismatches between GSTR-2B and GSTR-3B."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      value: "7 Days",
      label: "To Respond to Notices",
      description: "Once a DRC-01C notice is issued, you only have 7 days to explain the mismatch or pay the difference with interest."
    }
  ];

  return (
    <section className="w-full py-16 bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground">
            The Cost of Manual Reconciliation
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            GST compliance is getting stricter. Leaving reconciliation to manual Excel work is a major financial risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 border border-border bg-card rounded-xl">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight mb-2">{stat.value}</h3>
              <p className="font-bold text-sm text-foreground/80 mb-3">{stat.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
