import 'server-only'
import postgres from 'postgres'
import type { Sql } from 'postgres'
import { after } from 'next/server'
import { parsePgNumeric } from '@/lib/pg-numeric'
import { PG_POOL } from '@/lib/pg-pool'
import { createIdleCloser } from '@/lib/pool-lease'

/**
 * Postgres client for AirportLounges — Contabo VPS (port 5501).
 *
 * Numeric columns are parsed as JS numbers. postgres.js returns `numeric`
 * as text by default; PostgREST returned JSON numbers, and the pages call
 * `rating.toFixed` and filter coordinates with `typeof === 'number'`.
 *
 * Pool: one connection per isolate. A query holds that client until its
 * promise settles, and `end()` runs only when nothing is in flight. In a
 * request the close is awaited from `after()` so it finishes before Vercel
 * freezes the isolate. A bare timer does not: the isolate is suspended first
 * and the socket stays open. `prepare: false` avoids prepared-statement
 * caches across invocations. TLS: the Contabo cert is self-signed, so Node
 * must not require a CA.
 */

let _sql: Sql | null = null

function endIfIdle(): Promise<void> {
  if (queries.size !== 0) return Promise.resolve()
  const client = _sql
  if (!client) return Promise.resolve()
  _sql = null
  return client.end({ timeout: 1 }).then(() => undefined, () => undefined)
}

const queries = createIdleCloser(endIfIdle, (run) => {
  try {
    // Awaited after the response is sent and before Vercel freezes the isolate.
    // A bare timer never runs once the isolate is suspended.
    after(async () => {
      await run()
    })
  } catch {
    // `unstable_cache` background refresh has no request `after()` scope.
    // The query promise awaits this return value, so the socket is closed
    // before that task finishes. `run` rechecks the in-flight count.
    return run()
  }
})

/**
 * Register an idle close on the current request. Call this from the request
 * that starts a cached read, outside the `unstable_cache` callback, so the
 * close still runs when the loader itself cannot call `after()`.
 */
export function bindPoolToRequest(): void {
  try {
    after(async () => {
      await endIfIdle()
    })
  } catch {
    // Already outside a request. Query settlement closes the idle client.
  }
}

/** Close the shared client when no query is in flight. */
export function endPoolIfIdle(): Promise<void> {
  return endIfIdle()
}

function createClient(): Sql {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Set it in Vercel (preview + prod scopes) to the VPS Postgres connection string with ?sslmode=require.',
    )
  }
  return postgres(connectionString, {
    max: PG_POOL.max,
    idle_timeout: PG_POOL.idleTimeoutSeconds,
    max_lifetime: PG_POOL.maxLifetimeSeconds,
    connect_timeout: PG_POOL.connectTimeoutSeconds,
    prepare: false,
    ssl: 'require',
    types: {
      numeric: {
        to: 1700,
        from: [1700],
        serialize: (value: number | string) => String(value),
        parse: parsePgNumeric,
      },
    },
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

function callClient(name: 'json' | 'unsafe' | 'array') {
  return (...args: unknown[]) => {
    const client = sql() as unknown as Record<string, (...a: unknown[]) => unknown>
    return client[name](...args)
  }
}

/**
 * Callable tagged-template entry point so callers can write:
 *   await db`SELECT * FROM airports WHERE iata_code = ${code}`
 *
 * This is a real function (not a Proxy) so bundler transforms preserve the
 * callable semantics. `json` / `unsafe` / `array` are forwarded to the client.
 */
const dbCall = (...args: unknown[]) => {
  const client = sql()
  const release = queries.begin()
  try {
    // The query promise is what holds the client. Releasing in finally covers
    // both a normal request and a background revalidation where `after()` is
    // not available. The closer will not end the socket while `queries.size`
    // is still above zero.
    // @ts-expect-error — postgres client is callable as a tagged template
    const query = client(...args) as Promise<unknown>
    return query.finally(() => release())
  } catch (err) {
    release()
    throw err
  }
}

export const db = Object.assign(dbCall, {
  json: callClient('json'),
  unsafe: callClient('unsafe'),
  array: callClient('array'),
}) as unknown as Sql
