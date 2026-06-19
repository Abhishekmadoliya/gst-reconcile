import { useState } from "react";

const PAGES = {
  public: {
    label: "Public / Marketing",
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
    border: "rgba(100,116,139,0.25)",
    accent: "#94a3b8",
    pages: [
      {
        id: "landing",
        route: "/",
        title: "Landing Page",
        icon: "🏠",
        purpose: "Convert visitor → signup. One job.",
        sections: [
          { name: "Hero", detail: "Headline: 'GSTR-2B reconciled in 3 minutes, not 3 days.' Upload CTA + live demo of matching result." },
          { name: "Pain agitation", detail: "Show the before state: CA doing VLOOKUP at 11pm. Mismatch count. ITC at risk in ₹. Make it visceral." },
          { name: "How it works", detail: "3 steps: Connect GSTIN → Upload purchase register → Get results. Animated flow." },
          { name: "Mismatch categories", detail: "Show the 4 buckets (Matched / Amount mismatch / In books not 2B / In 2B not books) with example invoice rows." },
          { name: "Pricing", detail: "3 plans: Solo filer ₹999, CA Starter ₹4,999 (20 GSTINs), CA Pro ₹19,999 (200 GSTINs)." },
          { name: "Social proof", detail: "CA testimonials. '3 hours to 8 minutes for 800 invoices.' Stats: clients saved, ITC recovered." },
          { name: "FAQ", detail: "Is my data safe? Which ERPs are supported? Does it file 3B for me? How does GSP auth work?" },
          { name: "Footer CTA", detail: "Start free 14-day trial. No card required." },
        ],
        devNotes: [
          "Static page — Next.js with ISR. No auth required.",
          "Hero CTA → /register. Secondary CTA → /demo (interactive demo with sample data, no login).",
          "Use Framer Motion for scroll-triggered reveal of mismatch categories.",
          "Pricing section: fetch plan data from /api/plans. Highlight middle plan.",
        ],
        stateNeeded: "None — fully static",
        apiCalls: "None on landing. Plans from /api/plans (ISR cached).",
      },
      {
        id: "demo",
        route: "/demo",
        title: "Interactive Demo",
        icon: "▶️",
        purpose: "Let visitor run a real reconciliation with sample data — no signup.",
        sections: [
          { name: "Sample upload UI", detail: "Pre-loaded sample purchase register (50 rows). Visitor can also upload their own file." },
          { name: "Fake 2B data", detail: "Pre-seeded GSTR-2B with deliberate mismatches — shows realistic results immediately." },
          { name: "Results table", detail: "Color-coded 4-category output. Filters. ITC summary cards." },
          { name: "Signup nudge", detail: "Sticky CTA: 'Connect your real GSTIN to reconcile your actual returns →'." },
        ],
        devNotes: [
          "This is the most important acquisition page. Make it feel real.",
          "All processing runs in browser using Web Workers — no backend call for demo.",
          "Pre-load a 50-row sample CSV in /public/sample-purchase-register.csv.",
          "Show a banner: 'This is sample data. Your real results may vary.'",
        ],
        stateNeeded: "Local state only — upload file, recon results, active filter",
        apiCalls: "None — pure client-side demo.",
      },
      {
        id: "pricing",
        route: "/pricing",
        title: "Pricing Page",
        icon: "💳",
        purpose: "Remove friction from plan selection.",
        sections: [
          { name: "Plan cards", detail: "3 plans with toggle Monthly / Annual (annual = 2 months free). Feature comparison table below." },
          { name: "GST calculator", detail: "Interactive: 'How many GSTINs do you manage?' → shows monthly cost + time saved." },
          { name: "Enterprise CTA", detail: "200+ GSTINs? Talk to us. Calendly link." },
        ],
        devNotes: [
          "Annual toggle: save 2 months price. Show ₹ savings prominently.",
          "Razorpay Subscription plans pre-created. On 'Get started' → /register?plan=starter.",
        ],
        stateNeeded: "billingCycle (monthly/annual), hoveredPlan",
        apiCalls: "/api/plans",
      },
    ],
  },
  auth: {
    label: "Auth",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.25)",
    accent: "#a78bfa",
    pages: [
      {
        id: "register",
        route: "/register",
        title: "Register",
        icon: "✍️",
        purpose: "CA firm account creation. Minimal friction.",
        sections: [
          { name: "Form", detail: "Firm name, your name, email, password, mobile number. Optional: GST number of firm." },
          { name: "Plan selection", detail: "Pre-selected if came from pricing page (?plan=starter). Show selected plan summary." },
          { name: "OTP verify", detail: "Mobile OTP before account creation. Prevents spam registrations." },
        ],
        devNotes: [
          "Use NextAuth Credentials provider + custom register flow.",
          "On success → redirect to /onboarding (not dashboard — onboarding first).",
          "Pre-fill plan from query param. Pass to Razorpay subscription after onboarding.",
          "Form: React Hook Form + Zod. Validate GSTIN format if entered.",
        ],
        stateNeeded: "form state, otpSent, otpVerified, selectedPlan",
        apiCalls: "POST /api/auth/register, POST /api/auth/send-otp, POST /api/auth/verify-otp",
      },
      {
        id: "login",
        route: "/login",
        title: "Login",
        icon: "🔐",
        purpose: "Return user access.",
        sections: [
          { name: "Email + password form", detail: "With 'Forgot password' link. Show firm name after email entered (confirms right account)." },
          { name: "Magic link option", detail: "CA firms prefer email link over remembering password." },
        ],
        devNotes: [
          "NextAuth signIn('credentials', { email, password }).",
          "On success → redirect to /dashboard. On fail → inline error.",
          "Remember: NextAuth middleware in middleware.ts redirects /dashboard to /login if unauthenticated.",
        ],
        stateNeeded: "form, isLoading, error",
        apiCalls: "NextAuth signIn handler → POST /api/auth/login",
      },
      {
        id: "forgot-password",
        route: "/forgot-password",
        title: "Forgot Password",
        icon: "🔑",
        purpose: "Password reset via email OTP.",
        sections: [
          { name: "Email form", detail: "Enter email → send reset link. Show confirmation message." },
          { name: "Reset form", detail: "/reset-password?token=xxx → new password form." },
        ],
        devNotes: [
          "Generate signed JWT reset token (expires 15 min). Send via Resend/SendGrid.",
          "Token stored in DB with expiry. One-time use — delete after use.",
        ],
        stateNeeded: "email, sent, token (from URL), newPassword",
        apiCalls: "POST /api/auth/forgot-password, POST /api/auth/reset-password",
      },
    ],
  },
  onboarding: {
    label: "Onboarding",
    color: "#0891b2",
    bg: "rgba(8,145,178,0.08)",
    border: "rgba(8,145,178,0.25)",
    accent: "#22d3ee",
    pages: [
      {
        id: "onboarding",
        route: "/onboarding",
        title: "Onboarding Flow",
        icon: "🚀",
        purpose: "Get CA from account creation to first reconciliation in under 5 minutes.",
        sections: [
          { name: "Step 1: Add first GSTIN", detail: "Enter client GSTIN. Auto-fetch business name from GSTN (verify it's a real GSTIN). CA confirms." },
          { name: "Step 2: GSP authentication", detail: "Connect to GSTN via OTP. OTP sent to GSTIN's registered mobile. Explain what GSP access means. Store encrypted token." },
          { name: "Step 3: Upload purchase register", detail: "Upload Excel/CSV. Show column mapping preview. Confirm headers." },
          { name: "Step 4: Run first reconciliation", detail: "Select month (default: last completed month). Hit 'Reconcile'. Show progress bar." },
          { name: "Step 5: See results", detail: "Celebrate first result. Show ITC summary. Prompt to explore dashboard." },
        ],
        devNotes: [
          "5-step wizard with progress indicator. Each step validates before next.",
          "Step 2 (GSP OTP) is the highest drop-off point. Show 'Why do we need this?' expandable section.",
          "Store onboarding progress in DB. If user drops off, resume from last step on re-login.",
          "On completion → confetti animation + redirect to /dashboard/reconcile/:jobId (the result they just ran).",
          "Skip button after step 2 for users who want to explore first — but nudge them back.",
        ],
        stateNeeded: "currentStep (1-5), gstin, otpSent, columnMapping, jobId",
        apiCalls: "POST /api/gstins, POST /api/gstins/:id/connect, POST /api/reconcile, GET /api/reconcile/:jobId (polling)",
      },
    ],
  },
  dashboard: {
    label: "Dashboard (Authenticated)",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.25)",
    accent: "#34d399",
    pages: [
      {
        id: "dashboard-home",
        route: "/dashboard",
        title: "Dashboard Home",
        icon: "📊",
        purpose: "Monthly filing status at a glance. What needs action today.",
        sections: [
          { name: "Top bar", detail: "Firm name, current month, logged-in CA name, notifications bell, plan badge." },
          { name: "Sidebar", detail: "Nav: Dashboard, Reconcile, GSTINs, Reports, Billing, Settings. Collapsible. Shows GSTIN count." },
          { name: "This month status", detail: "Card grid: Total GSTINs | Reconciled this month | Pending | ITC recovered this month (₹)." },
          { name: "GSTIN status table", detail: "Every client GSTIN with: Name | Last reconciled | Status (Pending / Done / Mismatches found) | Quick action button." },
          { name: "Upcoming deadlines", detail: "Countdown to GSTR-3B deadline (20th). Red if <3 days. Yellow if <7 days." },
          { name: "Recent activity", detail: "Timeline: 'Reconciled ABC Traders — 12 mismatches found', 'Filed GSTR-3B for XYZ Pvt Ltd', etc." },
        ],
        devNotes: [
          "Server component — fetch all GSTIN statuses on load. No skeleton needed if SSR.",
          "GSTIN status table: sort by 'Pending' first. One-click 'Reconcile now' opens /dashboard/reconcile/new?gstin=xxx.",
          "Deadline countdown: calculate days remaining from today to 20th of current month. Use date-fns.",
          "This is the page CAs open every day. Optimize for speed — all data in one API call.",
        ],
        stateNeeded: "Minimal client state — data from server. Filter for GSTIN table (search, status filter).",
        apiCalls: "GET /api/dashboard/summary (GSTINs + statuses + ITC totals for current month)",
      },
      {
        id: "new-reconciliation",
        route: "/dashboard/reconcile/new",
        title: "New Reconciliation",
        icon: "⚡",
        purpose: "Start a new recon job — select GSTIN, period, upload purchase register.",
        sections: [
          { name: "GSTIN selector", detail: "Dropdown of connected GSTINs. Shows last reconciled date. If pre-filled from query param, show selected." },
          { name: "Period selector", detail: "Month/Year picker. Default: last completed month. Warn if trying to reconcile a month already filed." },
          { name: "Purchase register upload", detail: "Drag-drop zone. Accepts .xlsx, .csv. Max 10MB. Show file name + row count after upload." },
          { name: "Column mapping", detail: "If headers are ambiguous, show column mapping UI: 'Which column is Invoice Number?' Auto-detect for Tally/Zoho/SAP formats." },
          { name: "2B fetch status", detail: "Show: '2B for Oct 2024 already fetched on 15th Oct' or 'Fetching from GSTN...' with spinner." },
          { name: "Run button", detail: "'Reconcile 847 invoices →'. Show count from uploaded file. Disable if not ready." },
        ],
        devNotes: [
          "Column mapping: build a preset library for Tally Prime, Zoho Books, Busy, Marg ERP column names.",
          "After 'Reconcile' click → POST /api/reconcile → get jobId → redirect to /dashboard/reconcile/:jobId.",
          "2B fetch: check DB first (cached for 30 days). If stale → fetch fresh from GSP. Show age of cached data.",
          "File upload: direct to S3/GCS presigned URL. Parse on backend via BullMQ worker.",
          "Warn: 'This period already has a completed reconciliation. Running again will replace it.' with confirm dialog.",
        ],
        stateNeeded: "selectedGstin, selectedPeriod, uploadedFile, columnMapping, jobStatus, isFetching2B",
        apiCalls: "GET /api/gstins, GET /api/gstr2b/:gstin/:period, POST /api/reconcile",
      },
      {
        id: "reconcile-results",
        route: "/dashboard/reconcile/:jobId",
        title: "Reconciliation Results",
        icon: "📋",
        purpose: "The core product page. CA spends most time here.",
        sections: [
          { name: "Summary header", detail: "GSTIN name | Period | Date run | Total invoices processed | Time taken." },
          { name: "ITC summary cards", detail: "4 cards: ✅ ITC confirmed (₹) | ⚠️ ITC at risk (₹) | ➕ Unclaimed ITC (₹) | ~ Amount mismatches (count). Click → filters table." },
          { name: "Category tabs", detail: "Tabs: All | Matched (green) | Amount mismatch (amber) | In books not 2B (red) | In 2B not books (blue). Each tab shows count badge." },
          { name: "Invoice results table", detail: "Columns: GSTIN | Supplier name | Invoice No | Invoice Date | Taxable amount | IGST | CGST | SGST | Status | Action. Sortable, searchable, filterable." },
          { name: "Mismatch detail panel", detail: "Click any row → slide-in panel showing Your books vs GSTR-2B side by side. Difference highlighted in red. 'Raise with supplier' button." },
          { name: "Supplier follow-up", detail: "Red rows (In books not 2B): checkbox select → 'Draft follow-up messages' → AI generates WhatsApp text per supplier. CA edits + sends." },
          { name: "GSTR-3B draft", detail: "Button at top: 'Generate GSTR-3B draft'. Opens Table 4 pre-filled. CA reviews → 'File now' or 'Download for filing'." },
          { name: "Export options", detail: "Export: Color-coded Excel | PDF report | CSV (for Tally import)." },
        ],
        devNotes: [
          "Table: TanStack Table for virtual scrolling (handle 10,000+ rows without lag).",
          "Poll GET /api/reconcile/:jobId every 2s until status=completed. Show progress bar during processing.",
          "Mismatch panel: use a Sheet/Drawer component (Radix UI). Shows exact ₹ difference per tax head.",
          "GSTR-3B draft: open in modal with editable Table 4. POST /api/gstr3b/file only after CA confirmation.",
          "Color rows: green = matched, amber = amount mismatch, red = missing from 2B, blue = unclaimed.",
          "This page must handle 10K rows smoothly. TanStack Virtual is non-negotiable.",
          "Save filter state to URL params so CA can share the filtered view with a colleague.",
        ],
        stateNeeded: "jobData, activeTab, searchQuery, sortConfig, selectedRows, drawerOpen, selectedInvoice",
        apiCalls: "GET /api/reconcile/:jobId (poll), GET /api/reconcile/:jobId/results, POST /api/follow-ups/draft, POST /api/gstr3b/file, GET /api/reconcile/:jobId/export",
      },
      {
        id: "gstins",
        route: "/dashboard/gstins",
        title: "GSTIN Management",
        icon: "🏢",
        purpose: "CA's client portfolio. Add, remove, manage GSTINs.",
        sections: [
          { name: "GSTIN list", detail: "Table: GSTIN | Business name | State | Filing type (monthly/quarterly) | GSP connected (yes/no) | Last active | Actions." },
          { name: "Add GSTIN button", detail: "Opens modal: Enter GSTIN → auto-fetch name → OTP auth → add to portfolio." },
          { name: "GSTIN detail", detail: "Click row → side panel: Business details, filing history, GSP token status (active/expired), reconnect button." },
          { name: "Bulk import", detail: "Upload CSV of GSTINs. Useful for CA onboarding 20+ clients at once." },
          { name: "Subscription limit banner", detail: "If on Starter (20 GSTINs) and at 18/20 → show 'Upgrade for more GSTINs' banner." },
        ],
        devNotes: [
          "GSP token has 6-month expiry. Show token age. Auto-notify CA via email 1 week before expiry.",
          "GSTIN validation regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/",
          "State code from first 2 digits of GSTIN. Show state name.",
          "Bulk import: parse CSV, validate each GSTIN, show preview with valid/invalid count before adding.",
        ],
        stateNeeded: "gstinList, addModalOpen, selectedGstin, bulkUploadFile",
        apiCalls: "GET /api/gstins, POST /api/gstins, DELETE /api/gstins/:id, POST /api/gstins/:id/connect",
      },
      {
        id: "history",
        route: "/dashboard/history",
        title: "Reconciliation History",
        icon: "📅",
        purpose: "Past reconciliation jobs. Audit trail.",
        sections: [
          { name: "Filter bar", detail: "Filter by: GSTIN | Period (month/year) | Status | Date range." },
          { name: "Jobs table", detail: "Columns: GSTIN | Period | Run date | Invoices processed | Mismatches found | ITC at risk | Status | Actions (View / Re-run / Export)." },
          { name: "Month-over-month", detail: "Bar chart: mismatches per month over last 12 months. Shows if supplier quality is improving." },
        ],
        devNotes: [
          "Paginated list. 20 per page. Server-side filtering.",
          "Re-run: creates a new job for the same GSTIN + period. Useful if supplier filed late and CA wants to re-check.",
          "Export from history: downloads the Excel report from when the job was originally run (from GCS).",
        ],
        stateNeeded: "filters, currentPage, sortBy",
        apiCalls: "GET /api/reconcile/history?gstin=&period=&page=",
      },
      {
        id: "reports",
        route: "/dashboard/reports",
        title: "Reports & Analytics",
        icon: "📈",
        purpose: "ITC trends, supplier health, filing compliance overview.",
        sections: [
          { name: "ITC summary", detail: "Monthly bar chart: ITC confirmed vs ITC at risk vs ITC unclaimed. Shows ₹ trend over 12 months." },
          { name: "Supplier health table", detail: "Per-supplier: Name | GSTIN | On-time filing % | Avg days late | ITC at risk (₹) | Follow-ups sent. Sort by 'ITC at risk' to find worst offenders." },
          { name: "Client compliance", detail: "If CA has multiple GSTINs: table showing each client's compliance score (0–100). Based on % invoices matched." },
          { name: "Export", detail: "Download full analytics report as PDF. Share with client as monthly compliance summary." },
        ],
        devNotes: [
          "Recharts for all charts. Pie chart for mismatch category breakdown. Bar chart for monthly ITC trend.",
          "Supplier health: aggregate from reconciliation result rows. Cache in analytics table, not computed on every request.",
          "PDF export: Puppeteer on backend. POST /api/reports/export → returns PDF URL.",
        ],
        stateNeeded: "selectedPeriodRange, selectedGstin (filter), chartType",
        apiCalls: "GET /api/analytics/itc-summary, GET /api/analytics/supplier-health, POST /api/reports/export",
      },
      {
        id: "follow-ups",
        route: "/dashboard/follow-ups",
        title: "Supplier Follow-ups",
        icon: "📨",
        purpose: "Track supplier communication for missing invoices.",
        sections: [
          { name: "Pending follow-ups", detail: "Invoices in 'In books not 2B' state across all GSTINs. Grouped by supplier GSTIN." },
          { name: "Message composer", detail: "Select rows → AI drafts WhatsApp/email per supplier. Shows: 'Hi, invoices [list] not found in your GSTR-2B for Oct. Please file or clarify.'" },
          { name: "Sent history", detail: "Table of follow-ups sent: Supplier | Date sent | Channel (WA/email) | Response status (Pending/Replied/Resolved)." },
          { name: "Resolution tracker", detail: "Mark as Resolved when supplier files. Auto-detected if next month's 2B includes the invoice." },
        ],
        devNotes: [
          "AI draft: POST /api/follow-ups/draft with list of invoice IDs. GPT-4o-mini generates message per unique supplier.",
          "WhatsApp send: uses WA Business API if clinic has WA number configured. Fallback: show copy-paste text.",
          "Resolution detection: run on each new reconciliation — if previously missing invoice now appears in 2B, mark resolved.",
        ],
        stateNeeded: "selectedRows, draftMessages, sendChannel",
        apiCalls: "GET /api/follow-ups, POST /api/follow-ups/draft, POST /api/follow-ups/send",
      },
      {
        id: "gstr3b",
        route: "/dashboard/gstr3b",
        title: "GSTR-3B Filing",
        icon: "📄",
        purpose: "Review and file GSTR-3B from reconciled data.",
        sections: [
          { name: "GSTIN + period selector", detail: "Select which GSTIN and month to file. Shows reconciliation status — warn if not fully reconciled." },
          { name: "Table 4 (ITC)", detail: "Pre-filled from recon results: 4A (ITC available), 4B (ITC reversed), 4D (ineligible ITC). All editable." },
          { name: "Table 3 (liabilities)", detail: "Outward supplies summary. CA fills this manually (linked from GSTR-1 data optionally)." },
          { name: "Tax computation", detail: "Auto-calculate net tax payable = liability - ITC. Show per tax head: IGST, CGST, SGST, Cess." },
          { name: "File button", detail: "'File GSTR-3B' → confirmation modal showing final numbers → EVC/DSC signature → file via GSP." },
          { name: "Filed status", detail: "After filing: show ARN (acknowledgement number), date, tax paid. Option to download filed return PDF." },
        ],
        devNotes: [
          "Table 4 is editable — CA may override AI-computed values. Track changes with a 'Modified' indicator.",
          "EVC auth: OTP to registered mobile. DSC: digital signature (complex — v1 can skip DSC, do EVC only).",
          "Save draft: auto-save every 30 seconds. CA can come back and continue.",
          "POST /api/gstr3b/file → GSP files with GSTN → returns ARN. Store ARN in DB.",
          "Do NOT auto-file. Always require explicit CA confirmation before hitting GSP file endpoint.",
        ],
        stateNeeded: "selectedGstin, selectedPeriod, table4Data, table3Data, isDirty, isConfirmOpen, arn",
        apiCalls: "GET /api/gstr3b/draft/:jobId, POST /api/gstr3b/save-draft, POST /api/gstr3b/file",
      },
      {
        id: "billing",
        route: "/dashboard/billing",
        title: "Billing & Plan",
        icon: "💰",
        purpose: "Subscription management.",
        sections: [
          { name: "Current plan", detail: "Plan name | GSTINs used / limit | Billing date | Amount. Upgrade/downgrade button." },
          { name: "Invoice history", detail: "Table of past invoices. Download PDF option." },
          { name: "Payment method", detail: "Razorpay card/UPI on file. Update option." },
          { name: "Plan comparison", detail: "Compare current vs next plan. Show what unlocks on upgrade." },
        ],
        devNotes: [
          "Razorpay Subscription webhooks update plan status in DB. Never trust client-side for plan status.",
          "Show GSTIN usage prominently: '18 / 20 GSTINs used'. Progress bar turns red at 90%.",
          "Downgrade: warn about which GSTINs will be deactivated if limit is exceeded.",
        ],
        stateNeeded: "plan, usage, invoices, paymentMethod",
        apiCalls: "GET /api/billing/plan, GET /api/billing/invoices, POST /api/billing/upgrade",
      },
      {
        id: "settings",
        route: "/dashboard/settings",
        title: "Settings",
        icon: "⚙️",
        purpose: "Firm profile, team members, notifications.",
        sections: [
          { name: "Firm profile", detail: "Firm name, address, CA registration number, firm GSTIN (for invoicing). Logo upload." },
          { name: "Team members", detail: "Invite CAs/assistants by email. Assign role: Admin or Viewer. Viewer can see results but not file." },
          { name: "Notifications", detail: "Email alerts: reconciliation complete, mismatch found, 3B deadline reminder (configurable days before)." },
          { name: "ERP presets", detail: "Save column mapping presets per ERP (Tally, Zoho, Busy, SAP). Name them. Apply on upload." },
          { name: "API access", detail: "For power users: generate API key to integrate with their own tools. Show usage stats." },
        ],
        devNotes: [
          "Team invites: send email with signup link + auto-join firm on registration.",
          "Roles: implement as simple enum (ADMIN | VIEWER) in Doctor table. Middleware checks role for write operations.",
          "ERP presets: store as JSON in firm settings. { 'Tally Prime': { invoiceNo: 'Vch No.', gstin: 'Party GSTIN', ... } }",
          "API keys: generate with crypto.randomBytes(32).toString('hex'). Store hashed in DB. Show once on creation.",
        ],
        stateNeeded: "activeTab, profileForm, inviteEmail, selectedRole, notifications config",
        apiCalls: "GET/PATCH /api/settings, POST /api/team/invite, GET/POST /api/api-keys",
      },
    ],
  },
};

const ROUTE_TREE = [
  { path: "/", label: "Landing" },
  { path: "/demo", label: "Interactive demo" },
  { path: "/pricing", label: "Pricing" },
  { path: "/login", label: "Login" },
  { path: "/register", label: "Register" },
  { path: "/forgot-password", label: "Forgot password" },
  { path: "/onboarding", label: "Onboarding (5-step wizard)" },
  { path: "/dashboard", label: "Home — GSTIN status overview" },
  { path: "/dashboard/reconcile/new", label: "New reconciliation" },
  { path: "/dashboard/reconcile/:jobId", label: "Results — the core page" },
  { path: "/dashboard/gstins", label: "GSTIN management" },
  { path: "/dashboard/history", label: "Job history" },
  { path: "/dashboard/reports", label: "Analytics & reports" },
  { path: "/dashboard/follow-ups", label: "Supplier follow-ups" },
  { path: "/dashboard/gstr3b", label: "GSTR-3B filing" },
  { path: "/dashboard/billing", label: "Billing & plan" },
  { path: "/dashboard/settings", label: "Settings" },
];

export default function FrontendPages() {
  const [selected, setSelected] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  const allPages = Object.values(PAGES).flatMap(g => g.pages);
  const selectedPage = allPages.find(p => p.id === selected);
  const selectedGroup = Object.values(PAGES).find(g => g.pages.some(p => p.id === selected));

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#09090b",
      minHeight: "100vh",
      color: "#e4e4e7",
    }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #18181b", padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#52525b", textTransform: "uppercase", marginBottom: 4 }}>
            GST Reconciliation Autopilot
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fafafa", letterSpacing: "-0.025em", marginBottom: 6 }}>
            Frontend Page Structure
          </div>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            {allPages.length} pages across {Object.keys(PAGES).length} sections · Click any page for full detail
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>

        {/* Left: page list */}
        <div style={{ width: selected ? 340 : "100%", flexShrink: 0 }}>

          {/* Route tree toggle */}
          {!selected && (
            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Complete route tree
              </div>
              {ROUTE_TREE.map((r, i) => (
                <div key={r.path} style={{ display: "flex", gap: 12, marginBottom: 6, alignItems: "baseline" }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: 11,
                    color: r.path.startsWith("/dashboard") ? "#34d399" : r.path === "/" ? "#f59e0b" : "#60a5fa",
                    whiteSpace: "nowrap",
                  }}>{r.path}</span>
                  <span style={{ fontSize: 11, color: "#52525b" }}>{r.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Groups */}
          {Object.entries(PAGES).map(([groupKey, group]) => (
            <div key={groupKey} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                color: group.accent, textTransform: "uppercase", marginBottom: 8,
                paddingLeft: 2,
              }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {group.pages.map(page => {
                  const isActive = selected === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => { setSelected(isActive ? null : page.id); setActiveSection("overview"); }}
                      style={{
                        textAlign: "left", borderRadius: 8, padding: "10px 12px",
                        background: isActive ? group.bg : "#18181b",
                        border: `1px solid ${isActive ? group.border : "#27272a"}`,
                        cursor: "pointer", transition: "all 0.12s",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 14 }}>{page.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#fafafa" : "#d4d4d8" }}>
                          {page.title}
                        </span>
                        <span style={{
                          fontFamily: "monospace", fontSize: 10, color: "#52525b",
                          marginLeft: "auto", whiteSpace: "nowrap",
                        }}>
                          {page.route}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "#71717a", paddingLeft: 22, lineHeight: 1.5 }}>
                        {page.purpose}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail panel */}
        {selectedPage && selectedGroup && (
          <div style={{
            flex: 1, background: "#18181b", border: `1px solid ${selectedGroup.border}`,
            borderRadius: 12, padding: 20, position: "sticky", top: 16, maxHeight: "90vh",
            overflowY: "auto",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: selectedGroup.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                  {selectedGroup.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{selectedPage.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#fafafa" }}>{selectedPage.title}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#52525b" }}>{selectedPage.route}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Purpose */}
            <div style={{ background: selectedGroup.bg, border: `1px solid ${selectedGroup.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: selectedGroup.accent, marginBottom: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>Purpose</div>
              <div style={{ fontSize: 12, color: "#d4d4d8", lineHeight: 1.6 }}>{selectedPage.purpose}</div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {["overview", "dev notes", "state & api"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                    background: activeSection === tab ? selectedGroup.bg : "transparent",
                    border: `1px solid ${activeSection === tab ? selectedGroup.border : "#27272a"}`,
                    color: activeSection === tab ? selectedGroup.accent : "#52525b",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview: sections */}
            {activeSection === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedPage.sections.map((s, i) => (
                  <div key={s.name} style={{ background: "#111113", borderRadius: 8, padding: "10px 12px", border: "1px solid #27272a" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 4,
                        background: selectedGroup.bg, color: selectedGroup.accent,
                        border: `1px solid ${selectedGroup.border}`,
                      }}>
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7" }}>{s.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.6, paddingLeft: 26 }}>{s.detail}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Dev notes */}
            {activeSection === "dev notes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selectedPage.devNotes.map((note, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: selectedGroup.accent, marginTop: 1, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.7 }}>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {/* State & API */}
            {activeSection === "state & api" && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>State needed</div>
                  <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#71717a", lineHeight: 1.7 }}>
                    {selectedPage.stateNeeded}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>API calls</div>
                  <div style={{ background: "#111113", border: `1px solid ${selectedGroup.border}`, borderLeft: `2px solid ${selectedGroup.accent}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#71717a", lineHeight: 2 }}>
                    {selectedPage.apiCalls.split(", ").map((call, i) => (
                      <div key={i}>{call}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
