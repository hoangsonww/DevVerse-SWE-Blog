"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaTags, FaTimes, FaSearch, FaInfoCircle } from "react-icons/fa";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
  readingMinutes?: number;
  excerpt?: string;
}

interface ArticlesListProps {
  articles: Article[];
  showSearch?: boolean;
}

export default function ArticlesList({
  articles,
  showSearch = true,
}: ArticlesListProps) {
  // Collect all distinct topics across the articles.
  const allTopicsSet = new Set<string>();
  articles.forEach((article) => {
    article.topics.forEach((topic) => allTopicsSet.add(topic));
  });
  const allTopics = Array.from(allTopicsSet).sort();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // State for the currently selected topics and how many articles to show.
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 articles initially
  // State for how many topics are visible.
  const [visibleTopicsCount, setVisibleTopicsCount] = useState(10);

  useEffect(() => {
    if (!showSearch) return;
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") ?? "";
    setSearchTerm(initialSearch);
  }, [showSearch]);

  useEffect(() => {
    if (!showSearch) return;
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    // leave topics untouched
    const query = params.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [searchTerm, router, showSearch]);

  useEffect(() => {
    if (!showSearch) return;
    setVisibleCount(10);
  }, [searchTerm, showSearch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const headerKicker = showSearch ? "Search & Filter" : "Topic Filters";
  const headerTitle = showSearch
    ? "Find the right article fast."
    : "Refine the list by topic.";
  const headerSubtitle = showSearch
    ? "Search by keyword, then refine with topic filters."
    : "Select one or more topics to narrow the results.";

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTopics =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) => article.topics.includes(topic));
      if (!matchesTopics) return false;
      if (!normalizedSearch) return true;
      const haystack = [article.title, article.description, article.excerpt]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [articles, normalizedSearch, selectedTopics]);

  // Slice the filtered list to show only the visible portion.
  const displayedArticles = filteredArticles.slice(0, visibleCount);
  // Only show a subset of topics.
  const displayedTopics = allTopics.slice(0, visibleTopicsCount);

  // Prepare values for the dynamic count display.
  const totalFiltered = filteredArticles.length;
  const totalDisplayed = displayedArticles.length;

  const allCardElements = useMemo(
    () =>
      filteredArticles.map((article, i) => (
        <div
          key={article.slug}
          className="fade-in-card"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <InteractiveCard
            slug={article.slug}
            title={article.title}
            description={article.description || article.excerpt}
            readingTimeMinutes={article.readingMinutes}
          />
        </div>
      )),
    [filteredArticles],
  );

  const displayedCardElements = allCardElements.slice(0, visibleCount);

  // Toggle topic selection
  const updateURL = (topics: string[]) => {
    const params = new URLSearchParams(window.location.search);

    // Update topics
    if (topics.length) {
      params.set("topics", topics.join(","));
    } else {
      params.delete("topics");
    }

    // Leave any existing ?search intact
    const queryString = params.toString();
    router.replace(
      `${window.location.pathname}${queryString ? `?${queryString}` : ""}`,
      { scroll: false },
    );
  };

  const toggleTopic = (topic: string) => {
    setVisibleCount(10);
    setSelectedTopics((prev) => {
      const next = prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic];
      updateURL(next);
      return next;
    });
  };

  // Clear all selections.
  const clearSelection = () => {
    setVisibleCount(10); // Reset visible articles when clearing selection
    setSelectedTopics([]);
    updateURL([]);
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
      <div className="search-filter-shell fade-slide-up">
        <div className="search-filter-header">
          <div>
            <p className="search-filter-kicker">{headerKicker}</p>
            <h2 className="search-filter-title">{headerTitle}</h2>
            <p className="search-filter-subtitle">{headerSubtitle}</p>
          </div>
          <button className="filter-tip" type="button" aria-label="Filter tips">
            <FaInfoCircle aria-hidden="true" />
            <span className="filter-tooltip">
              Select multiple topics to narrow results. Articles shown will
              match every selected topic so you can stay focused.
            </span>
          </button>
        </div>

        {showSearch && (
          <div className={`search-field ${isSearchFocused ? "focused" : ""}`}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search articles, frameworks, or tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}

        <div className="filter-topics">
          <button
            className={`topic-btn all-topics ${selectedTopics.length === 0 ? "selected" : ""}`}
            onClick={clearSelection}
          >
            <FaTags />
            All Topics
          </button>

          {topicsToShow.map((topic) => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopics.includes(topic) ? "selected" : ""}`}
              onClick={() => toggleTopic(topic)}
            >
              <FaTags />
              {topic}
            </button>
          ))}

          {selectedTopics.length > 0 && (
            <button className="topic-btn clear-btn" onClick={clearSelection}>
              <FaTimes />
              Clear Selection
            </button>
          )}

          {visibleTopicsCount < allTopics.length && (
            <button
              className="topic-btn more-btn"
              onClick={() => setVisibleTopicsCount((prev) => prev + 10)}
            >
              More Topics ...
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="article-grid">{displayedCardElements}</div>

      {/* Load More Articles Button */}
      {visibleCount < filteredArticles.length && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="load-more-btn"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
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
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              No articles found.
            </p>
            <p>
              We’re sorry - no articles matched
              {searchTerm ? (
                <>
                  {" "}
                  your search for “<strong>{searchTerm}</strong>”
                </>
              ) : null}
              {searchTerm && selectedTopics.length > 0 && " and"}
              {selectedTopics.length > 0 ? (
                <>
                  {" "}
                  all the topic{selectedTopics.length > 1 ? "s" : ""} “
                  <strong>{selectedTopics.join(", ")}</strong>”
                </>
              ) : null}
              {!searchTerm && selectedTopics.length === 0 && " any criteria"}.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-filter-shell {
          margin-bottom: 2.5rem;
          padding: 1.75rem;
          border-radius: 18px;
          border: 1px solid var(--border-color);
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.08),
            rgba(0, 0, 0, 0)
          );
          box-shadow: 0 24px 40px rgba(15, 23, 42, 0.08);
        }

        .search-filter-header {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: space-between;
          align-items: flex-start;
        }

        .search-filter-kicker {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--link-color);
          margin: 0;
        }

        .search-filter-title {
          margin: 0.4rem 0 0.4rem;
          font-size: 1.6rem;
          color: var(--text-color);
        }

        .search-filter-subtitle {
          margin: 0;
          color: var(--text-color);
          opacity: 0.75;
          max-width: 520px;
          line-height: 1.6;
        }

        .filter-tip {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--container-background);
          color: var(--link-color);
          cursor: pointer;
          font: inherit;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .filter-tip:hover,
        .filter-tip:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
          border-color: var(--link-color);
        }

        .filter-tip:focus-visible {
          outline: 2px solid var(--link-color);
          outline-offset: 2px;
        }

        .filter-tooltip {
          position: absolute;
          right: 0;
          top: calc(100% + 0.6rem);
          background: var(--container-background);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
          width: 260px;
          max-width: min(260px, calc(100vw - 2rem));
          box-sizing: border-box;
          font-size: 0.85rem;
          color: var(--text-color);
          opacity: 0;
          transform: translateY(-6px);
          pointer-events: none;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
          z-index: 2;
        }

        .filter-tip:hover .filter-tooltip,
        .filter-tip:focus-within .filter-tooltip,
        .filter-tip:focus-visible .filter-tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .filter-tooltip {
            right: auto;
            left: 0;
          }
        }

        .search-field {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          background: var(--container-background);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-field.focused {
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
        }

        .search-icon {
          color: var(--text-color);
          opacity: 0.6;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 1rem;
          font-family: inherit;
          background: transparent;
          color: var(--text-color);
        }

        .search-clear {
          border: none;
          background: transparent;
          color: var(--text-color);
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .search-clear:hover {
          color: var(--link-color);
        }

        .filter-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
          align-items: center;
        }

        .topic-btn {
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 112, 243, 0.25);
          background-color: rgba(0, 112, 243, 0.08);
          color: var(--text-color);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease,
            border-color 0.2s ease;
          font: inherit;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-weight: 600;
        }

        .topic-btn svg {
          font-size: 0.85rem;
        }

        .topic-btn.selected {
          background-color: var(--link-color);
          color: #fff;
          border-color: var(--link-color);
        }

        .topic-btn.clear-btn {
          background-color: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.4);
          color: #b91c1c;
        }

        .topic-btn.more-btn {
          border-style: dashed;
          background-color: transparent;
        }

        .topic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
          border-color: var(--link-color);
          background-color: rgba(0, 112, 243, 0.16);
        }

        .topic-btn.selected:hover {
          background-color: var(--hover-link-color);
        }

        .topic-btn.clear-btn:hover {
          background-color: rgba(239, 68, 68, 0.18);
          border-color: rgba(239, 68, 68, 0.6);
          color: #991b1b;
        }

        .load-more-btn {
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          border: 1px solid var(--link-color);
          background-color: var(--link-color);
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
          background-color: var(--hover-link-color);
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

        @media (max-width: 720px) {
          .search-filter-shell {
            padding: 1.4rem;
          }

          .search-filter-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
