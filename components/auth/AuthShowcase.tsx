import { ShieldCheck, Database, Layers, ShieldAlert, Check } from "lucide-react";
import Link from "next/link";

export default function AuthShowcase() {
  return (
    <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-12 bg-muted/30 border-r border-border h-full relative transition-colors duration-200">
      
      {/* 1. Header Area with Logo */}
      <div className="space-y-4">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold tracking-tight text-lg text-foreground hover:opacity-90 transition-opacity w-fit">
          <span className="flex items-center justify-center bg-foreground text-background h-7 w-7 rounded font-sans font-bold text-sm">
            GST
          </span>
          <span>Recon<span className="text-success">.</span>autopilot</span>
        </Link>
        <p className="text-xs text-muted-foreground max-w-sm">
          Enterprise-grade reconciliation engine for Chartered Accountants, corporate finance leads, and tax practitioners.
        </p>
      </div>

      {/* 2. Visual Center: Compliance Widget Mockup */}
      <div className="my-8 max-w-md border border-border bg-card rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-foreground/75" />
            <span className="text-xs font-bold text-foreground">Compliance Health Summary</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-muted/40 text-[9px] font-semibold text-foreground/80">
            <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
            Live Sync
          </span>
        </div>

        {/* Small metric block */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 border border-border bg-muted/20 rounded-lg text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Reconciled</div>
            <div className="text-sm font-bold text-success mt-0.5">99.2%</div>
          </div>
          <div className="p-2 border border-border bg-muted/20 rounded-lg text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Mismatches</div>
            <div className="text-sm font-bold text-warn mt-0.5">₹8,200</div>
          </div>
          <div className="p-2 border border-border bg-muted/20 rounded-lg text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Risk Rating</div>
            <div className="text-sm font-bold text-success mt-0.5">A+</div>
          </div>
        </div>

        {/* Audit Status log */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>GSTR-2B API Handshake (Sandbox)</span>
            <span className="font-mono text-foreground font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Database Token Storage</span>
            <span className="font-mono text-foreground font-semibold">AES-256 ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* 3. Testimonial Quote */}
      <div className="space-y-4 max-w-md">
        <blockquote className="text-xs italic text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
          "Reconciling 40 client GSTINs manually used to consume 80% of our filing cycle. Autopilot completed our entire June reconciliation in under two hours."
        </blockquote>
        <div className="pl-4">
          <div className="text-xs font-bold text-foreground">CA Vinay Sharma</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Managing Partner, Sharma & Associates</div>
        </div>
      </div>

      {/* 4. Footer Badges */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />
          <span>GSP Authorized API (Sandbox.co.in)</span>
        </div>
        <span className="text-border text-xs hidden sm:inline">•</span>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium">
          <Database className="h-3.5 w-3.5 text-success shrink-0" />
          <span>AES-256 Storage</span>
        </div>
      </div>

    </div>
  );
}
