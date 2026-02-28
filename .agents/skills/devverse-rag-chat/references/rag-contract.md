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
- Assistant history sent back to the API is stripped of the trailing `Sources:` section.
- The rendered answer body is linkified from bracket citations to source cards.
- `message.sources` is the source of truth for the source list shown under the answer.

## Citation assumptions

- Formats currently handled:
  - `[1]`
  - `[1, 2]`
  - `[Source 1, Source 2]`
- `lib/chat-citations.ts` must stay aligned with backend output expectations.

## Runtime dependencies

- `GOOGLE_AI_API_KEY`
- `PINECONE_API_KEY`
- optional `PINECONE_INDEX`
