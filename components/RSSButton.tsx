"use client";

import { FaRss } from "react-icons/fa";
import { useState } from "react";

export default function RSSButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="rss-button"
        style={{
          backgroundColor: "var(--primary-color, #007ACC)",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.9rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        aria-label="Subscribe to RSS/Atom feeds"
      >
        <FaRss size={16} />
        Subscribe
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            backgroundColor: "var(--card-background, white)",
            border: "1px solid var(--border-color, #e0e0e0)",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: "150px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <a
            href="/api/rss"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              textDecoration: "none",
              color: "var(--text-color, #333)",
              transition: "background-color 0.2s ease",
              borderBottom: "1px solid var(--border-color, #e0e0e0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--hover-background, #f5f5f5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FaRss size={14} />
            RSS Feed
          </a>
          <a
            href="/api/atom"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              textDecoration: "none",
              color: "var(--text-color, #333)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--hover-background, #f5f5f5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FaRss size={14} />
            Atom Feed
          </a>
        </div>
      )}
    </div>
  );
}
