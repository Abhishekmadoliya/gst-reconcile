import type { Metadata } from "next";
import Link from "next/link";
import { getBlogBySlug, incrementBlogViews } from "@/lib/blog";
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  Wrench,
  FileSpreadsheet,
  Calculator,
  Scale,
  Sparkles
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate SEO Metadata on the server
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | TaxSolver",
    };
  }

  const title = post.seoTitle || `${post.title} | TaxSolver Blog`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: post.canonicalUrl || `https://taxsolver.in/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://taxsolver.in/blog/${post.slug}`,
      publishedTime: post.publishDate,
      authors: [post.author],
      images: post.ogImage 
        ? [{ url: post.ogImage, alt: post.title }] 
        : (post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : []),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.ogImage ? [post.ogImage] : (post.featuredImage ? [post.featuredImage] : []),
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center py-20 px-4">
        <div className="max-w-md w-full border border-border bg-card p-8 rounded-xl text-center shadow-md">
          <h2 className="text-xl font-bold mb-2">Audit Unsuccessful</h2>
          <p className="text-xs text-muted-foreground mb-6">
            We searched the Firestore database, but couldn't locate any blog post matching the slug &quot;{slug}&quot;.
          </p>
          <Link 
            href="/blog"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Increment view counter in background on the server
  await incrementBlogViews(post.id);

  // Dynamic Table of Contents generation by parsing H2 tags in Server Component
  const h2Regex = /<h2>(.*?)<\/h2>/g;
  const headings: { text: string; id: string }[] = [];
  let match;
  let contentWithIds = post.content;
  let idx = 0;

  // Find all H2 text and inject unique IDs for anchors
  while ((match = h2Regex.exec(post.content)) !== null) {
    const rawText = match[1] || "";
    // Strip HTML tags inside H2 if any
    const text = rawText.replace(/<[^>]*>/g, "");
    const id = `section-${idx}`;
    contentWithIds = contentWithIds.replace(`<h2>${rawText}</h2>`, `<h2 id="${id}">${rawText}</h2>`);
    headings.push({ text, id });
    idx++;
  }

  // Build Social Share URL strings (Safe static server-rendered hrefs)
  const postUrl = encodeURIComponent(`https://taxsolver.in/blog/${post.slug}`);
  const postTitle = encodeURIComponent(post.title);
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Blog Article Wrap */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        
        {/* Breadcrumb Navigation */}
        {post.breadcrumbToggle !== false && (
          <nav className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-muted-foreground/60">{post.category}</span>
              </>
            )}
          </nav>
        )}

        {/* Back Link */}
        <div className="mb-6 text-left">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog listing
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-3xl text-left mb-8">
          {post.category && (
            <span className="inline-block bg-primary/5 border border-primary/20 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded text-primary mb-3">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black font-sans tracking-tight leading-tight mb-4 text-foreground">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-muted-foreground font-semibold pt-2 border-t border-border/40">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-muted-foreground/80" />
              By <strong className="text-foreground">{post.author}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishDate}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="h-3.5 w-3.5" />
              {post.views || 0} views
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video max-w-5xl rounded-xl overflow-hidden border border-border/60 mb-12 shadow-sm">
            <img 
              src={post.featuredImage} 
              alt={post.featuredImageAlt || post.title} 
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Main Content Layout Grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
          
          {/* Main Article Body */}
          <div className="min-w-0">
            <div 
              className="blog-content prose dark:prose-invert max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* Custom CTA Box */}
            {post.ctaTitle && (
              <div className="mt-12 p-6 md:p-8 rounded-xl border border-primary/20 bg-card/60 relative overflow-hidden text-left shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_250px_at_right_bottom,rgba(16,185,129,0.05),transparent)]"></div>
                <div className="relative max-w-xl">
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-primary mb-2">
                    <Bookmark className="h-3 w-3" />
                    Special Resource
                  </span>
                  <h4 className="text-lg md:text-xl font-bold mb-2">{post.ctaTitle}</h4>
                  <p className="text-xs text-muted-foreground leading-normal mb-6">
                    {post.ctaDescription}
                  </p>
                  <a 
                    href={post.ctaButtonLink || "/register"}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
                  >
                    {post.ctaButtonText || "Get Started"}
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                  </a>
                </div>
              </div>
            )}

                        {/* E-E-A-T Author Trust Box */}
            <div className="mt-12 p-6 rounded-xl border border-border bg-card/40 flex items-start gap-4 text-left shadow-xs">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {post.author ? post.author.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">Written by {post.author}</h4>
                  <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">Tax Verified</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Published by the TaxSolver editorial and compliance research group. All guidelines and tax calculations are reviewed against CBIC statutory notifications and CGST Act rules.
                </p>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-16 border-t border-border/60 pt-12 text-left">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {post.faqs.map((faq, index) => (
                    <div key={`faq-${index}`} className="border border-border/80 bg-card/30 rounded-lg p-5 shadow-sm">
                      <h5 className="text-xs uppercase font-extrabold text-foreground mb-2 flex gap-1.5">
                        <span>Q:</span>
                        <span>{faq.question}</span>
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-4 border-l border-border">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar (Table of Contents & Social Share) */}
          <aside className="sticky top-24 space-y-8 hidden lg:block text-left">
            
            {/* Table of Contents */}
            {post.tableOfContentsToggle !== false && headings.length > 0 && (
              <div className="border border-border/80 bg-card/30 rounded-xl p-5 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground border-b border-border/40 pb-2 mb-4">
                  Table of Contents
                </h4>
                <nav className="space-y-2">
                  {headings.map((heading) => (
                    <a 
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="block text-[11px] text-muted-foreground hover:text-primary leading-normal hover:translate-x-0.5 transition-all"
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Social Sharing */}
            {post.socialShareToggle !== false && (
              <div className="border border-border/80 bg-card/30 rounded-xl p-5 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground border-b border-border/40 pb-2 mb-4 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5" />
                  Share This Article
                </h4>
                <div className="flex gap-2">
                  <a 
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center p-2 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Share on X / Twitter"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a 
                    href={linkedinShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center p-2 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Share on LinkedIn"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a 
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center p-2 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Share on WhatsApp"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Free GST Compliance Tools Sidebar Widget */}
            <div className="border border-border/80 bg-card/40 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">
                  Free GST Compliance Tools
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <Link
                  href="/free-tools/offline-reconciliation"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/70 text-foreground transition-colors group"
                >
                  <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-xs group-hover:text-primary">Offline 2B Matcher</p>
                    <p className="text-[10px] text-muted-foreground">100% private in-browser</p>
                  </div>
                </Link>

                <Link
                  href="/free-tools/itc-calculator"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/70 text-foreground transition-colors group"
                >
                  <Calculator className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs group-hover:text-primary">ITC Mismatch Calc</p>
                    <p className="text-[10px] text-muted-foreground">Rule 88D penalty diagnostic</p>
                  </div>
                </Link>

                <Link
                  href="/gst-late-fee-calculator"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/70 text-foreground transition-colors group"
                >
                  <Scale className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs group-hover:text-primary">Late Fee Calculator</p>
                    <p className="text-[10px] text-muted-foreground">CGST/SGST & 18% interest</p>
                  </div>
                </Link>

                <Link
                  href="/drc-01c-notice"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/70 text-foreground transition-colors group"
                >
                  <Wrench className="h-4 w-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs group-hover:text-primary">DRC-01C Reply Guide</p>
                    <p className="text-[10px] text-muted-foreground">7-day statutory workflow</p>
                  </div>
                </Link>
              </div>

              <div className="pt-2 border-t border-border/40">
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </aside>

        </div>

      </article>

      {/* Schema Block Injection */}
      {post.articleSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.articleSchema }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://taxsolver.in/blog/${post.slug}`
              },
              "headline": post.title,
              "alternativeHeadline": post.seoTitle || "",
              "image": post.featuredImage || "",
              "genre": post.category || "Taxation",
              "keywords": post.tags || "",
              "wordcount": post.wordCount || 0,
              "publisher": {
                "@type": "Organization",
                "name": "TaxSolver",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://taxsolver.in/logo.png"
                }
              },
              "url": `https://taxsolver.in/blog/${post.slug}`,
              "datePublished": post.publishDate,
              "author": {
                "@type": "Person",
                "name": post.author,
                "jobTitle": "GST Compliance & Tax Technology Specialist",
                "worksFor": {
                  "@type": "Organization",
                  "name": "TaxSolver",
                  "url": "https://taxsolver.in"
                }
              },
              "description": post.excerpt
            })
          }}
        />
      )}

      {/* FAQ Schema Block (if FAQs exist) */}
      {post.faqs && post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": post.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      )}

    </div>
  );
}
