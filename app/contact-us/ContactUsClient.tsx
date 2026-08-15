"use client";

import { useState, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Bookmark
} from "lucide-react";

export default function ContactUsClient() {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firmName, setFirmName] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "offline_leads"), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        firmName: firmName.trim(),
        subject: subject,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        source: "contact_us"
      });

      setIsSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setFirmName("");
      setSubject("General Inquiry");
      setMessage("");
    } catch (err: any) {
      console.error("Error submitting contact form to Firestore:", err);
      setError("Failed to deliver your message. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_left_top,rgba(120,119,198,0.05),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_right_bottom,rgba(16,185,129,0.02),transparent)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1fr_500px] gap-12 items-start">

          {/* Left Column: Direct Info & Support */}
          <div className="text-left space-y-8 lg:pr-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary mb-4">
                <Bookmark className="h-3 w-3" />
                Contact Support & Sales
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-sans tracking-tight leading-tight text-foreground">
                Let&apos;s build a compliant future together
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 leading-relaxed max-w-xl">
                Have questions about automated GSTR-2B reconciliation, custom GSP APIs, CA firm packages,
                or preventing Input Tax Credit (ITC) leakage? Speak to our team of product and compliance specialists.
              </p>
            </div>

            {/* Support Details */}
            <div className="space-y-6 max-w-md">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">General & Technical Support</h4>
                  <a href="mailto:abhishekmadoliya@gmail.com" className="text-sm font-semibold mt-1 text-foreground hover:text-primary transition-colors block">
                    abhishekmadoliya@gmail.com
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Direct line to product engineering & compliance team.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CA & Enterprise Helpline</h4>
                  <a href="tel:+919310069214" className="text-sm font-semibold mt-1 text-foreground hover:text-primary transition-colors block font-mono">
                    +91 93100 69214
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mon–Sat, 9:00 AM to 7:00 PM IST (WhatsApp enabled).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 border border-border bg-card rounded-lg flex items-center justify-center text-primary shadow-xs">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Headquarters</h4>
                  <p className="text-sm font-semibold mt-1">Badarpur, New Delhi, 110044</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">New Delhi National Capital Region, India.</p>
                </div>
              </div>
            </div>

            {/* Compliance Badging */}
            <div className="pt-6 border-t border-border/40 max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-success/15 bg-success-bg/10">
                <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-foreground">Secure Data Guarantee</h5>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-1">
                    Your ledger files and corporate GSTIN data are protected using AES-256 encryption at rest. TaxSolver uses SOC2 Type II compliant GSP sandbox pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="border border-border/80 bg-card/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl text-left">
            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Message Sent Successfully!</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
                  Thank you for reaching out. One of our Chartered Accountants or product support specialists
                  will review your query and call/email you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Write to Us</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Please provide your details below and we will follow up.</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Abhishek Madoliya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="name@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Firm Name (Dynamic Additions) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      CA Firm / Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="XYZ Associates"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Subject / Inquiry Type
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="CA Firm / Enterprise Licensing">CA Firm / Enterprise Licensing</option>
                    <option value="GSP API Integration Support">GSP API Integration Support</option>
                    <option value="Technical Bug / Issue Reporting">Technical Bug / Issue Reporting</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Your Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <textarea
                      placeholder="How can we help your tax compliance team?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/95 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
