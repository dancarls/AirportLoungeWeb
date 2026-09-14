/**
 * Google Places API (New) client — the v1 REST endpoints at
 * places.googleapis.com. Field-masked so we pay only for what we actually
 * display: photos, rating, reviewCount, hours, phone, editorial summary,
 * website, and geometry. Never fetches without a field mask; that would
 * cost the full "Advanced" tier per request.
 *
 * Auth: uses NEXT_PUBLIC_GOOGLE_MAPS_KEY. The Places API (New) must be
 * enabled on the same Google Cloud project. HTTP-referrer restrictions on
 * the key must NOT be applied for server-side calls — API restrictions
 * (limiting the key to a specific set of APIs) still work.
 */

const PLACES_API_BASE = 'https://places.googleapis.com/v1'

// The Fields we request on every Place Details response. Field masking is
// what makes the New API cheap — omit fields and the SKU drops. This is the
// full "lounge display" mask, still well within the ~$5 cost per 1000 lookups.
const LOUNGE_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
  'websiteUri',
  'googleMapsUri',
  'regularOpeningHours',
  'currentOpeningHours',
  'photos',
  'editorialSummary',
  'primaryTypeDisplayName',
].join(',')

// Text Search (for backfill / matching a lounge name to a Place ID).
const SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
].join(',')

export interface GooglePlace {
  id: string
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  internationalPhoneNumber?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  googleMapsUri?: string
  regularOpeningHours?: {
    openNow?: boolean
    weekdayDescriptions?: string[]
    periods?: unknown[]
  }
  currentOpeningHours?: {
    openNow?: boolean
    weekdayDescriptions?: string[]
  }
  photos?: Array<{
    name: string
    widthPx: number
    heightPx: number
    authorAttributions?: Array<{ displayName: string; uri?: string; photoUri?: string }>
  }>
  editorialSummary?: { text: string; languageCode?: string }
  primaryTypeDisplayName?: { text: string }
}

function apiKey(): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!key) {
    throw new Error(
      'NEXT_PUBLIC_GOOGLE_MAPS_KEY not set. Add it to .env.local (dev) and to Vercel env vars (prod).'
    )
  }
  return key
}

/**
 * Places Text Search — the entry point for the backfill. Given a lounge name
 * and airport hint, returns the top few matches ranked by Google's relevance.
 * Caller filters further by proximity to the airport's known lat/long.
 */
export async function searchPlaces(query: string, locationBias?: {
  latitude: number
  longitude: number
  radiusMeters?: number
}): Promise<GooglePlace[]> {
  const body: Record<string, unknown> = { textQuery: query, maxResultCount: 5 }
  if (locationBias) {
    body.locationBias = {
      circle: {
        center: { latitude: locationBias.latitude, longitude: locationBias.longitude },
        radius: locationBias.radiusMeters ?? 5000, // 5 km bias around the airport
      },
    }
  }
  const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places Text Search failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const data = (await res.json()) as { places?: GooglePlace[] }
  return data.places ?? []
}

/**
 * Places Details — fetch the full display-mask response for a known Place ID.
 * Used for the periodic ISR refresh of enriched lounge data.
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  const res = await fetch(`${PLACES_API_BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': LOUNGE_FIELD_MASK,
    },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places Details failed (${res.status}): ${text.slice(0, 200)}`)
  }
  return (await res.json()) as GooglePlace
}

/**
 * Build a Google-hosted photo URL from a photo.name reference. Google's photo
 * URLs need the API key inline and are single-use redirects — safe to inline
 * server-side but do not proxy through your own domain (that violates ToS).
 * `maxWidthPx` caps at 4800 per the API; 1600 is a good gallery size.
 */
export function photoUrl(photoName: string, maxWidthPx = 1600): string {
  return `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${apiKey()}`
}

/**
 * Distance in kilometres between two lat/long points (Haversine). Used by the
 * backfill script to score candidate Place matches by proximity to the
 * airport's known coordinates — closer wins, in the event of a name-collision.
 */
export function kmBetween(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
