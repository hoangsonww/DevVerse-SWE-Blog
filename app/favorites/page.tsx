import React from "react";
import FavoritesList from "@/components/FavoritesList";
import { getArticles, Article } from "@/lib/articles";
import BackToTopButton from "@/components/BackToTopButton";

export const revalidate = 60; // Enable ISR: regenerate this page every 60 seconds

/**
 * My Favorites page, enhanced with SSG to fetch articles at build time. Helps with SEO.
 */
export default async function MyFavoritesPage() {
  const articles: Article[] = await getArticles();

  return (
    <>
      <FavoritesList articles={articles} />
      <BackToTopButton />
    </>
  );
}
