"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check local storage for consent status
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-4 md:pb-6 md:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-card border border-border shadow-2xl rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pointer-events-auto relative">
        <button 
          onClick={handleDecline} 
          className="md:hidden absolute top-2 right-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start md:items-center gap-4">
          <div className="bg-primary/10 p-2.5 rounded-lg hidden sm:block shrink-0">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground mb-1">We use cookies to improve your experience</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies to analyze site traffic and enhance our services. By clicking "Accept", you agree to our use of cookies. 
              You can read more about this in our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end md:justify-start pt-2 md:pt-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
