import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";
import TopicsList from "@/components/TopicsList";
import { motion } from "framer-motion";

interface Params {
  slug: string;
}

interface PageProps {
  params: Promise<Params>;
}

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

  console.log(topics);

  return (
    <>
      <article
        className="animate-fade-down"
        style={{
          padding: "2rem 0",
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
          transition: "background-color 0.3s ease, color 0.3s ease",
          zIndex: 1,
        }}
      >
        <MDXComponent />
        <TopicsList topics={topics} />
      </article>
      <FavButton articleSlug={slug} />
      <BackToTopButton />
    </>
  );
}
