import RSS from "rss";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingStats } from "@/utils/calculateReadingTime";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  topics: string[];
  content: string;
  image?: string;
  excerpt?: string;
  wordCount?: number;
  readingMinutes?: number;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const contentDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(contentDirectory);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map(async (filename) => {
        const filePath = path.join(contentDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Extract metadata using regex to find the export const metadata
        const metadataMatch = fileContent.match(
          /export const metadata = \{([\s\S]*?)\};/,
        );

        if (!metadataMatch) {
          return null;
        }

        // Parse the metadata object
        const metadataString = metadataMatch[1];
        const titleMatch = metadataString.match(/title:\s*(['"])([\s\S]*?)\1/);
        const descriptionMatch = metadataString.match(
          /description:\s*(['"])([\s\S]*?)\1/,
        );
        const topicsMatch = metadataString.match(/topics:\s*\[([\s\S]*?)\]/);

        const title = titleMatch ? titleMatch[2] : filename.replace(".mdx", "");
        const description = descriptionMatch ? descriptionMatch[2] : "";

        // Try to extract an optional image/thumbnail/cover from metadata
        const imageMatch = metadataString.match(
          /(image|thumbnail|cover)\s*:\s*(['"])([\s\S]*?)\2/,
        );

        let topics: string[] = [];
        if (topicsMatch) {
          topics = topicsMatch[1]
            .split(",")
            .map((t) => t.trim().replace(/["']/g, ""))
            .filter((t) => t.length > 0);
        }

        // Extract date and author from content
        const dateMatch = fileContent.match(/>\s*Date:\s*(\d{4}-\d{2}-\d{2})/);
        const authorMatch = fileContent.match(/###\s*Author:\s*([^\n]+)/);

        const date = dateMatch
          ? dateMatch[1]
          : new Date().toISOString().split("T")[0];
        const author = authorMatch ? authorMatch[1].trim() : "Son Nguyen";

        // Extract actual content (remove metadata and export statements)
        const contentStart = fileContent.indexOf("#");
        const actualContent =
          contentStart !== -1 ? fileContent.substring(contentStart) : "";

        // Derive a lightweight excerpt if no description is provided
        const excerptSource = description || actualContent;
        const excerpt = excerptSource
          .replace(/```[\s\S]*?```/g, "") // remove code blocks
          .replace(/\(.*?\)/g, "") // remove link URLs
          .replace(/[#*>`_\-\[\]]/g, "") // strip common MDX/MD syntax
          .replace(/\s+/g, " ")
          .trim();

        // Reading stats
        const reading = calculateReadingStats(actualContent);

        return {
          slug: filename.replace(".mdx", ""),
          title,
          description,
          date,
          author,
          topics,
          content: actualContent,
          image: imageMatch ? imageMatch[3] : undefined,
          excerpt,
          wordCount: reading.words,
          readingMinutes: reading.minutes,
        };
      }),
  );

  return posts
    .filter((post) => post !== null)
    .sort(
      (a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime(),
    ) as BlogPost[];
}

export async function generateRSSFeed(): Promise<string> {
  const posts = await getAllPosts();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://devverse-swe.vercel.app";

  const feed = new RSS({
    title: "DevVerse CS Blog",
    description:
      "A comprehensive blog covering Software Engineering, Web Development, AI, Machine Learning, and Computer Science topics",
    site_url: siteUrl,
    feed_url: `${siteUrl}/api/rss`,
    copyright: `${new Date().getFullYear()} Son Nguyen`,
    language: "en",
    pubDate: new Date().toISOString(),
    ttl: 60,
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
      media: "http://search.yahoo.com/mrss/",
    },
  });

  posts.forEach((post) => {
    const postUrl = `${siteUrl}/articles/${post.slug}`;

    // Convert MDX content to a readable format for RSS
    const cleanContent = post.content
      .replace(/import.*?from.*?;/g, "")
      .replace(/export.*?;/g, "")
      .replace(/```[\s\S]*?```/g, (match) => {
        // Preserve code blocks but remove syntax highlighting
        return match.replace(/```\w+/, "```");
      })
      .substring(0, 5000); // Limit content length for RSS

    feed.item({
      title: post.title,
      description: post.description,
      url: postUrl,
      guid: postUrl,
      categories: post.topics,
      author: post.author,
      date: new Date(post.date),
      custom_elements: [{ "content:encoded": { _cdata: cleanContent } }],
    });
  });

  return feed.xml({ indent: true });
}

export async function generateAtomFeed(): Promise<string> {
  const posts = await getAllPosts();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://devverse-swe.vercel.app";

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>DevVerse CS Blog</title>
  <subtitle>A comprehensive blog covering Software Engineering, Web Development, AI, Machine Learning, and Computer Science topics</subtitle>
  <link href="${siteUrl}/api/atom" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}" rel="alternate" type="text/html"/>
  <id>${siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Son Nguyen</name>
  </author>
  <rights>${new Date().getFullYear()} Son Nguyen</rights>
  ${posts
    .map((post) => {
      const postUrl = `${siteUrl}/articles/${post.slug}`;
      const cleanContent = post.content
        .replace(/import.*?from.*?;/g, "")
        .replace(/export.*?;/g, "")
        .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w+/, "```"))
        .substring(0, 5000);

      return `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <author>
      <name>${escapeXml(post.author)}</name>
    </author>
    <summary type="text">${escapeXml(post.description)}</summary>
    <content type="html">${escapeXml(cleanContent)}</content>
    ${post.topics.map((topic) => `<category term="${escapeXml(topic)}"/>`).join("\n    ")}
  </entry>`;
    })
    .join("")}
</feed>`;

  return atomFeed;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getPostsByTopic(topic: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) =>
    p.topics.map((t) => t.toLowerCase()).includes(topic.toLowerCase()),
  );
}

export async function getPostsByAuthor(author: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.author.toLowerCase() === author.toLowerCase());
}

export async function getRelatedPosts(
  slug: string,
  limit = 4,
  minCount = 2,
): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  const others = posts.filter((p) => p.slug !== slug);
  if (others.length === 0) return [];

  const currentTopics = new Set(current.topics.map((t) => t.toLowerCase()));

  const withScores = others.map((p) => {
    const candidateTopics = new Set(p.topics.map((t) => t.toLowerCase()));
    let shared = 0;
    currentTopics.forEach((t) => {
      if (candidateTopics.has(t)) shared += 1;
    });
    const score =
      shared * 2 +
      (p.author.toLowerCase() === current.author.toLowerCase() ? 1 : 0);
    return { post: p, score };
  });

  let ranked = withScores
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map((x) => x.post)
    .filter((p) => p.slug !== slug);

  // If not enough strong matches, top up with recents (fallback)
  if (ranked.length < minCount) {
    const recents = others
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((p) => !ranked.some((r) => r.slug === p.slug));
    ranked = [...ranked, ...recents];
  }

  return ranked.slice(0, Math.max(minCount, Math.min(limit, ranked.length)));
}
