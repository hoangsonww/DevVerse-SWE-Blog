"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaRss } from "react-icons/fa";
import { BiAtom } from "react-icons/bi";
import { VscJson } from "react-icons/vsc";

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState("");
  const [mounted, setMounted] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    setMounted(true);
  }, []);

  if (!mounted || isLanding) return null;

  return (
    <footer
      className="fade-in"
      style={{
        textAlign: "center",
        padding: "1rem 2rem",
        backgroundColor: "var(--footer-background-color, #f0f0f0)",
        borderTop: "1px solid var(--footer-border-color, #eaeaea)",
        marginTop: "2rem",
        color: "var(--text-color, #333)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div>
        &copy; {year}{" "}
        <a
          href="https://github.com/hoangsonww"
          target="_blank"
          rel="noopener noreferrer"
        >
          Son (David) Nguyen
        </a>
        . All rights reserved.
      </div>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            opacity: 0.7,
            marginRight: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          Subscribe:
        </span>
        <a
          href="/api/rss"
          style={{
            color: "var(--text-color, #333)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.8rem",
            border: "1px solid var(--border-color, #e0e0e0)",
            borderRadius: "6px",
            fontSize: "0.9rem",
            fontWeight: "500",
            backgroundColor:
              "var(--card-background, rgba(255, 255, 255, 0.05))",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(255, 140, 0, 0.3)";
            e.currentTarget.style.borderColor = "#FF8C00";
            e.currentTarget.style.backgroundColor = "rgba(255, 140, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--border-color, #e0e0e0)";
            e.currentTarget.style.backgroundColor =
              "var(--card-background, rgba(255, 255, 255, 0.05))";
          }}
          title="Subscribe via RSS Feed"
        >
          <FaRss
            size={16}
            style={{
              color: "#FF8C00",
            }}
          />
          <span>RSS Feed</span>
        </a>
        <a
          href="/api/atom"
          style={{
            color: "var(--text-color, #333)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.8rem",
            border: "1px solid var(--border-color, #e0e0e0)",
            borderRadius: "6px",
            fontSize: "0.9rem",
            fontWeight: "500",
            backgroundColor:
              "var(--card-background, rgba(255, 255, 255, 0.05))",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(138, 43, 226, 0.3)";
            e.currentTarget.style.borderColor = "#8A2BE2";
            e.currentTarget.style.backgroundColor = "rgba(138, 43, 226, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--border-color, #e0e0e0)";
            e.currentTarget.style.backgroundColor =
              "var(--card-background, rgba(255, 255, 255, 0.05))";
          }}
          title="Subscribe via Atom Feed"
        >
          <BiAtom
            size={18}
            style={{
              color: "#8A2BE2",
            }}
          />
          <span>Atom Feed</span>
        </a>
        <a
          href="/feed.json"
          style={{
            color: "var(--text-color, #333)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.8rem",
            border: "1px solid var(--border-color, #e0e0e0)",
            borderRadius: "6px",
            fontSize: "0.9rem",
            fontWeight: "500",
            backgroundColor:
              "var(--card-background, rgba(255, 255, 255, 0.05))",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(34, 197, 94, 0.3)";
            e.currentTarget.style.borderColor = "#22C55E";
            e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--border-color, #e0e0e0)";
            e.currentTarget.style.backgroundColor =
              "var(--card-background, rgba(255, 255, 255, 0.05))";
          }}
          title="Subscribe via JSON Feed"
        >
          <VscJson
            size={18}
            style={{
              color: "#22C55E",
            }}
          />
          <span>JSON Feed</span>
        </a>
      </div>
    </footer>
  );
}
