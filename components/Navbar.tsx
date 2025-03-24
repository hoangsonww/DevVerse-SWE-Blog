"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiChevronRight, FiBook, FiSun, FiMoon } from "react-icons/fi";
import { DarkModeContext } from "@/provider/DarkModeProvider";

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;

  // State for dark mode from context.
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  let breadcrumb: React.ReactNode;

  if (isHomePage) {
    // On the home page
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <FiHome />
        <span>Home</span>
      </span>
    );
  } else if (segments[0] === "articles") {
    if (segments.length === 1) {
      // e.g., /articles
      breadcrumb = (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiHome />
            <span>Home</span>
          </Link>
          <FiChevronRight />
          {/* Topics redirects to homepage */}
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiBook />
            <span>Articles</span>
          </Link>
        </span>
      );
    } else {
      // e.g., /articles/ai-ml
      breadcrumb = (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiHome />
            <span>Home</span>
          </Link>
          <FiChevronRight />
          {/* Topics also redirects to homepage */}
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiBook />
            <span>Articles</span>
          </Link>
          <FiChevronRight />
          <span>{formatSlug(segments[1])}</span>
        </span>
      );
    }
  } else {
    // Fallback for other pages
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link
          href="/"
          style={{
            color: "var(--link-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <FiHome />
          <span>Home</span>
        </Link>
      </span>
    );
  }

  return (
    <>
      <nav
        className="navbar"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="breadcrumb">{breadcrumb}</div>
        <div className="darkmode">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </nav>
      <style jsx>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--background-color);
          border-bottom: 1px solid var(--border-color, #eaeaea);
          transition: background-color 0.3s ease;
          animation: fadeDown 0.6s ease forwards;
        }

        .breadcrumb {
          font-size: 1.125rem;
          flex: 1 1 auto;
        }

        .darkmode button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: ${darkMode ? "#f9f9f9" : "#333"};
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .navbar {
            flex-direction: ${isHomePage ? "row" : "column"};
            align-items: ${isHomePage ? "center" : "flex-start"};
          }
          .breadcrumb {
            margin-bottom: ${isHomePage ? "0" : "1rem"};
            width: ${isHomePage ? "auto" : "100%"};
            text-align: left;
          }
          .darkmode {
            width: ${isHomePage ? "auto" : "100%"};
            display: flex;
            justify-content: ${isHomePage ? "flex-end" : "flex-start"};
            padding: 0;
          }
          .darkmode button {
            width: ${isHomePage ? "auto" : "100%"};
            padding: 0;
            text-align: ${isHomePage ? "right" : "left"};
            font-size: ${isHomePage ? "1.5rem" : "1.3rem"};
          }
        }
      `}</style>
    </>
  );
}
