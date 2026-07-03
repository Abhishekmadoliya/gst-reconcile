import { collection, query, where, getDocs, limit, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  tags?: string;
  status: string;
  publishDate: string;
  author: string;
  views: number;
  readingTime?: number;
  wordCount?: number;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  faqs?: BlogFAQ[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  tableOfContentsToggle?: boolean;
  breadcrumbToggle?: boolean;
  socialShareToggle?: boolean;
  articleSchema?: string;
}

/**
 * Fetch all published blogs, ordered by publishDate descending
 */
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, "blogs"),
      where("status", "==", "Published")
    );
    
    const querySnapshot = await getDocs(q);
    const blogs: BlogPost[] = [];
    querySnapshot.forEach((doc: any) => {
      blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
    });

    // Sort in-memory by publishDate descending to avoid requiring a composite index
    blogs.sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime() || 0;
      const dateB = new Date(b.publishDate).getTime() || 0;
      return dateB - dateA;
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching published blogs from Firestore:", error);
    return [];
  }
}

/**
 * Fetch a single blog by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(
      collection(db, "blogs"),
      where("slug", "==", slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0]!;
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog by slug "${slug}" from Firestore:`, error);
    return null;
  }
}

/**
 * Increment the views counter for a blog post
 */
export async function incrementBlogViews(postId: string): Promise<void> {
  try {
    const postRef = doc(db, "blogs", postId);
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error(`Error incrementing views for post "${postId}":`, error);
  }
}
