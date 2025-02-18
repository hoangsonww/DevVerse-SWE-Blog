"use client";
import React from "react";
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
  const [hover, setHover] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hover ? "0 4px 14px rgba(0, 0, 0, 0.1)" : "none",
    // Use minHeight instead of a fixed height so the card grows to fit its content
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  // Fixed-size container for the icon
  const iconContainerStyle: React.CSSProperties = {
    width: "28px", // Fixed width equal to the icon size
    height: "28px", // Fixed height equal to the icon size
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.75rem",
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    margin: 0,
    color: "#0070f3",
  };

  const descriptionStyle: React.CSSProperties = {
    color: "#555",
    fontSize: "1rem",
    flexGrow: 1,
  };

  return (
    <Link href={`/topics/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={cardStyle}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <FiFileText size={28} color="#0070f3" />
          </div>
          <h2 style={titleStyle}>{title}</h2>
        </div>
        <p style={descriptionStyle}>{description}</p>
      </div>
    </Link>
  );
}
