"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
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
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          color: "var(--text-color)",
        }}
      >
        Favorite Articles 📚
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          fontSize: "1.125rem",
          marginBottom: "2rem",
          color: "var(--text-color)",
        }}
      >
        {user
          ? `Welcome, ${user.user_metadata.display_name ?? user.email}! Here are your favorites:`
          : "Please log in to view your favorite articles."}
      </motion.p>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          whileFocus={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--container-background)",
            border: "2px solid var(--border-color)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            width: isFocused || searchTerm ? "500px" : "400px",
            transition: "width 0.3s",
          }}
        >
          <FaSearch
            style={{
              marginRight: "0.75rem",
              color: isFocused ? "#0070f3" : "var(--text-color)",
            }}
          />
          <motion.input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
              color: "var(--text-color)",
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
            }}
          />
        </motion.div>
      </div>

      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ color: "var(--text-color)" }}
        >
          Loading...
        </motion.p>
      ) : filteredFavorites.length ? (
        <ArticlesList articles={filteredFavorites} />
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ color: "var(--text-color)" }}
        >
          You have no favorite articles.
        </motion.p>
      )}
    </div>
  );
}
