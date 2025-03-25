CREATE TABLE IF NOT EXISTS profiles (
                                        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
    );
