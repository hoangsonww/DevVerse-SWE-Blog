import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";
import TopicsList from "@/components/TopicsList";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import { getRelatedPosts, getAllPosts } from "@/lib/rss";
import { formatReadingLabel } from "@/utils/calculateReadingTime";
import "./article.css";

interface Params {
  slug: string;
}

interface PageProps {
  params: Promise<Params>;
}

/**
 * Generate static paths for all articles in the content directory.
 * Enables static site generation (SSG) for this page. Helps with SEO.
 */
export async function generateStaticParams() {
  const fs = await import("fs/promises");
  const path = await import("path");
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);
  return files
    .filter((file: string) => file.endsWith(".mdx"))
    .map((file: string) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  let MDXComponent: React.ComponentType<any>;
  let topics: string[] = [];
  let related: Awaited<ReturnType<typeof getRelatedPosts>> = [];
  let readingMinutes: number | undefined = undefined;

  try {
    const mod = await import(`@/content/${slug}.mdx`);
    MDXComponent = mod.default;
    topics = mod.metadata?.topics ?? [];
    const all = await getAllPosts();
    const me = all.find((p) => p.slug === slug);
    readingMinutes = me?.readingMinutes;
    related = await getRelatedPosts(slug, 4, 2);
  } catch {
    notFound();
  }

  return (
    <>
      <article className="fade-down-article">
        {typeof readingMinutes === "number" && readingMinutes > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "0.5rem",
              margin: "0 0 1rem 0",
              color: "var(--text-color)",
              opacity: 0.85,
              fontSize: "0.95rem",
            }}
          >
            <span>{formatReadingLabel(readingMinutes)}</span>
          </div>
        ) : null}
        <MDXComponent style={{ minWidth: "100%" }} />
        <TopicsList topics={topics} />
        {related.length > 0 ? (
          <RelatedPosts
            posts={related.map((p) => ({
              slug: p.slug,
              title: p.title,
              description: p.description,
              excerpt: p.excerpt,
              readingMinutes: p.readingMinutes,
            }))}
          />
        ) : null}
      </article>
      <TableOfContents />
      <FavButton articleSlug={slug} />
      <BackToTopButton />
    </>
  );
}
