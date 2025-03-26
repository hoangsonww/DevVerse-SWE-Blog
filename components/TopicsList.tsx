"use client";

import React from "react";
import Link from "next/link";

interface TopicsListProps {
  topics: string[];
}

export default function TopicsList({ topics }: TopicsListProps) {
  return (
    <div className="topics-wrapper">
      <h2 className="topics-heading">Article Topics</h2>
      <p className="topics-body">
        Here are the topics covered in this article:
      </p>

      <div className="topics-container">
        {topics.map((topic) => (
          <Link
            key={topic}
            href={`/?topics=${encodeURIComponent(topic)}`}
            passHref
          >
            <span className="topic-pill">{topic}</span>
          </Link>
        ))}
      </div>

      <p className="topics-body">
        Click on a topic to find more articles on that subject.
      </p>

      <style jsx>{`
        .topics-wrapper {
          max-width: 700px;
          width: auto;
          margin: 1rem auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          border: 2px solid var(--border-color);
          border-radius: 12px;
        }

        .topics-heading {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0;
          color: var(--text-color);
          opacity: 0;
          transform: translateY(-10px);
          animation: fadeDown 0.4s forwards;
        }

        .topics-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          width: 100%;
        }

        .topic-pill {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: 1px solid var(--border-color);
          background-color: var(--container-background);
          color: var(--text-color);
          font-size: 0.875rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .topic-pill:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          background-color: var(--link-color);
          color: #fff;
        }

        @keyframes fadeDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
