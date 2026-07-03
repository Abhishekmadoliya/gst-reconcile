# Blog Integration Guide (Developer Setup)

This guide documents how to retrieve and render blogs from the CMS database into the main **TaxSolver** user-facing website.

---

## 1. Credentials & Configuration

To connect to the database, you will need the Firestore API credentials. Add the following keys to your project's `.env` configuration file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### Firebase Initialization Code
Initialize the database instance in your website source code:

```javascript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## 2. Firestore Schema & Fields

All blogs are stored in the **`blogs`** collection.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Document ID |
| `title` | `string` | Blog title |
| `slug` | `string` | URL slug identifier (e.g. `tax-saving-tips-2026`) |
| `excerpt` | `string` | Short preview summary of the post |
| `content` | `string` | **HTML content** (Rich text markup produced by Tiptap) |
| `featuredImage` | `string` | Secure Cloudinary URL for the main image header |
| `featuredImageAlt` | `string` | Alt text description for accessibility |
| `category` | `string` | Main category category name (e.g., "Taxes", "GST") |
| `tags` | `string` | Comma-separated tag list (e.g. `tax, saving, 2026`) |
| `status` | `string` | Publication state (`"Published"`, `"Draft"`, or `"In Review"`) |
| `publishDate` | `string` | Date string (e.g., `Jul 2, 2026`) |
| `author` | `string` | Author name |
| `views` | `number` | Total page views counter |
| `readingTime` | `number` | Estimated read time in minutes |
| `wordCount` | `number` | Post word count |
| `seoTitle` | `string` | Custom HTML `<title>` tag content |
| `metaDescription`| `string` | Description content for the search snippet meta |
| `focusKeyword` | `string` | Primary SEO focus target |
| `canonicalUrl` | `string` | Custom canonical URL for SEO indexing |
| `ogImage` | `string` | Open Graph image URL |
| `faqs` | `Array` | FAQ structure: `[{ question: string, answer: string }]` |
| `ctaTitle` | `string` | Custom call-to-action title |
| `ctaDescription`| `string` | Call-to-action description text |
| `ctaButtonText` | `string` | Text for the call-to-action button |
| `ctaButtonLink` | `string` | URL link for the call-to-action button |
| `tableOfContentsToggle` | `boolean` | Flag indicating if a Table of Contents is requested |
| `breadcrumbToggle` | `boolean` | Flag indicating if Breadcrumbs are requested |
| `socialShareToggle` | `boolean` | Flag indicating if Social Sharing buttons are requested |
| `articleSchema` | `string` | JSON string of structured `BlogPosting` Schema markup |

---

## 3. Data Retrieval Snippets

### A. Fetching All Published Blogs
Use a Firestore query to fetch only published posts:

```javascript
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./firebase"; // path to your config

export async function getPublishedBlogs() {
  const q = query(
    collection(db, "blogs"),
    where("status", "==", "Published"),
    orderBy("publishDate", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const blogs = [];
  querySnapshot.forEach((doc) => {
    blogs.push({ id: doc.id, ...doc.data() });
  });
  return blogs;
}
```

### B. Fetching a Single Blog by Slug
Retrieve a single document matches the URL slug:

```javascript
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "./firebase";

export async function getBlogBySlug(slug) {
  const q = query(
    collection(db, "blogs"),
    where("slug", "==", slug),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null; // Not found
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}
```

---

## 4. Rendering Tiptap HTML Content

The `content` field contains standard HTML elements (including tables, highlights, custom headers, and lists).

### Safe HTML Injection in React
Inject the HTML string safely inside your page component:

```jsx
export default function BlogPostPage({ post }) {
  if (!post) return <p>Post not found</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-xs text-gray-500 mb-6">By {post.author} • {post.publishDate}</p>

      {/* Render HTML content */}
      <div 
        className="blog-content prose dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}
```

### Styling the HTML
If you are using **Tailwind CSS**, install the `@tailwindcss/typography` plugin:

```bash
npm install -D @tailwindcss/typography
```

Then add it to your `tailwind.config.js`:

```javascript
plugins: [
  require('@tailwindcss/typography'),
]
```

Using the `prose` class will style standard headings, paragraphs, lists, and quotes automatically.

#### Special CSS Overrides
Ensure these specific styles are added to your CSS sheet to match Tiptap formatting:

```css
/* Link Styles */
.blog-content a {
  color: #3b82f6;
  text-decoration: underline;
}

/* Highlight Styles */
.blog-content mark {
  background-color: rgba(250, 204, 21, 0.3);
  border-radius: 2px;
  padding: 0.1rem 0.2rem;
  color: inherit;
}

/* Table Styles */
.blog-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
}
.blog-content td,
.blog-content th {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
}
.blog-content th {
  background-color: #f7fafc;
  font-weight: bold;
}
```

---

## 5. Analytics View Increments

To feed reader analytics back into the CMS Dashboard, **always increment the post view count** in Firestore when a user opens the blog page:

```javascript
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export async function incrementBlogViews(postId) {
  const postRef = doc(db, "blogs", postId);
  await updateDoc(postRef, {
    views: increment(1)
  });
}
```
Trigger this method inside your page view hook (e.g., React `useEffect` or Next.js `getServerSideProps` / API route) on page load.
