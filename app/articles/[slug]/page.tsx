import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";
import TopicsList from "@/components/TopicsList";
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

  try {
    const mod = await import(`@/content/${slug}.mdx`);
    MDXComponent = mod.default;
    topics = mod.metadata?.topics ?? [];
  } catch {
    notFound();
  }

  return (
    <>
      <article className="fade-down-article">
        <MDXComponent style={{ minWidth: "100%" }} />
        <TopicsList topics={topics} />
      </article>
      <FavButton articleSlug={slug} />
      <BackToTopButton />
    </>
  );
}
