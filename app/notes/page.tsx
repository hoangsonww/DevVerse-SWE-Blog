"use client";

import React, { useState } from "react";
import { useHighlights } from "@/hooks/useHighlights";
import { Highlight, HIGHLIGHT_COLORS, createDeepLink } from "@/lib/highlights/selectors";
import { FaSearch, FaExternalLinkAlt, FaFilter } from "react-icons/fa";
import Link from "next/link";

export default function NotesPage() {
  const { data: highlights = [], isLoading, error } = useHighlights();
  const [searchQuery, setSearchQuery] = useState("");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [articleFilter, setArticleFilter] = useState<string>("all");

  // Filter highlights based on search and filters
  const filteredHighlights = highlights.filter((highlight) => {
    const matchesSearch = 
      searchQuery === "" ||
      highlight.text_quote_exact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.article_slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesColor = colorFilter === "all" || highlight.color === colorFilter;
    const matchesArticle = articleFilter === "all" || highlight.article_slug === articleFilter;
    
    return matchesSearch && matchesColor && matchesArticle;
  });

  // Get unique articles for filter
  const uniqueArticles = Array.from(new Set(highlights.map(h => h.article_slug)));

  // Group highlights by article
  const highlightsByArticle = filteredHighlights.reduce((acc, highlight) => {
    const slug = highlight.article_slug;
    if (!acc[slug]) {
      acc[slug] = [];
    }
    acc[slug].push(highlight);
    return acc;
  }, {} as Record<string, Highlight[]>);

  const formatArticleTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        fontFamily: "Inter, sans-serif" 
      }}>
        Loading your notes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        color: "#dc3545"
      }}>
        Error loading notes. Please try again.
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "0.5rem",
          color: "var(--text-color)",
        }}>
          My Notes
        </h1>
        <p style={{ 
          fontSize: "1.1rem", 
          color: "#666",
          marginBottom: "2rem"
        }}>
          All your highlights and annotations across articles ({highlights.length} total)
        </p>

        {/* Search and filters */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Search box */}
          <div style={{ position: "relative", flex: "1", minWidth: "250px" }}>
            <FaSearch 
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              placeholder="Search highlights and notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Color filter */}
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              minWidth: "120px",
            }}
          >
            <option value="all">All Colors</option>
            {Object.keys(HIGHLIGHT_COLORS).map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>

          {/* Article filter */}
          <select
            value={articleFilter}
            onChange={(e) => setArticleFilter(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              minWidth: "200px",
            }}
          >
            <option value="all">All Articles</option>
            {uniqueArticles.map((slug) => (
              <option key={slug} value={slug}>
                {formatArticleTitle(slug)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredHighlights.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}>
          {highlights.length === 0 ? (
            <>
              <h3 style={{ marginBottom: "1rem" }}>No highlights yet</h3>
              <p>Start reading articles and highlight text to create your first note!</p>
              <Link 
                href="/articles"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                }}
              >
                Browse Articles
              </Link>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: "1rem" }}>No highlights match your filters</h3>
              <p>Try adjusting your search terms or filters.</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {Object.entries(highlightsByArticle).map(([slug, articleHighlights]) => (
            <div
              key={slug}
              style={{
                backgroundColor: "white",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "1.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* Article header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #eee",
              }}>
                <h2 style={{
                  fontSize: "1.5rem",
                  margin: 0,
                  color: "var(--text-color)",
                }}>
                  {formatArticleTitle(slug)}
                </h2>
                <Link
                  href={`/articles/${slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#007bff",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  View Article <FaExternalLinkAlt size={12} />
                </Link>
              </div>

              {/* Highlights for this article */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {articleHighlights
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((highlight) => (
                    <div
                      key={highlight.id}
                      style={{
                        padding: "1rem",
                        backgroundColor: "#fafafa",
                        borderRadius: "6px",
                        border: "1px solid #eee",
                      }}
                    >
                      {/* Quote */}
                      <div
                        style={{
                          marginBottom: "0.75rem",
                          padding: "0.75rem",
                          backgroundColor: HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.background || HIGHLIGHT_COLORS.yellow.background,
                          border: `1px solid ${HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.border || HIGHLIGHT_COLORS.yellow.border}`,
                          borderRadius: "4px",
                          lineHeight: "1.5",
                          fontSize: "15px",
                        }}
                      >
                        "{highlight.text_quote_exact}"
                      </div>

                      {/* Note */}
                      {highlight.note && (
                        <div
                          style={{
                            marginBottom: "0.75rem",
                            fontSize: "14px",
                            color: "#555",
                            lineHeight: "1.5",
                            fontStyle: "italic",
                            paddingLeft: "1rem",
                            borderLeft: "3px solid #ddd",
                          }}
                        >
                          {highlight.note}
                        </div>
                      )}

                      {/* Metadata and actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        <div>
                          {new Date(highlight.created_at).toLocaleDateString()} at{" "}
                          {new Date(highlight.created_at).toLocaleTimeString()}
                        </div>
                        <Link
                          href={createDeepLink(slug, highlight)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            color: "#007bff",
                            textDecoration: "none",
                            fontSize: "12px",
                          }}
                        >
                          Jump to highlight <FaExternalLinkAlt size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}