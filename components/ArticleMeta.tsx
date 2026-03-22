"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiClock, FiEye } from "react-icons/fi";

interface ArticleMetaProps {
  readingLabel?: string;
  viewCount?: number;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toLocaleString();
}

export default function ArticleMeta({
  readingLabel,
  viewCount,
}: ArticleMetaProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const idRef = useRef("article-meta-portal");

  useEffect(() => {
    const container = document.querySelector(".mdx-container");
    if (!container) return;

    const blockquote = container.querySelector("blockquote");
    if (!blockquote) return;

    let el = document.getElementById(idRef.current);
    if (!el) {
      el = document.createElement("div");
      el.id = idRef.current;
      blockquote.parentNode!.insertBefore(el, blockquote.nextSibling);
    }
    setTarget(el);
  }, []);

  const hasReading = !!readingLabel;
  const hasViews = typeof viewCount === "number" && viewCount > 0;

  if (!target || (!hasReading && !hasViews)) return null;

  // Strip the emoji prefix from readingLabel if present (e.g. "⏱ 11 min read" -> "11 min read")
  const cleanReading = readingLabel?.replace(/^⏱\s*/, "");

  return createPortal(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.15rem",
        fontSize: "0.93rem",
        color: "var(--text-color)",
        opacity: 0.8,
        marginTop: "0.3rem",
        marginBottom: "0.75rem",
        fontStyle: "italic",
      }}
    >
      {hasReading && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <FiClock size={14} style={{ flexShrink: 0 }} />
          {cleanReading}
        </span>
      )}
      {hasViews && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <FiEye size={14} style={{ flexShrink: 0 }} />
          {formatCount(viewCount!)} views
        </span>
      )}
    </div>,
    target,
  );
}
