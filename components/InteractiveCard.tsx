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
  const [hover, setHover] = React.useState(false);
  const [isDark, setIsDark] = useState(false);

  // Listen for changes to the dark mode class on the document.
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const cardStyle: React.CSSProperties = {
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hover
      ? isDark
        ? "0 4px 20px rgba(255, 255, 255, 0.8)" // Light-ish shadow when dark & hovered
        : "0 4px 20px rgba(0, 0, 0, 0.3)" // Dark-ish shadow when light & hovered
      : isDark
        ? "0 4px 10px rgba(255, 255, 255, 0.4)" // Light-ish but subtle shadow when dark & not hovered
        : "0 4px 10px rgba(0, 0, 0, 0.2)", // Dark-ish but subtle shadow when light & not hovered
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
    <Link href={`/articles/${slug}`} style={{ textDecoration: "none" }}>
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
