import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/auth/AuthInitializer";
import QueryProvider from "@/components/providers/QueryProvider";
import { getServerUser } from "@/lib/auth";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSTR-2B Reconciliation Software for CA Firms in India | TaxSolver",
  description: "India's fastest GSTR-2B reconciliation tool. Match 10,000+ invoices in seconds, auto-chase suppliers, and file GSTR-3B with 100% accurate ITC. Free trial for CA firms.",
  openGraph: {
    title: "GSTR-2B Reconciliation Software for CA Firms in India | TaxSolver",
    description: "India's fastest GSTR-2B reconciliation tool. Match 10,000+ invoices in seconds, auto-chase suppliers, and file GSTR-3B with 100% accurate ITC. Free trial for CA firms.",
    type: "website",
    url: "https://taxsolver.in",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TaxSolver GST Reconciliation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GSTR-2B Reconciliation Software for CA Firms in India | TaxSolver",
    description: "India's fastest GSTR-2B reconciliation tool. Match 10,000+ invoices in seconds, auto-chase suppliers, and file GSTR-3B with 100% accurate ITC. Free trial for CA firms.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getServerUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthInitializer initialUser={initialUser}>
            <Header />
            {children}
            <Footer />
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
}

