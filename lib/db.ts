import 'server-only'
import postgres from 'postgres'
import type { Sql } from 'postgres'

/**
 * Postgres client for AirportLounges — points at the VPS Postgres on
 * Contabo (62.146.175.212:5501). Replaces the Supabase client for data
 * reads + writes.
 *
 * Pool sizing guidance (from SolarQuotes' 53300 "too many clients" incident):
 *   - max: 2 — Vercel serverless burst-fans; keep per-invocation pool tiny
 *   - idle_timeout: 20 — drain idle connections fast
 *   - prepare: false — no prepared-statement cache across invocations
 *
 * TLS: Contabo cert is self-signed; Node must not require CA verification.
 */

let _sql: Sql | null = null

function createClient(): Sql {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Set it in Vercel (preview + prod scopes) to the VPS Postgres connection string with ?sslmode=require.',
    )
  }
  return postgres(connectionString, {
    max: 2,
    idle_timeout: 20,
    prepare: false,
    ssl: 'require',
  })
}

/**
 * Lazy singleton accessor.
 *   const rows = await sql()`SELECT 1`
 */
export function sql(): Sql {
  if (!_sql) _sql = createClient()
  return _sql
}

/**
 * Callable tagged-template entry point so callers can write:
 *   await db`SELECT * FROM airports WHERE iata_code = ${code}`
 *
 * This is a real function (not a Proxy on an object) so bundler transforms
 * preserve the callable semantics. A tagged-template invocation always
 * passes the TemplateStringsArray as the first argument plus the substitution
 * values as rest — we just forward to the pg client's tagged-template call.
 */
export const db = ((...args: unknown[]) => {
  const client = sql()
  // @ts-expect-error — postgres client is callable as a tagged template
  return client(...args)
}) as unknown as Sql
