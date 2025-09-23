import { supabase } from "./supabaseClient";

export type ReactionType = "like" | "love" | "fire" | "idea";

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  fire: "🔥",
  idea: "💡",
};

/**
 * Adds a reaction to an article
 * @param userId The user ID
 * @param articleSlug The article slug
 * @param reactionType The type of reaction
 */
export const addReaction = async (
  userId: string,
  articleSlug: string,
  reactionType: ReactionType,
) => {
  const { data, error } = await supabase
    .from("article_reactions")
    .insert([
      {
        user_id: userId,
        article_slug: articleSlug,
        reaction_type: reactionType,
      },
    ]);
  return { data, error };
};

/**
 * Removes a reaction from an article
 * @param userId The user ID
 * @param articleSlug The article slug
 * @param reactionType The type of reaction
 */
export const removeReaction = async (
  userId: string,
  articleSlug: string,
  reactionType: ReactionType,
) => {
  const { data, error } = await supabase
    .from("article_reactions")
    .delete()
    .eq("user_id", userId)
    .eq("article_slug", articleSlug)
    .eq("reaction_type", reactionType);
  return { data, error };
};

/**
 * Checks if a user has reacted to an article with a specific reaction type
 * @param userId The user ID
 * @param articleSlug The article slug
 * @param reactionType The type of reaction
 */
export const hasUserReacted = async (
  userId: string,
  articleSlug: string,
  reactionType: ReactionType,
) => {
  const { data, error } = await supabase
    .from("article_reactions")
    .select("*")
    .eq("user_id", userId)
    .eq("article_slug", articleSlug)
    .eq("reaction_type", reactionType)
    .maybeSingle();
  return { hasReacted: !!data, error };
};

/**
 * Gets all reactions for an article with counts
 * @param articleSlug The article slug
 */
export const getArticleReactions = async (articleSlug: string) => {
  const { data, error } = await supabase
    .from("article_reactions")
    .select("reaction_type")
    .eq("article_slug", articleSlug);

  if (error) return { reactions: {}, error };

  // Count reactions by type
  const reactions: Record<ReactionType, number> = {
    like: 0,
    love: 0,
    fire: 0,
    idea: 0,
  };

  data?.forEach((reaction) => {
    const type = reaction.reaction_type as ReactionType;
    if (type in reactions) {
      reactions[type]++;
    }
  });

  return { reactions, error: null };
};

/**
 * Gets user's reactions for an article
 * @param userId The user ID
 * @param articleSlug The article slug
 */
export const getUserReactions = async (userId: string, articleSlug: string) => {
  const { data, error } = await supabase
    .from("article_reactions")
    .select("reaction_type")
    .eq("user_id", userId)
    .eq("article_slug", articleSlug);

  if (error) return { userReactions: [], error };

  const userReactions = data?.map((r) => r.reaction_type as ReactionType) || [];
  return { userReactions, error: null };
};
