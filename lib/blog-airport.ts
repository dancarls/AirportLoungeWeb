/**
 * Airport used by the blog weather widget.
 *
 * Resolution order: an explicit `iata` on the post, then a single known IATA
 * code in the slug. Zero matches, several matches, or an explicit code we do
 * not have coordinates for all return null so the page omits the widget
 * instead of showing another city's weather.
 *
 * Coordinates for the seeded airports match supabase/migrations/002_seed_data.sql.
 * The remaining codes are the published aerodrome reference points for airports
 * this site already covers.
 */

export interface BlogAirport {
  iata: string
  city: string
  lat: number
  lng: number
}

export const BLOG_AIRPORTS: Record<string, BlogAirport> = {
  YEG: { iata: 'YEG', city: 'Edmonton', lat: 53.309723, lng: -113.580278 },
  YHZ: { iata: 'YHZ', city: 'Halifax', lat: 44.880833, lng: -63.508611 },
  YOW: { iata: 'YOW', city: 'Ottawa', lat: 45.322498, lng: -75.669197 },
  YQB: { iata: 'YQB', city: 'Quebec City', lat: 46.791111, lng: -71.393333 },
  YQR: { iata: 'YQR', city: 'Regina', lat: 50.431944, lng: -104.665833 },
  YTZ: { iata: 'YTZ', city: 'Toronto', lat: 43.627499, lng: -79.396194 },
  YUL: { iata: 'YUL', city: 'Montreal', lat: 45.4706, lng: -73.740799 },
  YVR: { iata: 'YVR', city: 'Vancouver', lat: 49.193901, lng: -123.184402 },
  YWG: { iata: 'YWG', city: 'Winnipeg', lat: 49.909999, lng: -97.239799 },
  YXE: { iata: 'YXE', city: 'Saskatoon', lat: 52.170834, lng: -106.699722 },
  YYT: { iata: 'YYT', city: "St. John's", lat: 47.618598, lng: -52.7519 },
  YYC: { iata: 'YYC', city: 'Calgary', lat: 51.113888, lng: -114.020278 },
  YYZ: { iata: 'YYZ', city: 'Toronto', lat: 43.6772, lng: -79.6306 },
}

export function resolveBlogAirport(post: {
  iata?: string | null
  slug: string
}): BlogAirport | null {
  const explicit = post.iata?.trim().toUpperCase()
  if (explicit) return BLOG_AIRPORTS[explicit] ?? null

  const found = new Set<string>()
  for (const token of post.slug.toUpperCase().split(/[^A-Z0-9]+/)) {
    if (BLOG_AIRPORTS[token]) found.add(token)
  }
  if (found.size !== 1) return null
  return BLOG_AIRPORTS[[...found][0]]
}
