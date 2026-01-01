"use client";

import React, { useState, useEffect } from "react";
import ArticlesList from "./ArticlesList";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";

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
}

const chatCtaVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};

export default function HomePageContent({ articles }: HomePageContentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

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
            <p className="page-kicker">Welcome to DevVerse Tech Blog ✨</p>
            <h1 className="page-title">
              Deep dives into computer science and modern engineering.
            </h1>
            <p className="page-description">
              DevVerse Tech Blog is your go-to source for deep dives into
              computer science and technology. Explore{" "}
              <strong>{articles.length}</strong> articles covering frameworks,
              libraries, tools, and cutting-edge tech innovations. Stay
              informed, inspired, and ready to tackle the latest trends in
              computer science and software development.
            </p>
          </div>
          <div className="page-stats">
            <div className="stat-card">
              <span className="stat-value">{articles.length}</span>
              <span className="stat-label">Articles curated</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">CS + SWE</span>
              <span className="stat-label">Core focus</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">Weekly</span>
              <span className="stat-label">Fresh insights</span>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          background:
            "linear-gradient(135deg, rgba(0, 112, 243, 0.12), transparent 70%)",
          marginBottom: "3.5rem",
        }}
        variants={chatCtaVariants}
        initial="hidden"
        animate={visible ? "show" : "hidden"}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Explore the DevVerse RAG Chatbot
        </div>
        <div style={{ opacity: 0.8 }}>
          Ask questions about any article and get answers with citations.
        </div>
        <div>
          <Link href="/chat" className="chat-cta">
            Open chat
          </Link>
        </div>
      </motion.div>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <ArticlesList articles={articles} />
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
          gap: 2rem;
          padding: 2.5rem;
          border-radius: 18px;
          border: 1px solid var(--border-color);
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.08),
            rgba(0, 0, 0, 0)
          );
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
        }

        .page-hero-copy {
          display: grid;
          gap: 1rem;
        }

        .page-kicker {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--link-color);
          margin: 0;
        }

        .page-title {
          font-size: clamp(2.2rem, 3.5vw, 3rem);
          margin: 0;
          color: var(--text-color);
          line-height: 1.1;
        }

        .page-description {
          font-size: 1.1rem;
          color: var(--text-color);
          max-width: 680px;
          margin: 0;
          line-height: 1.7;
        }

        .page-stats {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .stat-card {
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 1rem 1.2rem;
          background: rgba(255, 255, 255, 0.7);
          display: grid;
          gap: 0.35rem;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
        }

        :global(.dark) .stat-card {
          background: rgba(15, 23, 42, 0.6);
        }

        .stat-value {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .stat-label {
          color: var(--text-color);
          opacity: 0.7;
          font-size: 0.95rem;
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
            padding: 2rem;
          }

          .page-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
