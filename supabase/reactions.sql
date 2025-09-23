-- DevVerse Blog Article Reactions Schema for PostgreSQL (Supabase)
-- Author: Son Nguyen
-- Created: 2025-01-27

CREATE TABLE IF NOT EXISTS article_reactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug TEXT NOT NULL,
  reaction_type TEXT NOT NULL, -- 'like', 'love', 'fire', 'idea'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, article_slug, reaction_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_reactions_article_slug ON article_reactions(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_reactions_user_id ON article_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_article_reactions_type ON article_reactions(reaction_type);

-- Enable RLS (Row Level Security)
ALTER TABLE article_reactions ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can view all reactions" ON article_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reactions" ON article_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON article_reactions
  FOR DELETE USING (auth.uid() = user_id);