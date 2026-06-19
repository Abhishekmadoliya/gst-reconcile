import { CheckCircle2, XCircle } from "lucide-react";

export default function CompetitorComparisonSection() {
  const features = [
    { name: "Live GSTR-2B Fetch via GSP", taxsolver: true, others: true, excel: false },
    { name: "Direct ERP Import (Tally, Zoho)", taxsolver: true, others: true, excel: false },
    { name: "10,000+ Invoices Performance", taxsolver: true, others: false, excel: false },
    { name: "Automated Supplier WhatsApp Follow-ups", taxsolver: true, others: false, excel: false },
    { name: "Section 50 Penalty Diagnostics", taxsolver: true, others: false, excel: false },
    { name: "Multi-Client Dashboard for CAs", taxsolver: true, others: true, excel: false },
  ];

  return (
    <section className="w-full py-16 border-b border-border bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground">
            TaxSolver vs The Rest
          </h2>
          <p className="text-muted-foreground mt-3">
            Why growing CA firms are switching from ClearTax, LEDGERS, and Excel VLOOKUPs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse bg-card rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-border w-2/5">Feature</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center text-primary font-bold">TaxSolver</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center">Legacy Software</th>
                <th className="px-6 py-4 border-b border-border w-1/5 text-center">Excel VLOOKUP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-6 py-4 text-center">
                    {row.taxsolver ? (
                      <CheckCircle2 className="h-5 w-5 text-success mx-auto" />
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
      </div>
    </section>
  );
}
