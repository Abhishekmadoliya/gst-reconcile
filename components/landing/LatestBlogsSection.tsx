import Link from "next/link";
import { getPublishedBlogs, BlogPost } from "@/lib/blog";
import { Calendar, Clock, ChevronRight, FileText, ArrowRight } from "lucide-react";

export default async function LatestBlogsSection() {
  const allPosts = await getPublishedBlogs();
  const posts = allPosts.slice(0, 3);

  // If no blog posts exist, do not render this section on the homepage
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 border-t border-border/50 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_right_bottom,rgba(120,119,198,0.03),transparent)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
              <FileText className="h-3 w-3" />
              Tax Insights & Guides
            </div>
            <h3 className="text-2xl md:text-4xl font-black font-sans tracking-tight mb-2">
              Latest from the Compliance Hub
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
              Stay ahead of recent CGST notifications, GSTR-2B filing rules, and expert tips on avoiding ITC tax mismatches.
            </p>
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all self-start md:self-auto uppercase tracking-wider"
          >
            Explore all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <article 
              key={post.id} 
              className="group flex flex-col bg-background border border-border/80 hover:border-primary/20 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Featured Image / Placeholder */}
              <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-video">
                {post.featuredImage ? (
                  <img 
                    src={post.featuredImage} 
                    alt={post.featuredImageAlt || post.title} 
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-indigo-950/60 flex items-center justify-center relative border-b border-border/30">
                    <span className="text-[9px] tracking-wider uppercase font-bold text-muted-foreground/60">
                      {post.category || "TaxSolver"}
                    </span>
                  </div>
                )}
                {post.category && (
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs border border-border/50 text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded text-foreground">
                    {post.category}
                  </span>
                )}
              </Link>

              {/* Card Body */}
              <div className="flex-1 p-5 flex flex-col">
                {/* Meta Row */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold mb-3">
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
                </div>

                {/* Title */}
                <h4 className="text-base font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>

                {/* Excerpt */}
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* Read Link */}
                <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-foreground">
                    By {post.author}
                  </span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-primary hover:gap-1.5 transition-all"
                  >
                    Read Article
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
