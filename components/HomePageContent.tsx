"use client";

import React, { useState, useEffect, useCallback } from "react";
import ArticlesList from "./ArticlesList";
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";
import { FiBook, FiCode, FiRefreshCw } from "react-icons/fi";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
  readingMinutes?: number;
  excerpt?: string;
}

interface HomePageContentProps {
  articles: Article[];
  viewCounts?: Record<string, number>;
}

const chatCtaVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (target <= 0) return;
    const delayTimer = setTimeout(() => {
      let start = 0;
      const step = Math.max(1, Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= target) {
          clearInterval(timer);
          setDone(true);
        }
      }, step);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [target, duration, delay]);
  return { count, done };
}

function TypewriterValue({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [text, started]);
  return (
    <span>
      {displayed}
      {!done && started && <span className="tw-cursor">|</span>}
    </span>
  );
}

export default function HomePageContent({
  articles,
  viewCounts,
}: HomePageContentProps) {
  const [visible, setVisible] = useState(false);
  const { count: articleCount } = useCountUp(articles.length, 1200, 0);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleBrowseClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById("all-articles");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [],
  );

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "var(--container-background)",
        transition: "background-color 0.3s",
        borderRadius: "8px",
      }}
    >
      <header className="page-header">
        <div className="page-hero">
          <div className="page-hero-copy">
            <p className="page-kicker">DevVerse Tech Blog</p>
            <h1 className="page-title">
              Deep dives into{" "}
              <span className="page-title-accent">computer science</span> and
              modern engineering.
            </h1>
            <p className="page-description">
              Explore <strong>{articleCount}</strong> in-depth articles on
              frameworks, distributed systems, AI, databases, and software
              architecture. Written for engineers who want to understand the{" "}
              <em>why</em>, not just the <em>how</em>.
            </p>
            <div className="page-hero-actions">
              <a href="/chat" className="hero-cta hero-cta-primary">
                Ask the AI chatbot
              </a>
              <a
                href="#all-articles"
                className="hero-cta hero-cta-secondary"
                onClick={handleBrowseClick}
              >
                Browse articles
              </a>
            </div>
          </div>
          <div className="page-stats-col">
            <div className="stat-card">
              <div className="stat-icon">
                <FiBook size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{articleCount}</span>
                <span className="stat-label">Articles curated</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiCode size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  <TypewriterValue text="CS + SWE" delay={1300} />
                </span>
                <span className="stat-label">Core focus</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiRefreshCw size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  <TypewriterValue text="Weekly" delay={2200} />
                </span>
                <span className="stat-label">Fresh insights</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <ArticlesList articles={articles} viewCounts={viewCounts} />
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--text-color)",
          }}
        >
          More articles will be added soon. Stay tuned! 🚀
        </p>
      </div>

      {/* Creator Profile Card */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2rem",
          border: "1px solid var(--border-color, #eaeaea)",
          borderRadius: "8px",
          backgroundColor: "var(--container-background)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          About The Creator
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a
            href="https://sonnguyenhoang.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/profile.jpg"
              alt="Profile Picture"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>

          <h3 style={{ color: "var(--text-color)" }}>Son (David) Nguyen</h3>

          <p
            style={{
              color: "var(--text-color)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            A passionate developer and tech enthusiast sharing insights and
            expertise on computer science, software development, and emerging
            technologies. Let's connect and build the future together! 👨🏻‍💻
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            }}
          >
            {[
              {
                href: "https://github.com/hoangsonww",
                icon: <FaGithub />,
              },
              {
                href: "https://www.linkedin.com/in/hoangsonw",
                icon: <FaLinkedin />,
              },
              {
                href: "https://sonnguyenhoang.com",
                icon: <FaGlobe />,
              },
              {
                href: "mailto:hoangson091104@gmail.com",
                icon: <FaEnvelope />,
              },
            ].map(({ href, icon }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--link-color)",
                  fontSize: "1.75rem",
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(1.2) translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1) translateY(0)")
                }
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Website Info Card */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2rem",
          border: "1px solid var(--border-color, #eaeaea)",
          borderRadius: "8px",
          backgroundColor: "var(--container-background)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          About This Website
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a
            href="https://github.com/hoangsonww/DevVerse-SWE-Blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/nextjs.jpeg"
              alt="Profile Picture"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>

          <p
            style={{
              color: "var(--text-color)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            This website is built and designed with a <strong>modern</strong>{" "}
            tech stack:{" "}
            <strong>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://mdxjs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDX
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
            </strong>
            , and{" "}
            <strong>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                TailwindCSS
              </a>
            </strong>
            . It serves as a hub for sharing software engineering insights,
            technical tutorials, and the latest trends in technology. Enjoy a
            fast, modern, and responsive user experience as you explore our
            articles and resources! 🌐
          </p>

          <p
            style={{
              color: "var(--text-color)",
              maxWidth: "400px",
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            Please feel free to visit our{" "}
            <a
              href="https://github.com/hoangsonww/DevVerse-SWE-Blog"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--link-color)" }}
            >
              GitHub repository
            </a>{" "}
            if you have any suggestions or want to contribute! 💡
          </p>
        </div>
      </section>
      <style jsx>{`
        .page-header {
          margin-bottom: 3rem;
          animation: fadeSlideIn 0.6s ease-out;
        }

        .page-hero {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 3rem;
          align-items: center;
          padding: 2.5rem 3rem;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--container-background);
          position: relative;
          overflow: hidden;
        }

        .page-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            #6366f1,
            #3b82f6,
            #06b6d4,
            #10b981
          );
        }

        .page-hero-copy {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .page-kicker {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--link-color);
          margin: 0;
        }

        .page-title {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          margin: 0;
          color: var(--text-color);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .page-title-accent {
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        :global(.dark) .page-title-accent {
          background: linear-gradient(135deg, #818cf8, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-description {
          font-size: 1.05rem;
          color: var(--text-color);
          opacity: 0.8;
          max-width: 560px;
          margin: 0;
          line-height: 1.7;
        }

        .page-hero-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .page-stats-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 220px;
        }

        .stat-card {
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 0.9rem 1.1rem;
          background: var(--background-color);
          display: flex;
          align-items: center;
          gap: 0.85rem;
          transition:
            border-color 0.2s ease,
            transform 0.15s ease;
        }

        .stat-card:hover {
          border-color: var(--link-color);
          transform: translateX(4px);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          flex-shrink: 0;
        }

        :global(.dark) .stat-icon {
          background: rgba(129, 140, 248, 0.15);
          color: #818cf8;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .stat-value {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.2;
        }

        .stat-label {
          color: var(--text-color);
          opacity: 0.6;
          font-size: 0.8rem;
        }

        :global(.tw-cursor) {
          display: inline-block;
          color: #6366f1;
          font-weight: 400;
          animation: blink 0.7s step-end infinite;
          margin-left: 1px;
        }

        :global(.dark .tw-cursor) {
          color: #818cf8;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .page-hero {
            grid-template-columns: 1fr;
            padding: 2rem;
            gap: 2rem;
          }

          .page-stats-col {
            flex-direction: row;
            min-width: 0;
          }

          .stat-card {
            flex: 1;
          }
        }

        @media (max-width: 600px) {
          .page-stats-col {
            flex-direction: column;
          }

          .page-hero-actions {
            flex-direction: column;
          }

          .page-hero-btn {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
