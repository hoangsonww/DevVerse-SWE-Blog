"use client";

import React from "react";
import Link from "next/link";
import {
  FiCpu,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiLock,
  FiServer,
  FiLayout,
  FiTool,
  FiZap,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { formatReadingLabel } from "@/utils/calculateReadingTime";
import FavStar from "@/components/FavStar";

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toLocaleString();
}

const TOPIC_COLORS: Record<string, string> = {
  "Artificial Intelligence": "#8b5cf6",
  "Machine Learning": "#7c3aed",
  "Agentic AI": "#6d28d9",
  "LLM Engineering": "#7c3aed",
  DevOps: "#0891b2",
  "CI/CD": "#0e7490",
  Docker: "#0ea5e9",
  Kubernetes: "#0284c7",
  Databases: "#059669",
  Performance: "#10b981",
  Security: "#dc2626",
  "Web Development": "#2563eb",
  "Web Architecture": "#1d4ed8",
  "Web Frameworks": "#3b82f6",
  "Software Engineering": "#6366f1",
  "Design Patterns": "#4f46e5",
  Architecture: "#4338ca",
  Backend: "#0d9488",
  "Data Science": "#8b5cf6",
  RAG: "#a855f7",
  "System Design": "#6366f1",
  Infrastructure: "#64748b",
  "Distributed Systems": "#475569",
  Automation: "#0891b2",
};

const TOPIC_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "Artificial Intelligence": FiCpu,
  "Machine Learning": FiCpu,
  "Agentic AI": FiCpu,
  "LLM Engineering": FiCpu,
  DevOps: FiTool,
  "CI/CD": FiTool,
  Databases: FiDatabase,
  Performance: FiZap,
  Security: FiLock,
  "Web Development": FiGlobe,
  "Web Architecture": FiServer,
  "Web Frameworks": FiLayout,
  "Software Engineering": FiCode,
  "Design Patterns": FiCode,
  Architecture: FiServer,
  Backend: FiServer,
  "Data Science": FiDatabase,
  "System Design": FiServer,
  Infrastructure: FiServer,
  "Distributed Systems": FiServer,
};

function getTopicColor(topic: string): string {
  if (TOPIC_COLORS[topic]) return TOPIC_COLORS[topic];
  // Deterministic color from topic string
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 50%)`;
}

function getTopicIcon(
  topics: string[],
): React.ComponentType<{ size?: number }> {
  for (const t of topics) {
    if (TOPIC_ICONS[t]) return TOPIC_ICONS[t];
  }
  return FiCode;
}

interface CardProps {
  slug: string;
  title: string;
  description?: string;
  topics?: string[];
  readingTimeMinutes?: number;
  viewCount?: number;
}

export default function InteractiveCard({
  slug,
  title,
  description,
  topics = [],
  readingTimeMinutes,
  viewCount,
}: CardProps) {
  const accentColor = getTopicColor(topics[0] || "default");
  const Icon = getTopicIcon(topics);
  const displayTopics = topics.slice(0, 3);

  return (
    <Link href={`/articles/${slug}`} className="interactive-card-link">
      <div
        className="interactive-card"
        style={{ "--card-accent": accentColor } as React.CSSProperties}
      >
        <div
          className="interactive-card-accent"
          style={{ background: accentColor }}
        />
        <div className="interactive-card-body">
          <div className="interactive-card-header">
            <div
              className="interactive-card-icon"
              style={{ background: `${accentColor}18`, color: accentColor }}
            >
              <Icon size={20} />
            </div>
            <h2 className="interactive-card-title">{title}</h2>
            <FavStar slug={slug} />
          </div>

          {displayTopics.length > 0 && (
            <div className="interactive-card-topics">
              {displayTopics.map((t) => (
                <span
                  key={t}
                  className="interactive-card-topic-pill"
                  style={{
                    background: `${getTopicColor(t)}14`,
                    color: getTopicColor(t),
                    borderColor: `${getTopicColor(t)}30`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <p className="interactive-card-description">{description}</p>

          <div className="interactive-card-meta">
            {readingTimeMinutes ? (
              <span className="interactive-card-meta-item">
                <FiClock size={13} />
                {readingTimeMinutes} min read
              </span>
            ) : null}
            {typeof viewCount === "number" && viewCount > 0 ? (
              <span className="interactive-card-meta-item interactive-card-views">
                <FiEye size={13} />
                {formatViewCount(viewCount)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <style jsx>{`
        .interactive-card-link {
          text-decoration: none !important;
          color: inherit;
          display: block;
          height: 100%;
        }

        .interactive-card-link:hover {
          text-decoration: none !important;
        }

        .interactive-card {
          border: 1px solid var(--border-color);
          border-radius: 16px;
          background-color: var(--container-background);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .interactive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.14);
          border-color: var(--card-accent, #3b82f6);
        }

        .interactive-card-accent {
          height: 3px;
          width: 100%;
          flex-shrink: 0;
        }

        .interactive-card-body {
          padding: 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .interactive-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .interactive-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .interactive-card:hover .interactive-card-icon {
          transform: scale(1.1);
        }

        .interactive-card-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 650;
          line-height: 1.35;
          color: var(--text-color);
          word-break: break-word;
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }

        .interactive-card-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .interactive-card-topic-pill {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .interactive-card-description {
          margin: 0;
          color: var(--text-color);
          opacity: 0.75;
          font-size: 0.92rem;
          line-height: 1.55;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .interactive-card-meta {
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.82rem;
          color: var(--text-color);
          opacity: 0.6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .interactive-card-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .interactive-card-views {
          margin-left: auto;
        }

        :global(.dark) .interactive-card {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        :global(.dark) .interactive-card:hover {
          box-shadow: 0 20px 44px rgba(0, 0, 0, 0.5);
          border-color: var(--card-accent, #4dabf7);
        }
      `}</style>
    </Link>
  );
}
