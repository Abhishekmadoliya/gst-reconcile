import type { Metadata } from "next";
import AuthShowcase from "@/components/auth/AuthShowcase";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Access Your Firm Portal — GST Reconciliation Autopilot",
  description: "Log in to your GSTR-2B vs Books auditing portfolio. Partnered with government-certified GSPs. AES-256 secure credentials.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground transition-colors duration-200">
      
      {/* Left-hand features and metric panel (Server Component) */}
      <AuthShowcase />

      {/* Right-hand login form panel (Server container with Client Form) */}
      <div className="lg:col-span-6 flex flex-col justify-between p-8 relative min-h-screen">
        
        {/* Top-right corner theme toggle option */}
        <div className="flex justify-end p-2 sm:p-4">
          <ThemeToggle />
        </div>

        {/* Center aligned Form */}
        <div className="flex-1 flex items-center justify-center py-12">
          <LoginForm />
        </div>

        {/* Small bottom compliance copyright */}
        <div className="text-center text-[9px] text-muted-foreground">
          Secure Session protected by AES-256-GCM. Sandbox GSP authentication indicator active.
        </div>

      </div>

    </div>
  );
}
