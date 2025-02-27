"use client";
import React, { useState } from "react";
import InteractiveCard from "./InteractiveCard";
import { FaTags } from "react-icons/fa";
import { motion } from "framer-motion";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

interface ArticlesListProps {
  articles: Article[];
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  // Collect all distinct topics across the articles.
  const allTopicsSet = new Set<string>();
  articles.forEach((article) => {
    article.topics.forEach((topic) => allTopicsSet.add(topic));
  });
  const allTopics = Array.from(allTopicsSet).sort();

  // State for the currently selected topic and how many articles to show.
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 articles initially
  // State for how many topics are visible.
  const [visibleTopicsCount, setVisibleTopicsCount] = useState(10);

  // Filter the articles by the selected topic (if any).
  const filteredArticles = selectedTopic
    ? articles.filter((article) => article.topics.includes(selectedTopic))
    : articles;

  // Slice the filtered list to show only the visible portion.
  const displayedArticles = filteredArticles.slice(0, visibleCount);
  // Only show a subset of topics.
  const displayedTopics = allTopics.slice(0, visibleTopicsCount);

  // Prepare values for the dynamic count display.
  const totalFiltered = filteredArticles.length;
  const totalDisplayed = displayedArticles.length;

  return (
    <div>
      {/* Topic Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2rem", textAlign: "center" }}
      >
        <h2>Filter by Topic</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          {/* Button for All Topics */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setSelectedTopic(null);
              setVisibleCount(10); // Reset when changing topics
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #0070f3",
              backgroundColor: selectedTopic === null ? "#0070f3" : "#fff",
              color: selectedTopic === null ? "#fff" : "#0070f3",
              cursor: "pointer",
              transition: "background-color 0.2s",
              font: "inherit",
            }}
          >
            <FaTags style={{ marginRight: "0.5rem" }} />
            All Topics
          </motion.button>

          {/* Buttons for Each Topic (limited by visibleTopicsCount) */}
          {displayedTopics.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedTopic(topic);
                setVisibleCount(10); // Reset when changing topics
              }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #0070f3",
                backgroundColor: selectedTopic === topic ? "#0070f3" : "#fff",
                color: selectedTopic === topic ? "#fff" : "#0070f3",
                cursor: "pointer",
                transition: "background-color 0.2s",
                font: "inherit",
              }}
            >
              <FaTags style={{ marginRight: "0.5rem" }} />
              {topic}
            </motion.button>
          ))}

          {/* More Topics Button */}
          {visibleTopicsCount < allTopics.length && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setVisibleTopicsCount((prev) => prev + 10)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "2px dashed #0070f3",
                backgroundColor: "#fff",
                color: "#0070f3",
                cursor: "pointer",
                transition: "background-color 0.2s",
                font: "inherit",
              }}
            >
              More Topics ...
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Articles Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, duration: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
        }}
      >
        {displayedArticles.map((article) => (
          <InteractiveCard
            key={article.slug}
            slug={article.slug}
            title={article.title}
            description={article.description}
          />
        ))}
      </motion.div>

      {/* Load More Articles Button */}
      {visibleCount < filteredArticles.length && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVisibleCount((prev) => prev + 10)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "2px solid #0070f3",
              backgroundColor: "#0070f3",
              color: "#fff",
              cursor: "pointer",
              transition: "background-color 0.2s",
              font: "inherit",
              fontSize: "1rem",
            }}
          >
            Load More Articles
            <motion.span
              style={{ marginLeft: "0.5rem" }}
              initial={{ y: 0 }}
              animate={{ y: 3 }}
              transition={{ yoyo: Infinity, duration: 0.5 }}
            >
              ↓
            </motion.span>
          </motion.button>
        </div>
      )}

      {/* Dynamic Article Count */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        {totalFiltered > 0 ? (
          <p>
            Showing <strong>1 – {totalDisplayed}</strong> of{" "}
            <strong>{totalFiltered}</strong> article
            {totalFiltered === 1 ? "" : "s"}
          </p>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
}
