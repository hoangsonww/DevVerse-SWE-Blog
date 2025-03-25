CREATE TABLE IF NOT EXISTS favorite_articles (
                                                 id SERIAL PRIMARY KEY,
                                                 user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    article_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, article_slug)
    );
