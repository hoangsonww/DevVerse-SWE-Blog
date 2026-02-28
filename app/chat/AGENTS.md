# Chat Guidance

- Keep `app/chat/page.tsx`, `lib/chat-citations.ts`, and `lib/rag.ts` aligned.
- The UI expects bracket citations and a trailing `Sources:` section from the backend.
- The `sources` array is the source of truth for rendered source cards.
- Do not change citation formatting in one place only.
- Use the `devverse-rag-chat` skill for substantial chat or retrieval changes.
