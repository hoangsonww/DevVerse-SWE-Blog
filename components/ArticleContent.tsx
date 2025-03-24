"use client";

import React from "react";
import { motion } from "framer-motion";

interface ArticleContentProps {
  Component: React.ComponentType<any>;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ArticleContent({ Component }: ArticleContentProps) {
  return (
    <motion.article
      initial="hidden"
      animate="enter"
      variants={variants}
      style={{
        padding: "2rem 0",
        backgroundColor: "var(--container-background)",
        color: "var(--text-color)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Component />
    </motion.article>
  );
}
