"use client";

import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

interface ViewCountProps {
  slug: string;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toLocaleString();
}

export default function ViewCount({ slug }: ViewCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetchCount() {
      try {
        const { getViewCount } = await import("@/supabase/views");
        const c = await getViewCount(slug);
        if (!cancelled) setCount(c);
      } catch {
        // Silently fail — don't break the page if Supabase is unreachable
      }
    }

    fetchCount();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (count === null) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.9rem",
        color: "var(--text-color)",
        opacity: 0.75,
      }}
    >
      <FiEye size={14} />
      {formatCount(count)} views
    </span>
  );
}
