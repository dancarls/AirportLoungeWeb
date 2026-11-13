import 'server-only'
import postgres from 'postgres'
import type { Sql } from 'postgres'
import { after } from 'next/server'
import { parsePgNumeric } from '@/lib/pg-numeric'
import { PG_POOL } from '@/lib/pg-pool'
import { createLeaseCounter } from '@/lib/pool-lease'

/**
 * Postgres client for AirportLounges — Contabo VPS (port 5501).
 *
 * Numeric columns are parsed as JS numbers. postgres.js returns `numeric`
 * as text by default; PostgREST returned JSON numbers, and the pages call
 * `rating.toFixed` and filter coordinates with `typeof === 'number'`.
 *
 * Pool: one connection per isolate, closed in `after()` once the response
 * finishes so a frozen serverless isolate does not hold the socket. The app
 * role allows 30 connections; a burst of 20 concurrent renders stays under
 * that. `prepare: false` avoids prepared-statement caches across invocations.
 * TLS: the Contabo cert is self-signed, so Node must not require a CA.
 */

let _sql: Sql | null = null

const leases = createLeaseCounter(() => {
  const client = _sql
  if (!client) return
  _sql = null
  void client.end({ timeout: 1 }).catch(() => {
    // The socket is already unusable if end() fails; the next query opens a new one.
  })
})

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

function trackQuery() {
  const lease = leases.acquire()
  try {
    after(() => {
      lease.release()
    })
  } catch {
    // No request scope (a script, or a prerender that cannot defer work).
    // Leave the socket to idle_timeout instead of closing it mid-query.
    lease.cancel()
  }
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
  trackQuery()
  // @ts-expect-error — postgres client is callable as a tagged template
  return client(...args)
}

export const db = Object.assign(dbCall, {
  json: callClient('json'),
  unsafe: callClient('unsafe'),
  array: callClient('array'),
}) as unknown as Sql
