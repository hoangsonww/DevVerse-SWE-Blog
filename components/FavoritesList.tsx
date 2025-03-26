"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArticlesList from "./ArticlesList";
import { Article } from "@/lib/articles";
import { getFavoriteSlugs } from "@/supabase/favorites";
import { FaSearch } from "react-icons/fa";

interface FavoritesListProps {
  articles: Article[];
}

export default function FavoritesList({ articles }: FavoritesListProps) {
  const [mounted, setMounted] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState<Article[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((term: string, favs: Article[]) => {
      setFilteredFavorites(
        term
          ? favs.filter(
              (a) =>
                a.title.toLowerCase().includes(term.toLowerCase()) ||
                a.description?.toLowerCase().includes(term.toLowerCase()),
            )
          : favs,
      );
    }, 300),
    [],
  );

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
    handleSearch(searchTerm, favs);
  }, [articles, favoriteSlugs, searchTerm, handleSearch]);

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "var(--background-color)",
        borderRadius: "8px",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          color: "var(--text-color)",
          opacity: 1,
          transform: "translateY(0)",
          animation: "fadeSlideIn 0.6s ease forwards",
        }}
      >
        Favorite Articles 📚
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          marginBottom: "2rem",
          color: "var(--text-color)",
          opacity: 0,
          animation: "fadeInText 0.6s ease forwards",
          animationDelay: "0.3s",
        }}
      >
        {user
          ? `Welcome, ${user.user_metadata.display_name ?? user.email}! Here are your favorites:`
          : "Please log in to view your favorite articles."}
      </p>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <div
          className={`search-bar ${isFocused || searchTerm ? "expanded" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1rem",
            border: "2px solid var(--border-color, #ccc)",
            borderRadius: "12px",
            backgroundColor: "var(--container-background)",
            gap: "0.75rem", // 👈 adds space between icon and input
            width: isFocused || searchTerm ? "500px" : "400px",
            transition: "width 0.3s ease-in-out, background-color 0.3s ease",
          }}
        >
          <FaSearch
            className={`search-icon ${isFocused ? "focused" : ""}`}
            style={{
              color: isFocused ? "#0070f3" : "var(--text-color)",
              transition: "color 0.3s ease",
            }}
          />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "1rem",
              fontFamily: "inherit",
              backgroundColor: "transparent",
              color: "var(--text-color)",
            }}
          />
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : filteredFavorites.length ? (
        <ArticlesList articles={filteredFavorites} />
      ) : (
        <p className="no-favorites-message">
          You have no favorite articles.
        </p>
      )}
      <style jsx>{`
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

        .search-bar {
          display: flex;
          align-items: center;
          background-color: var(--container-background);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          width: 400px;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: fadeInSearch 0.3s ease forwards;
          transition: width 0.3s, box-shadow 0.3s, background-color 0.3s;
        }

        .search-bar.expanded {
          width: 500px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
          color: var(--text-color);
          font-family: "Inter", sans-serif;
          font-size: 1rem;
        }

        .search-icon {
          margin-right: 0.75rem;
          color: var(--text-color);
          transition: color 0.2s ease;
        }

        .search-icon.focused {
          color: #0070f3;
        }

        @keyframes fadeInSearch {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .loading-text {
          color: var(--text-color);
          opacity: 0;
          animation: fadeInLoading 0.5s ease forwards;
        }

        @keyframes fadeInLoading {
          to {
            opacity: 1;
          }
        }

        .no-favorites-message {
          color: var(--text-color);
          opacity: 0;
          animation: fadeInNoFav 0.5s ease forwards;
        }

        @keyframes fadeInNoFav {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
