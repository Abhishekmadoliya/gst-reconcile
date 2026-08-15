import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const staticPages = [
    { path: "", changefreq: "daily", priority: "1.0" },
    { path: "gst-reconciliation-software", changefreq: "weekly", priority: "0.9" },
    { path: "gstr-2b-reconciliation", changefreq: "weekly", priority: "0.8" },
    { path: "drc-01c-notice", changefreq: "weekly", priority: "0.8" },
    { path: "free-tools/itc-calculator", changefreq: "weekly", priority: "0.8" },
    { path: "free-tools/offline-reconciliation", changefreq: "weekly", priority: "0.9" },
    { path: "gst-due-date-calender", changefreq: "weekly", priority: "0.7" },
    { path: "gst-late-fee-calculator", changefreq: "weekly", priority: "0.7" },
    { path: "integrations/tally", changefreq: "weekly", priority: "0.7" },
    { path: "compare/cleartax-vs-taxsolver", changefreq: "weekly", priority: "0.8" },
    { path: "compare/expressgst-vs-taxsolver", changefreq: "weekly", priority: "0.8" },
    { path: "compare/ledgers-vs-taxsolver", changefreq: "weekly", priority: "0.8" },
    { path: "reports/gst-reconciliation-benchmark-2026", changefreq: "monthly", priority: "0.8" },
    { path: "login", changefreq: "monthly", priority: "0.5" },
    { path: "register", changefreq: "monthly", priority: "0.5" },
    { path: "contact-us", changefreq: "monthly", priority: "0.6" },
    { path: "about-us", changefreq: "monthly", priority: "0.6" },
  ];

  const today = new Date().toISOString().split("T")[0];

  const urlsXml = staticPages
    .map((page) => {
      const url = `https://taxsolver.in/${page.path}`.replace(/\/$/, ""); // avoid trailing slash on root
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
