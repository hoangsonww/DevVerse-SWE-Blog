-- DevVerse Comprehensive PostgreSQL Schema
-- Includes advanced features: comments, roles, permissions, analytics, full-text search, audit logs, and more
-- Author: Son Nguyen
-- Created: 2025-03-24

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM types
CREATE TYPE article_status AS ENUM ('draft','published','archived');
CREATE TYPE user_role AS ENUM ('reader','author','editor','admin');

-- Schemas
CREATE SCHEMA IF NOT EXISTS devverse AUTHORIZATION postgres;

-- Users
CREATE TABLE devverse.users (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                email CITEXT UNIQUE NOT NULL,
                                display_name TEXT NOT NULL,
                                role user_role NOT NULL DEFAULT 'reader',
                                avatar_url TEXT,
                                preferences JSONB DEFAULT '{}'::JSONB,
                                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Articles
CREATE TABLE devverse.articles (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   slug TEXT UNIQUE NOT NULL,
                                   title TEXT NOT NULL,
                                   summary TEXT,
                                   content TEXT NOT NULL,
                                   status article_status NOT NULL DEFAULT 'draft',
                                   published_at TIMESTAMPTZ,
                                   author_id UUID REFERENCES devverse.users(id) ON DELETE SET NULL,
                                   views BIGINT NOT NULL DEFAULT 0,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments
CREATE TABLE devverse.comments (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   article_id UUID REFERENCES devverse.articles(id) ON DELETE CASCADE,
                                   user_id UUID REFERENCES devverse.users(id) ON DELETE SET NULL,
                                   parent_id UUID REFERENCES devverse.comments(id) ON DELETE CASCADE,
                                   body TEXT NOT NULL,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Topics
CREATE TABLE devverse.topics (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 name TEXT UNIQUE NOT NULL,
                                 description TEXT,
                                 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Article-Topic join
CREATE TABLE devverse.article_topics (
                                         article_id UUID REFERENCES devverse.articles(id) ON DELETE CASCADE,
                                         topic_id UUID REFERENCES devverse.topics(id) ON DELETE CASCADE,
                                         PRIMARY KEY(article_id, topic_id)
);

-- Favorites
CREATE TABLE devverse.favorites (
                                    user_id UUID REFERENCES devverse.users(id) ON DELETE CASCADE,
                                    article_id UUID REFERENCES devverse.articles(id) ON DELETE CASCADE,
                                    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                    PRIMARY KEY(user_id, article_id)
);

-- Audit log
CREATE TABLE devverse.audit_logs (
                                     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                     table_name TEXT NOT NULL,
                                     record_id UUID,
                                     action TEXT NOT NULL,
                                     performed_by UUID REFERENCES devverse.users(id),
                                     details JSONB,
                                     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full text search index
CREATE INDEX idx_articles_fts ON devverse.articles USING GIN(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_comments_fts ON devverse.comments USING GIN(to_tsvector('english', body));

-- Triggers to update timestamps
CREATE FUNCTION devverse.set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER set_users_updated BEFORE UPDATE ON devverse.users FOR EACH ROW EXECUTE FUNCTION devverse.set_timestamp();
CREATE TRIGGER set_articles_updated BEFORE UPDATE ON devverse.articles FOR EACH ROW EXECUTE FUNCTION devverse.set_timestamp();
CREATE TRIGGER set_comments_updated BEFORE UPDATE ON devverse.comments FOR EACH ROW EXECUTE FUNCTION devverse.set_timestamp();

-- Audit trigger function
CREATE FUNCTION devverse.audit_trigger() RETURNS TRIGGER AS $$ BEGIN
  INSERT INTO devverse.audit_logs(table_name, record_id, action, performed_by, details)
  VALUES(TG_TABLE_NAME, COALESCE(OLD.id, NEW.id), TG_OP, current_setting('app.current_user')::UUID, row_to_json(NEW));
RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Attach audit trigger
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT table_name FROM information_schema.tables WHERE table_schema='devverse' AND table_name IN ('users','articles','comments','favorites') LOOP
    EXECUTE format('CREATE TRIGGER audit_%I AFTER INSERT OR UPDATE OR DELETE ON devverse.%I FOR EACH ROW EXECUTE FUNCTION devverse.audit_trigger()', r.table_name, r.table_name);
END LOOP; END; $$;

-- Materialized view for top articles
CREATE MATERIALIZED VIEW devverse.top_articles AS
SELECT id, title, views, published_at FROM devverse.articles WHERE status='published' ORDER BY views DESC LIMIT 10;

-- Function to refresh top_articles
CREATE FUNCTION devverse.refresh_top_articles() RETURNS void LANGUAGE sql AS $$ REFRESH MATERIALIZED VIEW devverse.top_articles; $$;

-- Schedule refresh via pg_cron (if available)
-- SELECT cron.schedule('0 * * * *', 'SELECT devverse.refresh_top_articles()');

-- Analytics table
CREATE TABLE devverse.article_views (
                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                        article_id UUID REFERENCES devverse.articles(id) ON DELETE CASCADE,
                                        viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                        user_id UUID REFERENCES devverse.users(id)
);

-- Function to record view
CREATE FUNCTION devverse.log_view(article UUID, user UUID) RETURNS void LANGUAGE plpgsql AS $$ BEGIN
  INSERT INTO devverse.article_views(article_id, user_id) VALUES(article, user);
UPDATE devverse.articles SET views = views + 1 WHERE id = article;
END; $$;

-- Search helper function
CREATE FUNCTION devverse.search_articles(query TEXT) RETURNS TABLE(id UUID, title TEXT, snippet TEXT) LANGUAGE sql AS $$
SELECT id, title, ts_headline('english', content, plainto_tsquery(query)) FROM devverse.articles WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery(query);
$$;
