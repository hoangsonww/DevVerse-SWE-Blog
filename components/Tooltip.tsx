"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({
  text,
  children,
  position = "top",
  delay = 400,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const show = () => {
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 8;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - gap;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - gap;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + gap;
          break;
      }

      setCoords({ top, left });
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const transformOrigin: Record<string, string> = {
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    right: "translateY(-50%)",
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {children}
      </div>
      {mounted &&
        visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: transformOrigin[position],
              background: "var(--text-color)",
              color: "var(--background-color)",
              padding: "0.35rem 0.65rem",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: 500,
              fontFamily: "Inter, system-ui, sans-serif",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 999999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.15s ease",
              lineHeight: 1.3,
              letterSpacing: "0.01em",
            }}
            role="tooltip"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
