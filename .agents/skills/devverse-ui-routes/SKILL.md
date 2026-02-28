---
name: devverse-ui-routes
description: Route and UI conventions for the DevVerse Next.js app. Use when modifying app routes, layout, navigation, page components, global styling, route-scoped CSS, article rendering, favorites UI, or chat UI.
---

# DevVerse UI And Route Workflow

1. Preserve the split between `/` and `/home`.
`/` is the landing page with no navbar. `/home` is the article index.

2. Preserve the route wrappers.
`ConditionalNavbar` and `ConditionalMain` are architectural, not cosmetic.

3. Keep styling aligned with the repo's actual patterns.
Prefer `app/globals.css`, route-scoped CSS, and existing inline styles over introducing Tailwind-first rewrites.

4. Preserve the dark-mode chain.
Keep the inline boot script, the `dark` class on `<html>`, the CSS variables in `app/globals.css`, and `DarkModeProvider` in sync.

5. Preserve article DOM contracts.
Do not remove `.mdx-container`, and do not casually change the `h2` and `h3` structure used by `TableOfContents`.

6. Read the route map before broad UI work.
@references/route-map.md

7. Run repo-aware validation after meaningful UI or route changes.
Use the `devverse-validate` skill or run the relevant checks directly.
