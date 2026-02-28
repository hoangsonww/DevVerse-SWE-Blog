---
name: devverse-feeds-seo
description: Feed, sitemap, metadata, and publishing guidance for DevVerse. Use when modifying lib/rss.ts, lib/jsonfeed.ts, feed routes, next-sitemap.config.js, app/layout.tsx metadata, manifest or robots files, or SEO-related site metadata.
---

# DevVerse Feeds And SEO Workflow

1. Treat `lib/rss.ts` as the central publishing parser.
Home page data, feeds, related posts, excerpts, and reading stats all depend on it.

2. Preserve the current public URL assumptions.
Feeds and local RAG use `NEXT_PUBLIC_SITE_URL`, while sitemap uses `SITE_URL`.

3. Read the publishing notes before changing metadata or feed generation.
@references/publishing-notes.md

4. If you change article metadata parsing in `lib/rss.ts`, check the MDX contract and update dependent code as needed.

5. After meaningful changes here, prefer `devverse-validate` and consider `npm run build`.
