"use client";

import { useEffect, useState, useRef } from "react";
import { FaList, FaTimes } from "react-icons/fa";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Extract headings from the article
  useEffect(() => {
    const extractHeadings = () => {
      const article = document.querySelector(".mdx-container");
      if (!article) return;

      const headingElements = article.querySelectorAll("h2, h3");
      const items: TOCItem[] = [];

      headingElements.forEach((heading) => {
        // Skip headings that contain "Author:"
        if (heading.textContent?.includes("Author:")) {
          return;
        }

        if (!heading.id) {
          heading.id =
            heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || "";
        }

        items.push({
          id: heading.id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName[1]),
        });
      });

      setHeadings(items);
    };

    // Wait for content to load
    setTimeout(extractHeadings, 100);
  }, []);

  // Scroll spy implementation
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0% -66% 0%",
        threshold: 0,
      },
    );

    const article = document.querySelector(".mdx-container");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3");
    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, [headings]);

  // Auto-scroll active TOC item into view
  useEffect(() => {
    if (!activeId || !tocRef.current) return;

    const activeButton = tocRef.current.querySelector(
      `button[data-heading-id="${activeId}"]`,
    );
    if (activeButton) {
      const tocContainer = tocRef.current;
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = tocContainer.getBoundingClientRect();

      // Check if button is below the visible area
      if (buttonRect.bottom > containerRect.bottom) {
        // Scroll down to show the button with some padding
        tocContainer.scrollTop += buttonRect.bottom - containerRect.bottom + 20;
      }
      // Check if button is above the visible area
      else if (buttonRect.top < containerRect.top) {
        // Scroll up to show the button with some padding
        tocContainer.scrollTop -= containerRect.top - buttonRect.top + 20;
      }
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  // Desktop TOC - Absolutely positioned, not affecting document flow
  if (!isMobile) {
    return (
      <div
        ref={tocRef}
        style={{
          position: "fixed",
          top: "100px",
          right: "20px",
          width: "250px",
          maxWidth: "250px",
          maxHeight: "calc(100vh - 140px)",
          overflowY: "auto",
          zIndex: 100,
          padding: "1rem",
          backgroundColor: "var(--background-color)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3
          className={inter.className}
          style={{
            fontSize: "0.75rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-color)",
            opacity: 0.6,
            marginBottom: "0.75rem",
          }}
        >
          On This Page
        </h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{
                  marginBottom: "0.25rem",
                }}
              >
                <button
                  className={inter.className}
                  data-heading-id={heading.id}
                  onClick={() => handleClick(heading.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.375rem 0.5rem",
                    paddingLeft: heading.level === 3 ? "1.5rem" : "0.5rem",
                    fontSize: heading.level === 3 ? "0.875rem" : "0.9375rem",
                    color:
                      activeId === heading.id
                        ? "var(--primary-color, #0ea5e9)"
                        : "var(--text-color)",
                    opacity: activeId === heading.id ? 1 : 0.7,
                    textAlign: "left",
                    background:
                      activeId === heading.id
                        ? "linear-gradient(90deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)"
                        : "transparent",
                    border: "none",
                    borderLeft:
                      activeId === heading.id
                        ? "2px solid var(--primary-color, #0ea5e9)"
                        : "2px solid transparent",
                    borderRadius: "0 4px 4px 0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontWeight: activeId === heading.id ? "600" : "400",
                    textDecoration: "none",
                    lineHeight: "1.5",
                  }}
                  onMouseEnter={(e) => {
                    if (activeId !== heading.id) {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.background =
                        "var(--hover-background, rgba(0, 0, 0, 0.03))";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeId !== heading.id) {
                      e.currentTarget.style.opacity = "0.7";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Mobile version
  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-mobile-button"
        aria-label="Toggle table of contents"
      >
        <FaList size={20} />
      </button>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Slide-out panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-100%",
          height: "100%",
          width: "min(320px, 85vw)",
          backgroundColor: "var(--background-color)",
          boxShadow: isOpen ? "0 0 20px rgba(0, 0, 0, 0.15)" : "none",
          zIndex: 1000,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem",
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            className={inter.className}
            style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-color)",
            }}
          >
            Table of Contents
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--text-color)",
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <nav style={{ flex: 1, padding: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {headings.map((heading) => (
              <li key={heading.id} style={{ marginBottom: "0.5rem" }}>
                <button
                  className={inter.className}
                  data-heading-id={heading.id}
                  onClick={() => handleClick(heading.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem",
                    paddingLeft: heading.level === 3 ? "2rem" : "0.75rem",
                    fontSize: heading.level === 3 ? "0.9375rem" : "1rem",
                    color:
                      activeId === heading.id
                        ? "var(--primary-color, #0ea5e9)"
                        : "var(--text-color)",
                    background:
                      activeId === heading.id
                        ? "var(--hover-background, rgba(14, 165, 233, 0.1))"
                        : "transparent",
                    border: "none",
                    borderRadius: "8px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontWeight: activeId === heading.id ? "600" : "400",
                  }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .toc-mobile-button {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 8px;
          width: 3rem;
          height: 3rem;
          cursor: pointer;
          z-index: 998;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          opacity: 0;
          transform: scale(0.5);
          animation: fadeInScale 0.3s forwards;
          transition:
            background-color 0.3s ease,
            color 0.3s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .toc-mobile-button:hover {
          backdrop-filter: blur(5px);
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
}
