import { supabase } from "./supabaseClient";

/**
 * Increment the view count for an article.
 * Uses the server-side RPC function for atomic upsert.
 */
export async function trackView(slug: string): Promise<void> {
  await supabase.rpc("increment_view_count", { article_slug: slug });
}

/**
 * Get the view count for a single article.
 */
export async function getViewCount(slug: string): Promise<number> {
  const { data } = await supabase
    .from("article_views")
    .select("view_count")
    .eq("slug", slug)
    .maybeSingle();
  return data?.view_count ?? 0;
}

/**
 * Get view counts for multiple articles at once.
 * Returns a map of slug -> view_count.
 */
export async function getViewCounts(
  slugs: string[],
): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const { data } = await supabase
    .from("article_views")
    .select("slug, view_count")
    .in("slug", slugs);
  const map: Record<string, number> = {};
  if (data) {
    for (const row of data) {
      map[row.slug] = row.view_count;
    }
  }
  return map;
}

/**
 * Get all view counts (for the home page).
 * Returns a map of slug -> view_count.
 */
export async function getAllViewCounts(): Promise<Record<string, number>> {
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
}
