import Link from "next/link";
import { AlertTriangle, Clock, Percent, ShieldCheck, ArrowRight } from "lucide-react";

export default function ComplianceStatsSection() {
  const stats = [
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      value: ">10% or ₹1 Lakh",
      label: "Rule 88D DRC-01C Trigger",
      description: "Automated GSTN notice triggered whenever ITC claimed in GSTR-3B exceeds GSTR-2B by more than 10% and exceeds ₹1,00,000.",
      linkText: "Read DRC-01C Guide",
      linkHref: "/drc-01c-notice"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      value: "7 Days",
      label: "Mandatory Reply Window",
      description: "Strict statutory deadline under Rule 88D(2) to either pay the differential via DRC-03 with interest or file Part B reasons on the portal.",
      linkText: "Notice Process",
      linkHref: "/drc-01c-notice"
    },
    {
      icon: <Percent className="h-6 w-6 text-red-500" />,
      value: "18% p.a.",
      label: "Section 50(3) Statutory Interest",
      description: "Mandatory statutory interest levied on any wrongly availed and utilized ITC from the date of filing until reversal via DRC-03.",
      linkText: "Calculate Exposure",
      linkHref: "/free-tools/itc-calculator"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      value: "Section 16(2)(aa)",
      label: "Strict GSTR-2B Matching Mandate",
      description: "Statutory restriction preventing ITC claims unless the invoice details are furnished by the supplier in GSTR-1/IFF and reflected in 2B.",
      linkText: "Free Offline Recon",
      linkHref: "/free-tools/offline-reconciliation"
    }
  ];

  return (
    <section className="w-full py-16 bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <span>Statutory GST Compliance Rules (FY 2026–27)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground">
            Strict Statutory Criteria Enforced by the GST Portal
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Automated system-generated notices leave zero tolerance for mismatched ledgers. TaxSolver automates invoice matching against exact GSTN rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col p-6 border border-border bg-card rounded-xl hover:border-primary/40 transition-all hover:shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-black text-foreground tracking-tight mb-1">{stat.value}</h3>
              <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{stat.description}</p>
              <div className="mt-4 pt-3 border-t border-border/60">
                <Link
                  href={stat.linkHref}
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline group"
                >
                  {stat.linkText}
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
