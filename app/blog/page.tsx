import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogs, BlogPost } from "@/lib/blog";
import { Calendar, User, Clock, Eye, ChevronRight, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "GST Reconciliation & Tax Compliance Blog | TaxSolver",
  description: "Read expert guides, tax compliance insights, and industry updates on GSTR-2B reconciliation, input tax credit optimization, and CGST rules. Stay compliant with TaxSolver.",
  keywords: ["GST reconciliation blog", "GSTR-2B guides", "ITC compliance articles", "TaxSolver resources", "CA tax software news"],
  alternates: {
    canonical: "https://taxsolver.in/blog",
  },
  openGraph: {
    title: "GST Reconciliation & Tax Compliance Blog | TaxSolver",
    description: "Read expert guides, tax compliance insights, and industry updates on GSTR-2B reconciliation, input tax credit optimization, and CGST rules. Stay compliant with TaxSolver.",
    type: "website",
    url: "https://taxsolver.in/blog",
  }
};

export default async function BlogListingPage() {
  const posts = await getPublishedBlogs();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Blog Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card/30 to-background border-b border-border/50 py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-4">
            <FileText className="h-3.5 w-3.5" />
            Knowledge Hub & Resources
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground">
            TaxSolver Compliance Blog
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with expert tax analysis, CGST rule changes, GSTR-2B reconciliation best practices, 
            and walkthroughs on preventing Input Tax Credit (ITC) tax leakage.
          </p>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BlogPost) => (
              <article 
                key={post.id} 
                className="group flex flex-col bg-card border border-border/80 hover:border-primary/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                
                {/* Card Image / Placeholder */}
                <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-video">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.featuredImageAlt || post.title} 
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-indigo-950/60 flex items-center justify-center relative border-b border-border/30">
                      <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground/60">
                        {post.category || "TaxSolver"}
                      </span>
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs border border-border/50 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded text-foreground">
                      {post.category}
                    </span>
                  )}
                </Link>

                {/* Card Content */}
                <div className="flex-1 p-6 flex flex-col text-left">
                  
                  {/* Meta stats */}
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishDate}
                    </span>
                    {post.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto">
                      <Eye className="h-3 w-3" />
                      {post.views || 0} views
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h2 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Footer Author & CTA */}
                  <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground">
                        {post.author}
                      </span>
                    </div>

                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-primary hover:gap-1.5 transition-all"
                    >
                      Read Post
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </div>

              </article>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-card/40 rounded-2xl p-16 text-center shadow-xs max-w-xl mx-auto">
            <FileText className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">No Articles Published</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Our tax consultants and CA writers are currently drafting compliance articles. Check back shortly!
            </p>
            <Link 
              href="/" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

      </section>

      {/* CTA Conversion Banner */}
      <section className="bg-card border-t border-border/60 py-16 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_right_top,rgba(59,130,246,0.05),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Ready to automate your GSTR-2B reconciliation?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              TaxSolver identifies vendor filing mismatches, fuzzy invoice patterns, and helps you claim 100% correct Input Tax Credit (ITC) in under 15 seconds.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all flex-1 md:flex-initial"
            >
              Get Free Trial
            </Link>
            <Link
              href="/free-tools/offline-reconciliation"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-5 text-xs font-semibold transition-all flex-1 md:flex-initial"
            >
              Try Offline Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Schema List */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "TaxSolver Compliance Blog",
            "description": "Expert guides, tax compliance insights, and industry updates on GSTR-2B reconciliation and GST rules.",
            "publisher": {
              "@type": "Organization",
              "name": "TaxSolver",
              "logo": {
                "@type": "ImageObject",
                "url": "https://taxsolver.in/logo.png"
              }
            },
            "blogPost": posts.map((post) => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "alternativeHeadline": post.seoTitle || "",
              "image": post.featuredImage || "",
              "genre": post.category || "Tax",
              "keywords": post.tags || "",
              "wordcount": post.wordCount || 0,
              "publisher": "TaxSolver",
              "url": `https://taxsolver.in/blog/${post.slug}`,
              "datePublished": post.publishDate,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "description": post.excerpt
            }))
          })
        }}
      />

    </div>
  );
}
