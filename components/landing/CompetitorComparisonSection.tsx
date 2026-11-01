import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Scale } from "lucide-react";

export default function CompetitorComparisonSection() {
  const features = [
    { name: "Live GSTR-2B Fetch via GSP", taxsolver: true, others: true, excel: false },
    { name: "Direct ERP Import (Tally, Zoho)", taxsolver: true, others: true, excel: false },
    { name: "10,000+ Invoices Performance", taxsolver: true, others: false, excel: false },
    { name: "Automated Supplier WhatsApp Follow-ups", taxsolver: true, others: false, excel: false },
    { name: "Section 50 Penalty Diagnostics", taxsolver: true, others: false, excel: false },
    { name: "Multi-Client Dashboard for CAs", taxsolver: true, others: true, excel: false },
  ];

  const comparisonGuides = [
    {
      title: "ClearTax vs TaxSolver",
      tag: "ClearTax Alternative",
      description: "Compare matching speed, annual subscription costs, and private in-browser offline mode.",
      href: "/compare/cleartax-vs-taxsolver"
    },
    {
      title: "ExpressGST vs TaxSolver",
      tag: "ExpressGST Alternative",
      description: "Cloud-native autopilot vs legacy Windows desktop setups and manual portal sync.",
      href: "/compare/expressgst-vs-taxsolver"
    },
    {
      title: "LEDGERS vs TaxSolver",
      tag: "LEDGERS Alternative",
      description: "Dedicated GSTR-2B reconciliation engine vs heavyweight all-in-one accounting software.",
      href: "/compare/ledgers-vs-taxsolver"
    }
  ];

  return (
    <section className="w-full py-16 border-b border-border bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-3">
            <Scale className="h-3.5 w-3.5" />
            <span>Market Benchmark Matrix</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground">
            TaxSolver vs Legacy GST Tools
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Why growing CA firms are switching from ClearTax, LEDGERS, and error-prone Excel VLOOKUPs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse bg-card rounded-xl overflow-hidden shadow-sm border border-border">
            <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-border w-2/5">Capability</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center text-primary font-bold bg-primary/5">TaxSolver</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center">Legacy Software</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center">Excel VLOOKUP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-6 py-4 text-center bg-primary/5">
                    {row.taxsolver ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.others ? (
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.excel ? (
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Competitor Breakdown Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisonGuides.map((guide, idx) => (
            <Link
              key={idx}
              href={guide.href}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {guide.tag}
                </span>
                <h3 className="text-sm font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-primary group-hover:underline">
                Read full comparison <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
