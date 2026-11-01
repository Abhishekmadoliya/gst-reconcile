"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, Loader2, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { authClient } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Validation States
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    setPasswordRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isPasswordValid) {
      setError("Please satisfy all password safety criteria.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          phone: phone.trim() ? phone.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Email may already be registered.");
      }

      const userProfile = data.data?.user;
      
      if (!userProfile) {
        throw new Error("No user profile data received from authentication server.");
      }

      // Update the client-side Zustand store immediately to prevent layout flickering
      useAuthStore.getState().setAuth(userProfile);

      // Route straight to the 3-step rapid onboarding flow
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/onboarding`,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to initialize Google SSO. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-1">
          <Sparkles className="h-3 w-3" />
          14-Day Free Trial &bull; Practitioner Plan (₹0)
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Create CA Firm Account
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enroll free with full <strong>Practitioner Tier</strong> access (up to 5 Client GSTINs &amp; 3,000 monthly invoices). No credit card required.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="CA Vinay Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* Work Email Address */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="name@firm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Dynamic Password Criteria Checklist */}
          {password.length > 0 && (
            <div className="p-2.5 bg-muted/40 border border-border rounded-lg space-y-1.5 mt-2">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Password Requirements:</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${passwordRules.length ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                  <span className={passwordRules.length ? "text-foreground/80 font-medium" : "text-muted-foreground"}>8+ Characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${passwordRules.uppercase ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                  <span className={passwordRules.uppercase ? "text-foreground/80 font-medium" : "text-muted-foreground"}>1+ Uppercase</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${passwordRules.number ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                  <span className={passwordRules.number ? "text-foreground/80 font-medium" : "text-muted-foreground"}>1+ Number</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${passwordRules.specialChar ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                  <span className={passwordRules.specialChar ? "text-foreground/80 font-medium" : "text-muted-foreground"}>1+ Special Char</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Phone Number (Optional with clear notice) */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Number <span className="font-normal text-muted-foreground/70 lowercase">(optional)</span>
            </label>
            <span className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
              <MessageSquare className="h-3 w-3" /> WhatsApp Alerts
            </span>
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
            />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Only needed if you want instant WhatsApp discrepancy notices for supplier follow-up. We never share or spam.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || (!isPasswordValid && password.length > 0)}
          className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Initializing Account...
            </>
          ) : (
            <>
              Continue to Onboarding <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

      </form>

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">or</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      {/* Google SSO Button */}
      <button
        onClick={handleGoogleSSO}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 h-10 border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.72 5.72 0 0 1-2.48 3.75v3.12h4.02c2.35-2.17 3.515-5.38 3.515-8.72z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.02-3.12c-1.12.75-2.55 1.19-3.91 1.19-3.02 0-5.58-2.04-6.5-4.78H1.31v3.23c1.98 3.93 6.04 6.39 10.69 6.39z"
          />
          <path
            fill="#FBBC05"
            d="M5.5 14.38a7.21 7.21 0 0 1 0-4.76V6.39H1.31a11.98 11.98 0 0 0 0 11.22l4.19-3.23z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.33 2.46 1.31 6.39l4.19 3.23c.92-2.74 3.48-4.78 6.5-4.78z"
          />
        </svg>
        Sign in with Google
      </button>

      {/* Switch Link */}
      <p className="text-xs text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/95 underline transition-colors">
          Log In
        </Link>
      </p>

    </div>
  );
}
