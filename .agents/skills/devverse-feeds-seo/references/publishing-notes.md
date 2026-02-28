# DevVerse Publishing Notes

## Core files

- `lib/rss.ts`: raw MDX parsing, excerpts, reading stats, related posts, RSS and Atom generation
- `lib/jsonfeed.ts`: JSON feed generation
- `app/api/rss/route.ts`, `app/api/atom/route.ts`, `app/feed.json/route.ts`: feed endpoints
- `next-sitemap.config.js`: sitemap config
- `app/layout.tsx`: site metadata and feed links
- `public/robots.txt`, `public/manifest.json`: public metadata assets

## Important quirks

- `lib/rss.ts` depends on literal MDX metadata and inline Author/Date conventions.
- `next-sitemap.config.js` uses `SITE_URL`, not `NEXT_PUBLIC_SITE_URL`.
- A build can still fail on `next/font/google` even when SEO/feed code is fine, due to restricted-network font fetching.
