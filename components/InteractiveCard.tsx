"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiFileText } from "react-icons/fi";

interface CardProps {
  slug: string;
  title: string;
  description?: string;
}

export default function InteractiveCard({
  slug,
  title,
  description,
}: CardProps) {
  const [hover, setHover] = useState(false);

  const cardStyle: React.CSSProperties = {
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hover
      ? "0 4px 20px rgba(0, 0, 0, 0.3)"
      : "0 4px 10px rgba(0, 0, 0, 0.2)",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    textAlign: "left",
  };

  // Fixed-size container for the icon
  const iconContainerStyle: React.CSSProperties = {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.75rem",
    flexShrink: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    color: "#555",
    fontSize: "1rem",
    flexGrow: 1,
    marginTop: "1rem",
    textAlign: "left",
  };

  return (
    <Link href={`/articles/${slug}`} style={{ textDecoration: "none" }}>
      <div
        className="interactive-card"
        style={cardStyle}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div style={headerStyle}>
          <div className="interactive-card-icon" style={iconContainerStyle}>
            <FiFileText size={28} />
          </div>
          <h2 className="interactive-card-title">{title}</h2>
        </div>
        <p style={descriptionStyle}>{description}</p>
      </div>
      <style jsx>{`
        /* Enforce the blue color using high specificity */
        .interactive-card h2,
        .interactive-card-title,
        .interactive-card h2:where(:not(.override)) {
          color: #0070f3 !important; /* Override any other styles */
        }

        .interactive-card h2 {
          margin-top: 0;
          margin-bottom: 0;
        }

        /* Ensure the icon always remains blue */
        .interactive-card-icon {
          color: #0070f3 !important;
          margin-top: 0;
        }

        /* Override potential global dark mode styles */
        html.dark .interactive-card h2,
        html.dark .interactive-card-title {
          color: #0070f3 !important;
        }

        /* Ensure no parent styles affect the h2 */
        .interactive-card h2:not([style]) {
          color: #0070f3 !important;
        }

        /* Extra specificity just in case */
        body .interactive-card h2 {
          color: #0070f3 !important;
        }
      `}</style>
    </Link>
  );
}
