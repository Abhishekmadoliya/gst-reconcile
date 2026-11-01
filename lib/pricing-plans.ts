export interface Plan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  priceAnnual: number;
  priceMonthly: number;
  gstinLimit: number | 'Unlimited';
  gstinDisplay: string;
  invoiceLimitMonthly: number | 'Unlimited';
  invoiceDisplay: string;
  teamSeats: number | 'Unlimited';
  seatsDisplay: string;
  features: string[];
  cta: string;
  popular: boolean;
  valueMath?: string;
}

export interface Addon {
  id: string;
  name: string;
  unit: string;
  priceAnnual: number;
  priceMonthly: number;
  description: string;
  minQty: number;
  maxQty: number;
  step: number;
  badge?: string;
}

export const PRICING_PLANS: Plan[] = [
  {
    id: "practitioner",
    name: "Practitioner",
    tagline: "For solo tax practitioners, independent CAs & single-entity trading or manufacturing businesses.",
    priceAnnual: 9999,
    priceMonthly: 1199,
    gstinLimit: 5,
    gstinDisplay: "Up to 5 GSTINs",
    invoiceLimitMonthly: 3000,
    invoiceDisplay: "3,000 Invoices / month",
    teamSeats: 1,
    seatsDisplay: "1 Admin Seat",
    popular: false,
    cta: "Get Started with Practitioner",
    features: [
      "Up to 5 Active Client GSTINs",
      "3,000 Invoices reconciled / month",
      "Portal OTP + Direct JSON GSTR-2B Fetch",
      "Core 3-Tier Reconciliation Engine",
      "Multi-line invoice aggregation & CDNR credit notes",
      "PDF & Excel Statutory Notice generator",
      "Unlimited Excel export workpapers",
      "Email Customer Support"
    ],
    valueMath: "Ideal entry point. Costs less than ₹833/mo while automating ~15 hours of manual VLOOKUP."
  },
  {
    id: "growth",
    name: "Growth Desk",
    badge: "Recommended for CA Firms",
    tagline: "Tailored for Chartered Accountants & multi-client practices automating ITC audits and vendor chase.",
    priceAnnual: 24999,
    priceMonthly: 2799,
    gstinLimit: 25,
    gstinDisplay: "Up to 25 GSTINs",
    invoiceLimitMonthly: 20000,
    invoiceDisplay: "20,000 Invoices / month",
    teamSeats: 3,
    seatsDisplay: "3 Team Seats (CA + Articles)",
    popular: true,
    cta: "Choose Growth Desk",
    features: [
      "Up to 25 Client GSTINs included",
      "20,000 Invoices reconciled / month",
      "Automated Vendor Follow-up System (Email notices)",
      "Real-time CA Event Logs (Notice dispatch & recon complete)",
      "Supplier Health Scorecard & At-Risk ITC Default ranking",
      "Head Mismatch Detection (IGST vs CGST/SGST)",
      "Section 17(5) Ineligible Blocked ITC isolation",
      "Auto-prefilled GSTR-3B Table 4 draft breakdown",
      "CA Firm custom audit signature / letterhead",
      "Priority WhatsApp & Email Support"
    ],
    valueMath: "Saves ~40 hours of manual Excel work per month. Recovers thousands in at-risk blocked ITC."
  },
  {
    id: "corporate",
    name: "Corporate Shield",
    tagline: "For mid-market enterprises, multi-branch corporations & corporate finance controllers.",
    priceAnnual: 59999,
    priceMonthly: 6499,
    gstinLimit: 75,
    gstinDisplay: "Up to 75 GSTINs",
    invoiceLimitMonthly: 75000,
    invoiceDisplay: "75,000 Invoices / month",
    teamSeats: 8,
    seatsDisplay: "8 Corporate Seats with RBAC",
    popular: false,
    cta: "Choose Corporate Shield",
    features: [
      "Up to 75 GSTINs across states",
      "75,000 Invoices reconciled / month",
      "Everything in Growth Desk",
      "Multi-stage Vendor Escalation Workflows",
      "Automated Payment Hold Notification triggers",
      "PAN-level multi-GSTIN consolidated reports",
      "Tally Prime, SAP & Zoho Books ERP-ready export mappings",
      "7-year immutable cloud statutory audit trail",
      "Role-Based Access Control (Admin, Preparer, Reviewer)",
      "Dedicated Account Manager & Audit Defense support"
    ],
    valueMath: "Undercuts Clear MaxITC by 60%+ while offering complete enterprise vendor control."
  },
  {
    id: "enterprise",
    name: "Enterprise GSP",
    tagline: "For national conglomerates, retail networks & high-volume accounting shared service centers.",
    priceAnnual: 129999,
    priceMonthly: 14999,
    gstinLimit: "Unlimited",
    gstinDisplay: "Unlimited GSTINs",
    invoiceLimitMonthly: 200000,
    invoiceDisplay: "2,00,000+ Invoices / month",
    teamSeats: "Unlimited",
    seatsDisplay: "Unlimited Team Seats",
    popular: false,
    cta: "Deploy Enterprise GSP",
    features: [
      "Unlimited GSTINs & Entities",
      "2,00,000+ Invoices / month (Scalable)",
      "Direct GST Suvidha Provider (GSP) API Tunnel",
      "Custom tolerance & ledger reconciliation rules",
      "Automated WhatsApp Follow-up API Webhooks",
      "Dedicated Cloud Infrastructure or On-Prem deployment",
      "Custom ERP Webhooks & 99.9% Uptime SLA",
      "24x7 Priority Hotline & dedicated Solution Architect"
    ],
    valueMath: "Turnkey enterprise setup with dedicated compliance infrastructure and ERP integration."
  }
];

export const PRICING_ADDONS: Addon[] = [
  {
    id: "addon_gstin",
    name: "Additional GSTIN Bucket",
    unit: "Pack of 5 GSTINs",
    priceAnnual: 5000,
    priceMonthly: 500,
    description: "₹1,000 / GSTIN / year (Sold in packs of 5 for ₹5,000). Expand your portfolio with 5 extra active GSTIN slots.",
    minQty: 0,
    maxQty: 20,
    step: 1,
    badge: "5 GSTINs / Pack"
  },
  {
    id: "addon_invoices",
    name: "Invoice Volume Recharge",
    unit: "+10,000 Invoices Bucket",
    priceAnnual: 1499,
    priceMonthly: 1499,
    description: "₹1,499 for an additional 10,000 invoices. Full rollover allowed within your active subscription period.",
    minQty: 0,
    maxQty: 20,
    step: 1,
    badge: "+10k Invoices"
  },
  {
    id: "addon_whatsapp",
    name: "WhatsApp Follow-up Credits",
    unit: "1,500 WhatsApp Messages",
    priceAnnual: 1499,
    priceMonthly: 1499,
    description: "Standard email is free. ₹1,499 for 1,500 WhatsApp notices (~₹1/msg). Delivers 78% higher vendor response rate.",
    minQty: 0,
    maxQty: 20,
    step: 1,
    badge: "1,500 Notices"
  }
];

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

export function getPlanById(id?: string): Plan {
  return PRICING_PLANS.find(p => p.id === id) || PRICING_PLANS[1]; // default Growth Desk
}
