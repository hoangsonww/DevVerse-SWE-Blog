import React from "react";
import FavoritesList from "@/components/FavoritesList";
import { getArticles, Article } from "@/lib/articles";
import BackToTopButton from "@/components/BackToTopButton";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

async function getViewCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("article_views")
      .select("slug, view_count");
    const map: Record<string, number> = {};
    if (data) {
      for (const row of data) {
        map[row.slug] = row.view_count;
      }
    }
    return map;
  } catch {
    return {};
  }
}

export default async function MyFavoritesPage() {
  const [articles, viewCounts] = await Promise.all([
    getArticles(),
    getViewCounts(),
  ]);

  return (
    <>
      <FavoritesList articles={articles} viewCounts={viewCounts} />
      <BackToTopButton />
    </>
  );
}
