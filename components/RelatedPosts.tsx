"use client";

import InteractiveCard from "@/components/InteractiveCard";

export interface RelatedPostItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  readingMinutes?: number;
}

export default function RelatedPosts({ posts }: { posts: RelatedPostItem[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title" className="related-posts">
      <h2
        id="related-posts-title"
        style={{ marginBottom: "1rem", fontSize: "2rem" }}
      >
        Related Articles
      </h2>
      <p style={{ marginBottom: "1.5rem" }}>
        You might also find these articles interesting:
      </p>
      <div className="article-grid">
        {posts.map((p, i) => (
          <div
            key={p.slug}
            className="fade-in-card"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <InteractiveCard
              slug={p.slug}
              title={p.title}
              description={p.description || p.excerpt || ""}
              readingTimeMinutes={p.readingMinutes}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .related-posts {
          margin-top: 2.5rem;
          padding: 1.5rem 2rem 0;
          border-top: 1px solid var(--border-color, #eaeaea);
          max-width: 800px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }
        .article-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .related-posts {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .article-grid {
            grid-template-columns: 1fr;
          }
        }
        .fade-in-card {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
