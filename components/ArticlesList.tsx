"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaTags, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

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
      <div className="fade-slide-up" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div className="filter-header">
          <h2>Filter by Topic</h2>
          <div className="toggle-icon" onClick={() => setShowOnlyMessage((prev) => !prev)}>
            {showOnlyMessage ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </div>
        </div>

        <div className={`filter-description ${showOnlyMessage ? "open" : ""}`} style={{ marginTop: 0 }}>
          <p>
            You can select multiple topics to filter the articles. If you select more than one topic,
            only articles that match all selected topics will be shown. 🧠
          </p>
        </div>

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
          <button className="topic-btn all-topics" onClick={clearSelection}>
            <FaTags style={{ marginRight: "0.5rem" }} />
            All Topics
          </button>

          {topicsToShow.map((topic) => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopics.includes(topic) ? "selected" : ""}`}
              onClick={() => toggleTopic(topic)}
            >
              <FaTags style={{ marginRight: "0.5rem" }} />
              {topic}
            </button>
          ))}

          {selectedTopics.length > 0 && (
            <button className="topic-btn clear-btn" onClick={clearSelection}>
              <FaTimes style={{ marginRight: "0.5rem" }} />
              Clear Selection
            </button>
          )}

          {visibleTopicsCount < allTopics.length && (
            <button className="topic-btn more-btn" onClick={() => setVisibleTopicsCount(prev => prev + 10)}>
              More Topics ...
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div
        className="article-grid"
      >
        {displayedArticles.map((article, index) => (
          <div
            key={article.slug}
            className="fade-in-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <InteractiveCard
              slug={article.slug}
              title={article.title}
              description={article.description}
            />
          </div>
        ))}
      </div>

      {/* Load More Articles Button */}
      {visibleCount < filteredArticles.length && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="load-more-btn" onClick={() => setVisibleCount((prev) => prev + 10)}>
            Load More Articles
            <span className="arrow">↓</span>
          </button>
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

      <style jsx>{`
          .topic-btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            border: 1px solid #0070f3;
            background-color: #fff;
            color: #0070f3;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s;
            font: inherit;
            display: flex;
            align-items: center;
          }
        
          .topic-btn.selected {
            background-color: #0070f3;
            color: #fff;
          }
        
          .topic-btn.clear-btn {
            color: red;
          }
        
          .topic-btn.more-btn {
            border: 2px dashed #0070f3;
          }
        
          .topic-btn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            background-color: #0070f3;
            color: #fff;
          }

          .toggle-icon {
            cursor: pointer;
            display: inline-block;
            transition: transform 0.2s ease;
          }
          .toggle-icon:hover {
            transform: scale(1.1);
          }

          .load-more-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: 2px solid #0070f3;
            background-color: #0070f3;
            color: #fff;
            font-size: 1rem;
            font-family: inherit;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .load-more-btn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          }

          .arrow {
            display: inline-block;
            animation: bounce 0.5s infinite alternate;
          }

          @keyframes bounce {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(3px);
            }
          }

          .fade-slide-up {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeSlideUp 0.5s ease-out forwards;
          }

          @keyframes fadeSlideUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .article-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
          }

          .fade-in-card {
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }

          .slide-container {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, opacity 0.3s ease, margin-top 0.3s ease;
            margin-top: 0;
            margin-bottom: 1rem;
          }

          .slide-container.open {
            max-height: 150px;
            opacity: 1;
            margin-top: 1rem;
          }

          .slide-text {
            max-width: 80%;
            margin: 0 auto;
            text-align: center;
            line-height: 1.6;
            color: var(--text-color);
          }

          .filter-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }

          .toggle-icon {
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .toggle-icon:hover {
            transform: scale(1.15);
          }

          .filter-description {
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.4s ease;
            display: flex;
            justify-content: center;
          }

          .filter-description.open {
            max-height: 200px;
            opacity: 1;
            transform: translateY(0);
            margin-top: 1rem;
          }

          .filter-description p {
            max-width: 80%;
            text-align: center;
            color: var(--text-color);
            transition: color 0.3s ease;
            line-height: 1.6;
          }
      `}</style>
    </div>
  );
}
