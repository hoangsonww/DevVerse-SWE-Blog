# DevVerse Chat Contract

## Backend flow

- `app/api/chat/route.ts` validates input and calls `buildChatResponse`.
- `lib/rag.ts`:
  - embeds the query with Gemini
  - queries Pinecone
  - runs local lexical fallback from `lib/rag-local.ts`
  - merges and reranks sources
  - generates the answer with Gemini model rotation
  - ensures the trailing `Sources:` section exists

## UI flow

- `app/chat/page.tsx` stores chat history in `localStorage`.
- Assistant history passed back to the API is stripped of the trailing `Sources:` section.
- The rendered answer body is linkified from bracket citations to source cards.
- `message.sources` is the source of truth for the source list shown under the answer.

## Citation assumptions

- Bracket citation formats currently handled:
  - `[1]`
  - `[1, 2]`
  - `[Source 1, Source 2]`
- `lib/chat-citations.ts` must stay in sync with the backend prompt and with UI rendering expectations.

## Runtime dependencies

- `GOOGLE_AI_API_KEY`
- `PINECONE_API_KEY`
- optional `PINECONE_INDEX`

## Validation priorities

- `tests/chat-citations.spec.js`
- `tests/rag-local.spec.js`
- `npx tsc --noEmit --pretty false`
- manual `/api/chat` verification when live keys are available

## Staleness warning

`scripts/vectorize_articles.mjs` is an offline sync step. Article updates may render correctly on pages while still producing stale semantic search results in chat until vectors are refreshed.
