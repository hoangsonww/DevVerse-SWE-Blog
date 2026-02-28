# DevVerse Route Map

## Primary routes

- `app/page.tsx`: landing page; full-width marketing entry point.
- `app/home/page.tsx`: article index and discovery experience.
- `app/articles/[slug]/page.tsx`: statically generated MDX article page.
- `app/chat/page.tsx`: client chat UI with citations and source cards.
- `app/favorites/page.tsx`: server-loaded article list plus client Supabase gating.
- `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/reset/page.tsx`: auth flows.

## Shared shell

- `app/layout.tsx`: metadata, analytics, KaTeX CSS, dark-mode boot script, providers, navbar/footer shell.
- `components/ConditionalNavbar.tsx`: hides navbar on `/`.
- `components/ConditionalMain.tsx`: swaps between fixed-width and landing layouts.

## Article-specific UI dependencies

- `components/MdxLayout.tsx`: wrapper imported by MDX articles.
- `components/TableOfContents.tsx`: scans `.mdx-container` for `h2` and `h3`.
- `app/articles/[slug]/article.css`: article-specific styling.

## Styling reality

- `app/globals.css` is the main shared styling system.
- `app/chat/chat.module.css` and `app/articles/[slug]/article.css` are route-specific.
- Many components still use inline styles or `style jsx`.
- Tailwind exists in config but is not the dominant styling approach in this repo.

## Common breakpoints to avoid

- Breaking `/` versus `/home` behavior.
- Removing `.mdx-container`.
- Replacing current dark-mode setup with a partial rewrite.
- Converting URL-driven search/topic state to local-only state in article/favorites discovery views.
