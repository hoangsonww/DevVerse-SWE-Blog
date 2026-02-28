# DevVerse Supabase Runtime Boundaries

## Browser-side usage

- `supabase/supabaseClient.ts` creates the anon client.
- `supabase/auth.ts` handles sign-up, sign-in, and calls to custom verify/reset routes.
- `supabase/favorites.ts` reads and writes favorites directly from the browser client.

## Server-side sensitive usage

- `app/api/verify-email/route.ts`
- `app/api/reset-password/route.ts`

Those routes instantiate a Supabase admin client with `SUPABASE_SERVICE_ROLE_KEY`.

## Non-runtime references

- `supabase/articles.sql` and `supabase/devverse_full_schema.sql` are reference files, not the live article content source.
