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
  // Compute distinct topics across all articles.
  const allTopicsSet = new Set<string>();
  articles.forEach((article) => {
    article.topics.forEach((topic) => allTopicsSet.add(topic));
  });
  const allTopics = Array.from(allTopicsSet).sort();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 articles initially

  const filteredArticles = selectedTopic
    ? articles.filter((article) => article.topics.includes(selectedTopic))
    : articles;

  const displayedArticles = filteredArticles.slice(0, visibleCount);

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
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setSelectedTopic(null);
              setVisibleCount(10); // Reset visible articles when topic is changed
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
          {allTopics.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedTopic(topic);
                setVisibleCount(10); // Reset visible articles when topic is changed
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

      {/* Load More Button */}
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
          </motion.button>
        </div>
      )}
    </div>
  );
}
