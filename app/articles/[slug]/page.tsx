import { notFound } from "next/navigation";
import BackToTopButton from "@/components/BackToTopButton";
import FavButton from "@/components/FavButton";
import React from "react";

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

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  let MDXComponent: React.ComponentType<any>;
  try {
    MDXComponent = (await import(`@/content/${slug}.mdx`)).default;
  } catch (err) {
    notFound();
  }

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
      </article>
      <FavButton articleSlug={slug} />
      <BackToTopButton />
    </>
  );
}
