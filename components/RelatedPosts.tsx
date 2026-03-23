"use client";

import { useState } from "react";
import InteractiveCard from "@/components/InteractiveCard";
import { FiBookOpen } from "react-icons/fi";

export interface RelatedPostItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  topics?: string[];
  readingMinutes?: number;
  viewCount?: number;
}

const PAGE_SIZE = 4;

export default function RelatedPosts({ posts }: { posts: RelatedPostItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  if (!posts || posts.length === 0) return null;

  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <section aria-labelledby="related-posts-title" className="related-posts">
      <div className="related-header">
        <div className="related-icon">
          <FiBookOpen size={20} />
        </div>
        <div>
          <h2 id="related-posts-title" className="related-title">
            Related Articles
          </h2>
          <p className="related-subtitle">
            You might also find these articles interesting
          </p>
        </div>
      </div>

      <div className="article-grid">
        {visible.map((p, i) => (
          <div
            key={p.slug}
            className="fade-in-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <InteractiveCard
              slug={p.slug}
              title={p.title}
              description={p.description || p.excerpt || ""}
              topics={p.topics}
              readingTimeMinutes={p.readingMinutes}
              viewCount={p.viewCount}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            type="button"
            className="load-more-btn"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Show more related articles <span className="arrow">↓</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .related-posts {
          margin-top: 2.5rem;
          padding: 1.5rem 2rem 1rem;
          border-top: 1px solid var(--border-color);
          max-width: 800px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }

        .related-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .related-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          flex-shrink: 0;
        }

        :global(.dark) .related-icon {
          background: rgba(129, 140, 248, 0.15);
          color: #818cf8;
        }

        .related-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 750;
          color: var(--text-color);
        }

        .related-subtitle {
          margin: 0.15rem 0 0;
          font-size: 0.88rem;
          color: var(--text-color);
          opacity: 0.55;
        }

        .article-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 640px) {
          .related-posts {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .article-grid {
            grid-template-columns: 1fr;
          }
        }

        .fade-in-card {
          opacity: 0;
          animation: fadeIn 0.4s ease forwards;
          height: 100%;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .load-more-btn {
          padding: 0.65rem 1.4rem;
          border-radius: 999px;
          border: 1px solid var(--link-color);
          background-color: var(--link-color);
          color: #fff;
          font-size: 0.92rem;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
          background-color: var(--hover-link-color);
        }

        .arrow {
          display: inline-block;
          animation: bounce 0.5s infinite alternate;
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(3px);
          }
        }
      `}</style>
    </section>
  );
}
