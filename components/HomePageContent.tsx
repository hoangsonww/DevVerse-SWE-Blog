"use client";
import React from 'react';
import ArticlesList from './ArticlesList';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from 'react-icons/fa';

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

interface HomePageContentProps {
  articles: Article[];
}

export default function HomePageContent({ articles }: HomePageContentProps) {
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: 'var(--container-background)',
        transition: 'background-color 0.2s',
        borderRadius: '8px'
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
          Welcome to DevVerse Software Engineering Blog
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-color)',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          DevVerse CS Blog is your go-to source for deep dives into computer science and technology.
          Explore in-depth articles on AI/ML, web frameworks, microservices, and cutting-edge tech innovations.
          Stay informed, inspired, and ready to tackle the latest trends in computer science.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ArticlesList articles={articles} />
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-color)' }}>
          More articles will be added soon. Stay tuned! 🚀
        </p>
      </motion.div>

      {/* Creator Profile Card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          marginTop: '3rem',
          padding: '2rem',
          border: '1px solid var(--border-color, #eaeaea)',
          borderRadius: '8px',
          backgroundColor: 'var(--container-background)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
          About the Creator
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.img
            src="/profile.jpg" // Ensure this file exists in your public folder.
            alt="Profile Picture"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem'
            }}
          />
          <h3 style={{ color: 'var(--text-color)' }}>Son (David) Nguyen</h3>
          <p style={{ color: 'var(--text-color)', maxWidth: '400px', textAlign: 'center' }}>
            A passionate developer and tech enthusiast sharing insights and expertise on computer science,
            software development, and emerging technologies.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
          >
            <motion.a
              href="https://github.com/hoangsonww"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--link-color)',
                fontSize: '1.75rem',
                display: 'inline-block'
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/hoangsonw"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--link-color)',
                fontSize: '1.75rem',
                display: 'inline-block'
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="https://sonnguyenhoang.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--link-color)',
                fontSize: '1.75rem',
                display: 'inline-block'
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaGlobe />
            </motion.a>
            <motion.a
              href="mailto:hoangson091104@gmail.com"
              style={{
                color: 'var(--link-color)',
                fontSize: '1.75rem',
                display: 'inline-block'
              }}
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaEnvelope />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-color)' }}>
        Web application powered by{' '}
        <motion.a
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--link-color)', textDecoration: 'underline', display: 'inline-block' }}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Next.js
        </motion.a>{' '}
        and{' '}
        <motion.a
          href="https://vercel.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--link-color)', textDecoration: 'underline', display: 'inline-block' }}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Vercel
        </motion.a>
        . 🌐
      </p>
    </div>
  );
}
