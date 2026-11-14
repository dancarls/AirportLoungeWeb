/**
 * Serverless pool budget for the Contabo app role (30 connections).
 *
 * A Vercel isolate serves one page render at a time, but a burst opens many
 * isolates. `max: 1` caps each isolate at a single socket (20 concurrent
 * renders = 20 connections, under the role limit). `idleTimeoutSeconds` is a
 * backstop while the isolate stays warm. The actual close is awaited from
 * `after()` in `lib/db.ts`, because a bare timer is frozen when Vercel
 * suspends the isolate.
 */
export const PG_POOL = {
  max: 1,
  idleTimeoutSeconds: 5,
  maxLifetimeSeconds: 60 * 5,
  connectTimeoutSeconds: 10,
} as const
