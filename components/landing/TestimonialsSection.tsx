import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "TaxSolver reduced our monthly reconciliation time from 38 hours to just 15 minutes. It's the only software we trust for our 120+ SME clients.",
      name: "Rahul Desai",
      title: "Partner, Desai & Associates",
      stats: "Saved 38 hours/month",
      initials: "RD"
    },
    {
      quote: "The auto-chasing feature for missing 2B invoices is magic. We recovered ₹4.2L in ITC last month that we would have missed without it.",
      name: "Priya Sharma",
      title: "Finance Head, TechNova India",
      stats: "Recovered ₹4.2L ITC",
      initials: "PS"
    },
    {
      quote: "Finally, a GST tool that doesn't crash on 10,000+ rows. The interface is clean, fast, and directly connects to our GSP. A lifesaver for CA firms.",
      name: "Sanjay Mehta",
      title: "Founder, Mehta & Co Chartered Accountants",
      stats: "Manages 200+ GSTINs",
      initials: "SM"
    },
  ];

  return (
    <section className="w-full py-20 bg-muted/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
            Wall of Love
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-sans text-foreground tracking-tight">
            Trusted by 250+ CA Firms Across India
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            See how top accounting firms and corporate finance teams are eliminating manual GST matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="group relative bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground/20 rotate-180" />
                </div>
                <p className="text-[15px] text-foreground/90 leading-relaxed font-medium mb-8">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{t.initials}</span>
                </div>
                
                {/* Name & Title */}
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">{t.title}</p>
                  <div className="inline-flex bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-success/20">
                    {t.stats}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
