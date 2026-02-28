"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaGithub, FaRss } from "react-icons/fa";
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

  const pillStyle = {
    color: "var(--text-color, #333)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.85rem",
    border: "1px solid var(--border-color, #e0e0e0)",
    borderRadius: "999px",
    fontSize: "0.9rem",
    fontWeight: "600",
    backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
    transition: "all 0.3s ease",
    position: "relative" as const,
    overflow: "hidden" as const,
    whiteSpace: "nowrap" as const,
  };

  const handlePillHover = (
    target: HTMLAnchorElement,
    shadowColor: string,
    borderColor: string,
    backgroundColor: string,
    darkModeStyles?: {
      shadowColor: string;
      borderColor: string;
      backgroundColor: string;
    },
  ) => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    const activeStyles =
      isDarkMode && darkModeStyles
        ? darkModeStyles
        : { shadowColor, borderColor, backgroundColor };

    target.style.transform = "translateY(-2px)";
    target.style.boxShadow = `0 6px 16px ${activeStyles.shadowColor}`;
    target.style.borderColor = activeStyles.borderColor;
    target.style.backgroundColor = activeStyles.backgroundColor;
  };

  const resetPillHover = (target: HTMLAnchorElement) => {
    target.style.transform = "translateY(0)";
    target.style.boxShadow = "none";
    target.style.borderColor = "var(--border-color, #e0e0e0)";
    target.style.backgroundColor =
      "var(--card-background, rgba(255, 255, 255, 0.05))";
  };

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
          style={pillStyle}
          onMouseEnter={(e) =>
            handlePillHover(
              e.currentTarget,
              "rgba(255, 140, 0, 0.3)",
              "#FF8C00",
              "rgba(255, 140, 0, 0.1)",
            )
          }
          onMouseLeave={(e) => resetPillHover(e.currentTarget)}
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
          style={pillStyle}
          onMouseEnter={(e) =>
            handlePillHover(
              e.currentTarget,
              "rgba(138, 43, 226, 0.3)",
              "#8A2BE2",
              "rgba(138, 43, 226, 0.1)",
            )
          }
          onMouseLeave={(e) => resetPillHover(e.currentTarget)}
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
          style={pillStyle}
          onMouseEnter={(e) =>
            handlePillHover(
              e.currentTarget,
              "rgba(34, 197, 94, 0.3)",
              "#22C55E",
              "rgba(34, 197, 94, 0.1)",
            )
          }
          onMouseLeave={(e) => resetPillHover(e.currentTarget)}
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
        <a
          href="https://github.com/hoangsonww/DevVerse-SWE-Blog"
          target="_blank"
          rel="noopener noreferrer"
          style={pillStyle}
          onMouseEnter={(e) =>
            handlePillHover(
              e.currentTarget,
              "rgba(17, 24, 39, 0.2)",
              "#111827",
              "rgba(17, 24, 39, 0.08)",
              {
                shadowColor: "rgba(255, 255, 255, 0.35)",
                borderColor: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            )
          }
          onMouseLeave={(e) => resetPillHover(e.currentTarget)}
          title="View the DevVerse GitHub repository"
        >
          <FaGithub
            size={16}
            style={{
              color: "var(--text-color, #333)",
            }}
          />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
