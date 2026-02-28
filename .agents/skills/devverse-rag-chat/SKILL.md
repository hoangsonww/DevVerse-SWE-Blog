---
name: devverse-rag-chat
description: DevVerse chat, citation, and retrieval workflow. Use when modifying the chat page, the chat API route, citation parsing, local retrieval fallback, Pinecone or Gemini integration, or the article vectorization pipeline.
---

# DevVerse RAG And Chat Workflow

1. Preserve the response contract between backend and UI.
The UI expects an `answer` string, a `sources` array, bracket citations in the answer body, and a trailing `Sources:` section that it strips before rendering.

2. Keep citation parsing aligned with UI behavior.
If you change citation formatting, update both `lib/chat-citations.ts` and the chat UI in the same task.

3. Preserve hybrid retrieval unless you are intentionally redesigning it.
`lib/rag.ts` merges Pinecone results with the local lexical fallback from `lib/rag-local.ts`.

4. Read the detailed contract before changing retrieval, prompt format, or vector metadata.
@references/rag-contract.md

5. Assume Pinecone vectors are stale after article or chunking changes until vectorization is rerun.

6. Validate chat changes with both tests and explicit runtime caveats.
Use the `devverse-validate` skill for automated checks, then note any live env checks you could not perform.
