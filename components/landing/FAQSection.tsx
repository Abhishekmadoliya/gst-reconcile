import { HelpCircle, ChevronRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the connection to the GST portal work, and is it secure?",
    answer: "We do not store your direct GST portal passwords. We integrate through government-certified GST Suvidha Providers (GSPs) including Sandbox.co.in and MasterGST. The connection uses standard two-factor OTP authentication. Access tokens generated from the OTP handshake are AES-256-GCM encrypted at rest on our databases and automatically expire/renew in compliance with GSTN security mandates."
  },
  {
    question: "Which accounting ERP formats are supported for the Purchase Register upload?",
    answer: "Our parser handles Excel (.xlsx, .xls) and CSV files. It automatically maps over 30 common accounting column header configurations (including standard exports from Tally Prime, Zoho Books, Busy, SAP, and QuickBooks). It normalizes numeric values, ignores empty spacer rows, and identifies duplicate entries in your file automatically."
  },
  {
    question: "What is the accuracy rate of the fuzzy matching algorithm?",
    answer: "Our primary reconciliation matching is deterministic (GSTIN + Invoice Number + Financial Period). For records with typos or missing GSTINs, the engine drops back to a configured Fuse.js fuzzy string matching algorithm on the vendor's trade name. Any fuzzy matches above an 80% confidence score are marked as 'Possible Match' and highlighted for quick human approval."
  },
  {
    question: "How does the system handle invoices filed by suppliers in subsequent months?",
    answer: "The reconciliation worker automatically queries historical GSTR-2B data cached in our PostgreSQL layer. If a supplier files an invoice late (e.g., a June invoice filed in August), the system flags it as 'Matched (Cross-Period)' and suggests the appropriate adjustments to prevent double-claiming or missing out on the ITC."
  },
  {
    question: "How does the GSTR-3B Table 4 pre-fill work?",
    answer: "After you approve the reconciliation job, the system compiles the final compliance figures into the exact schema required for GSTR-3B Table 4 (Eligible ITC, Ineligible ITC, ITC Reversals). You can review the totals, edit individual segments, and upload the finalized GSTR-3B draft to the GSTN portal in one click via our GSP gateway."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 border-b border-border bg-background transition-colors duration-200">
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
