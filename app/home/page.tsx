import HomePageContent from "@/components/HomePageContent";
import BackToTopButton from "@/components/BackToTopButton";
import { getAllPosts } from "@/lib/rss";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // Enable ISR: regenerate this page every 60 seconds

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
  readingMinutes?: number;
  excerpt?: string;
}

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
  articles.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: "base",
      numeric: true,
    }),
  );
  return articles;
}

async function getViewCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("article_views")
      .select("slug, view_count");
    const map: Record<string, number> = {};
    if (data) {
      for (const row of data) {
        map[row.slug] = row.view_count;
      }
    }
    return map;
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [articles, viewCounts] = await Promise.all([
    getArticles(),
    getViewCounts(),
  ]);

  return (
    <>
      <HomePageContent articles={articles} viewCounts={viewCounts} />
      <BackToTopButton />
    </>
  );
}
