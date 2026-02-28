---
name: devverse-supabase-auth
description: Supabase auth, favorites, and security boundaries for DevVerse. Use when changing files under supabase/, auth or favorites UI, or the verify-email and reset-password API routes.
user-invocable: false
---

# DevVerse Supabase Workflow

1. Keep anon and service-role responsibilities separate.
Browser-facing auth, favorites, and storage helpers use the anon client. Service-role usage must stay server-only.

2. Treat verify-email and reset-password routes as security-sensitive.
Those routes are publicly callable and currently enumerate users via `listUsers({ perPage: 1000 })`.

3. Do not move service-role code into shared modules imported by client code.

4. Remember what Supabase is and is not used for here.
Supabase handles auth, favorites, and some profile/storage helpers. It is not the runtime source of article content.

5. Read the runtime boundaries before changing auth or favorites behavior.
@references/runtime-boundaries.md

6. After auth route changes, run repo tests and state any real-env validation you could not perform.
