import fs from "fs/promises";
import path from "path";
import HomePageContent from "@/components/HomePageContent";
import BackToTopButton from "@/components/BackToTopButton";

export const revalidate = 60; // Enable ISR: regenerate this page every 60 seconds

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

/**
 * Homepage, enhanced with SSG to fetch articles at build time. Helps with SEO.
 */
async function getArticles(): Promise<Article[]> {
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);

  const articles: Article[] = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        try {
          const module = await import(`@/content/${slug}.mdx`);
          const metadata = module.metadata || {};
          return {
            slug,
            title: metadata.title || slug,
            description: metadata.description || "",
            topics: Array.isArray(metadata.topics) ? metadata.topics : [],
          };
        } catch (err) {
          return { slug, title: slug, description: "", topics: [] };
        }
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
