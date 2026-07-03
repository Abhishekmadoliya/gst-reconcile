import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getPublishedBlogs();
    
    // Map posts to sitemap URL entries
    const urlsXml = posts
      .map((post) => {
        let lastmod = new Date().toISOString().split("T")[0];
        try {
          if (post.publishDate) {
            lastmod = new Date(post.publishDate).toISOString().split("T")[0];
          }
        } catch (_) {
          // Fallback to today if parsing fails
        }

        return `
  <url>
    <loc>https://taxsolver.in/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://taxsolver.in/blog</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urlsXml}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=18000",
      },
    });
  } catch (error) {
    console.error("Error generating blogs.xml sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
