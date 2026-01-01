import HomePageContent from "@/components/HomePageContent";
import BackToTopButton from "@/components/BackToTopButton";
import { getAllPosts } from "@/lib/rss";

export const revalidate = 60; // Enable ISR: regenerate this page every 60 seconds

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
  readingMinutes?: number;
  excerpt?: string;
}

/**
 * Homepage, enhanced with SSG to fetch articles at build time. Helps with SEO.
 */
async function getArticles(): Promise<Article[]> {
  const posts = await getAllPosts();
  const articles = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    topics: p.topics,
    readingMinutes: p.readingMinutes,
    excerpt: p.excerpt,
  }));
  // Sort alphabetically by title (case-insensitive)
  articles.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: "base",
      numeric: true,
    }),
  );
  return articles;
}

export default async function HomePage() {
  // Fetch articles at build time (or during revalidation)
  const articles = await getArticles();

  return (
    <>
      <HomePageContent articles={articles} />
      <BackToTopButton />
    </>
  );
}
