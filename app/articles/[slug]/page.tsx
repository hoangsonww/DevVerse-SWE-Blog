import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";
import TopicsList from "@/components/TopicsList";

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

  return (
    <>
      <article className="fade-down-article">
        <MDXComponent />
        <TopicsList topics={topics} />
      </article>
      <FavButton articleSlug={slug} />
      <BackToTopButton />

      <style jsx>{`
        .fade-down-article {
          padding: 2rem 0;
          background-color: var(--background-color);
          color: var(--text-color);
          animation: fadeDown 0.6s ease-out;
          transition:
            background-color 0.3s ease,
            color 0.3s ease;
          z-index: 1;
        }

        @keyframes fadeDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
