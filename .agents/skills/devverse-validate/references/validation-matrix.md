# DevVerse Validation Matrix

## Content-only changes

- `python3 scripts/check_content_contract.py`
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

## Layout, page shell, global CSS, build config, or feed generation changes

- `npx tsc --noEmit --pretty false`
- `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`
- `npm run build`
