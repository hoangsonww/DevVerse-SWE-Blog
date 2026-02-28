# DevVerse Codex Guidance

## Core Expectations

- Treat `content/*.mdx` as the canonical article store. The SQL article schemas in `supabase/` are not the runtime source of article content.
- Prefer code over README when they conflict. Parts of the README are stale.
- Keep changes narrow. This repo has duplicated article parsers and several UI/data contracts that are easy to break with broad refactors.
- Do not read or print real secret values from `.env` or `.env.*`. Use `.env.example` for variable names and expected configuration.
- Use `rg` and `rg --files` for search.

## Architecture Invariants

- Preserve the split between `/` and `/home`.
- `/` is the landing page and intentionally hides the navbar.
- `/home` is the article browser.
- Preserve `.mdx-container` and the `h2` / `h3` article heading structure. `components/TableOfContents.tsx` depends on both.
- Preserve the dark-mode chain across:
  - the inline boot script in `app/layout.tsx`
  - the `dark` class on `<html>`
  - CSS variables in `app/globals.css`
  - `provider/DarkModeProvider.tsx`
- Preserve the chat response contract across `app/chat/page.tsx`, `lib/chat-citations.ts`, and `lib/rag.ts`.
  - assistant answers use bracket citations
  - backend appends a trailing `Sources:` section
  - UI strips that section and links citations to `message.sources`

## MDX Content Contract

- Keep article metadata as a literal `export const metadata = { ... };`.
- Keep `title`, `description`, and `topics` as literal string/array fields.
- Keep `### Author: ...`.
- Keep `> Date: YYYY-MM-DD`.
- Keep article body starting with a top-level `#` heading.
- If you change that contract, update all dependent parsers together:
  - `lib/rss.ts`
  - `lib/rag-local.ts`
  - `scripts/vectorize_articles.mjs`
  - any affected tests

## Security Boundaries

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Treat these routes as security-sensitive:
  - `app/api/verify-email/route.ts`
  - `app/api/reset-password/route.ts`
- Do not move service-role Supabase code into shared modules imported by client code.

## Validation Defaults

- Do not use `npm run lint` as a read-only check. In this repo it runs `npm run format` and mutates files.
- Preferred TypeScript validation:
  - `npx tsc --noEmit --pretty false`
- Preferred Jest validation in constrained environments:
  - `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- Coverage in constrained environments:
  - `env JEST_USE_WATCHMAN=0 npm run coverage -- --runInBand --watchman=false`
- Content contract validation:
  - `python3 scripts/check_content_contract.py`
- `npm run build` is valuable for route/layout/global styling changes, but may fail in restricted-network environments because of `next/font/google`.

## Project Skills

- Use the repository skills under `.agents/skills` when the task matches:
  - `devverse-ui-routes`
  - `devverse-content-mdx`
  - `devverse-rag-chat`
  - `devverse-supabase-auth`
  - `devverse-feeds-seo`
  - `devverse-validate`
  - `devverse-refresh-vectors`
