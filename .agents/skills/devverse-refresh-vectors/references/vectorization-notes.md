# DevVerse Vectorization Notes

## Script

- `scripts/vectorize_articles.mjs`

## Required env variables

- `GOOGLE_AI_API_KEY`
- `PINECONE_API_KEY`
- optional `PINECONE_INDEX`

## Important behavior

- the script reads `content/*.mdx`
- it parses literal metadata from source text
- it chunks article bodies and upserts vectors keyed by `${slug}#${chunkIndex}`
- article pages can reflect new content before vectors do
- chat semantic retrieval stays stale until this script is rerun
