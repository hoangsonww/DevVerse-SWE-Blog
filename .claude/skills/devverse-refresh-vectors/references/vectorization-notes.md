# DevVerse Vectorization Notes

## Script

- `scripts/vectorize_articles.mjs`

## Inputs

- reads `content/*.mdx`
- parses literal metadata from source text
- extracts article body starting from the first `#`
- chunks content and embeds `title + description + chunk`

## Required env variables

- `GOOGLE_AI_API_KEY`
- `PINECONE_API_KEY`
- optional `PINECONE_INDEX`

## Optional tuning env variables

- `VECTORIZE_BATCH_SIZE`
- `VECTORIZE_EMBED_DELAY_MS`
- `VECTORIZE_MAX_RETRIES`
- `VECTORIZE_RETRY_BASE_MS`

## Important behavior

- loads `.env.local` and `.env` manually
- upserts vectors keyed by `${slug}#${chunkIndex}`
- article pages can reflect new content before vectors do
- chat semantic retrieval stays stale until this script is rerun
