import { supabase } from "./supabaseClient";

/**
 * Adds an article to the user's favorites
 * @param userId The user ID
 * @param articleSlug The article slug
 */
export const addFavorite = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .insert([{ user_id: userId, article_slug: articleSlug }]);
  return { data, error };
};

/**
 * Removes an article from the user's favorites
 * @param userId The user ID
 * @param articleSlug The article slug
 */
export const removeFavorite = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .delete()
    .eq("user_id", userId)
    .eq("article_slug", articleSlug);
  return { data, error };
};

/**
 * Checks if an article is favorited by the user
 * @param userId The user ID
 * @param articleSlug The article slug
 */
export const isFavorited = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .select("*")
    .eq("user_id", userId)
    .eq("article_slug", articleSlug)
    .maybeSingle();
  return { favorited: !!data, error };
};

/**
 * This function gets all the favorite article slugs for a user
 * @param userId The user ID
 */
export const getFavoriteSlugs = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .select("article_slug")
    .eq("user_id", userId);
  if (error) return { data: [], error };
  const slugs = data.map((fav: any) => fav.article_slug);
  return { data: slugs, error: null };
};
