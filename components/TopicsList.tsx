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
        <FiTag size={18} className="topics-header-icon" />
        <h2 className="topics-heading">Topics</h2>
      </div>

      <div className="topics-container">
        {topics.map((topic) => {
          const color = getColor(topic);
          return (
            <Link
              key={topic}
              href={`/home?topics=${encodeURIComponent(topic)}`}
              className="topic-pill-link"
            >
              <span
                className="topic-pill"
                style={{
                  borderColor: `${color}35`,
                  background: `${color}0c`,
                  color,
                }}
              >
                {topic}
                <FiArrowRight size={12} className="topic-arrow" />
              </span>
            </Link>
          );
        })}
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
          gap: 0.5rem;
        }

        .topics-header :global(.topics-header-icon) {
          color: var(--link-color);
        }

        .topics-heading {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-color);
        }

        .topics-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        :global(.topic-pill-link) {
          text-decoration: none !important;
        }

        .topic-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .topic-pill :global(.topic-arrow) {
          opacity: 0;
          transform: translateX(-4px);
          transition:
            opacity 0.15s ease,
            transform 0.15s ease;
        }

        .topic-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .topic-pill:hover :global(.topic-arrow) {
          opacity: 1;
          transform: translateX(0);
        }

        .topics-hint {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
