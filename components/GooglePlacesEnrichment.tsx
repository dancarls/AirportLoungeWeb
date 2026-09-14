import type { GooglePlace } from '@/lib/google-places'
import { photoUrl } from '@/lib/google-places'

interface Props {
  place: GooglePlace | null | undefined
  loungeName: string
}

/**
 * Sidebar block on the lounge detail page that surfaces Google-verified
 * rating + review count + photos + hours + link out to Google Maps. Renders
 * nothing when the lounge has not been enriched yet, so the page degrades
 * cleanly during the backfill window.
 *
 * All photos come from Google's photo/media endpoint with the site's Places
 * API key inlined — Google's ToS requires the key on the URL. Photos may not
 * be re-hosted; the direct URL must resolve on every load.
 */
export default function GooglePlacesEnrichment({ place, loungeName }: Props) {
  if (!place) return null

  const rating = place.rating
  const reviewCount = place.userRatingCount ?? 0
  const photos = (place.photos ?? []).slice(0, 6)
  const openingHours = place.regularOpeningHours?.weekdayDescriptions

  return (
    <div className="bg-white border border-outline-variant/30 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>verified</span>
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary">Verified on Google</span>
      </div>

      {rating != null && (
        <div className="flex items-baseline gap-3 mb-4">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>star</span>
            <span className="font-bold text-2xl text-primary">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-secondary">from {reviewCount.toLocaleString('en-CA')} Google reviews</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mb-4">
          {photos.map((p, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={p.name}
              src={photoUrl(p.name, 400)}
              alt={`${loungeName} — Google photo ${i + 1}`}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>
      )}

      {place.editorialSummary?.text && (
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 italic">
          "{place.editorialSummary.text}"
          <span className="block text-[10px] text-secondary/60 mt-1 not-italic">— Google editorial summary</span>
        </p>
      )}

      {openingHours && openingHours.length > 0 && (
        <details className="mb-3">
          <summary className="cursor-pointer text-sm font-semibold text-primary py-1">
            Hours verified on Google
          </summary>
          <ul className="text-xs text-on-surface-variant mt-2 space-y-0.5">
            {openingHours.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </details>
      )}

      {place.googleMapsUri && (
        <a
          href={place.googleMapsUri}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2"
        >
          See on Google Maps
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
        </a>
      )}

      <p className="text-[10px] text-secondary/50 mt-4 leading-relaxed">
        Google rating and photos are third-party data supplementing our verified operator information. Photos © Google and their contributors.
      </p>
    </div>
  )
}
