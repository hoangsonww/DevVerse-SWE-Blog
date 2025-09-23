"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SelectionToolbar } from "./SelectionToolbar";
import { HighlightRenderer } from "./HighlightRenderer";
import { HighlightsPanel } from "./HighlightsPanel";
import { useHighlights, useCreateHighlight, useUpdateHighlight, useDeleteHighlight } from "@/hooks/useHighlights";
import { Highlight } from "@/lib/highlights/selectors";

interface ArticleHighlightsProps {
  articleSlug: string;
  children: React.ReactNode;
}

/**
 * Main component that wraps article content and provides highlighting functionality
 */
export function ArticleHighlights({ articleSlug, children }: ArticleHighlightsProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks for data management
  const { data: highlights = [], isLoading } = useHighlights(articleSlug);
  const createHighlightMutation = useCreateHighlight();
  const updateHighlightMutation = useUpdateHighlight();
  const deleteHighlightMutation = useDeleteHighlight();

  // Handle text selection
  useEffect(() => {
    function handleSelectionChange() {
      const currentSelection = window.getSelection();
      
      if (
        currentSelection &&
        currentSelection.rangeCount > 0 &&
        !currentSelection.isCollapsed
      ) {
        const range = currentSelection.getRangeAt(0);
        const container = containerRef.current;
        
        // Check if selection is within our container
        if (container && container.contains(range.commonAncestorContainer)) {
          const selectedText = range.toString().trim();
          if (selectedText.length > 0) {
            setSelection(currentSelection);
            setShowToolbar(true);
            return;
          }
        }
      }
      
      // Hide toolbar if no valid selection
      setSelection(null);
      setShowToolbar(false);
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  // Handle clicking outside to close toolbar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (showToolbar && !target.closest(".selection-toolbar")) {
        setShowToolbar(false);
        setSelection(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showToolbar]);

  // Handle deep linking on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#h_")) {
      const highlightId = hash.slice(3);
      const element = document.getElementById(`h_${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.style.animation = "highlight-pulse 2s ease-in-out";
          setTimeout(() => {
            element.style.animation = "";
          }, 2000);
        }, 500);
      }
    } else if (hash.includes(":~:text=")) {
      // Handle native text fragments
      // Browser will handle this automatically, but we can add visual feedback
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          selection.getRangeAt(0).startContainer.parentElement?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 500);
    }
  }, []);

  const handleCreateHighlight = useCallback(async (data: {
    text_quote_exact: string;
    text_quote_prefix?: string;
    text_quote_suffix?: string;
    color: string;
    note?: string;
  }) => {
    try {
      await createHighlightMutation.mutateAsync({
        ...data,
        article_slug: articleSlug,
      });
    } catch (error) {
      console.error("Error creating highlight:", error);
    }
  }, [articleSlug, createHighlightMutation]);

  const handleUpdateHighlight = useCallback(async (highlight: Highlight) => {
    setEditingHighlight(highlight);
    // Note: Actual edit form would be implemented as a modal or inline editor
    // For now, we'll just log the action
    console.log("Edit highlight:", highlight);
  }, []);

  const handleDeleteHighlight = useCallback(async (highlightId: string) => {
    try {
      await deleteHighlightMutation.mutateAsync({
        id: highlightId,
        articleSlug,
      });
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  }, [articleSlug, deleteHighlightMutation]);

  const handleJumpToHighlight = useCallback((highlight: Highlight) => {
    // Update URL without causing navigation
    const newUrl = `${window.location.pathname}#h_${highlight.id}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  const handleHighlightClick = useCallback((highlight: Highlight) => {
    console.log("Highlight clicked:", highlight);
    // Could open note editor or show details
  }, []);

  return (
    <div className="article-highlights-container">
      <div
        ref={containerRef}
        className="article-content"
        style={{ position: "relative" }}
      >
        {children}
        
        {/* Render highlights in the DOM */}
        <HighlightRenderer
          highlights={highlights}
          container={containerRef.current}
          showHighlights={showHighlights}
          onHighlightClick={handleHighlightClick}
        />
      </div>

      {/* Selection toolbar */}
      {showToolbar && (
        <SelectionToolbar
          selection={selection}
          container={containerRef.current}
          articleSlug={articleSlug}
          onHighlight={handleCreateHighlight}
          onClose={() => {
            setShowToolbar(false);
            setSelection(null);
          }}
        />
      )}

      {/* Highlights panel */}
      <HighlightsPanel
        highlights={highlights}
        showHighlights={showHighlights}
        onToggleVisibility={() => setShowHighlights(!showHighlights)}
        onEditHighlight={handleUpdateHighlight}
        onDeleteHighlight={handleDeleteHighlight}
        onJumpToHighlight={handleJumpToHighlight}
      />

      <style jsx>{`
        @keyframes highlight-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        
        .article-highlights-container {
          position: relative;
        }
        
        .article-content {
          /* Ensure text selection works properly */
          user-select: text;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
        }
        
        :global(.article-highlight) {
          transition: all 0.2s ease;
        }
        
        :global(.article-highlight:hover) {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}