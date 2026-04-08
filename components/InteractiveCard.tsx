"use client";

import React from "react";
import TransitionLink from "./TransitionLink";
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
  // AI family — purples
  "Artificial Intelligence": "#8b5cf6",
  "Machine Learning": "#a855f7",
  "Agentic AI": "#6d28d9",
  "LLM Engineering": "#7c3aed",
  "Autonomous Systems": "#7c3aed",
  "Future of AI": "#a855f7",
  "Sentiment Analysis": "#c084fc",
  // Web family — blues
  "Web Development": "#3b82f6",
  "Web Architecture": "#1d4ed8",
  "Web Frameworks": "#6366f1",
  Frontend: "#818cf8",
  // Backend/infra — teals/greens
  Backend: "#059669",
  "Backend Development": "#047857",
  Microservices: "#0d9488",
  "API Development": "#0891b2",
  // Data — greens/pinks
  Databases: "#059669",
  "Data Science": "#ec4899",
  MLOps: "#db2777",
  RAG: "#d946ef",
  // DevOps family — cyans/oranges
  DevOps: "#0891b2",
  "CI/CD": "#0e7490",
  Docker: "#0ea5e9",
  Containerization: "#0284c7",
  Kubernetes: "#326ce5",
  Automation: "#f97316",
  "Infrastructure as Code": "#ea580c",
  // Systems — blues/teals
  "System Design": "#0284c7",
  "Distributed Systems": "#0d9488",
  "Event-Driven Architecture": "#0f766e",
  Scalability: "#14b8a6",
  // Security — reds
  Security: "#dc2626",
  "User Authentication": "#b91c1c",
  "Zero Trust": "#ef4444",
  // SRE/Ops — oranges/reds
  SRE: "#ef4444",
  Reliability: "#f97316",
  Operations: "#ea580c",
  // Performance — amber
  Performance: "#f59e0b",
  SEO: "#eab308",
  // Software eng — indigos
  "Software Engineering": "#4f46e5",
  "Design Patterns": "#7c3aed",
  Architecture: "#6366f1",
  // Specific tech — distinctive
  "Tech Innovations": "#06b6d4",
  "Mobile Development": "#f43f5e",
  "Cloud Computing": "#0369a1",
  Infrastructure: "#78716c",
  "Technical Interviews": "#8b5cf6",
  Web3: "#f59e0b",
  Blockchain: "#f59e0b",
  Concurrency: "#10b981",
  "Asynchronous Programming": "#34d399",
  "Rust Programming": "#ea580c",
  "Apache Kafka": "#231f20",
  MongoDB: "#10b981",
  Redis: "#dc2626",
  GraphQL: "#e535ab",
  WebAssembly: "#654ff0",
  "React Native": "#61dafb",
  AI: "#8b5cf6",
};

const TOPIC_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "Artificial Intelligence": FiCpu,
  "Machine Learning": FiCpu,
  "Agentic AI": FiCpu,
  "LLM Engineering": FiCpu,
  "Sentiment Analysis": FiCpu,
  AI: FiCpu,
  DevOps: FiTool,
  "CI/CD": FiTool,
  Automation: FiZap,
  Operations: FiTool,
  Databases: FiDatabase,
  MongoDB: FiDatabase,
  Redis: FiDatabase,
  "Data Science": FiDatabase,
  MLOps: FiDatabase,
  Performance: FiZap,
  SEO: FiGlobe,
  Security: FiLock,
  "User Authentication": FiLock,
  "Zero Trust": FiLock,
  "Web Development": FiGlobe,
  "Web Architecture": FiLayout,
  "Web Frameworks": FiLayout,
  Frontend: FiLayout,
  "Software Engineering": FiCode,
  "Design Patterns": FiCode,
  "Technical Interviews": FiCode,
  Architecture: FiServer,
  "System Design": FiServer,
  "Distributed Systems": FiServer,
  Microservices: FiServer,
  Scalability: FiServer,
  "Event-Driven Architecture": FiServer,
  Backend: FiServer,
  "Backend Development": FiServer,
  "API Development": FiServer,
  Infrastructure: FiTool,
  "Infrastructure as Code": FiTool,
  Docker: FiTool,
  Containerization: FiTool,
  Kubernetes: FiTool,
  SRE: FiZap,
  Reliability: FiZap,
  "Cloud Computing": FiGlobe,
  "Mobile Development": FiLayout,
  "React Native": FiLayout,
  "Tech Innovations": FiZap,
  Web3: FiGlobe,
  Blockchain: FiGlobe,
  GraphQL: FiCode,
  WebAssembly: FiCpu,
  RAG: FiCpu,
  Concurrency: FiZap,
  "Rust Programming": FiCode,
  "Apache Kafka": FiServer,
};

// Broad categories that many articles share — prefer a more specific second topic
const BROAD_TOPICS = new Set([
  "Artificial Intelligence",
  "Web Development",
  "Machine Learning",
  "Tech Innovations",
  "Web Frameworks",
]);

function pickAccentTopic(topics: string[]): string {
  if (topics.length <= 1) return topics[0] || "default";
  // If first topic is broad and second is more specific, use second
  if (BROAD_TOPICS.has(topics[0]) && topics[1] && TOPIC_COLORS[topics[1]]) {
    return topics[1];
  }
  return topics[0];
}

function getTopicColor(topic: string): string {
  if (TOPIC_COLORS[topic]) return TOPIC_COLORS[topic];
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
  // Try accent topic first, then all topics
  const accent = pickAccentTopic(topics);
  if (TOPIC_ICONS[accent]) return TOPIC_ICONS[accent];
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
  const accentTopic = pickAccentTopic(topics);
  const accentColor = getTopicColor(accentTopic);
  const Icon = getTopicIcon(topics);
  const displayTopics = topics.slice(0, 3);
  const extraCount = topics.length - displayTopics.length;

  return (
    <TransitionLink
      href={`/articles/${slug}`}
      className="interactive-card-link"
    >
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
              {extraCount > 0 && (
                <span
                  className="interactive-card-topic-pill interactive-card-topic-more"
                  style={{
                    background: `${accentColor}14`,
                    color: accentColor,
                    borderColor: `${accentColor}30`,
                  }}
                >
                  +{extraCount}
                </span>
              )}
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
    </TransitionLink>
  );
}
