"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { addFavorite, removeFavorite, isFavorited } from "@/supabase/favorites";
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

  const tooltipText = favorited ? "Remove from favorites" : "Add to favorites";

  return (
    <div className="fav-button-wrapper">
      <button
        onClick={handleToggleFavorite}
        aria-label={tooltipText}
        className="fav-button"
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
      <span className="fav-tooltip" role="tooltip">
        {tooltipText}
      </span>

      <style jsx>{`
        .fav-button-wrapper {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 1000;
        }

        .fav-button {
          background: ${favorited
            ? "var(--hover-link-color)"
            : "var(--link-color)"};
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 3.5rem;
          height: 3.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          font-family: "Inter, sans-serif";
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .fav-tooltip {
          position: absolute;
          left: calc(100% + 0.6rem);
          top: 50%;
          transform: translate(4px, -50%);
          background: var(--container-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 0.4rem 0.65rem;
          font-size: 0.85rem;
          white-space: nowrap;
          max-width: calc(100vw - 2.5rem);
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.18);
        }

        .fav-button-wrapper:hover .fav-tooltip,
        .fav-button:focus-visible + .fav-tooltip {
          opacity: 1;
          transform: translate(0, -50%);
        }
      `}</style>
    </div>
  );
};

export default FavButton;
