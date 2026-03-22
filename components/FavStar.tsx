"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/supabase/supabaseClient";
import { addFavorite, removeFavorite, isFavorited } from "@/supabase/favorites";
import { FaStar, FaRegStar } from "react-icons/fa";

interface FavStarProps {
  slug: string;
}

export default function FavStar({ slug }: FavStarProps) {
  const [user, setUser] = useState<any>(null);
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tip, setTip] = useState(false);
  const [tipCoords, setTipCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    isFavorited(user.id, slug).then(({ favorited: f }) => {
      if (!cancelled) setFavorited(f);
    });
    return () => {
      cancelled = true;
    };
  }, [user, slug]);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user || busy) return;
      setBusy(true);
      if (favorited) {
        await removeFavorite(user.id, slug);
        setFavorited(false);
      } else {
        await addFavorite(user.id, slug);
        setFavorited(true);
      }
      setBusy(false);
    },
    [user, slug, favorited, busy],
  );

  const showTip = () => {
    tipTimer.current = setTimeout(() => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setTipCoords({ top: r.top - 8, left: r.left + r.width / 2 });
      setTip(true);
    }, 400);
  };

  const hideTip = () => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTip(false);
  };

  if (!user) return null;

  const label = favorited ? "Remove from favorites" : "Add to favorites";

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1.2)";
          showTip();
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = favorited ? "1" : "0.4";
          e.currentTarget.style.transform = "scale(1)";
          hideTip();
        }}
        aria-label={label}
        style={{
          background: "none",
          border: "none",
          cursor: busy ? "wait" : "pointer",
          padding: "0.3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: favorited ? "#f59e0b" : "var(--text-color)",
          opacity: favorited ? 1 : 0.4,
          transition:
            "color 0.15s ease, opacity 0.15s ease, transform 0.15s ease",
          flexShrink: 0,
        }}
      >
        {favorited ? <FaStar size={18} /> : <FaRegStar size={18} />}
      </button>
      {tip &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: tipCoords.top,
              left: tipCoords.left,
              transform: "translateX(-50%) translateY(-100%)",
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
              lineHeight: 1.3,
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  );
}
