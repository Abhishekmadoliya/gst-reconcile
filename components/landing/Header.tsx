import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import { ShieldAlert } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-mono font-semibold tracking-tight text-lg text-foreground hover:opacity-95 transition-opacity">
            <span className="flex items-center justify-center bg-foreground text-background h-7 w-7 rounded font-sans font-bold text-sm">
              GST
            </span>
            <span>Recon<span className="text-success">.</span>autopilot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Interactive Demo
            </a>
            <a href="#risk-calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              DRC-01C Calculator
            </a>
            <a href="#suppliers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Supplier Matrix
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border bg-muted/40 rounded-md text-[10px] text-foreground/80 font-medium">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">GSP Connection: Sandbox.co.in</span>
            <span className="sm:hidden">GSP Sandbox</span>
          </div>
          <ThemeToggle />
          <Link 
            href="#pricing" 
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
