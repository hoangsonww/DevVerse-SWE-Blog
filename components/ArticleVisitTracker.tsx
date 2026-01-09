"use client";

import { useEffect } from "react";

const VISIT_STORAGE_KEY = "devverse:article-visit-history";
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
  }, [slug, title, topics]);

  return null;
}
