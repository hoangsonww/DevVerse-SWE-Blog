"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import {
  FaTags,
  FaTimes,
  FaSearch,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const VISIT_STORAGE_KEY = "devverse:article-visit-history";

const TITLE_STOP_WORDS = new Set([
  "about",
  "after",
  "before",
  "between",
  "from",
  "into",
  "over",
  "that",
  "the",
  "this",
  "with",
  "your",
  "what",
  "when",
  "where",
  "why",
  "how",
  "and",
  "for",
  "are",
  "you",
  "our",
]);

const tokenizeText = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !TITLE_STOP_WORDS.has(word));

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
  viewCounts?: Record<string, number>;
  showSearch?: boolean;
  showCarousel?: boolean;
}

interface ArticleVisitRecord {
  slug: string;
  title?: string;
  topics?: string[];
  lastViewed?: number;
}

export default function ArticlesList({
  articles,
  viewCounts: serverViewCounts,
  showSearch = true,
  showCarousel = true,
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
  const [visitHistory, setVisitHistory] = useState<ArticleVisitRecord[]>([]);
  const viewCounts = serverViewCounts ?? {};

  // State for the currently selected topics and how many articles to show.
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
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
    setVisibleCount(12);
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
  const displayedArticles = useMemo(
    () => filteredArticles.slice(0, visibleCount),
    [filteredArticles, visibleCount],
  );
  // Only show a subset of topics.
  const displayedTopics = allTopics.slice(0, visibleTopicsCount);

  // Prepare values for the dynamic count display.
  const totalFiltered = filteredArticles.length;
  const totalDisplayed = displayedArticles.length;

  const displayedCardElements = useMemo(
    () =>
      displayedArticles.map((article, i) => (
        <div
          key={article.slug}
          className="fade-in-card"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <InteractiveCard
            slug={article.slug}
            title={article.title}
            description={article.description || article.excerpt}
            topics={article.topics}
            readingTimeMinutes={article.readingMinutes}
            viewCount={viewCounts[article.slug]}
          />
        </div>
      )),
    [displayedArticles],
  );

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
    setVisibleCount(12);
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
    setVisibleCount(12);
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

  useEffect(() => {
    if (!showCarousel) return;

    const loadHistory = () => {
      try {
        const raw = window.localStorage.getItem(VISIT_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) {
          setVisitHistory([]);
          return;
        }
        const cleaned = parsed
          .filter((entry) => entry && typeof entry.slug === "string")
          .map((entry) => ({
            slug: entry.slug,
            title: typeof entry.title === "string" ? entry.title : "",
            topics: Array.isArray(entry.topics)
              ? entry.topics.filter(
                  (topic: unknown) => typeof topic === "string",
                )
              : [],
            lastViewed:
              typeof entry.lastViewed === "number" ? entry.lastViewed : 0,
          }));
        setVisitHistory(cleaned);
      } catch {
        setVisitHistory([]);
      }
    };

    loadHistory();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === VISIT_STORAGE_KEY) {
        loadHistory();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [showCarousel]);

  const [carouselPage, setCarouselPage] = useState(0);
  const [carouselPageSize, setCarouselPageSize] = useState(3);
  const [carouselInteractionKey, setCarouselInteractionKey] = useState(0);

  useEffect(() => {
    if (!showCarousel) return;

    const updatePageSize = () => {
      const width = window.innerWidth;
      const nextSize = width < 720 ? 1 : width < 1080 ? 2 : 3;
      setCarouselPageSize(nextSize);
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);

    return () => window.removeEventListener("resize", updatePageSize);
  }, [showCarousel]);

  useEffect(() => {
    if (!showCarousel) return;
    setCarouselPage(0);
  }, [showCarousel, visitHistory]);

  const hasVisitHistory = visitHistory.length > 0;
  const MAX_CAROUSEL = 9;

  const recommendedArticles = useMemo(() => {
    if (!hasVisitHistory) return [];

    const now = Date.now();
    const DAY_MS = 86_400_000;
    const visitedSlugs = new Set(visitHistory.map((v) => v.slug));

    // Build weighted topic frequency map with recency decay.
    // Recent visits contribute more than old ones.
    const topicWeights = new Map<string, number>();
    visitHistory.forEach((v) => {
      const age = Math.max(0, now - (v.lastViewed ?? 0));
      // Halve the weight every 7 days
      const recency = Math.pow(0.5, age / (7 * DAY_MS));
      (v.topics ?? []).forEach((topic) => {
        topicWeights.set(topic, (topicWeights.get(topic) ?? 0) + recency);
      });
    });

    // Build weighted token frequency map from visited titles
    const tokenWeights = new Map<string, number>();
    visitHistory.forEach((v) => {
      const age = Math.max(0, now - (v.lastViewed ?? 0));
      const recency = Math.pow(0.5, age / (7 * DAY_MS));
      tokenizeText(v.title ?? "").forEach((token) => {
        tokenWeights.set(token, (tokenWeights.get(token) ?? 0) + recency);
      });
    });

    // Only recommend articles the user hasn't visited yet
    const candidates = articles.filter((a) => !visitedSlugs.has(a.slug));

    const scored = candidates.map((article) => {
      // Topic relevance: sum of weights for matching topics
      const topicScore = article.topics.reduce(
        (sum, t) => sum + (topicWeights.get(t) ?? 0),
        0,
      );

      // Title keyword overlap
      const titleScore = tokenizeText(article.title).reduce(
        (sum, t) => sum + (tokenWeights.get(t) ?? 0),
        0,
      );

      // Description keyword overlap (lower weight)
      const descTokens = tokenizeText(
        `${article.description ?? ""} ${article.excerpt ?? ""}`,
      );
      const descScore = descTokens.reduce(
        (sum, t) => sum + (tokenWeights.get(t) ?? 0),
        0,
      );

      const score = topicScore * 3 + titleScore * 2 + descScore;
      return { article, score };
    });

    // Filter to only meaningfully relevant articles
    scored.sort((a, b) => b.score - a.score);
    const minScore = scored.length > 0 ? scored[0].score * 0.1 : 0;

    return scored
      .filter((item) => item.score > minScore)
      .slice(0, MAX_CAROUSEL)
      .map((item) => item.article);
  }, [articles, hasVisitHistory, visitHistory]);

  const carouselArticles = hasVisitHistory
    ? recommendedArticles
    : articles.slice(0, MAX_CAROUSEL);

  const carouselPages = useMemo(() => {
    if (!showCarousel) return [];
    const pages: Article[][] = [];
    for (let i = 0; i < carouselArticles.length; i += carouselPageSize) {
      pages.push(carouselArticles.slice(i, i + carouselPageSize));
    }
    return pages;
  }, [carouselArticles, carouselPageSize, showCarousel]);

  const totalCarouselPages = carouselPages.length;

  useEffect(() => {
    if (!showCarousel) return;
    if (totalCarouselPages === 0) {
      setCarouselPage(0);
      return;
    }
    if (carouselPage > totalCarouselPages - 1) {
      setCarouselPage(totalCarouselPages - 1);
    }
  }, [carouselPage, totalCarouselPages, showCarousel]);

  useEffect(() => {
    if (!showCarousel || totalCarouselPages < 2) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setCarouselPage((prev) =>
        prev >= totalCarouselPages - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [showCarousel, totalCarouselPages, carouselInteractionKey]);

  const carouselKicker = hasVisitHistory ? "Recommended" : "Quick browse";
  const carouselTitle = hasVisitHistory
    ? "Recommended articles for you."
    : "Flip through the article deck.";
  const carouselSubtitle = hasVisitHistory
    ? "Tuned using what you read most: topics, titles, and themes."
    : "A quick pass before diving into the full list.";

  return (
    <div>
      {showCarousel && (
        <div id="all-articles" className="all-articles-heading">
          <div className="all-articles-accent-bar" aria-hidden="true" />
          <p className="all-articles-kicker">Library</p>
          <h2 className="all-articles-title">All Articles</h2>
          <p className="all-articles-subtitle">
            Browse the full collection - search, filter by topic, or just scroll
          </p>
        </div>
      )}

      {showCarousel && totalCarouselPages > 0 && (
        <section className="articles-carousel">
          <div className="carousel-header">
            <div>
              <p className="carousel-kicker">{carouselKicker}</p>
              <h2 className="carousel-title">{carouselTitle}</h2>
              <p className="carousel-subtitle">{carouselSubtitle}</p>
            </div>
            <div className="carousel-controls">
              <button
                type="button"
                className="carousel-btn"
                onClick={() => {
                  setCarouselPage((prev) =>
                    totalCarouselPages === 0
                      ? 0
                      : prev === 0
                        ? totalCarouselPages - 1
                        : prev - 1,
                  );
                  setCarouselInteractionKey((prev) => prev + 1);
                }}
                aria-label="Previous articles"
                disabled={totalCarouselPages === 0}
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="carousel-btn"
                onClick={() => {
                  setCarouselPage((prev) =>
                    totalCarouselPages === 0
                      ? 0
                      : prev >= totalCarouselPages - 1
                        ? 0
                        : prev + 1,
                  );
                  setCarouselInteractionKey((prev) => prev + 1);
                }}
                aria-label="Next articles"
                disabled={totalCarouselPages === 0}
              >
                <FaChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${carouselPage * 100}%)`,
              }}
            >
              {carouselPages.map((page, pageIndex) => (
                <div
                  key={`carousel-page-${pageIndex}`}
                  className="carousel-page"
                  style={
                    {
                      "--carousel-cols": carouselPageSize,
                    } as React.CSSProperties
                  }
                >
                  {page.map((article) => (
                    <div key={article.slug} className="carousel-card">
                      <InteractiveCard
                        slug={article.slug}
                        title={article.title}
                        description={article.description || article.excerpt}
                        topics={article.topics}
                        readingTimeMinutes={article.readingMinutes}
                        viewCount={viewCounts[article.slug]}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-pagination">
            {carouselPages.map((_, index) => (
              <button
                key={`carousel-dot-${index}`}
                type="button"
                className={`carousel-dot ${index === carouselPage ? "active" : ""}`}
                onClick={() => {
                  setCarouselPage(index);
                  setCarouselInteractionKey((prev) => prev + 1);
                }}
                aria-label={`Go to carousel page ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

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
            onClick={() => setVisibleCount((prev) => prev + 12)}
          >
            Load More Articles
            <span className="arrow">↓</span>
          </button>
        </div>
      )}

      {/* Dynamic Article Count */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          marginTop: "1.5rem",
        }}
      >
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
          padding: 1.5rem 1.75rem;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          background: var(--container-background);
        }

        .search-filter-header {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: space-between;
          align-items: flex-start;
        }

        .search-filter-kicker {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--link-color);
          margin: 0;
        }

        .search-filter-title {
          margin: 0.3rem 0 0.3rem;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .search-filter-subtitle {
          margin: 0;
          color: var(--text-color);
          opacity: 0.65;
          max-width: 480px;
          line-height: 1.55;
          font-size: 0.95rem;
        }

        .filter-tip {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          margin-left: auto;
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
            right: 0;
            left: auto;
          }
        }

        .search-field {
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--background-color);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-field.focused {
          border-color: var(--link-color);
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.12);
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
          gap: 0.5rem;
          margin-top: 1.25rem;
          align-items: center;
        }

        .topic-btn {
          padding: 0.35rem 0.8rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: var(--background-color);
          color: var(--text-color);
          cursor: pointer;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
          font: inherit;
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }

        .topic-btn svg {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .topic-btn.selected {
          background-color: var(--link-color);
          color: #fff;
          border-color: var(--link-color);
        }

        .topic-btn.selected svg {
          opacity: 1;
        }

        .topic-btn.clear-btn {
          background-color: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }

        .topic-btn.more-btn {
          border-style: dashed;
          background-color: transparent;
          opacity: 0.7;
        }

        .topic-btn:hover {
          border-color: var(--link-color);
          background-color: rgba(0, 112, 243, 0.08);
        }

        .topic-btn.selected:hover {
          background-color: var(--hover-link-color);
        }

        .topic-btn.clear-btn:hover {
          background-color: rgba(239, 68, 68, 0.14);
          border-color: rgba(239, 68, 68, 0.5);
        }

        :global(.dark) .topic-btn.clear-btn {
          color: #f87171;
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

        .all-articles-heading {
          margin: 2.8rem 0 1.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.35rem;
          scroll-margin-top: 2rem;
        }

        .all-articles-accent-bar {
          width: 48px;
          height: 4px;
          border-radius: 4px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          margin-bottom: 0.5rem;
        }

        .all-articles-kicker {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.72rem;
          font-weight: 700;
          color: #6366f1;
        }

        :global(.dark) .all-articles-kicker {
          color: #818cf8;
        }

        .all-articles-title {
          margin: 0;
          font-size: clamp(1.8rem, 2.8vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-color);
          line-height: 1.2;
        }

        .all-articles-subtitle {
          margin: 0.25rem 0 0;
          font-size: 1rem;
          color: var(--text-color);
          opacity: 0.6;
          line-height: 1.5;
        }

        .articles-carousel {
          margin: 2.5rem 0 3rem;
          padding: 1.75rem;
          border-radius: 22px;
          border: 1px solid var(--border-color);
          background: transparent;
          position: relative;
        }

        .carousel-header {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .carousel-kicker {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--link-color);
          margin: 0;
        }

        .carousel-title {
          margin: 0.5rem 0 0.35rem;
          font-size: 1.55rem;
          color: var(--text-color);
        }

        .carousel-subtitle {
          margin: 0;
          color: var(--text-color);
          opacity: 0.75;
          max-width: 520px;
          line-height: 1.6;
        }

        .carousel-controls {
          display: inline-flex;
          gap: 0.6rem;
          align-items: center;
        }

        .carousel-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--container-background);
          color: var(--text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .carousel-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: var(--link-color);
          box-shadow: 0 14px 26px rgba(15, 23, 42, 0.15);
        }

        .carousel-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .carousel-viewport {
          overflow: hidden;
          width: 100%;
          padding: 0.6rem 0.3rem 1rem;
          box-sizing: border-box;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.45s ease;
        }

        .carousel-page {
          flex: 0 0 100%;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(var(--carousel-cols), minmax(0, 1fr));
          gap: 1.5rem;
          padding: 0.2rem 0.1rem;
          box-sizing: border-box;
        }

        .carousel-card {
          height: 100%;
          padding: 0.2rem;
          box-sizing: border-box;
        }

        .articles-carousel :global(.interactive-card-title) {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .articles-carousel :global(.interactive-card-description) {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .articles-carousel :global(.interactive-card) {
          box-shadow: none;
        }

        .articles-carousel :global(.interactive-card:hover) {
          box-shadow: none;
        }

        .carousel-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.3rem;
          flex-wrap: wrap;
          max-width: 100%;
          overflow: hidden;
          padding: 0 0.5rem;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: none;
          background: rgba(0, 112, 243, 0.2);
          cursor: pointer;
          transition:
            width 0.2s ease,
            background-color 0.2s ease;
        }

        .carousel-dot.active {
          width: 26px;
          background: var(--link-color);
        }

        .fade-in-card {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          height: 100%;
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

          .articles-carousel {
            padding: 1.4rem;
          }

          .carousel-title {
            font-size: 1.35rem;
          }

          .carousel-controls {
            width: 100%;
            justify-content: flex-start;
          }

          .carousel-pagination {
            gap: 0.35rem;
          }

          .carousel-dot {
            width: 8px;
            height: 8px;
          }

          .carousel-dot.active {
            width: 20px;
          }
        }
      `}</style>
    </div>
  );
}
