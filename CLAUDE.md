# DevVerse Claude Code Memory

## Operating Rules

- Treat `content/*.mdx` as the canonical article store. The checked-in SQL article schemas are not the runtime source of content.
- Prefer code over README when they conflict. Several README sections are stale.
- Keep changes narrow. This repo has duplicate metadata parsers and several UI/data contracts that are easy to break with broad refactors.
- Do not read or print secret values from `.env` or `.env.*`. Use `.env.example` for the expected variable names.
- Do not treat `npm run lint` as a read-only validation step. In this repository it runs `npm run format`, which mutates files.

## Quick Repo Map

- `app/`: Next.js App Router routes, API handlers, route-scoped CSS.
- `components/`: Reusable React components, much of the page behavior, lots of inline styles.
- `content/`: MDX articles. This is the canonical content source.
- `lib/rss.ts`: Raw MDX parser for home/feed/related-posts/reading stats.
- `lib/articles.ts`: MDX module metadata loader used by favorites.
- `lib/rag.ts`: Pinecone + Gemini retrieval and answer generation.
- `lib/rag-local.ts`: Local lexical fallback for chat retrieval.
- `lib/chat-citations.ts`: Citation parsing/linking shared by chat UI.
- `supabase/`: Browser helpers and SQL reference files.
- `scripts/vectorize_articles.mjs`: Offline embedding/upsert pipeline for Pinecone.
- `tests/`: Jest test suite.

## Architecture Invariants

- Preserve the split between `/` and `/home`.
- `/` is the landing page and intentionally hides the navbar.
- `/home` is the article index.
- Preserve `.mdx-container` and the article heading structure. `TableOfContents` depends on `h2` and `h3` inside that container.
- Preserve the dark-mode chain:
  - inline boot script in `app/layout.tsx`
  - `dark` class on `<html>`
  - CSS variables in `app/globals.css`
  - delayed render in `provider/DarkModeProvider.tsx`
- Keep chat response formatting aligned across UI and backend:
  - answer body uses bracket citations
  - backend appends a `Sources:` section
  - UI strips that section and links citations to the `sources` array

## MDX Content Contract

- Keep article metadata as a literal `export const metadata = { ... };` object.
- Keep `title`, `description`, and `topics` as literal string/array fields.
- Keep `### Author: ...` and `> Date: YYYY-MM-DD` in article content.
- Keep article body starting at the first top-level `#` heading.
- If you change this contract, update all dependent code together:
  - `lib/rss.ts`
  - `lib/rag-local.ts`
  - `scripts/vectorize_articles.mjs`
  - any affected tests

## Data And Security Boundaries

- Supabase anon client belongs in browser-facing helpers only.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- The sensitive server routes are:
  - `app/api/verify-email/route.ts`
  - `app/api/reset-password/route.ts`
- Those routes currently enumerate users through `auth.admin.listUsers({ perPage: 1000 })`. Changes there need explicit thought about abuse, auth, and the 1000-user ceiling.

## Validation Defaults

- For Jest in constrained environments, prefer:
  - `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- For coverage in constrained environments, prefer:
  - `env JEST_USE_WATCHMAN=0 npm run coverage -- --runInBand --watchman=false`
- For TypeScript validation, prefer:
  - `npx tsc --noEmit --pretty false`
- For content changes, run:
  - `python3 .claude/scripts/check_content_contract.py`
- For route/layout/build-sensitive changes, run:
  - `npm run build`
- If `npm run build` fails on Google font fetches from `next/font/google`, treat that as an environment/network limitation unless there is evidence of a real application regression.

## Repo-Specific Caveats

- `lint` is not linting. It runs Prettier write mode.
- CI does not prove a production build is healthy. The Docker image starts `npm run dev`; it does not compile the app.
- `next-sitemap.config.js` reads `SITE_URL`, while feeds and local RAG use `NEXT_PUBLIC_SITE_URL`.
- Content edits can make Pinecone vectors stale. After MDX or RAG chunking changes, consider rerunning `npm run vectorize:articles`.

## Project Skills

- Use the project skills under `.claude/skills/` for repository-specific guidance.
- The most important ones are:
  - `devverse-ui-routes`
  - `devverse-content-mdx`
  - `devverse-rag-chat`
  - `devverse-supabase-auth`
  - `devverse-validate`
  - `devverse-refresh-vectors`

## Project Subagents

- Prefer the project subagents under `.claude/agents/` when delegating specialized work:
  - `devverse-researcher`
  - `devverse-reviewer`
  - `devverse-content-editor`
  - `devverse-rag-maintainer`
