"use client";
import React, { useState, useEffect, useCallback } from "react";
import ArticlesList from "./ArticlesList";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

interface HomePageContentProps {
  articles: Article[];
}

const imageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, type: "spring", stiffness: 300 },
  },
};

export default function HomePageContent({ articles }: HomePageContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [isFocused, setIsFocused] = useState(false);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((term: string) => {
      if (!term) {
        setFilteredArticles(articles);
        return;
      }
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(term.toLowerCase()) ||
            (article.description &&
              article.description.toLowerCase().includes(term.toLowerCase())),
        ),
      );
    }, 300),
    [articles],
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "var(--container-background)",
        transition: "background-color 0.2s",
        borderRadius: "8px",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          Welcome to DevVerse Software Engineering Blog
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-color)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          DevVerse Blog is your go-to source for deep dives into computer
          science and technology. Explore in-depth articles on AI/ML, web
          frameworks, microservices, and cutting-edge tech innovations. Stay
          informed, inspired, and ready to tackle the latest trends in computer
          science and software development. 🚀
        </p>
      </motion.header>

      {/* Motion Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileFocus={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--container-background)",
            border: "2px solid var(--border-color, #ccc)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            width: isFocused || searchTerm ? "500px" : "400px",
            transition: "width 0.3s ease-in-out",
          }}
        >
          <FaSearch
            style={{
              marginRight: "0.75rem",
              color: isFocused ? "#0070f3" : "var(--text-color)",
              transition: "color 0.3s ease",
            }}
          />
          <motion.input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "1rem",
              fontFamily: "inherit",
              backgroundColor: "transparent",
              color: "var(--text-color)",
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ArticlesList articles={filteredArticles} />
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--text-color)",
          }}
        >
          More articles will be added soon. Stay tuned! 🚀
        </p>
      </motion.div>

      {/* Creator Profile Card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          marginTop: "3rem",
          padding: "2rem",
          border: "1px solid var(--border-color, #eaeaea)",
          borderRadius: "8px",
          backgroundColor: "var(--container-background)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          About the Creator
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a href="https://sonnguyenhoang.com" target="_blank" rel="noopener noreferrer">
            <motion.img
              src="/profile.jpg"
              alt="Profile Picture"
              variants={imageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
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
            technologies.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
          >
            <motion.a
              href="https://github.com/hoangsonww"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--link-color)",
                fontSize: "1.75rem",
                display: "inline-block",
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/hoangsonw"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--link-color)",
                fontSize: "1.75rem",
                display: "inline-block",
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="https://sonnguyenhoang.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--link-color)",
                fontSize: "1.75rem",
                display: "inline-block",
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaGlobe />
            </motion.a>
            <motion.a
              href="mailto:hoangson091104@gmail.com"
              style={{
                color: "var(--link-color)",
                fontSize: "1.75rem",
                display: "inline-block",
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaEnvelope />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
