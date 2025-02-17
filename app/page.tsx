import fs from 'fs';
import path from 'path';
import HomePageContent from '@/components/HomePageContent';

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

async function getArticles(): Promise<Article[]> {
  const contentDir = path.join(process.cwd(), 'content');
  const files = await fs.promises.readdir(contentDir);
  const articles: Article[] = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        try {
          const module = await import(`../content/${fileName}`);
          const metadata = module.metadata || {};
          return {
            slug,
            title: metadata.title || slug,
            description: metadata.description || '',
            topics: Array.isArray(metadata.topics) ? metadata.topics : []
          };
        } catch (err) {
          return { slug, title: slug, description: '', topics: [] };
        }
      })
  );
  return articles;
}

export default async function HomePage() {
  const articles = await getArticles();

  // Pass the articles to a client component that handles animations.
  return <HomePageContent articles={articles} />;
}
