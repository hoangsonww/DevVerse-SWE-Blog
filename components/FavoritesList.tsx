"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArticlesList from "./ArticlesList";
import { Article } from "@/lib/articles";
import { getFavoriteSlugs } from "@/supabase/favorites";
import { FaSpinner } from "react-icons/fa";

interface FavoritesListProps {
  articles: Article[];
  viewCounts?: Record<string, number>;
}

export default function FavoritesList({
  articles,
  viewCounts: serverViewCounts,
}: FavoritesListProps) {
  const [mounted, setMounted] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filteredFavorites, setFilteredFavorites] = useState<Article[]>([]);
  const viewCounts = serverViewCounts ?? {};
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Please log in to view your favorites", {
          theme: "colored",
        });
        router.push("/auth/login");
        return;
      }
      setUser(session.user);
      const { data, error } = await getFavoriteSlugs(session.user.id);
      if (error) toast.error(error.message, { theme: "colored" });
      else setFavoriteSlugs(data || []);
      setLoading(false);
    }
    if (mounted) fetchFavorites();
  }, [mounted, router]);

  useEffect(() => {
    const favs = articles.filter((a) => favoriteSlugs.includes(a.slug));
    setFilteredFavorites(favs);
  }, [articles, favoriteSlugs]);

  if (!mounted) return null;

  return (
    <div
      className="favorites-page"
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "var(--background-color)",
        borderRadius: "8px",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="favorites-hero">
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            color: "var(--text-color)",
            animation: "fadeSlideIn 0.6s ease forwards",
          }}
        >
          Favorite Articles
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            marginBottom: "2rem",
            color: "var(--text-color)",
            opacity: 0,
            animation: "fadeInText 0.6s ease forwards",
            animationDelay: "0.3s",
          }}
        >
          {user
            ? `Welcome back, ${user.user_metadata.display_name ?? user.email}. Here are your saved articles.`
            : "Please log in to view your favorite articles."}
        </p>
      </div>

      <div className="favorites-content">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <FaSpinner className="spinner" size={32} />
            <span className="loading-text">Loading…</span>
          </div>
        ) : favoriteSlugs.length === 0 ? (
          <p className="no-favorites-message">
            You have no favorite articles yet. Browse articles and click the
            star to save them here.
          </p>
        ) : (
          <div className="articles-list-wrapper">
            <ArticlesList
              articles={filteredFavorites}
              viewCounts={viewCounts}
              showSearch={true}
              showCarousel={false}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .articles-list-wrapper {
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInText {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .favorites-hero {
          text-align: center;
        }

        .favorites-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: left;
        }

        .no-favorites-message {
          color: var(--text-color);
          text-align: center;
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
          font-size: 1.05rem;
          line-height: 1.6;
          padding: 2rem;
        }

        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
          margin-right: 1rem;
          color: var(--text-color);
        }

        .loading-text {
          color: var(--text-color);
          font-size: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
