---
name: devverse-content-mdx
description: MDX article conventions for DevVerse. Use when adding or editing files under content/, changing article metadata, updating author or date lines, or modifying code that parses article content for feeds, related posts, reading stats, or RAG ingestion.
---

# DevVerse MDX Content Workflow

1. Treat `content/*.mdx` as the canonical article store.
Do not model article changes around `supabase/articles.sql`; runtime content comes from MDX files.

2. Keep the article contract stable.
Use a literal `export const metadata = { title, description, topics };`, keep `### Author: ...`, keep `> Date: YYYY-MM-DD`, and keep the article body starting with a top-level `#` heading.

3. Use the checked-in template when creating a new article.
@assets/article-template.mdx

4. Read the contract notes before changing metadata conventions.
@references/article-contract.md

5. If you change metadata shape or article template rules, update every dependent parser in the same task.

6. After content edits, run `python3 scripts/check_content_contract.py`.

7. If chat retrieval quality should reflect the change immediately, consider `devverse-refresh-vectors`.
