import { getAllPosts } from "@/lib/rss";

export async function generateJSONFeed(): Promise<string> {
  const posts = await getAllPosts();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://devverse-swe.vercel.app";

  const items = posts.map((post) => {
    const postUrl = `${siteUrl}/articles/${post.slug}`;
    const cleanContent = post.content
      .replace(/import.*?from.*?;/g, "")
      .replace(/export.*?;/g, "")
      .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w+/, "```"))
      .substring(0, 5000);

    return {
      id: postUrl,
      url: postUrl,
      title: post.title,
      content_text: cleanContent,
      summary: post.description,
      date_published: new Date(post.date).toISOString(),
      authors: [{ name: post.author }],
      tags: post.topics,
    } as const;
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "DevVerse CS Blog",
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description:
      "A comprehensive blog covering Software Engineering, Web Development, AI, Machine Learning, and Computer Science topics",
    language: "en",
    authors: [{ name: "Son Nguyen" }],
    items,
  };

  return JSON.stringify(feed, null, 2);
}

