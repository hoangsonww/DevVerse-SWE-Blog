# Supabase Guidance

- Browser-facing auth and favorites use the anon client.
- Service-role code must stay server-only.
- The SQL files here are mostly reference material, not the runtime source of article content.
- Treat verify-email and reset-password behavior as security-sensitive even if the code change seems small.
- Use the `devverse-supabase-auth` skill for substantial auth, favorites, or server-route changes.
