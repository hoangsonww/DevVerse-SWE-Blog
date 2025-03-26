import React from "react";
import FavoritesList from "@/components/FavoritesList";
import { getArticles, Article } from "@/lib/articles";
import BackToTopButton from "@/components/BackToTopButton";
import TriggerReload from "@/components/TriggerReload";

export const revalidate = 60;

export default async function MyFavoritesPage() {
  const articles: Article[] = await getArticles();

  return (
    <>
      {/* This client component will force a reload immediately on page load */}
      <TriggerReload />
      <FavoritesList articles={articles} />
      <BackToTopButton />
    </>
  );
}
