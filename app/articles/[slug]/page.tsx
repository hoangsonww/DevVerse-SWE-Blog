import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";
import TopicsList from "@/components/TopicsList";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import ArticleVisitTracker from "@/components/ArticleVisitTracker";
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
  let title = slug;

  try {
    const mod = await import(`@/content/${slug}.mdx`);
    MDXComponent = mod.default;
    topics = mod.metadata?.topics ?? [];
    title = mod.metadata?.title ?? slug;
    const all = await getAllPosts();
    const me = all.find((p) => p.slug === slug);
    readingMinutes = me?.readingMinutes;
    related = await getRelatedPosts(slug, 4, 2);
  } catch {
    notFound();
  }

  const readingLabel =
    typeof readingMinutes === "number" && readingMinutes > 0
      ? formatReadingLabel(readingMinutes)
      : undefined;

  return (
    <>
      <article
        className="fade-down-article"
        style={
          readingLabel
            ? ({
                ["--reading-time" as any]: `"${readingLabel}"`,
              } as React.CSSProperties)
            : undefined
        }
      >
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
      <BackToTopButton placement="toc" showWhenNavbarHidden />
      <TableOfContents />
      <FavButton articleSlug={slug} />
      <ArticleVisitTracker slug={slug} title={title} topics={topics} />
    </>
  );
}
