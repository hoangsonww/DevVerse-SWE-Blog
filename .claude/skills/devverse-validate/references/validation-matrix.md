# DevVerse Validation Matrix

## Always inspect the diff

- `git status --short`
- `git diff --name-only`

## Content-only changes

- `python3 .claude/scripts/check_content_contract.py`
- refresh vectors only if chat retrieval should reflect the content change now

## TS, TSX, JS, route, component, or lib changes

- `npx tsc --noEmit --pretty false`
- `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`

## RAG or citation changes

- `npx tsc --noEmit --pretty false`
- `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- live `/api/chat` verification if real keys are available

## Auth route or favorites changes

- `npx tsc --noEmit --pretty false`
- `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- note any missing real Supabase validation

## Layout, page shell, global CSS, build config, or feed generation changes

- `npx tsc --noEmit --pretty false`
- `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- `npm run build`

## Caveats

- `npm run lint` mutates files.
- `npm run build` can fail in network-restricted environments because `next/font/google` fetches fonts.
- CI is not a strong production-build signal in this repo.
