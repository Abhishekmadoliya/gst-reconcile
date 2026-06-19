import { LineChart, BookOpen, Briefcase, Building, Landmark, PlugZap } from "lucide-react";

export default function IntegrationsBar() {
  const logos = [
    { name: "Tally Prime", icon: <LineChart className="h-5 w-5 text-indigo-500" /> },
    { name: "Zoho Books", icon: <BookOpen className="h-5 w-5 text-blue-500" /> },
    { name: "Busy Accounting", icon: <Briefcase className="h-5 w-5 text-amber-600" /> },
    { name: "SAP", icon: <Building className="h-5 w-5 text-sky-600" /> },
    { name: "GST Portal", icon: <Landmark className="h-5 w-5 text-emerald-600" /> },
    { name: "Sandbox.co.in GSP", icon: <PlugZap className="h-5 w-5 text-violet-500" /> },
  ];

  return (
    <section className="w-full py-10 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Seamlessly integrates with your existing workflow
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80">
          {logos.map((logo, idx) => (
            <div key={idx} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
              <span className="flex items-center justify-center">{logo.icon}</span>
              <span className="font-bold text-sm text-foreground/80">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
