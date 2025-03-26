import fs from "fs/promises";
import path from "path";

export interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

/**
 * Get all articles from the content directory
 */
export async function getArticles(): Promise<Article[]> {
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
