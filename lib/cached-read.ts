import { unstable_cache } from 'next/cache'

const inflight = new Map<string, Promise<unknown>>()

/**
 * Cross-request cache for public Postgres reads on routes that cannot be
 * full-page ISR (no dynamic segment, or they read searchParams).
 *
 * Dynamic routes (`/airports/[iata]`, lounge pages, collections) use
 * `generateStaticParams` → `[]` plus `revalidate` so the HTML itself is
 * cached. Parameter-less pages stay `force-dynamic` so `next build` does not
 * need a live database, and this cache is what stops every hit from opening
 * a connection.
 *
 * In-flight calls with the same key share one promise inside an isolate so
 * a parallel burst does not stampede the pool.
 */
export function cachedRead<T>(
  key: string,
  revalidateSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const pending = inflight.get(key) as Promise<T> | undefined
  if (pending) return pending

  let run!: Promise<T>
  run = unstable_cache(loader, [key], { revalidate: revalidateSeconds })().finally(() => {
    if (inflight.get(key) === run) inflight.delete(key)
  })
  inflight.set(key, run)
  return run
}
