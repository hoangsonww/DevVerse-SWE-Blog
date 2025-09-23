"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaHighlighter, FaStickyNote, FaLink, FaTimes } from "react-icons/fa";
import { createTextQuoteSelector, createDeepLink, HighlightColor, HIGHLIGHT_COLORS } from "@/lib/highlights/selectors";

interface SelectionToolbarProps {
  selection: Selection | null;
  container: HTMLElement | null;
  articleSlug: string;
  onHighlight: (data: {
    text_quote_exact: string;
    text_quote_prefix?: string;
    text_quote_suffix?: string;
    color: string;
    note?: string;
  }) => void;
  onClose: () => void;
}

export function SelectionToolbar({ 
  selection, 
  container, 
  articleSlug, 
  onHighlight, 
  onClose 
}: SelectionToolbarProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");
  const [selectedColor, setSelectedColor] = useState<HighlightColor>("yellow");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position toolbar above the selection
      setPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top - 10
      });
    }
  }, [selection]);

  useEffect(() => {
    if (showNoteInput && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteInput]);

  const handleHighlight = () => {
    if (!selection || !container || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    
    if (!selectedText) return;

    try {
      const selector = createTextQuoteSelector(range, container);
      
      onHighlight({
        text_quote_exact: selector.exact,
        text_quote_prefix: selector.prefix,
        text_quote_suffix: selector.suffix,
        color: selectedColor,
        note: note || undefined,
      });

      // Clear selection and close toolbar
      selection.removeAllRanges();
      handleClose();
    } catch (error) {
      console.error("Error creating highlight:", error);
    }
  };

  const handleCopyLink = async () => {
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.getRangeAt(0).toString().trim();
    if (!selectedText) return;

    try {
      // Create a temporary highlight object for link generation
      const tempHighlight = {
        id: "temp",
        text_quote_exact: selectedText,
        user_id: "",
        article_slug: articleSlug,
        color: "yellow",
        is_public: false,
        created_at: "",
        updated_at: "",
      };

      const link = createDeepLink(articleSlug, tempHighlight, window.location.origin);
      
      await navigator.clipboard.writeText(link);
      
      // Show feedback (could integrate with toast system)
      console.log("Link copied to clipboard:", link);
      
      // Clear selection and close toolbar
      selection.removeAllRanges();
      handleClose();
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const handleClose = () => {
    setShowNoteInput(false);
    setNote("");
    setSelectedColor("yellow");
    onClose();
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleHighlight();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!selection || selection.rangeCount === 0) return null;

  const selectedText = selection.getRangeAt(0).toString().trim();
  if (!selectedText) return null;

  return (
    <div
      ref={toolbarRef}
      className="selection-toolbar"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 10000,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "200px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Color picker */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        {Object.entries(HIGHLIGHT_COLORS).map(([color, styles]) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color as HighlightColor)}
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: styles.background,
              border: selectedColor === color ? "2px solid #333" : "1px solid #ccc",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            title={`${color} highlight`}
            aria-label={`Select ${color} highlight color`}
          />
        ))}
      </div>

      {/* Note input (conditional) */}
      {showNoteInput && (
        <textarea
          ref={noteInputRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleNoteKeyDown}
          placeholder="Add a note (optional)..."
          style={{
            width: "100%",
            minHeight: "60px",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        <button
          onClick={handleHighlight}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          title="Create highlight"
        >
          <FaHighlighter size={12} />
          Highlight
        </button>

        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 8px",
            backgroundColor: showNoteInput ? "#ffc107" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          title="Add note"
        >
          <FaStickyNote size={12} />
          Note
        </button>

        <button
          onClick={handleCopyLink}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 8px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          title="Copy quote link"
        >
          <FaLink size={12} />
          Link
        </button>

        <button
          onClick={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          title="Close"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );
}