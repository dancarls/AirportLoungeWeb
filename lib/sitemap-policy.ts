/**
 * A failed sitemap query must not be published as a successful partial
 * document. Search engines would replace the full URL set with whatever
 * static pages we still had. `next build` also runs with NODE_ENV=production;
 * that phase is not a user-facing response, so a caught failure there may
 * fall back (and `dynamic = 'force-dynamic'` plus `connection()` keep that
 * fallback from being the deployed sitemap).
 */
export function sitemapDbFailureMode(env: {
  nodeEnv?: string
  nextPhase?: string
}): 'throw' | 'static-fallback' {
  if (env.nextPhase === 'phase-production-build') return 'static-fallback'
  if (env.nodeEnv === 'production') return 'throw'
  return 'static-fallback'
}
