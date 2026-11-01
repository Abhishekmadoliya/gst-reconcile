"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Plus, 
  Minus, 
  CreditCard, 
  Lock, 
  Building2, 
  Sparkles, 
  FileText, 
  QrCode, 
  ArrowRight,
  Download,
  CheckCircle2,
  AlertCircle,
  Layers,
  Printer
} from "lucide-react";
import { PRICING_PLANS, PRICING_ADDONS, formatINR, getPlanById } from "@/lib/pricing-plans";
import { API_URL } from "@/lib/config";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPlanId = searchParams.get("plan") || "growth";
  const initialBilling = (searchParams.get("billing") as "annual" | "monthly") || "annual";

  // State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(initialBilling);
  const [addonGstinQty, setAddonGstinQty] = useState<number>(0);
  const [addonInvoiceQty, setAddonInvoiceQty] = useState<number>(0);
  const [addonWhatsappQty, setAddonWhatsappQty] = useState<number>(0);

  // Customer & Billing details
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [firmName, setFirmName] = useState<string>("");
  const [hasGstin, setHasGstin] = useState<boolean>(true);
  const [gstin, setGstin] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");

  // Payment UI state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState<boolean>(false);
  const [simulatedMethod, setSimulatedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [currentBackendOrder, setCurrentBackendOrder] = useState<any>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);

  // Client-generated unique Idempotency Key (RFC 7231 / Razorpay standard)
  const [idempotencyKey] = useState<string>(() => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "idemp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
  });

  const [receipt, setReceipt] = useState<any>(null);

  const selectedPlan = getPlanById(selectedPlanId);

  // Auto-fill state and firm name based on GSTIN input
  useEffect(() => {
    if (gstin.length >= 2) {
      const stateCode = gstin.substring(0, 2);
      const stateMap: Record<string, string> = {
        "27": "Maharashtra",
        "29": "Karnataka",
        "07": "Delhi",
        "24": "Gujarat",
        "33": "Tamil Nadu",
        "09": "Uttar Pradesh",
        "19": "West Bengal",
        "06": "Haryana",
        "08": "Rajasthan",
        "32": "Kerala",
        "36": "Telangana",
      };
      if (stateMap[stateCode]) {
        setSelectedState(stateMap[stateCode]);
      }
    }
  }, [gstin]);

  // Pricing calculations (Server will authoritatively recompute upon order creation)
  const basePrice = billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
  const addonGstinPrice = (billingCycle === "annual" ? PRICING_ADDONS[0].priceAnnual : PRICING_ADDONS[0].priceMonthly) * addonGstinQty;
  const addonInvoicePrice = PRICING_ADDONS[1].priceAnnual * addonInvoiceQty;
  const addonWhatsappPrice = PRICING_ADDONS[2].priceAnnual * addonWhatsappQty;

  const subtotal = basePrice + addonGstinPrice + addonInvoicePrice + addonWhatsappPrice;
  const isInterState = selectedState !== "Maharashtra";
  const gstRate = 0.18;
  const igst = isInterState ? Math.round(subtotal * gstRate) : 0;
  const cgst = !isInterState ? Math.round(subtotal * (gstRate / 2)) : 0;
  const sgst = !isInterState ? Math.round(subtotal * (gstRate / 2)) : 0;
  const gstTotal = cgst + sgst + igst;
  const grandTotal = subtotal + gstTotal;

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /**
   * Displays Coming Soon modal. Online payment collection is temporarily deferred on frontend.
   */
  const handlePay = () => {
    setErrorMsg(null);
    setShowComingSoonModal(true);
  };

  /**
   * Verifies payment signature on the backend to activate entitlements.
   */
  const verifyPaymentOnBackend = async (paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(paymentResponse),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Payment signature verification failed");
      }

      const verified = data.data;
      setReceipt({
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: verified.orderNumber,
        invoiceNumber: verified.invoiceNumber,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        planName: verified.planName,
        billingCycle: verified.billingCycle,
        subtotal,
        gstTotal: verified.taxAmount,
        grandTotal: verified.totalAmount,
        customerName: name,
        firmName: firmName || name,
        customerGstin: verified.customerGstin || (hasGstin ? gstin : ""),
        state: selectedState,
        status: "Verified & Active",
      });

      setShowSimulatedModal(false);
      setIsPaid(true);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setErrorMsg(err.message || "Payment verification failed. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Executes verification for the interactive sandbox simulator
   */
  const handleSimulatedPaymentComplete = async () => {
    if (!currentBackendOrder) return;
    const simulatedResponse = {
      razorpay_order_id: currentBackendOrder.razorpayOrderId,
      razorpay_payment_id: `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      razorpay_signature: `sim_sig_${Date.now()}`,
    };
    await verifyPaymentOnBackend(simulatedResponse);
  };

  // SUCCESS / RECEIPT VIEW
  if (isPaid && receipt) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none">
            
            {/* Header */}
            <div className="bg-[#dde5f2] p-8 text-center border-b border-[#cbd5e1]">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Authorized & Verified</h1>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                TaxSolver Statutory B2B Tax Invoice &bull; GST SAC 998314
              </p>
              <div className="inline-block mt-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                100% ITC Eligible &bull; Instant Capacity Credited
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-8 space-y-6">
              
              {/* Reference Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Invoice No:</span>
                  <span className="font-mono font-bold text-foreground text-xs">{receipt.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Order Reference:</span>
                  <span className="font-mono font-bold text-foreground text-xs">{receipt.orderId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Payment ID:</span>
                  <span className="font-mono font-bold text-foreground text-xs truncate block">{receipt.paymentId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Date:</span>
                  <span className="font-bold text-foreground">{receipt.date}</span>
                </div>
              </div>

              {/* Billed To */}
              <div className="border border-border rounded-xl p-4 bg-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Billed To (Customer Details)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Entity / Firm:</span>{" "}
                    <strong className="text-foreground">{receipt.firmName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contact:</span>{" "}
                    <strong className="text-foreground">{receipt.customerName}</strong>
                  </div>
                  {receipt.customerGstin && (
                    <div className="sm:col-span-2 text-emerald-600 font-bold bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                      B2B GSTIN for ITC: <span className="font-mono">{receipt.customerGstin}</span> (18% ITC Claimable in GSTR-3B)
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Place of Supply:</span>{" "}
                    <strong className="text-foreground">{receipt.state}</strong>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Cadence</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        TaxSolver {receipt.planName} Plan
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          Full 3-Tier Recon Engine + Statutory Notice Automation
                        </span>
                      </td>
                      <td className="py-2.5 px-3 capitalize text-muted-foreground">{receipt.billingCycle}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{formatINR(basePrice)}</td>
                    </tr>
                    {addonGstinQty > 0 && (
                      <tr>
                        <td className="py-2 px-3 text-muted-foreground">
                          Additional GSTIN Bucket (+{addonGstinQty * 5} GSTINs)
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{addonGstinQty} pack(s)</td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">{formatINR(addonGstinPrice)}</td>
                      </tr>
                    )}
                    {addonInvoiceQty > 0 && (
                      <tr>
                        <td className="py-2 px-3 text-muted-foreground">
                          Invoice Volume Recharge (+{addonInvoiceQty * 10000} Invoices)
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{addonInvoiceQty} recharge(s)</td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">{formatINR(addonInvoicePrice)}</td>
                      </tr>
                    )}
                    {addonWhatsappQty > 0 && (
                      <tr>
                        <td className="py-2 px-3 text-muted-foreground">
                          WhatsApp Follow-up Credits (+{addonWhatsappQty * 1500} Notices)
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{addonWhatsappQty} credit pack(s)</td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">{formatINR(addonWhatsappPrice)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-muted/40 font-semibold text-foreground border-t border-border">
                    <tr>
                      <td colSpan={2} className="py-2 px-3 text-right text-muted-foreground">Subtotal:</td>
                      <td className="py-2 px-3 text-right font-mono">{formatINR(subtotal)}</td>
                    </tr>
                    {isInterState ? (
                      <tr>
                        <td colSpan={2} className="py-1.5 px-3 text-right text-muted-foreground">Integrated GST (IGST 18%):</td>
                        <td className="py-1.5 px-3 text-right font-mono">{formatINR(igst)}</td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={2} className="py-1 px-3 text-right text-muted-foreground">Central GST (CGST 9%):</td>
                          <td className="py-1 px-3 text-right font-mono">{formatINR(cgst)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="py-1 px-3 text-right text-muted-foreground">State GST (SGST 9%):</td>
                          <td className="py-1 px-3 text-right font-mono">{formatINR(sgst)}</td>
                        </tr>
                      </>
                    )}
                    <tr className="border-t border-border font-bold text-sm bg-muted/80">
                      <td colSpan={2} className="py-2.5 px-3 text-right text-foreground">Total Paid (INR):</td>
                      <td className="py-2.5 px-3 text-right font-mono text-primary font-black text-base">
                        {formatINR(receipt.grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-xs font-bold text-foreground bg-secondary/50 hover:bg-secondary cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  Print Statutory Invoice
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md cursor-pointer"
                >
                  <span>Go to Client Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#dde5f2] p-4 text-center text-xs text-slate-700 border-t border-[#cbd5e1]">
              TaxSolver Technologies India Pvt Ltd &bull; Corporate Identification: U72900MH2024PTC123456 &bull; SAC 998314
            </div>

          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plan Matrix
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Coming Soon Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-foreground">Paid Subscriptions Coming Soon</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                We are not collecting payments online right now. All reconciliation and audit features are 100% available under our <strong>14-Day Free Evaluation</strong>!
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Configure Subscription & Complete Checkout
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your plan, configure modular add-ons, add your firm GSTIN for 18% ITC credit, and pay securely.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-bold text-destructive block">Payment Notice</strong>
              <span className="text-destructive/90">{errorMsg}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Plan, Add-ons, Billing Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Plan Selector Switcher */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Step 1 &bull; Selected Plan & Cadence
                </span>
                
                {/* Billing Toggle */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-muted text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                      billingCycle === "annual" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Annual (Save ~25%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                      billingCycle === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Plan Choice Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRICING_PLANS.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;
                  const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm" 
                          : "border-border bg-card/50 hover:bg-muted/40"
                      }`}
                    >
                      <div className="text-[11px] font-bold text-foreground truncate">{plan.name}</div>
                      <div className="text-xs font-black text-primary mt-1 font-mono">{formatINR(price)}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{plan.gstinDisplay}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Plan Details Pill */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">{selectedPlan.name} Plan</span>
                  <span className="text-muted-foreground ml-2 text-[11px]">
                    Includes {selectedPlan.gstinDisplay} &bull; {selectedPlan.invoiceDisplay}
                  </span>
                </div>
                <span className="font-mono font-bold text-foreground">{formatINR(basePrice)}</span>
              </div>
            </div>

            {/* 2. Modular Add-ons Configurator */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Step 2 &bull; Modular Add-on Buckets
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Scale your GSTIN slots, invoice volume, and WhatsApp vendor notices without forcing an entire tier upgrade.
                </p>
              </div>

              <div className="space-y-3">
                {/* Addon 1: GSTIN Bucket */}
                <div className="p-3.5 border border-border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Additional GSTIN Bucket</span>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                        Sold in packs of 5
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      ₹1,000 / GSTIN / year (Sold in packs of 5 for ₹5,000). Add active client entities.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button
                        type="button"
                        onClick={() => setAddonGstinQty(Math.max(0, addonGstinQty - 1))}
                        disabled={addonGstinQty === 0}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                        {addonGstinQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddonGstinQty(addonGstinQty + 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-mono font-bold text-xs text-foreground">
                      {formatINR(addonGstinPrice)}
                    </div>
                  </div>
                </div>

                {/* Addon 2: Invoice Volume Recharge */}
                <div className="p-3.5 border border-border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Invoice Volume Recharge</span>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                        +10,000 Invoices
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      ₹1,499 for an additional 10,000 invoices (Full rollover allowed within active subscription).
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button
                        type="button"
                        onClick={() => setAddonInvoiceQty(Math.max(0, addonInvoiceQty - 1))}
                        disabled={addonInvoiceQty === 0}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                        {addonInvoiceQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddonInvoiceQty(addonInvoiceQty + 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-mono font-bold text-xs text-foreground">
                      {formatINR(addonInvoicePrice)}
                    </div>
                  </div>
                </div>

                {/* Addon 3: WhatsApp Follow-up Credits */}
                <div className="p-3.5 border border-border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">WhatsApp Follow-up Credits</span>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                        1,500 Notices (~₹1/msg)
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Standard email is free. Retail: ₹1,499 for 1,500 WhatsApp notices via Meta Cloud API.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button
                        type="button"
                        onClick={() => setAddonWhatsappQty(Math.max(0, addonWhatsappQty - 1))}
                        disabled={addonWhatsappQty === 0}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                        {addonWhatsappQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddonWhatsappQty(addonWhatsappQty + 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-mono font-bold text-xs text-foreground">
                      {formatINR(addonWhatsappPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Customer & B2B Tax Details */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Step 3 &bull; Account & Tax Invoice Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. CA Rajesh Sharma"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Email Address (for Tax Invoice) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@sharmaca.in"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">CA Firm / Business Name</label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="Sharma & Associates CA Firm"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* B2B GSTIN Checkbox */}
              <div className="pt-2 border-t border-border space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasGstin}
                    onChange={(e) => setHasGstin(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-xs font-bold text-foreground">
                    I have a GSTIN &bull; Claim 18% Input Tax Credit on this purchase
                  </span>
                </label>

                {hasGstin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/20 border border-border rounded-xl animate-in fade-in">
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1 font-semibold">
                        Firm GSTIN (15 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="27AABCT2418Q1ZV"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono tracking-wider focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1 font-semibold">
                        Billing State (Place of Supply)
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option value="Maharashtra">Maharashtra (CGST 9% + SGST 9%)</option>
                        <option value="Karnataka">Karnataka (IGST 18%)</option>
                        <option value="Delhi">Delhi (IGST 18%)</option>
                        <option value="Gujarat">Gujarat (IGST 18%)</option>
                        <option value="Tamil Nadu">Tamil Nadu (IGST 18%)</option>
                        <option value="Uttar Pradesh">Uttar Pradesh (IGST 18%)</option>
                        <option value="West Bengal">West Bengal (IGST 18%)</option>
                        <option value="Other">Other States & UTs (IGST 18%)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Razorpay Trigger */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-bold text-foreground">Order Breakdown</h3>
                <span className="text-[11px] text-muted-foreground font-mono">SAC 998314</span>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    TaxSolver {selectedPlan.name} ({billingCycle})
                  </span>
                  <span className="font-mono font-bold text-foreground">{formatINR(basePrice)}</span>
                </div>

                {addonGstinQty > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>+ {addonGstinQty * 5} Additional GSTIN Slots</span>
                    <span className="font-mono">{formatINR(addonGstinPrice)}</span>
                  </div>
                )}

                {addonInvoiceQty > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>+ {addonInvoiceQty * 10000} Invoices Recharge</span>
                    <span className="font-mono">{formatINR(addonInvoicePrice)}</span>
                  </div>
                )}

                {addonWhatsappQty > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>+ {addonWhatsappQty * 1500} WhatsApp Follow-up Credits</span>
                    <span className="font-mono">{formatINR(addonWhatsappPrice)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-2 flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-foreground">{formatINR(subtotal)}</span>
                </div>

                {/* Tax Breakdown */}
                <div className="bg-muted/40 p-3 rounded-xl space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>GST Rate</span>
                    <span>18% (SAC 998314)</span>
                  </div>
                  {isInterState ? (
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>IGST (Inter-state &bull; {selectedState})</span>
                      <span className="font-mono font-medium">{formatINR(igst)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>CGST (9%)</span>
                        <span className="font-mono font-medium">{formatINR(cgst)}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>SGST (9%)</span>
                        <span className="font-mono font-medium">{formatINR(sgst)}</span>
                      </div>
                    </>
                  )}
                  {hasGstin && (
                    <div className="text-[10px] text-emerald-600 font-bold pt-1 border-t border-border/50">
                      ✓ ₹{gstTotal.toLocaleString("en-IN")} can be claimed back as ITC in GSTR-3B Table 4.
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-foreground">Total Payable</span>
                    <span className="block text-[10px] text-muted-foreground">Inclusive of all taxes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary font-mono">{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Complete Checkout &bull; Coming Soon</span>
              </button>

              {/* Trust Badges */}
              <div className="pt-2 text-center space-y-2">
                <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Idempotent & Secure
                  </span>
                  <span>&bull;</span>
                  <span>UPI / Cards / Net Banking</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80">
                  Instant subscription provisioning &bull; 7-Day Money Back Guarantee
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Razorpay Interactive Simulator Modal (For Local & Sandbox Testing) */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-black flex items-center justify-center text-xs">
                  RZP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Razorpay Payment Gateway</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Order: {currentBackendOrder?.order?.orderNumber || "TS-SECURE"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulatedModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-muted/40 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">Amount to Pay</p>
                  <p className="text-lg font-extrabold text-foreground">{formatINR(grandTotal)}</p>
                </div>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 font-bold px-2 py-0.5 rounded">
                  Verified Backend Pipeline
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatedMethod("upi")}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                    simulatedMethod === "upi" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  <QrCode className="h-4 w-4 mx-auto mb-1" />
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedMethod("card")}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                    simulatedMethod === "card" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mx-auto mb-1" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedMethod("netbanking")}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                    simulatedMethod === "netbanking" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  <Building2 className="h-4 w-4 mx-auto mb-1" />
                  Net Banking
                </button>
              </div>

              {simulatedMethod === "upi" && (
                <div className="border border-border rounded-xl p-4 text-center bg-muted/20">
                  <div className="w-28 h-28 bg-white border border-border rounded-lg mx-auto flex items-center justify-center p-2 mb-2">
                    <QrCode className="h-24 w-24 text-slate-800" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Scan with Google Pay, PhonePe, or Paytm</p>
                  <p className="text-[10px] font-mono text-primary mt-1 font-bold">UPI ID: taxsolver@razorpay</p>
                </div>
              )}

              {simulatedMethod === "card" && (
                <div className="border border-border rounded-xl p-4 space-y-2 bg-muted/20 text-xs">
                  <input
                    type="text"
                    disabled
                    value="4111 1111 1111 1111 (Test Card)"
                    className="w-full h-8 px-2 bg-background border border-border rounded text-[11px] font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="h-8 px-2 bg-background border border-border rounded text-[11px]"
                    />
                    <input
                      type="text"
                      disabled
                      value="123"
                      className="h-8 px-2 bg-background border border-border rounded text-[11px]"
                    />
                  </div>
                </div>
              )}

              {simulatedMethod === "netbanking" && (
                <div className="border border-border rounded-xl p-3 grid grid-cols-2 gap-2 bg-muted/20 text-[11px] font-semibold text-muted-foreground">
                  <span className="p-2 border border-border rounded bg-card text-center text-foreground font-bold">HDFC Bank</span>
                  <span className="p-2 border border-border rounded bg-card text-center text-foreground font-bold">ICICI Bank</span>
                  <span className="p-2 border border-border rounded bg-card text-center text-foreground font-bold">SBI</span>
                  <span className="p-2 border border-border rounded bg-card text-center text-foreground font-bold">Axis Bank</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowSimulatedModal(false)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatedPaymentComplete}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Server...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Authorize & Complete Payment</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-center">
            
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm cursor-pointer"
            >
              &times;
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sparkles className="h-7 w-7" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 mb-3">
              Payment Gateway Coming Soon
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2">
              Paid Checkout Coming Soon!
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
              Thank you for choosing the <strong className="text-foreground">{selectedPlan.name} Plan</strong> ({billingCycle === "annual" ? "Annual" : "Monthly"}).
              <br /><br />
              We are currently not collecting subscription payments as we finalize payment gateway activation. In the meantime, you have <strong>100% free access to our Practitioner Tier for 14 days</strong> with zero upfront payment and no credit card required.
            </p>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md"
              >
                <span>Continue to Free Trial Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <button
                type="button"
                onClick={() => setShowComingSoonModal(false)}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
              >
                Close &amp; Review Configuration
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Loading TaxSolver Checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
