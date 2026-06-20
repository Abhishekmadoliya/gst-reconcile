import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Logo & Compliance Info */}
          <div className="space-y-3 max-w-sm text-left">
            <Link href="/" className="flex items-center gap-2 font-mono font-semibold tracking-tight text-foreground hover:opacity-90 transition-opacity">
              <span className="flex items-center justify-center bg-foreground text-background h-6 w-6 rounded font-sans font-bold text-xs">
                TS
              </span>
              <span className="text-sm">TaxSolver</span>
            </Link>
            <p className="text-[10px] text-muted-foreground leading-normal">
              An enterprise-grade reconciliation utility for Chartered Accountants, corporate tax teams, and SMEs. Reconcile invoices, track vendor filing history, and prevent ITC tax leakage.
            </p>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />
              <span>Partnered with Sandbox.co.in / MasterGST licensed GSPs.</span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-8 md:gap-16">
            <div className="space-y-2 text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Product</h5>
              <ul className="space-y-1.5 text-[10px]">
                <li><Link href="/gst-reconciliation-software" className="text-muted-foreground hover:text-foreground transition-colors">Software Features</Link></li>
                <li><Link href="/free-tools/itc-calculator" className="text-muted-foreground hover:text-foreground transition-colors">ITC Calculator</Link></li>
                <li><Link href="/free-tools/offline-reconciliation" className="text-muted-foreground hover:text-foreground transition-colors">Offline Recon Tool</Link></li>
                <li><Link href="/integrations/tally" className="text-muted-foreground hover:text-foreground transition-colors">Tally Integration</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-2 text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Resources</h5>
              <ul className="space-y-1.5 text-[10px]">
                <li><Link href="/gstr-2b-reconciliation" className="text-muted-foreground hover:text-foreground transition-colors">GSTR-2B Guide</Link></li>
                <li><Link href="/drc-01c-notice" className="text-muted-foreground hover:text-foreground transition-colors">DRC-01C Notice Reply</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Tax Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-2 text-left">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Company</h5>
              <ul className="space-y-1.5 text-[10px]">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security Audit Report</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright divider */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[9px] text-muted-foreground">
          <span>&copy; {currentYear} TaxSolver. All rights reserved.</span>
          <span>Made for Indian tax professionals. Secure, reliable, and compliant.</span>
        </div>
      </div>
    </footer>
  );
}
