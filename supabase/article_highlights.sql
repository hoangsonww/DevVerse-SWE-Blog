-- Article Highlights Schema
-- Implements W3C Web Annotation-style selectors for text highlighting
-- Author: DevVerse Team
-- Created: 2024

create table public.article_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_slug text not null,
  -- W3C Web Annotation-style selectors
  text_quote_exact text not null,
  text_quote_prefix text,
  text_quote_suffix text,
  text_position_start int,  -- optional fallback
  text_position_end int,    -- optional fallback
  note text,                -- nullable
  color text not null default 'yellow', -- 'yellow' | 'green' | 'pink' | etc.
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index on public.article_highlights (user_id, article_slug);
create index on public.article_highlights (article_slug);
create index on public.article_highlights (created_at);

-- Enable Row Level Security
alter table public.article_highlights enable row level security;

-- RLS Policies
create policy "owner_crud"
on public.article_highlights
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_read_when_public"
on public.article_highlights
for select
using (is_public = true);

-- Function to update updated_at timestamp
create or replace function public.update_article_highlights_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_article_highlights_updated_at
  before update on public.article_highlights
  for each row
  execute function public.update_article_highlights_updated_at();