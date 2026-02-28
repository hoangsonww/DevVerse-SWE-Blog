# DevVerse Article Contract

## Required article shape

- `export const metadata = { ... };` must exist as literal source code.
- Metadata should include:
  - `title`
  - `description`
  - `topics`
- Article content should include:
  - `### Author: ...`
  - `> Date: YYYY-MM-DD`
  - a top-level `#` heading for the main article title

## Why this contract matters

Multiple parts of the repo parse article files independently:

- `lib/rss.ts`: home page, feeds, related posts, reading stats
- `lib/rag-local.ts`: local chat retrieval fallback
- `scripts/vectorize_articles.mjs`: Pinecone vector sync
- `lib/articles.ts`: metadata import path used by favorites

Those parsers are not unified. A format change that touches only one path will create partial breakage.

## Validation

- Run `python3 .claude/scripts/check_content_contract.py`.
- If you changed parser behavior, update the relevant Jest tests as well.

## Practical rule

Do not switch articles to frontmatter or computed metadata without a full parser migration across every dependent file.
