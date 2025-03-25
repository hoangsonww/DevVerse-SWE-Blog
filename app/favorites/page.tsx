import React from "react";
import FavoritesList from "@/components/FavoritesList";
import { getArticles, Article } from "@/lib/articles";

export const revalidate = 60;

export default async function MyFavoritesPage() {
  const articles: Article[] = await getArticles();

  return <FavoritesList articles={articles} />;
}
