"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiChevronRight, FiBook, FiSun, FiMoon } from "react-icons/fi";

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // State for dark mode, with initial value from localStorage.
  const [darkMode, setDarkMode] = useState(false);

  // On mount, load dark mode preference from localStorage.
  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference) {
      const isDark = storedPreference === "true";
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Update document and localStorage on darkMode change.
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  let breadcrumb: React.ReactNode;

  if (segments.length === 0) {
    // On the home page
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiHome />
        <span>Home</span>
      </span>
    );
  } else if (segments[0] === "topics") {
    if (segments.length === 1) {
      // e.g., /topics
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
            <span>Topics</span>
          </Link>
        </span>
      );
    } else {
      // e.g., /topics/ai-ml
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
            <span>Topics</span>
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
      <nav className="navbar">
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
        .navbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--background-color);
          border-bottom: 1px solid var(--border-color, #eaeaea);
          transition: background-color 0.3s ease;
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
        /* Responsive adjustments for mobile */
        @media (max-width: 600px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .breadcrumb {
            margin-bottom: 1rem;
            width: 100%;
            text-align: left;
          }
          .darkmode {
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
}
