-- ============================================================
-- Article View Counts
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Table: stores the total view count per article slug
CREATE TABLE IF NOT EXISTS article_views (
  slug        TEXT PRIMARY KEY,
  view_count  BIGINT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read view counts (public data)
CREATE POLICY "Public read access for article_views"
  ON article_views FOR SELECT
  USING (true);

-- Policy: anyone can insert (first view of an article creates the row)
CREATE POLICY "Public insert access for article_views"
  ON article_views FOR INSERT
  WITH CHECK (true);

-- Policy: anyone can update (increment view count)
CREATE POLICY "Public update access for article_views"
  ON article_views FOR UPDATE
  USING (true);

-- Function: atomically increment view count (upsert)
CREATE OR REPLACE FUNCTION increment_view_count(article_slug TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO article_views (slug, view_count, updated_at)
  VALUES (article_slug, 1, now())
  ON CONFLICT (slug)
  DO UPDATE SET
    view_count = article_views.view_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Seed: initialize all 50 articles with random view counts
-- between 120 and 2400
-- ============================================================

INSERT INTO article_views (slug, view_count, updated_at) VALUES
  ('2FA-User-Authentication', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('AI-Coding-Assistants', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Agentic-AI', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Amazon-Web-Services', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Apache-Kafka-Microservices', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Auth0-Authentication', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('BERT-and-Sentiment-Analysis', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('CICD-Pipelines-DevOps', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Compound-Engineering', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Context-Engineering', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Database-Index-Design', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Database-Optimization', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Design-Patterns', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Docker-K8s', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Edge-Computing', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('End-to-End-Data-Pipeline', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Event-Driven-Architecture', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Explainable-AI', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Express.js-RESTful-APIs', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Frontend-Frameworks', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Go-and-Golang-Frameworks', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Graph-Neural-Networks', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('GraphQL', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('HTML6-New-Features', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Improve-Web-SEO', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('InfluxDB', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Kafka-vs-RabbitMQ', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('LLM-Observability', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Microfrontends', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Microservices', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('MongoDB', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Next.js', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('ONNX', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('React-Native-vs-Swift-vs-Kotlin', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Redis', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Reinforcement-Learning-For-Self-Driving', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Rust-Arctix-Web', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('SRE-Incident-Response', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('SSG-SSR-and-ISR', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('State-Management-Web-Apps', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Supabase', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Supervised-Learning', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('TailwindCSS', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Technical-Interviews', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Vision-Transformers', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Web-Development-Basics', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Web3-and-Blockchain', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('WebAssembly', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('WebSockets', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days')),
  ('Zero-Trust-Security', floor(random() * (2400 - 120 + 1) + 120)::bigint, now() - (random() * interval '30 days'))
ON CONFLICT (slug) DO NOTHING;
