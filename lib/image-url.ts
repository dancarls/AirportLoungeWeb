/**
 * Image URL helper. Resolves lounge/airport image storage paths against
 * `NEXT_PUBLIC_IMAGE_BASE_URL` (the MinIO CDN at cdn.airportlounges.ca)
 * when set, falling back to the Supabase storage URL for rollback safety.
 *
 * Object keys are identical between Supabase storage and MinIO
 * (airports/<iata>/hero.jpg, <lounge-slug>/01.jpg, etc) — only the prefix
 * differs, so swapping the base is enough.
 */

const SUPABASE_PREFIX_FALLBACK =
  'https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images'

/**
 * Build the public URL for a storage path like "airports/yul/hero.jpg" or
 * "<lounge-slug>/01.jpg". Pass a path with no leading slash — the helper
 * handles that normalization.
 */
export function imageUrl(storagePath: string): string {
  const normalized = storagePath.replace(/^\/+/, '')
  const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL
  if (base) {
    return `${base.replace(/\/+$/, '')}/${normalized}`
  }
  return `${SUPABASE_PREFIX_FALLBACK}/${normalized}`
}

/**
 * Convenience accessor for pages that need just the base, without a path —
 * e.g. legacy string concatenation like `${IMAGE_BASE}/${slug}/01.jpg`.
 */
export const IMAGE_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, '') ??
  SUPABASE_PREFIX_FALLBACK
