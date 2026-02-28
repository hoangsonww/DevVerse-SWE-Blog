---
name: devverse-refresh-vectors
description: Refresh Pinecone article embeddings after MDX article changes or RAG chunking and metadata changes. Use when content updates should be reflected in chat retrieval or when the vectorization pipeline changes.
argument-hint: [reason]
disable-model-invocation: true
---

# DevVerse Vector Refresh Workflow

Refresh vectors for `$ARGUMENTS`.

1. Confirm why the refresh is needed.
Common triggers are article content changes, metadata changes, chunking changes, or Pinecone metadata changes.

2. Read the vectorization notes before running anything.
@references/vectorization-notes.md

3. Check for required env variable names without reading their values.
Use `.env.example` as the contract.

4. Explain that vector refresh calls external services.
The script uses Gemini embeddings and Pinecone upserts.

5. Run `npm run vectorize:articles` only when the user explicitly wants the refresh or the task clearly requires it.

6. Report what changed, whether the refresh ran, and any env or quota blockers.
