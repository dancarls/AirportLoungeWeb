import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin (service-role) client — strictly server-only.
 *
 * The `server-only` import at the top of this module causes Next.js to
 * refuse the build if any 'use client' file (directly or transitively)
 * imports from here. That is the single most important guarantee this
 * module provides: the `sb_secret_` key MUST NOT reach the browser bundle.
 *
 * Who should use this client:
 *   - Route handlers that insert into tables RLS doesn't let anon write
 *     (currently: /api/newsletter, /api/operator-application)
 *   - Server-only data accessors that need to upsert cache tables
 *     (currently: lib/air-quality.ts)
 *
 * Who should NOT use this client:
 *   - Any 'use client' React component (compile-time blocked by server-only)
 *   - middleware.ts
 *   - Any NEXT_PUBLIC_ env var
 *   - OpenGraph image routes, llms.txt, sitemap, ReviewForm — these stay
 *     on NEXT_PUBLIC_SUPABASE_ANON_KEY via lib/supabase/{client,server}.ts
 *
 * The admin client intentionally disables session persistence and auto-
 * refresh — route handlers are stateless and shouldn't carry cookies.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY

  if (!url) {
    throw new Error('createAdminClient: NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  // Deliberately NO interpolation of the secret into the error — never log
  // or echo the value back; just report that it is missing.
  if (!secret) {
    throw new Error(
      'createAdminClient: SUPABASE_SECRET_KEY is not set. Add the server-only sb_secret_ key to the environment (Vercel: Project → Settings → Environment Variables).',
    )
  }

  return createClient(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
