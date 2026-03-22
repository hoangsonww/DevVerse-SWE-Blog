"use client";

import { useEffect } from "react";

const VISIT_STORAGE_KEY = "devverse:article-visit-history";
const VIEW_TRACKED_KEY = "devverse:views-tracked";
const MAX_STORED_VISITS = 50;

interface ArticleVisitTrackerProps {
  slug: string;
  title: string;
  topics: string[];
}

export default function ArticleVisitTracker({
  slug,
  title,
  topics,
}: ArticleVisitTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    // 1. Update local visit history (existing behavior)
    try {
      const raw = window.localStorage.getItem(VISIT_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      const next = [
        {
          slug,
          title,
          topics,
          lastViewed: Date.now(),
        },
        ...list.filter((entry: any) => entry?.slug !== slug),
      ].slice(0, MAX_STORED_VISITS);

      window.localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore localStorage errors (private mode, blocked storage, etc.).
    }

    // 2. Track view in Supabase (once per session per article)
    try {
      const raw = window.sessionStorage.getItem(VIEW_TRACKED_KEY);
      const tracked: string[] = raw ? JSON.parse(raw) : [];
      if (tracked.includes(slug)) return; // Already tracked this session

      fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {
        // Silently fail — view tracking should never break the reading experience
      });

      tracked.push(slug);
      window.sessionStorage.setItem(VIEW_TRACKED_KEY, JSON.stringify(tracked));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [slug, title, topics]);

  return null;
}
