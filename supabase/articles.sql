-- DevVerse Blog Database Schema for PostgreSQL (Supabase)
-- Author: Son Nguyen
-- Created: 2025-03-24

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
                                      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL
    );

-- Article_Topics join table
CREATE TABLE IF NOT EXISTS article_topics (
                                              article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY(article_id, topic_id)
    );

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
                                         user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, article_id)
    );

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_articles_description ON articles USING gin(to_tsvector('english', description));

-- Triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data Inserts
INSERT INTO users(email, display_name) VALUES
                                           ('alice@example.com', 'Alice'),
                                           ('bob@example.com', 'Bob')
    ON CONFLICT DO NOTHING;

INSERT INTO topics(name) VALUES
                             ('JavaScript'),
                             ('React'),
                             ('Next.js'),
                             ('SQL'),
                             ('DevOps')
    ON CONFLICT DO NOTHING;

INSERT INTO articles(slug, title, description, content, published, published_at, author_id) VALUES
                                                                                                ('getting-started-nextjs', 'Getting Started with Next.js', 'A beginner guide to Next.js', '## Content goes here', TRUE, now(), (SELECT id FROM users WHERE email='alice@example.com')),
                                                                                                ('sql-best-practices', 'SQL Best Practices', 'Tips for writing efficient SQL', '## Content goes here', TRUE, now(), (SELECT id FROM users WHERE email='bob@example.com'))
    ON CONFLICT DO NOTHING;

-- Link articles to topics
INSERT INTO article_topics(article_id, topic_id)
SELECT a.id, t.id FROM articles a JOIN topics t ON (t.name = ANY(ARRAY['Next.js','SQL']))
    ON CONFLICT DO NOTHING;

-- Sample favorites
INSERT INTO favorites(user_id, article_id)
SELECT u.id, a.id FROM users u, articles a WHERE u.email='alice@example.com' AND a.slug='sql-best-practices'
    ON CONFLICT DO NOTHING;
