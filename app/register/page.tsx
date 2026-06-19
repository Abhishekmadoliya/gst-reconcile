import type { Metadata } from "next";
import AuthShowcase from "@/components/auth/AuthShowcase";
import RegisterForm from "@/components/auth/RegisterForm";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Initialize Accounting Firm Space — GST Reconciliation Autopilot",
  description: "Register your GST portfolio firm profile to auto-ingest GSTR-2B datasets. Certified GSP API endpoints.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground transition-colors duration-200">
      
      {/* Left-hand features and metric panel (Server Component) */}
      <AuthShowcase />

      {/* Right-hand register form panel (Server container with Client Form) */}
      <div className="lg:col-span-6 flex flex-col justify-between p-8 relative min-h-screen">
        
        {/* Top-right corner theme toggle option */}
        <div className="flex justify-end p-2 sm:p-4">
          <ThemeToggle />
        </div>

        {/* Center aligned Form */}
        <div className="flex-1 flex items-center justify-center py-8">
          <RegisterForm />
        </div>

        {/* Small bottom compliance copyright */}
        <div className="text-center text-[9px] text-muted-foreground">
          Encrypted credentials workspace. Sandbox GSP authentication indicator active.
        </div>

      </div>

    </div>
  );
}
