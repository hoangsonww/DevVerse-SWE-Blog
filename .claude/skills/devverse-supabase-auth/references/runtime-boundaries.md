# DevVerse Supabase Runtime Boundaries

## Browser-side usage

- `supabase/supabaseClient.ts` creates the anon client from:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `supabase/auth.ts` handles sign-up, sign-in, and client-side calls to custom reset and verify routes.
- `supabase/favorites.ts` reads and writes favorites directly from the browser client.

## Server-side sensitive usage

- `app/api/verify-email/route.ts`
- `app/api/reset-password/route.ts`

Those routes instantiate a Supabase admin client with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Current risks to keep in mind

- both routes enumerate users via `auth.admin.listUsers({ perPage: 1000 })`
- they are public API routes
- changes here should be reviewed for abuse risk and scalability

## Non-runtime references

- `supabase/articles.sql` and `supabase/devverse_full_schema.sql` are reference files, not the live article content source
- runtime article content still comes from `content/*.mdx`
