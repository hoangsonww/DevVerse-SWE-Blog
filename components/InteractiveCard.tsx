"use client";

import React from "react";
import Link from "next/link";
import { FiFileText } from "react-icons/fi";
import { formatReadingLabel } from "@/utils/calculateReadingTime";

interface CardProps {
  slug: string;
  title: string;
  description?: string;
  readingTimeMinutes?: number;
}

export default function InteractiveCard({
  slug,
  title,
  description,
  readingTimeMinutes,
}: CardProps) {
  return (
    <Link href={`/articles/${slug}`} className="interactive-card-link">
      <div className="interactive-card">
        <div className="interactive-card-header">
          <div className="interactive-card-icon">
            <FiFileText size={20} />
          </div>
          <h2 className="interactive-card-title">{title}</h2>
        </div>
        <p className="interactive-card-description">{description}</p>
        {readingTimeMinutes ? (
          <div className="interactive-card-meta">
            {formatReadingLabel(readingTimeMinutes)}
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .interactive-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .interactive-card {
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.6rem;
          background-color: var(--container-background);
          box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
          min-height: 210px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .interactive-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 45px rgba(15, 23, 42, 0.16);
          border-color: rgba(0, 112, 243, 0.35);
        }

        .interactive-card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .interactive-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 112, 243, 0.12);
          color: var(--link-color);
          flex-shrink: 0;
        }

        .interactive-card-title {
          margin: 0;
          font-size: 1.15rem;
          line-height: 1.35;
          color: var(--text-color);
          word-break: break-word;
          overflow-wrap: anywhere;
          hyphens: auto;
        }

        .interactive-card-description {
          margin: 0;
          color: var(--text-color);
          opacity: 0.82;
          line-height: 1.6;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .interactive-card-meta {
          margin-top: auto;
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.7;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        :global(.dark) .interactive-card {
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.45);
        }

        :global(.dark) .interactive-card:hover {
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.6);
          border-color: rgba(77, 171, 247, 0.6);
        }

        :global(.dark) .interactive-card-icon {
          background: rgba(77, 171, 247, 0.18);
        }
      `}</style>
    </Link>
  );
}
