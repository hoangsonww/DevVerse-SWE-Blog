"use client";

import React from "react";
import Link from "next/link";
import { FiTag, FiArrowRight } from "react-icons/fi";

interface TopicsListProps {
  topics: string[];
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

function getColor(topic: string): string {
  if (TOPIC_COLORS[topic]) return TOPIC_COLORS[topic];
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 50%)`;
}

export default function TopicsList({ topics }: TopicsListProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="topics-wrapper">
      <div className="topics-header">
        <FiTag size={22} className="topics-header-icon" />
        <div>
          <h2 className="topics-heading">Topics</h2>
          <p className="topics-subheading">
            Themes and subjects covered in this article
          </p>
        </div>
      </div>

      <div className="topics-container">
        {topics.map((topic) => (
          <Link
            key={topic}
            href={`/home?topics=${encodeURIComponent(topic)}`}
            className="topic-pill-link"
          >
            <span className="topic-pill">
              {topic}
              <FiArrowRight size={12} className="topic-arrow" />
            </span>
          </Link>
        ))}
      </div>

      <p className="topics-hint">Click a topic to explore related articles</p>

      <style jsx>{`
        .topics-wrapper {
          max-width: 800px;
          width: 100%;
          margin: 1.5rem auto 0;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 1px solid var(--border-color);
          box-sizing: border-box;
        }

        .topics-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .topics-header :global(.topics-header-icon) {
          color: var(--link-color);
        }

        .topics-heading {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-color);
          letter-spacing: -0.01em;
        }

        .topics-subheading {
          margin: 0.15rem 0 0;
          font-size: 0.88rem;
          color: var(--text-color);
          opacity: 0.55;
        }

        .topics-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        :global(.topic-pill-link) {
          text-decoration: none !important;
        }

        .topic-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          border-radius: 9px;
          border: 1px solid var(--border-color);
          background: var(--background-color);
          color: var(--text-color);
          font-size: 0.88rem;
          font-weight: 550;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .topic-pill :global(.topic-arrow) {
          opacity: 0.4;
        }

        .topic-pill:hover {
          border-color: var(--link-color);
          background: rgba(0, 112, 243, 0.06);
        }

        .topic-pill:hover :global(.topic-arrow) {
          opacity: 0.7;
        }

        .topics-hint {
          margin: 0.5rem 0 0;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
