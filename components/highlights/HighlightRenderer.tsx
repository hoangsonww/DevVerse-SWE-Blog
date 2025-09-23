"use client";

import React, { useEffect, useRef, useState } from "react";
import { Highlight, HIGHLIGHT_COLORS, anchorTextQuoteSelector, generateHighlightAnchor } from "@/lib/highlights/selectors";

interface HighlightRendererProps {
  highlights: Highlight[];
  container: HTMLElement | null;
  showHighlights: boolean;
  onHighlightClick?: (highlight: Highlight) => void;
}

/**
 * Component that renders highlights in the DOM by wrapping matched text in <mark> elements
 */
export function HighlightRenderer({ 
  highlights, 
  container, 
  showHighlights,
  onHighlightClick 
}: HighlightRendererProps) {
  const [renderedHighlights, setRenderedHighlights] = useState<Set<string>>(new Set());
  const markElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (!container || !showHighlights) {
      // Remove all highlight marks
      markElementsRef.current.forEach((element) => {
        const parent = element.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(element.textContent || ''), element);
          parent.normalize();
        }
      });
      markElementsRef.current.clear();
      setRenderedHighlights(new Set());
      return;
    }

    // Render new highlights
    const newRendered = new Set<string>();
    
    highlights.forEach((highlight) => {
      if (renderedHighlights.has(highlight.id)) {
        newRendered.add(highlight.id);
        return;
      }

      try {
        const range = anchorTextQuoteSelector(
          {
            exact: highlight.text_quote_exact,
            prefix: highlight.text_quote_prefix,
            suffix: highlight.text_quote_suffix,
          },
          container
        );

        if (range) {
          const mark = document.createElement('mark');
          mark.id = generateHighlightAnchor(highlight.id);
          mark.className = 'article-highlight';
          mark.style.backgroundColor = HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.background || HIGHLIGHT_COLORS.yellow.background;
          mark.style.border = `1px solid ${HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.border || HIGHLIGHT_COLORS.yellow.border}`;
          mark.style.borderRadius = '2px';
          mark.style.cursor = 'pointer';
          mark.setAttribute('aria-label', `Highlight by you${highlight.note ? ': ' + highlight.note : ''}`);
          mark.setAttribute('data-highlight-id', highlight.id);
          
          if (highlight.note) {
            mark.setAttribute('title', highlight.note);
          }

          mark.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onHighlightClick?.(highlight);
          });

          try {
            range.surroundContents(mark);
            markElementsRef.current.set(highlight.id, mark);
            newRendered.add(highlight.id);
          } catch (error) {
            // Range spans multiple elements, need to handle differently
            console.warn('Could not surround range contents for highlight:', highlight.id, error);
          }
        }
      } catch (error) {
        console.warn('Error rendering highlight:', highlight.id, error);
      }
    });

    setRenderedHighlights(newRendered);
  }, [highlights, container, showHighlights, onHighlightClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markElementsRef.current.forEach((element) => {
        const parent = element.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(element.textContent || ''), element);
          parent.normalize();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything itself
}

interface HighlightMarkProps {
  highlight: Highlight;
  children: React.ReactNode;
  onClick?: (highlight: Highlight) => void;
}

/**
 * Standalone highlight mark component for manual rendering
 */
export function HighlightMark({ highlight, children, onClick }: HighlightMarkProps) {
  return (
    <mark
      id={generateHighlightAnchor(highlight.id)}
      className="article-highlight"
      style={{
        backgroundColor: HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.background || HIGHLIGHT_COLORS.yellow.background,
        border: `1px solid ${HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS]?.border || HIGHLIGHT_COLORS.yellow.border}`,
        borderRadius: '2px',
        cursor: 'pointer',
        padding: '1px 2px',
      }}
      aria-label={`Highlight by you${highlight.note ? ': ' + highlight.note : ''}`}
      title={highlight.note || undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(highlight);
      }}
    >
      {children}
    </mark>
  );
}