-- DevVerse Blog Database Schema for PostgreSQL (Supabase)
-- Author: Son Nguyen
-- Created: 2025-03-24

CREATE TABLE IF NOT EXISTS profiles (
                                        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
    );
