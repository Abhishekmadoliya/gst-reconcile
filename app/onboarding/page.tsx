"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Briefcase,
  Building2,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Lock,
  Database,
  Trash2,
  Check,
  Zap,
  HelpCircle,
  Clock
} from "lucide-react";
import TaxSolverLogo from "@/components/logos/v1";

type RoleType = "ca_firm" | "in_house_accountant" | "business_owner";
type BooksSoftwareType = "tally" | "busy" | "zoho" | "marg" | "excel_csv" | "other";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const { setSelectedGstinId } = useDashboardStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Role & Workspace sizing
  const [role, setRole] = useState<RoleType>("ca_firm");
  const [firmName, setFirmName] = useState(user?.firmName || "");
  const [gstinCountRange, setGstinCountRange] = useState<string>("2-10");

  // Step 2: Books Software
  const [booksSoftware, setBooksSoftware] = useState<BooksSoftwareType>("tally");

  // Step 3: First GSTIN & Filing frequency
  const [gstin, setGstin] = useState("");
  const [legalName, setLegalName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [filingFrequency, setFilingFrequency] = useState<"monthly" | "qrmp">("monthly");
  const [phone, setPhone] = useState("");
  const [gstinLookupLoading, setGstinLookupLoading] = useState(false);
  const [gstinVerified, setGstinVerified] = useState<{
    valid: boolean;
    stateName: string;
    stateCode: string;
    pan: string;
    suggestedLegalName: string;
  } | null>(null);

  // Completed GSTIN ID after step 3 submission
  const [createdGstinId, setCreatedGstinId] = useState<string | null>(null);

  // Live GSTIN Lookup Debounce
  useEffect(() => {
    const clean = gstin.trim().toUpperCase();
    if (clean.length === 15) {
      const lookup = async () => {
        setGstinLookupLoading(true);
        setError(null);
        try {
          const res = await api.get(`${API_URL}/api/auth/gstin-lookup/${clean}`);
          if (res.data?.success && res.data?.data) {
            setGstinVerified(res.data.data);
            if (!legalName) setLegalName(res.data.data.suggestedLegalName);
            if (!tradeName) setTradeName(res.data.data.suggestedLegalName);
          }
        } catch (err: any) {
          setError(err?.response?.data?.message || "Invalid GSTIN format. Please check state code and checksum.");
          setGstinVerified(null);
        } finally {
          setGstinLookupLoading(false);
        }
      };
      lookup();
    } else {
      setGstinVerified(null);
    }
  }, [gstin]);

  // Handle Step 3 Submission
  const handleCompleteSetup = async () => {
    const cleanGstin = gstin.trim().toUpperCase();
    if (!cleanGstin || cleanGstin.length !== 15) {
      setError("Please provide a valid 15-character GSTIN before proceeding.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post(`${API_URL}/api/auth/onboarding`, {
        role,
        firmName: role === "ca_firm" ? (firmName.trim() || undefined) : undefined,
        gstinCountRange: role === "ca_firm" ? gstinCountRange : "1",
        booksSoftware,
        firstGstin: cleanGstin,
        legalName: legalName.trim() || gstinVerified?.suggestedLegalName || "Registered Taxpayer",
        tradeName: tradeName.trim() || legalName.trim() || "Registered Taxpayer",
        filingFrequency,
        phone: phone.trim() || undefined,
      });

      if (res.data?.success) {
        const newGstin = res.data.data?.gstin;
        if (newGstin) {
          setCreatedGstinId(newGstin.id);
          setSelectedGstinId(newGstin.id);
        }

        // Update local auth store
        if (user) {
          setAuth({
            ...user,
            firmName: firmName.trim() || user.firmName,
            onboardingCompleted: true,
          });
        }

        // Move to Step 4 (Straight to Value)
        setStep(4);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to complete onboarding. Please verify details.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Sample Demo Reconciliation
  const handleRunDemoRecon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post(`${API_URL}/api/auth/onboarding/demo-recon`, {
        gstinId: createdGstinId,
      });

      if (res.data?.success && res.data?.data?.jobId) {
        // Mark session cookie so middleware doesn't intercept
        document.cookie = "skip_onboarding=true; path=/; max-age=86400";
        router.push(`/dashboard/reconcile/${res.data.data.jobId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Fallback directly to dashboard
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipToDashboard = () => {
    document.cookie = "skip_onboarding=true; path=/; max-age=86400";
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-foreground">
      {/* Top Navigation */}
      <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <TaxSolverLogo size={26} />
        </Link>

        {/* Progress Tracker */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            1. Role
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            2. Accounting Stack
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${step === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            3. First GSTIN
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${step === 4 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            4. First Result
          </span>
        </div>

        <button
          onClick={handleSkipToDashboard}
          className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
        >
          Skip to Dashboard
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col justify-center">
        {error && (
          <div className="mb-6 p-3.5 rounded-lg border border-alert/20 bg-alert-bg text-alert text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STEP 1: WHO ARE YOU ================= */}
        {step === 1 && (
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Step 1 of 3
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Who are you?
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Choose your workflow role. This configures your multi-client ledger and recommended plan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Option A: CA Firm */}
              <button
                type="button"
                onClick={() => setRole("ca_firm")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  role === "ca_firm"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">CA & Accounting Firm</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Manage multiple clients, automate vendor chases, and batch audit 2B.
                </p>
                {role === "ca_firm" && (
                  <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 right-3" />
                )}
              </button>

              {/* Option B: In-House Accountant */}
              <button
                type="button"
                onClick={() => setRole("in_house_accountant")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  role === "in_house_accountant"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-info/10 text-info flex items-center justify-center mb-3">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">In-House Accountant</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Dedicated single or multi-branch compliance for your company.
                </p>
                {role === "in_house_accountant" && (
                  <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 right-3" />
                )}
              </button>

              {/* Option C: Business Owner */}
              <button
                type="button"
                onClick={() => setRole("business_owner")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  role === "business_owner"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Business Owner</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Verify your input tax credits, stop vendor leakages, and file accurately.
                </p>
                {role === "business_owner" && (
                  <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 right-3" />
                )}
              </button>
            </div>

            {/* Conditional fields for CA Firms */}
            {role === "ca_firm" && (
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    How many client GSTINs does your practice handle?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2-10", "11-50", "50+"].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setGstinCountRange(tier)}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          gstinCountRange === tier
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {tier} GSTINs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Firm / Practice Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma & Associates CA Firm"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer"
              >
                Continue to Accounting Stack <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: WHERE DO YOUR BOOKS LIVE ================= */}
        {step === 2 && (
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Step 2 of 3
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Where do your books live?
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                The purchase register import is where most drop off. Selecting your accounting software ensures our engine pre-configures the exact column mapping.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "tally", title: "Tally Prime / ERP 9", desc: "Auto-maps columnar purchase register export" },
                { id: "busy", title: "Busy Accounting", desc: "Native support for Busy GST register format" },
                { id: "zoho", title: "Zoho Books", desc: "Direct parser for Zoho bill & debit note reports" },
                { id: "marg", title: "Marg ERP", desc: "Optimized for pharma and FMCG distributor books" },
                { id: "excel_csv", title: "Excel / Custom CSV", desc: "Universal fuzzy mapper with AI column matching" },
                { id: "other", title: "Other / SAP / Oracle", desc: "Standard template with sample converter" },
              ].map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => setBooksSoftware(sw.id as BooksSoftwareType)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    booksSoftware === sw.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileSpreadsheet className={`h-5 w-5 ${booksSoftware === sw.id ? "text-primary" : "text-muted-foreground"}`} />
                    {booksSoftware === sw.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <h3 className="text-xs font-bold text-foreground">{sw.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{sw.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 h-10 px-4 border border-border text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer"
              >
                Continue to First GSTIN <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADD YOUR FIRST GSTIN & TRUST MOMENT ================= */}
        {step === 3 && (
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Step 3 of 3
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Add your first GSTIN
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                We'll validate checksum, identify jurisdiction state, and prepare your initial GSTR-2B sync.
              </p>
            </div>

            <div className="space-y-4 bg-card border border-border p-5 rounded-xl">
              {/* GSTIN Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Client / Business GSTIN (15 Digits)
                  </label>
                  {gstinLookupLoading && (
                    <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
                      <Loader2 className="h-3 w-3 animate-spin" /> Verifying checksum...
                    </span>
                  )}
                  {gstinVerified && (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Checksum Valid • {gstinVerified.stateName}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-border bg-background text-sm font-mono tracking-wider rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              {/* Legal Name Autofill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Legal Name / Trade Name
                  </label>
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                {/* Filing Frequency */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    GSTR-1 / 3B Filing Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFilingFrequency("monthly")}
                      className={`py-2 px-2 text-xs font-bold rounded-md border text-center transition-colors cursor-pointer ${
                        filingFrequency === "monthly"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilingFrequency("qrmp")}
                      className={`py-2 px-2 text-xs font-bold rounded-md border text-center transition-colors cursor-pointer ${
                        filingFrequency === "qrmp"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      QRMP (Quarterly)
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Phone for WhatsApp Notices */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  WhatsApp Contact (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210 (For automated supplier chase reminders only)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
                <span className="text-[10px] text-muted-foreground block">
                  *Only asked for sending discrepancy notifications to vendors or your team.
                </span>
              </div>
            </div>

            {/* ================= THE TRUST MOMENT (EXPLICIT) ================= */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Security & DPDP Act 2023 Compliance Notice</span>
              </div>
              <div className="space-y-1 text-[11px] text-muted-foreground leading-relaxed divide-y divide-border/40">
                <div className="flex items-center gap-2 py-1">
                  <Database className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span><strong>What we store:</strong> Encrypted invoice numbers, tax sums, and GSTIN headers needed for mathematical reconciliation.</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>What we NEVER store:</strong> Your GST Portal login password, taxpayer banking credentials, or unrelated client financials.</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <Trash2 className="h-3.5 w-3.5 text-alert shrink-0" />
                  <span><strong>Your data control:</strong> 1-click purge client records anytime under Digital Personal Data Protection Act compliance.</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 h-10 px-4 border border-border text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <button
                type="button"
                disabled={isLoading || gstin.trim().length !== 15}
                onClick={handleCompleteSetup}
                className="flex items-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving Workspace...
                  </>
                ) : (
                  <>
                    Complete & Run First Recon <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: STRAIGHT TO VALUE (FIRST RECONCILIATION RESULT) ================= */}
        {step === 4 && (
          <div className="space-y-6 text-left animate-in zoom-in-98 duration-200">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-1">
                <Check className="h-3.5 w-3.5" /> Workspace Initialized Successfully
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Get your first reconciliation result
              </h1>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                No waiting. See how TaxSolver detects rate mismatches, missing vendor invoices, and ineligible Section 17(5) ITC.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Recommended Day 1 Demo */}
              <div className="p-5 rounded-xl border-2 border-primary bg-primary/5 flex flex-col justify-between space-y-4 relative">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    <Zap className="h-3 w-3" /> Recommended
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    ⚡ Try with 1-Click Sample Data
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Test the engine with 25 realistic Indian GST invoices. See how discrepancies, ITC risk schedules, and vendor chase notices appear on screen.
                  </p>
                  <ul className="text-[11px] text-muted-foreground space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-500" /> Rate mismatch (18% vs 12%)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-500" /> Missing in GSTR-2B (vendor chase ready)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-500" /> Unclaimed ITC found in 2B
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleRunDemoRecon}
                  className="w-full flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Simulating First Recon...
                    </>
                  ) : (
                    <>
                      Launch Sample Reconciliation <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Option B: Upload Real Data */}
              <div className="p-5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Production Data
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    📁 Upload Your Books & GSTR-2B
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ready with client records? Upload your {booksSoftware.toUpperCase()} purchase register and portal GSTR-2B JSON or Excel directly.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Takes under 15 seconds to parse and match 10,000+ line items.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.cookie = "skip_onboarding=true; path=/; max-age=86400";
                      router.push("/dashboard/reconcile/new");
                    }}
                    className="w-full flex items-center justify-center gap-2 h-11 border border-border bg-background hover:bg-muted text-foreground text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Upload Purchase Files <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    href="/free-tools/offline-reconciliation"
                    className="text-[11px] text-primary hover:underline block text-center"
                  >
                    Prefer zero server uploads? Try 100% In-Browser Offline Tool →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border text-center text-[11px] text-muted-foreground">
        <span>TaxSolver GST Compliance • Compliant with Indian DPDP Act 2023 • All data encrypted in transit & at rest</span>
      </footer>
    </div>
  );
}
