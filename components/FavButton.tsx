"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { addFavorite, removeFavorite, isFavorited } from "@/supabase/favorites";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

interface FavButtonProps {
  articleSlug: string;
}

/**
 * Favorite button component (used in each article page)
 * @param articleSlug - The slug of the current article
 */
const FavButton: React.FC<FavButtonProps> = ({ articleSlug }) => {
  const [user, setUser] = useState<any>(null);
  const [favorited, setFavorited] = useState<boolean>(false);
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

  // Check if the current article is favorited
  useEffect(() => {
    async function checkFavorite() {
      if (user) {
        const { favorited, error } = await isFavorited(user.id, articleSlug);
        if (error) {
          console.error("Error checking favorite status:", error);
        } else {
          setFavorited(favorited);
        }
      }
    }
    checkFavorite();
  }, [user, articleSlug]);

  if (!user) return null; // Show only if user is logged in

  const handleToggleFavorite = async () => {
    if (favorited) {
      const { error } = await removeFavorite(user.id, articleSlug);
      if (error) {
        toast.error("Failed to remove favorite: " + error.message, {
          theme: "colored",
        });
      } else {
        toast.success("Removed from favorites!", { theme: "colored" });
        setFavorited(false);
      }
    } else {
      const { error } = await addFavorite(user.id, articleSlug);
      if (error) {
        toast.error("Failed to add favorite: " + error.message, {
          theme: "colored",
        });
      } else {
        toast.success("Added to favorites!", { theme: "colored" });
        setFavorited(true);
      }
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "2rem",
        background: favorited ? "var(--hover-link-color)" : "var(--link-color)",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "3.5rem",
        height: "3.5rem",
        cursor: "pointer",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
        fontFamily: "Inter, sans-serif",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      }}
    >
      {favorited ? <FaStar size={20} /> : <FaRegStar size={20} />}
    </button>
  );
};

export default FavButton;
