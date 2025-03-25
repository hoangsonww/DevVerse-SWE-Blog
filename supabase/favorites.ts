import { supabase } from "./supabaseClient";

export const addFavorite = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .insert([{ user_id: userId, article_slug: articleSlug }]);
  return { data, error };
};

export const removeFavorite = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .delete()
    .eq("user_id", userId)
    .eq("article_slug", articleSlug);
  return { data, error };
};

export const isFavorited = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .select("*")
    .eq("user_id", userId)
    .eq("article_slug", articleSlug)
    .maybeSingle();
  return { favorited: !!data, error };
};


export const getFavoriteSlugs = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorite_articles")
    .select("article_slug")
    .eq("user_id", userId);
  if (error) return { data: [], error };
  const slugs = data.map((fav: any) => fav.article_slug);
  return { data: slugs, error: null };
};
