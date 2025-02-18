import { notFound } from "next/navigation";

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

export default async function TopicPage({
  params,
}: {
  params: { slug: string };
}) {
  // Await params before destructuring to satisfy Next.js requirements.
  const { slug } = await Promise.resolve(params);
  let MDXComponent: React.ComponentType<any>;
  try {
    MDXComponent = (await import(`@/content/${slug}.mdx`)).default;
  } catch (err) {
    notFound();
  }

  return (
    <article
      style={{
        padding: "2rem 0",
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <MDXComponent />
    </article>
  );
}
