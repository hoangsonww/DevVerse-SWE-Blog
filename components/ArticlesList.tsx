"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaTags, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

  const searchParams = useSearchParams();

  // State for the currently selected topics and how many articles to show.
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 articles initially
  // State for how many topics are visible.
  const [visibleTopicsCount, setVisibleTopicsCount] = useState(10);
  const [showOnlyMessage, setShowOnlyMessage] = useState(false);

  // Filter the articles by the selected topics (if any).
  // Now an article is displayed only if it matches every selected topic.
  const filteredArticles =
    selectedTopics.length > 0
      ? articles.filter((article) =>
          selectedTopics.every((topic) => article.topics.includes(topic)),
        )
      : articles;

  // Slice the filtered list to show only the visible portion.
  const displayedArticles = filteredArticles.slice(0, visibleCount);
  // Only show a subset of topics.
  const displayedTopics = allTopics.slice(0, visibleTopicsCount);

  // Prepare values for the dynamic count display.
  const totalFiltered = filteredArticles.length;
  const totalDisplayed = displayedArticles.length;

  // Toggle topic selection.
  const toggleTopic = (topic: string) => {
    setVisibleCount(10); // Reset visible articles when changing selection
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topic)
        ? prevSelected.filter((t) => t !== topic)
        : [...prevSelected, topic],
    );
  };

  // Clear all selections.
  const clearSelection = () => {
    setVisibleCount(10); // Reset visible articles when clearing selection
    setSelectedTopics([]);
  };

  const [initialized, setInitialized] = useState(false);
  const extraTopics = selectedTopics.filter(
    (t) => !displayedTopics.includes(t),
  );
  const topicsToShow = [...displayedTopics, ...extraTopics];

  useEffect(() => {
    if (!initialized) {
      const param = searchParams.get("topics");
      if (param) {
        setSelectedTopics(param.split(","));
      }
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  return (
    <div>
      {/* Topic Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2rem", textAlign: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <h2>Filter by Topic</h2>
          <motion.div
            onClick={() => setShowOnlyMessage((prev) => !prev)}
            whileHover={{ scale: 1.1 }}
            style={{ cursor: "pointer" }}
          >
            {showOnlyMessage ? (
              <FaChevronUp size={20} />
            ) : (
              <FaChevronDown size={20} />
            )}
          </motion.div>
        </div>

        {showOnlyMessage && (
          <p
            style={{
              maxWidth: "80%",
              textAlign: "center",
              margin: "0 auto",
            }}
          >
            You can select multiple topics to filter the articles. If you select
            more than one topic, only articles that match all selected topics
            will be shown. 🧠
          </p>
        )}

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
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={clearSelection}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #0070f3",
              backgroundColor: selectedTopics.length === 0 ? "#0070f3" : "#fff",
              color: selectedTopics.length === 0 ? "#fff" : "#0070f3",
              cursor: "pointer",
              transition: "background-color 0.2s",
              font: "inherit",
            }}
          >
            <FaTags style={{ marginRight: "0.5rem" }} />
            All Topics
          </motion.button>

          {/* Buttons for Each Topic (limited by visibleTopicsCount) */}
          {topicsToShow.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleTopic(topic)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #0070f3",
                backgroundColor: selectedTopics.includes(topic)
                  ? "#0070f3"
                  : "#fff",
                color: selectedTopics.includes(topic) ? "#fff" : "#0070f3",
                cursor: "pointer",
                transition: "background-color 0.2s",
                font: "inherit",
              }}
            >
              <FaTags style={{ marginRight: "0.5rem" }} />
              {topic}
            </motion.button>
          ))}

          {/* Clear Selection Button */}
          {selectedTopics.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={clearSelection}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #0070f3",
                backgroundColor: "#fff",
                color: "#0070f3",
                cursor: "pointer",
                transition: "background-color 0.2s",
                font: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaTimes style={{ marginRight: "0.5rem" }} />
              Clear Selection
            </motion.button>
          )}

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
