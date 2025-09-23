"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import {
  addReaction,
  removeReaction,
  getArticleReactions,
  getUserReactions,
  ReactionType,
  REACTION_EMOJIS,
} from "@/supabase/reactions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface ReactionsBarProps {
  articleSlug: string;
}

/**
 * Reactions bar component for article reactions
 * @param articleSlug - The slug of the current article
 */
const ReactionsBar: React.FC<ReactionsBarProps> = ({ articleSlug }) => {
  const [user, setUser] = useState<any>(null);
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    like: 0,
    love: 0,
    fire: 0,
    idea: 0,
  });
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user session
  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Fetch reactions data
  useEffect(() => {
    async function fetchReactions() {
      const { reactions: articleReactions, error: reactionsError } =
        await getArticleReactions(articleSlug);
      if (reactionsError) {
        console.error("Error fetching reactions:", reactionsError);
      } else {
        setReactions(articleReactions);
      }

      if (user) {
        const { userReactions: userReactionsList, error: userError } =
          await getUserReactions(user.id, articleSlug);
        if (userError) {
          console.error("Error fetching user reactions:", userError);
        } else {
          setUserReactions(userReactionsList);
        }
      }
      setLoading(false);
    }

    fetchReactions();
  }, [user, articleSlug]);

  // Real-time subscription for reactions
  useEffect(() => {
    const channel = supabase
      .channel(`reactions:${articleSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "article_reactions",
          filter: `article_slug=eq.${articleSlug}`,
        },
        (payload) => {
          console.log("Reaction change received:", payload);
          // Refetch reactions when changes occur
          getArticleReactions(articleSlug).then(
            ({ reactions: updatedReactions, error }) => {
              if (!error) {
                setReactions(updatedReactions);
              }
            },
          );

          // Update user reactions if user is logged in
          if (user) {
            getUserReactions(user.id, articleSlug).then(
              ({ userReactions: updatedUserReactions, error }) => {
                if (!error) {
                  setUserReactions(updatedUserReactions);
                }
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleSlug, user]);

  const handleReaction = async (reactionType: ReactionType) => {
    if (!user) {
      toast.info("Please log in to react to articles!", {
        theme: "colored",
      });
      router.push("/auth/login");
      return;
    }

    const hasReacted = userReactions.includes(reactionType);

    // Optimistic update
    if (hasReacted) {
      setReactions((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType] - 1),
      }));
      setUserReactions((prev) => prev.filter((type) => type !== reactionType));
    } else {
      setReactions((prev) => ({
        ...prev,
        [reactionType]: prev[reactionType] + 1,
      }));
      setUserReactions((prev) => [...prev, reactionType]);
    }

    // Make API call
    const { error } = hasReacted
      ? await removeReaction(user.id, articleSlug, reactionType)
      : await addReaction(user.id, articleSlug, reactionType);

    if (error) {
      // Revert optimistic update on error
      if (hasReacted) {
        setReactions((prev) => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1,
        }));
        setUserReactions((prev) => [...prev, reactionType]);
      } else {
        setReactions((prev) => ({
          ...prev,
          [reactionType]: Math.max(0, prev[reactionType] - 1),
        }));
        setUserReactions((prev) =>
          prev.filter((type) => type !== reactionType),
        );
      }

      toast.error(
        `Failed to ${hasReacted ? "remove" : "add"} reaction: ${error.message}`,
        {
          theme: "colored",
        },
      );
    } else {
      const action = hasReacted ? "removed" : "added";
      const emoji = REACTION_EMOJIS[reactionType];
      toast.success(`Reaction ${action}! ${emoji}`, {
        theme: "colored",
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
          color: "var(--text-color)",
        }}
      >
        Loading reactions...
      </div>
    );
  }

  const reactionTypes: ReactionType[] = ["like", "love", "fire", "idea"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "1.5rem",
        marginTop: "2rem",
        borderTop: "1px solid var(--border-color, #e5e7eb)",
        backgroundColor: "var(--card-background, #ffffff)",
        borderRadius: "0.5rem",
        fontFamily: "Inter, sans-serif",
        flexWrap: "wrap",
      }}
    >
      {reactionTypes.map((type) => {
        const count = reactions[type];
        const hasReacted = userReactions.includes(type);
        const emoji = REACTION_EMOJIS[type];

        return (
          <motion.button
            key={type}
            onClick={() => handleReaction(type)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "2rem",
              border: hasReacted
                ? "2px solid var(--link-color, #3b82f6)"
                : "2px solid var(--border-color, #e5e7eb)",
              backgroundColor: hasReacted
                ? "var(--link-color, #3b82f6)"
                : "var(--background-color, #ffffff)",
              color: hasReacted ? "#ffffff" : "var(--text-color, #374151)",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              minWidth: "3rem",
              justifyContent: "center",
              boxShadow: hasReacted
                ? "0 2px 4px rgba(59, 130, 246, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              if (!hasReacted) {
                e.currentTarget.style.backgroundColor =
                  "var(--hover-background, #f3f4f6)";
                e.currentTarget.style.borderColor =
                  "var(--link-color, #3b82f6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!hasReacted) {
                e.currentTarget.style.backgroundColor =
                  "var(--background-color, #ffffff)";
                e.currentTarget.style.borderColor =
                  "var(--border-color, #e5e7eb)";
              }
            }}
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} this article`}
          >
            <span style={{ fontSize: "1.125rem" }}>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ReactionsBar;
