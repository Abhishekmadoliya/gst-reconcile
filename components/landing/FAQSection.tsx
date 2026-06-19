import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is GSTR-2B?",
    answer: "GSTR-2B is an auto-drafted ITC (Input Tax Credit) statement generated for every registered person based on the information furnished by their suppliers in GSTR-1, GSTR-5, or GSTR-6. It indicates whether the ITC is available or not available for a specific month."
  },
  {
    question: "How to reconcile GSTR-2B with purchase register?",
    answer: "To reconcile GSTR-2B with your purchase register, you need to match each invoice's GSTIN, invoice number, date, and tax amounts. TaxSolver automates this by directly fetching GSTR-2B from the GST portal and comparing it against your ERP data (like Tally or Zoho) using advanced matching algorithms, eliminating manual VLOOKUPs."
  },
  {
    question: "What happens if ITC in 3B exceeds 2B?",
    answer: "If the Input Tax Credit claimed in GSTR-3B exceeds the eligible ITC available in GSTR-2B by more than the allowed margin, the GST portal will automatically issue a DRC-01C notice. You must reply within 7 days and either explain the difference or pay the excess ITC along with Section 50 interest."
  },
  {
    question: "How does the connection to the GST portal work, and is it secure?",
    answer: "We integrate through government-certified GST Suvidha Providers (GSPs) including Sandbox.co.in. The connection uses standard two-factor OTP authentication. Access tokens generated from the OTP handshake are AES-256-GCM encrypted and automatically expire in compliance with GSTN security mandates."
  },
  {
    question: "Which accounting ERP formats are supported for the Purchase Register upload?",
    answer: "Our parser handles Excel (.xlsx, .xls) and CSV files. It automatically maps over 30 common accounting column header configurations (including standard exports from Tally Prime, Zoho Books, Busy, SAP, and QuickBooks)."
  },
  {
    question: "What is the accuracy rate of the matching algorithm?",
    answer: "Our primary reconciliation matching is 100% deterministic (GSTIN + Invoice Number + Financial Period). For records with typos, the engine drops back to a configured fuzzy string matching algorithm on the vendor's trade name. Fuzzy matches are highlighted for human approval."
  },
  {
    question: "How does the system handle invoices filed by suppliers in subsequent months?",
    answer: "The reconciliation worker automatically queries historical GSTR-2B data. If a supplier files an invoice late, the system flags it as 'Matched (Cross-Period)' and suggests appropriate adjustments to prevent double-claiming."
  },
  {
    question: "How does the GSTR-3B Table 4 pre-fill work?",
    answer: "After you approve the reconciliation job, the system compiles the final compliance figures into the exact schema required for GSTR-3B Table 4 (Eligible ITC, Ineligible ITC, ITC Reversals). You can review the totals and upload the finalized draft to the GST portal in one click."
  },
  {
    question: "Can TaxSolver handle more than 10,000 invoices at once?",
    answer: "Yes. TaxSolver is built on a high-performance backend that can process and match over 100,000 invoices in under 3 minutes without crashing your browser."
  },
  {
    question: "How do I follow up with suppliers who haven't filed?",
    answer: "TaxSolver includes an automated follow-up module. With one click, it groups all missing invoices by supplier and drafts personalized WhatsApp messages or emails for you to send, reminding them to file their returns."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial for CA firms and businesses to test the platform with their real data and experience the time savings firsthand."
  },
  {
    question: "Do I need to install any software on my computer?",
    answer: "No, TaxSolver is a 100% cloud-based SaaS platform. You can access it from any web browser on Windows, Mac, or Linux without installing any desktop software."
  }
];

export default function FAQSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-16 border-b border-border bg-background transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest bg-secondary px-2.5 py-1 rounded">
            Compliance Help
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 tracking-tight">
            Frequently Asked Technical & Compliance Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Have questions about GSP integrations, security, or matching rules? Read our detailed responses.
          </p>
        </div>

        {/* FAQs list */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="p-5 border border-border bg-card rounded-lg flex gap-4 transition-all hover:border-muted-foreground/20"
            >
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 stroke-[1.5]" />
              <div className="space-y-2 text-left">
                <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                  {faq.question}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
