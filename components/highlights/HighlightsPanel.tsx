"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaShare, FaFilter } from "react-icons/fa";
import { Highlight, HIGHLIGHT_COLORS, generateHighlightAnchor } from "@/lib/highlights/selectors";

interface HighlightsPanelProps {
  highlights: Highlight[];
  showHighlights: boolean;
  onToggleVisibility: () => void;
  onEditHighlight: (highlight: Highlight) => void;
  onDeleteHighlight: (highlightId: string) => void;
  onJumpToHighlight: (highlight: Highlight) => void;
}

export function HighlightsPanel({
  highlights,
  showHighlights,
  onToggleVisibility,
  onEditHighlight,
  onDeleteHighlight,
  onJumpToHighlight,
}: HighlightsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [noteFilter, setNoteFilter] = useState<string>("all");

  const filteredHighlights = highlights.filter((highlight) => {
    if (colorFilter !== "all" && highlight.color !== colorFilter) return false;
    if (noteFilter === "with-notes" && !highlight.note) return false;
    if (noteFilter === "no-notes" && highlight.note) return false;
    return true;
  });

  const scrollToHighlight = (highlight: Highlight) => {
    const element = document.getElementById(generateHighlightAnchor(highlight.id));
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
      
      // Add pulse animation
      element.style.animation = "highlight-pulse 2s ease-in-out";
      setTimeout(() => {
        element.style.animation = "";
      }, 2000);
    }
    onJumpToHighlight(highlight);
  };

  const copyShareLink = async (highlight: Highlight) => {
    try {
      const link = `${window.location.origin}/articles/${highlight.article_slug}#${generateHighlightAnchor(highlight.id)}`;
      await navigator.clipboard.writeText(link);
      console.log("Share link copied:", link);
    } catch (error) {
      console.error("Error copying share link:", error);
    }
  };

  return (
    <div
      className="highlights-panel"
      style={{
        position: "fixed",
        top: "50%",
        right: isExpanded ? "0" : "-400px",
        transform: "translateY(-50%)",
        width: "450px",
        height: "80vh",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px 0 0 8px",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
        transition: "right 0.3s ease",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: "absolute",
          left: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "40px",
          height: "80px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px 0 0 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          writingMode: "vertical-rl",
          fontSize: "12px",
          fontWeight: "bold",
        }}
        title={isExpanded ? "Close highlights panel" : "Open highlights panel"}
      >
        Notes
      </button>

      {/* Panel header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
            My Notes ({highlights.length})
          </h3>
          <button
            onClick={onToggleVisibility}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 8px",
              backgroundColor: showHighlights ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
            title={showHighlights ? "Hide highlights" : "Show highlights"}
          >
            {showHighlights ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
            {showHighlights ? "Visible" : "Hidden"}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            style={{
              padding: "4px 6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <option value="all">All Colors</option>
            {Object.keys(HIGHLIGHT_COLORS).map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={noteFilter}
            onChange={(e) => setNoteFilter(e.target.value)}
            style={{
              padding: "4px 6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <option value="all">All Notes</option>
            <option value="with-notes">With Notes</option>
            <option value="no-notes">No Notes</option>
          </select>
        </div>
      </div>

      {/* Highlights list */}
      <div
        style={{
          flex: 1,
          padding: "8px",
          overflowY: "auto",
        }}
      >
        {filteredHighlights.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              padding: "20px",
            }}
          >
            {highlights.length === 0 
              ? "No highlights yet. Select text to create your first highlight!"
              : "No highlights match the current filters."
            }
          </div>
        ) : (
          filteredHighlights.map((highlight) => (
            <div
              key={highlight.id}
              style={{
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #eee",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
                cursor: "pointer",
              }}
              onClick={() => scrollToHighlight(highlight)}
            >
              {/* Quote text */}
              <div
                style={{
                  marginBottom: "8px",
                  padding: "6px 8px",
                  backgroundColor: HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.background || HIGHLIGHT_COLORS.yellow.background,
                  border: `1px solid ${HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.border || HIGHLIGHT_COLORS.yellow.border}`,
                  borderRadius: "4px",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                "{highlight.text_quote_exact}"
              </div>

              {/* Note */}
              {highlight.note && (
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "12px",
                    color: "#555",
                    fontStyle: "italic",
                    lineHeight: "1.4",
                  }}
                >
                  "{highlight.note}"
                </div>
              )}

              {/* Metadata and actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "#666",
                }}
              >
                <div>
                  {new Date(highlight.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditHighlight(highlight);
                    }}
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Edit highlight"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyShareLink(highlight);
                    }}
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Share highlight"
                  >
                    <FaShare size={10} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this highlight?")) {
                        onDeleteHighlight(highlight.id);
                      }
                    }}
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Delete highlight"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes highlight-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}