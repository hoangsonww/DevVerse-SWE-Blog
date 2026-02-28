# DevVerse Route Map

## Primary routes

- `app/page.tsx`: landing page.
- `app/home/page.tsx`: article discovery page.
- `app/articles/[slug]/page.tsx`: statically generated MDX article page.
- `app/chat/page.tsx`: client chat UI with citations and source cards.
- `app/favorites/page.tsx`: favorites page with client-side Supabase gating.
- `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/reset/page.tsx`: auth routes.

## Shared shell

- `app/layout.tsx`: metadata, analytics, KaTeX CSS, dark-mode boot script, providers, navbar/footer shell.
- `components/ConditionalNavbar.tsx`: hides navbar on `/`.
- `components/ConditionalMain.tsx`: switches layout container behavior.

## Styling reality

- `app/globals.css` is the main shared styling layer.
- `app/chat/chat.module.css` and `app/articles/[slug]/article.css` are the main route-scoped CSS files.
- Many components still use inline styles or `style jsx`.
- Tailwind exists in config but is not the dominant styling system in this repo.
