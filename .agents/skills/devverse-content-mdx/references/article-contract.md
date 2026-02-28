# DevVerse Article Contract

## Required article shape

- `export const metadata = { ... };` must exist as literal source code.
- Metadata must keep literal `title`, `description`, and `topics`.
- Article content should include:
  - `### Author: ...`
  - `> Date: YYYY-MM-DD`
  - a top-level `#` heading for the main article title

## Why this matters

Multiple parts of the repo parse article files independently:

- `lib/rss.ts`: home page, feeds, related posts, reading stats
- `lib/rag-local.ts`: local chat retrieval fallback
- `scripts/vectorize_articles.mjs`: Pinecone vector sync
- `lib/articles.ts`: metadata import path used by favorites

Those parsers are not unified. Changing article format in one place will create partial breakage unless every parser is updated together.
