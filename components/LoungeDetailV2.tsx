/**
 * LoungeDetailV2 — the editorial redesign from the "Aviation Editorial & Transit
 * Intelligence" system delivered as stitch_airport_lounge_listing_redesign.zip.
 *
 * SEO invariants preserved by design (audit checklist for this file):
 *   - Same URL / route (this component is rendered from the same page.tsx)
 *   - Same JSON-LD blocks (rendered upstream, before this component)
 *   - Same H1 text (rendered from lounge.name)
 *   - Same data-speakable="intro" + data-speakable="access" hooks
 *   - Same internal link targets (breadcrumb + related-lounges + blog)
 *   - Same image alt text (from lounge_images.alt_text)
 *
 * Gated on a slug allowlist in page.tsx — one lounge at a time until the
 * design is proven, then flip the flag to expand.
 */

import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'
import LoungeMapClient from '@/components/LoungeMapClient'
import GalleryLightbox from '@/components/GalleryLightbox'
import WeatherWidget from '@/components/WeatherWidget'
import LoungePlaceholder from '@/components/LoungePlaceholder'
import NewsletterCTA from '@/components/NewsletterCTA'
import GooglePlacesEnrichment from '@/components/GooglePlacesEnrichment'
import LoungeClosureBanner from '@/components/LoungeClosureBanner'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'
import {
  getImageUrl,
  amenityIcon,
  DAY_ORDER,
  accessTierIcon,
  accessTierBadge,
  getBookingDestination,
  getLiveStatus,
  sellsWalkInDayPass,
} from '@/lib/lounge-helpers'
import { photoUrl as googlePhotoUrl } from '@/lib/google-places'
import type { Lounge, Review, AccessType } from '@/lib/types'
import type { GooglePlace } from '@/lib/google-places'

// Editorial display font, loaded once at build time. Applied via className scope
// to avoid leaking Plus Jakarta Sans into V1 pages while we're still testing.
const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-display',
})

interface Props {
  lounge: Lounge
  reviews: Review[]
  weather: Awaited<ReturnType<typeof import('@/lib/weather').getWeather>> | null
  googlePlace: GooglePlace | null
  alternativeLounges: { slug: string; name: string; terminal: string | null; airport_iata: string }[]
  code: string
  /**
   * Card-affiliate CTA for this lounge. Always safe to render since it points
   * to a FinlyWealth landing page that exists whether or not the affiliate ID
   * is set (see lib/affiliates.ts).
   */
  cardsCta: { href: string; ctaLabel: string; heading: string }
  isSignedIn: boolean
}

// Day-abbreviation for the compact 7-day toggle in the sticky rail.
const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default function LoungeDetailV2({
  lounge: l,
  reviews,
  weather,
  googlePlace,
  alternativeLounges,
  code,
  cardsCta,
  isSignedIn,
}: Props) {
  const images   = l.images ?? []
  const primaryIdx = images.findIndex(i => i.is_primary)
  const orderedImages = primaryIdx > 0
    ? [images[primaryIdx], ...images.filter((_, i) => i !== primaryIdx)]
    : images

  // Hero-photo pipeline: prefer local uploads, then fall back to Google Places
  // photos (the enrichment already fetches up to 10 per lounge). Every hero
  // slot has provenance metadata so the UI can render the Google-attribution
  // caption when required by Google's Places API terms.
  const heroPhotos = buildHeroPhotos(orderedImages, googlePlace, l.name)
  const heroPrimary   = heroPhotos[0]
  const heroSecondary = heroPhotos[1]
  const heroTertiary  = heroPhotos[2]
  const hasGooglePhotoInHero = heroPhotos.some(p => p?.provenance === 'google')
  const hasAiPhotoInHero     = heroPhotos.some(p => p?.provenance === 'ai')

  const accessTypes = (l.access_types ?? []) as AccessType[]
  const isClosed = !!l.closure_status && l.closure_status !== 'open'

  // Prefer aggregated Google rating when local reviews are absent — this
  // matches what the V1 sidebar already shows and keeps parity in AggregateRating.
  const displayRating = l.rating ?? googlePlace?.rating ?? null
  const displayReviewCount = (l.review_count && l.review_count > 0)
    ? l.review_count
    : (googlePlace?.userRatingCount ?? 0)

  // For the amenity-count strapline
  const amenityCount = (l.amenities ?? []).length

  // Access-type summary for the hero meta-strip
  const accessSummary = accessTypes.slice(0, 2).map(a => a.name).join(' • ') || 'Member / Status'

  // Location string for the hero meta-strip
  const locationSummary = [l.location_detail, l.terminal ? `Terminal ${l.terminal}` : null]
    .filter(Boolean)
    .join(' · ') || (l.terminal ? `Terminal ${l.terminal}` : `${l.airport?.name ?? code}`)

  // Booking destination — no fabricated CTA. Verified affiliate → Priority
  // Pass page → Google Maps (guaranteed live) → verified operator domain →
  // hidden. See lib/lounge-helpers.ts for the full resolution order.
  const booking = getBookingDestination({
    name: l.name,
    website: l.website ?? null,
    googlePlaceId: (l as { google_place_id?: string | null }).google_place_id ?? null,
  })

  // Whether the DB's `guest_fee` should be displayed as a walk-in price on the
  // primary Book card. Air Canada MLL rows have $59 in guest_fee — but that's
  // the member-brings-guest fee, NOT a walk-in ticket. Showing it prominently
  // as "Book Now $59" would mislead a non-member reader.
  const showFeeAsWalkIn = l.guest_fee != null && sellsWalkInDayPass(l.name, accessTypes)
  // Otherwise, if guest_fee is set, we'll display it in the Access section as
  // "Additional guest fee" so members still see it — but as context, not price.
  const showFeeAsGuestSurcharge = l.guest_fee != null && !sellsWalkInDayPass(l.name, accessTypes)

  // Live open/closed calc using the airport's timezone. Falls back to
  // 'unknown' when either data is missing so the UI never invents a status.
  const liveStatus = isClosed
    ? { kind: 'closed' as const, label: `Closed${l.closure_reopen_estimate ? ` · reopens ${l.closure_reopen_estimate}` : ''}`, tone: 'closed' as const }
    : getLiveStatus(l.opening_hours, l.airport?.timezone ?? null)

  // Access-highlight bullets for the booking card — derived from real amenities,
  // never fabricated. Keeps the visual density of the mockup while staying honest.
  const amenityHighlights = buildAmenityHighlights(l.amenities ?? [])

  return (
    <div className={`${displayFont.variable} bg-[#faf9f6] min-h-screen`}>
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HERO MASTHEAD — dark navy w/ breadcrumbs, title, gallery, meta bar */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#0e2a38] text-white overflow-hidden">
        {/* Ambient architectural glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(130,245,193,0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(72,98,113,0.15), transparent 40%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-10 relative z-10">
          {/* Breadcrumbs — same targets as V1 so no internal linking change */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#afcadc] mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/airports" className="hover:text-white transition-colors">Canadian Airports</Link>
            <span className="text-white/40">/</span>
            <Link href={`/airports/${code}`} className="hover:text-white transition-colors">
              {l.airport?.city ?? code} ({code})
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-[#68dba9]">{l.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e2a38]/60 backdrop-blur border border-white/10 text-[#68dba9] text-[11px] font-bold uppercase tracking-[0.08em]">
                <span className={`inline-block w-2 h-2 rounded-full ${isClosed ? 'bg-amber-400' : 'bg-[#68dba9] animate-pulse'}`} />
                {l.airport?.name ?? code} ({code})
                {l.terminal && ` • Terminal ${l.terminal}`}
              </div>
              <h1
                className="font-[family-name:var(--font-display)] font-bold tracking-tight text-white leading-tight text-[30px] sm:text-[38px] lg:text-[44px]"
              >
                {l.name}
              </h1>
              {l.description && (
                <p
                  className="text-white/80 text-[16px] leading-[26px] max-w-2xl"
                  // Strip HTML for the hero lede — the full rich description
                  // still renders in the Overview section below with the
                  // data-speakable hook.
                >
                  {l.description.replace(/<[^>]*>/g, '').trim().slice(0, 200)}
                  {l.description.replace(/<[^>]*>/g, '').trim().length > 200 && '…'}
                </p>
              )}
            </div>

            {/* Rating badge — right-aligned on desktop */}
            <div className="lg:col-span-4 flex lg:justify-end">
              {displayRating && (
                <div className="bg-[#0e2a38]/70 backdrop-blur border border-white/10 px-4 py-3 rounded-xl flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#68dba9]">Overall Score</div>
                    <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                      {displayRating.toFixed(1)}
                      <span
                        className="material-symbols-outlined text-amber-400 text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#afcadc]">Verified Reviews</div>
                    <div className="text-sm font-semibold text-white">
                      {displayReviewCount.toLocaleString('en-CA')} {displayReviewCount === 1 ? 'traveller' : 'travellers'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── HERO GALLERY: 1 large + 2 stacked (falls back to Google Places) ── */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl overflow-hidden shadow-2xl">
            <div className="md:col-span-8 relative h-72 lg:h-96 group">
              {heroPrimary ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={heroPrimary.url}
                  alt={heroPrimary.alt}
                  loading="eager"
                />
              ) : (
                <LoungePlaceholder name={l.name} variant="hero" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e2a38]/70 via-transparent to-transparent" />
              {heroPhotos.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1.5 bg-[#0e2a38]/60 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[16px] text-[#68dba9]">
                      {hasAiPhotoInHero ? 'auto_awesome' : 'photo_camera'}
                    </span>
                    {hasAiPhotoInHero
                      ? 'AI-generated placeholder · real photos coming soon'
                      : hasGooglePhotoInHero
                        ? `${heroPhotos.length} photo${heroPhotos.length === 1 ? '' : 's'} · via Google`
                        : `${orderedImages.length} verified photo${orderedImages.length === 1 ? '' : 's'}`}
                  </span>
                  {l.terminal && (
                    <span className="font-mono text-[#68dba9] text-xs bg-[#0e2a38]/60 backdrop-blur-md px-3 py-1 rounded-full">
                      Terminal {l.terminal}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-2 h-72 lg:h-96">
              <div className="relative overflow-hidden group">
                {heroSecondary ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={heroSecondary.url}
                    alt={heroSecondary.alt}
                  />
                ) : (
                  <div className="w-full h-full bg-[#071e28]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e2a38]/70 via-transparent to-transparent" />
              </div>
              <div className="relative overflow-hidden group">
                {heroTertiary ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={heroTertiary.url}
                    alt={heroTertiary.alt}
                  />
                ) : (
                  <div className="w-full h-full bg-[#071e28]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e2a38]/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Honest AI-attribution disclaimer directly under the gallery.
              Mirrors the caption on the hero pill so viewers still see it
              even if they missed the pill (mobile, or above the fold on desktop). */}
          {hasAiPhotoInHero && (
            <p className="mt-2 text-[11px] text-white/60 italic leading-relaxed">
              <span className="material-symbols-outlined align-middle text-[13px] mr-1">auto_awesome</span>
              These images are AI-generated placeholders while we source real photography of {l.name}. Amenities, hours and access rules on this page are verified from operator sources.
            </p>
          )}

          {/* ── QUICK META STRIP (4 tiles) ─────────────────────────────── */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <MetaTile icon="pin_drop" label="Location" value={locationSummary} />
            <MetaTile icon="verified_user" label="Access Protocol" value={accessSummary} />
            <MetaTile
              icon="airline_seat_recline_extra"
              label="Seating Capacity"
              value={l.capacity ? `${l.capacity} guests` : 'Not disclosed'}
            />
            <MetaTile
              icon="history"
              label="Data Verified"
              value={l.updated_at
                ? new Date(l.updated_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Editorial'}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STICKY SUB-NAV — in-page anchors                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between overflow-x-auto py-2.5">
          <div className="flex items-center gap-6 text-sm font-semibold shrink-0 whitespace-nowrap">
            <a href="#overview" className="text-[#0e2a38] hover:text-[#059669] py-1 transition-colors border-b-2 border-transparent hover:border-[#059669]">Overview</a>
            <a href="#access-eligibility" className="text-[#42474b] hover:text-[#0e2a38] py-1 transition-colors">Access &amp; Cards</a>
            <a href="#amenities" className="text-[#42474b] hover:text-[#0e2a38] py-1 transition-colors">Amenities</a>
            <a href="#operating-hours" className="text-[#42474b] hover:text-[#0e2a38] py-1 transition-colors">Daily Schedule</a>
            <a href="#wayfinding" className="text-[#42474b] hover:text-[#0e2a38] py-1 transition-colors">Terminal Wayfinding</a>
            <a href="#traveler-reviews" className="text-[#42474b] hover:text-[#0e2a38] py-1 transition-colors">Reviews</a>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                liveStatus.tone === 'open' ? 'bg-[#059669]'
                : liveStatus.tone === 'closed' ? 'bg-amber-500'
                : 'bg-slate-400'
              }`}
            />
            <span
              className={`text-[11px] font-bold uppercase tracking-[0.08em] ${
                liveStatus.tone === 'open' ? 'text-[#059669]'
                : liveStatus.tone === 'closed' ? 'text-amber-700'
                : 'text-slate-500'
              }`}
            >
              {liveStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BODY: 8 / 4 SPLIT (editorial main + sticky action rail)             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Closure banner takes precedence when applicable */}
            {isClosed && (
              <LoungeClosureBanner
                status={l.closure_status as 'temporary_closure' | 'reduced_capacity' | 'permanent_closure'}
                reason={l.closure_reason ?? null}
                startedOn={l.closure_started_on ?? null}
                reopenEstimate={l.closure_reopen_estimate ?? null}
                alternatives={l.closure_alternatives ?? null}
                alternativeLounges={alternativeLounges}
                sourceUrl={l.closure_source_url ?? null}
                verifiedAt={l.updated_at ?? null}
                loungeName={l.name}
              />
            )}

            {/* ─── SECTION: OVERVIEW ─────────────────────────────── */}
            <section id="overview" className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-4">
              <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                About This Lounge
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                {l.description ? `Inside the ${l.name}` : 'A refined travel experience'}
              </h2>

              {l.description ? (
                <div
                  data-speakable="intro"
                  className="text-[16px] leading-[26px] text-[#42474b] max-w-3xl
                    [&_h4]:font-semibold [&_h4]:text-[#0e2a38] [&_h4]:text-[17px] [&_h4]:mt-6 [&_h4]:mb-2
                    [&_h3]:font-semibold [&_h3]:text-[#0e2a38] [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
                    [&_p]:mb-4 [&_p:last-child]:mb-0
                    [&_strong]:font-semibold [&_strong]:text-[#0e2a38]
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                    [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: l.description }}
                />
              ) : (
                <p data-speakable="intro" className="text-[16px] leading-[26px] text-[#42474b] max-w-3xl">
                  {l.name} offers premium travellers a refined sanctuary from the terminal concourse.
                  {l.airport?.name ? ` Located at ${l.airport.name}` : ''}{l.terminal ? `, Terminal ${l.terminal}` : ''},
                  this lounge delivers premium amenities and attentive service in a calm environment before departure.
                </p>
              )}

              {/* Feature bullets — take the first 3 amenities as headline picks */}
              {(l.amenities ?? []).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                  {(l.amenities ?? []).slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-start gap-2 p-3 rounded-lg bg-[#f4f3f0]">
                      <span className="material-symbols-outlined text-[#059669] text-[20px] shrink-0 mt-0.5">check_circle</span>
                      <div>
                        <div className="font-semibold text-[#0e2a38] text-[15px] leading-snug">{a.name}</div>
                        <div className="text-[12px] text-[#42474b]">Verified in-lounge amenity</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Good to Know — surfaces busy_times.note */}
              {l.busy_times?.note && (
                <div className="bg-[#f4f3f0] rounded-xl p-4 md:p-5 flex gap-4 items-start mt-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0e2a38] text-[#68dba9] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">lightbulb</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#0e2a38]">Good to know: {l.airport?.city ?? code} traffic pattern</h3>
                    <p className="text-[14px] text-[#42474b] leading-relaxed">{l.busy_times.note}</p>
                    <div className="flex gap-4 text-[12px] text-[#42474b] pt-1">
                      {l.busy_times.busiest && (
                        <span><strong className="text-red-600">Busiest:</strong> {l.busy_times.busiest}</span>
                      )}
                      {l.busy_times.quietest && (
                        <span><strong className="text-[#059669]">Quietest:</strong> {l.busy_times.quietest}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {l.updated_at && (
                <p className="text-[11px] text-[#42474b] mt-4">
                  Last verified{' '}
                  <time dateTime={l.updated_at}>
                    {new Date(l.updated_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {' · '}
                  <Link href="/about#sourcing" className="underline underline-offset-2 hover:text-[#0e2a38]">
                    Sourcing methodology
                  </Link>
                </p>
              )}
            </section>

            {/* ─── SECTION: ACCESS & ADMITTANCE ─────────────────── */}
            {accessTypes.length > 0 && (
              <section
                id="access-eligibility"
                data-speakable="access"
                className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    Eligibility Directory
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                    Access &amp; Admittance Criteria
                  </h2>
                  <p className="text-[14px] text-[#42474b] mt-2">
                    Admittance to {l.name} is governed by these access channels. Verify eligibility before travel — rules can change.
                  </p>
                </div>
                {/* Honest disclosure of the additional-guest fee for lounges
                    where a member can bring a companion. Not a walk-in price. */}
                {showFeeAsGuestSurcharge && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0 mt-0.5">payments</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Additional guest fee: ${l.guest_fee} {l.guest_fee_currency ?? 'CAD'}
                      </p>
                      <p className="text-[13px] text-amber-800 mt-0.5 leading-snug">
                        This is what an <em>eligible member</em> pays to bring one companion. It is <strong>not</strong> a walk-in ticket — non-members cannot enter by paying this amount. Verify at check-in; rates change without notice.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {accessTypes.map((at, i) => {
                    const badge = accessTierBadge(at.type, at.name)
                    return (
                      <div
                        key={i}
                        className="bg-[#f4f3f0] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#efeeeb] transition-colors"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#0e2a38] text-[#68dba9] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">{accessTierIcon(at.type)}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-[#0e2a38] text-[16px]">{at.name}</h3>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.08em] ${
                                  badge.tone === 'complimentary'
                                    ? 'bg-[#82f5c1]/40 text-[#00714e]'
                                    : badge.tone === 'paid'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-[#c2c7cc]/50 text-[#42474b]'
                                }`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            {at.details && (
                              <p className="text-[13px] text-[#42474b] mt-1 leading-snug">{at.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Sponsored — routes to FinlyWealth (Aeroplan cards for MLL,
                    general otherwise). Same target as V1. */}
                <div className="rounded-xl bg-gradient-to-r from-[#0e2a38] to-[#0e2a38]/80 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#68dba9] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      Sponsored — Card Match
                    </div>
                    <h3 className="font-semibold text-white text-[17px]">{cardsCta.heading}</h3>
                    <p className="text-[13px] text-white/80 max-w-md">
                      Compare current Canadian credit cards with lounge benefits, welcome bonuses, and active rebates.
                    </p>
                  </div>
                  <a
                    href={cardsCta.href}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="shrink-0 bg-[#059669] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#047857] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {cardsCta.ctaLabel}
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                </div>
              </section>
            )}

            {/* ─── SECTION: AMENITIES ────────────────────────────── */}
            {(l.amenities ?? []).length > 0 && (
              <section id="amenities" className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                      <span className="material-symbols-outlined text-[16px]">room_service</span>
                      Service Standards
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                      Refined Lounge Amenities
                    </h2>
                  </div>
                  <span className="text-sm font-semibold text-[#059669] bg-[#82f5c1]/30 px-3 py-1 rounded">
                    {amenityCount} verified amenit{amenityCount === 1 ? 'y' : 'ies'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
                  {(l.amenities ?? []).map(a => (
                    <div
                      key={a.id}
                      className="p-4 rounded-xl bg-[#f4f3f0] flex flex-col items-center text-center space-y-2 hover:bg-[#e9e8e5] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0e2a38] shadow-sm">
                        <span className="material-symbols-outlined text-[26px]">{amenityIcon(a.name)}</span>
                      </div>
                      <span className="font-semibold text-[13px] text-[#0e2a38] leading-tight">{a.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ─── SECTION: OPERATING HOURS ──────────────────────── */}
            {l.opening_hours && (
              <section id="operating-hours" className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      Operational Schedule
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                      Operating Hours &amp; Service Times
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#82f5c1]/30 text-[#00714e] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.08em]">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                    Synchronized with {code} flights
                  </div>
                </div>

                {l.opening_hours.is_24_7 ? (
                  <div className="bg-[#82f5c1]/20 border border-[#82f5c1]/60 p-4 rounded-lg">
                    <p className="text-[#00714e] font-bold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined">check_circle</span>
                      Open 24 hours a day, 7 days a week
                    </p>
                    {l.opening_hours.notes && (
                      <p className="text-[13px] text-[#00714e] mt-2 leading-relaxed">{l.opening_hours.notes}</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-2">
                      {DAY_ORDER.slice(0, 4).map(day => {
                        const h = l.opening_hours[day]
                        if (!h) return null
                        return (
                          <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0]">
                            <span className="font-semibold text-[#0e2a38] capitalize">{day}</span>
                            <span className="font-mono font-bold text-[#0e2a38]">{h}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="space-y-2">
                      {DAY_ORDER.slice(4).map(day => {
                        const h = l.opening_hours[day]
                        if (!h) return null
                        return (
                          <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0]">
                            <span className="font-semibold text-[#0e2a38] capitalize">{day}</span>
                            <span className="font-mono font-bold text-[#0e2a38]">{h}</span>
                          </div>
                        )
                      })}
                      {l.opening_hours.notes && (
                        <div className="flex items-start justify-between p-3 rounded-lg bg-[#e9e8e5] text-[#42474b] text-[13px]">
                          <span className="flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">info</span> Notes
                          </span>
                          <span className="text-right max-w-[65%]">{l.opening_hours.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ─── PHOTO GALLERY (extra photos beyond the hero grid) ─── */}
            {orderedImages.length > 3 && (
              <section id="gallery" className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    Photo Library
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                    More Photos of {l.name}
                  </h2>
                </div>
                <GalleryLightbox images={orderedImages} loungeName={l.name} />
              </section>
            )}

            {/* ─── SECTION: REVIEWS ──────────────────────────────── */}
            <section id="traveler-reviews" className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e7eb] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                    <span className="material-symbols-outlined text-[16px]">reviews</span>
                    Traveller Experiences
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] lg:text-[28px] font-bold text-[#0e2a38] tracking-tight leading-tight">
                    Reviews &amp; Ratings
                  </h2>
                </div>
                {displayRating && displayReviewCount > 0 && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#0e2a38]">{displayRating.toFixed(1)}</div>
                    <div className="text-[11px] text-[#42474b]">
                      {displayReviewCount.toLocaleString('en-CA')} verified reviews
                    </div>
                  </div>
                )}
              </div>

              {isSignedIn ? (
                <div className="bg-[#f4f3f0] p-5 rounded-xl">
                  <h4 className="font-semibold text-[#0e2a38] mb-4">Share your experience</h4>
                  <ReviewForm loungeId={l.id} />
                </div>
              ) : (
                <div className="bg-[#f4f3f0] p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[#42474b]">Been to {l.name}? Sign in to share your experience.</p>
                  <Link
                    href={`/auth/login?redirectTo=/airports/${code}/lounges/${l.slug}`}
                    className="inline-flex items-center gap-2 bg-[#0e2a38] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0e2a38]/90 transition-colors shrink-0"
                  >
                    Sign in to review
                  </Link>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviews.slice(0, 5).map(r => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-[#42474b]">
                  <span className="material-symbols-outlined mb-3 block" style={{ fontSize: '48px' }}>rate_review</span>
                  <p>No traveller reviews yet. Be the first to share your experience of {l.name}.</p>
                </div>
              )}
            </section>
          </div>

          {/* ─── RIGHT COLUMN: STICKY ACTION RAIL ───────────────────── */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-16">
            {/* Live status card — real-time open/closed using airport timezone */}
            <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {liveStatus.tone === 'open' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        liveStatus.tone === 'open' ? 'bg-[#059669]'
                        : liveStatus.tone === 'closed' ? 'bg-amber-500'
                        : 'bg-slate-400'
                      }`}
                    />
                  </span>
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${
                      liveStatus.tone === 'open' ? 'text-[#059669]'
                      : liveStatus.tone === 'closed' ? 'text-amber-700'
                      : 'text-slate-500'
                    }`}
                  >
                    {liveStatus.tone === 'open' ? 'Open Now'
                     : liveStatus.tone === 'closed' ? 'Closed'
                     : 'Schedule'}
                  </span>
                </div>
                {l.airport?.timezone && liveStatus.kind !== 'unknown' && (
                  <span className="text-[10px] font-mono text-[#42474b]">
                    {new Intl.DateTimeFormat('en-CA', {
                      timeZone: l.airport.timezone,
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    }).format(new Date())} {l.airport.city} time
                  </span>
                )}
              </div>

              <p className="text-sm text-[#0e2a38]">{liveStatus.label}</p>

              {/* 7-day schedule toggle — only when we have a real schedule to show */}
              {l.opening_hours && !l.opening_hours.is_24_7 && !isClosed && (
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-sm text-[#0e2a38] hover:text-[#059669] py-1 transition-colors">
                    <span>View 7-day schedule</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-2 space-y-1 text-[13px] border-t border-[#e5e7eb] mt-2">
                    {DAY_ORDER.map(day => {
                      const h = l.opening_hours[day]
                      if (!h) return (
                        <div key={day} className="flex justify-between py-1 px-2 text-slate-400">
                          <span className="capitalize">{DAY_ABBR[day]}</span>
                          <span>Closed</span>
                        </div>
                      )
                      return (
                        <div key={day} className="flex justify-between py-1 px-2 text-[#42474b]">
                          <span className="capitalize">{DAY_ABBR[day]}</span>
                          <span className="font-mono">{h}</span>
                        </div>
                      )
                    })}
                  </div>
                </details>
              )}

              {l.opening_hours?.notes && (
                <p className="text-[11px] text-[#42474b] italic leading-relaxed pt-1 border-t border-[#e5e7eb]">
                  {l.opening_hours.notes}
                </p>
              )}
            </div>

            {/* Access & Booking card — truth-only. Content depends on what we
                actually know: real published price, real booking destination,
                real amenities. No fabricated perks or unverified claims. */}
            <div className="bg-[#0e2a38] text-white rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#059669]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Header row: badge, headline, icon.
                  Fee display is CONDITIONAL: only surfaces as a walk-in price
                  when the operator actually sells walk-in access. For lounges
                  where guest_fee means "member brings guest", we hide the
                  number here and show it in the Access section instead. */}
              <div className="flex items-start justify-between relative z-10">
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.08em] bg-[#059669] text-white">
                    {showFeeAsWalkIn ? 'Walk-in Day Pass' : 'Access & Booking'}
                  </span>

                  {showFeeAsWalkIn ? (
                    <div className="mt-2">
                      <div className="font-[family-name:var(--font-display)] text-3xl font-bold text-white leading-none">
                        ${l.guest_fee}
                        <span className="text-sm font-normal text-[#68dba9] ml-1">
                          {l.guest_fee_currency ?? 'CAD'}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-1">
                        Published walk-in rate · verify on the operator site
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="font-[family-name:var(--font-display)] text-xl font-bold text-white leading-snug">
                        {accessTypes.length > 0
                          ? 'Access via eligible fare, elite status or card'
                          : 'Access via the operator'}
                      </div>
                      <p className="text-xs text-white/70 mt-1">
                        This lounge does not sell walk-in day passes with us
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#68dba9] shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[24px]">
                    {showFeeAsWalkIn ? 'confirmation_number' : 'workspace_premium'}
                  </span>
                </div>
              </div>

              {/* Amenity chips — real amenities only, up to 3 */}
              {amenityHighlights.length > 0 && (
                <div className="flex flex-wrap gap-2 relative z-10">
                  {amenityHighlights.map(h => (
                    <span
                      key={h.label}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/90 bg-white/10 px-2.5 py-1 rounded-full"
                    >
                      <span className="material-symbols-outlined text-[#68dba9] text-[15px]">{h.icon}</span>
                      {h.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Primary CTA — always lands on a real destination */}
              {booking.url && booking.ctaLabel && (
                <a
                  href={booking.url}
                  target="_blank"
                  rel={booking.kind === 'affiliate' ? AFFILIATE_REL : 'noopener noreferrer'}
                  className="relative z-10 w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                  <span>{booking.ctaLabel}</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              )}
              {/* When we cannot connect them anywhere, be honest about it and
                  route to card comparison instead — never a fake "Book" button */}
              {!booking.url && (
                <a
                  href={cardsCta.href}
                  target="_blank"
                  rel={AFFILIATE_REL}
                  className="relative z-10 w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                  <span>{cardsCta.ctaLabel}</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              )}

              {/* Attribution caption — always tells the reader exactly where
                  the button will take them, and discloses the commercial
                  relationship where one exists */}
              {booking.url && booking.hostname && (
                <p className="relative z-10 text-[11px] text-white/60 text-center leading-relaxed">
                  {booking.kind === 'affiliate'
                    ? <>Booking on {booking.hostname} · we may earn a commission</>
                    : booking.kind === 'priority_pass'
                      ? <>Verified Priority Pass listing · current hours, access rules & photos</>
                      : booking.kind === 'google_maps'
                        ? <>Live listing on Google Maps · current hours, photos, reviews &amp; directions</>
                        : <>Info on {booking.hostname}</>}
                </p>
              )}

              {/* Secondary utility row */}
              <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
                {l.phone && (
                  <a
                    href={`tel:${l.phone.replace(/[^\d+]/g, '')}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    Call Lounge
                  </a>
                )}
                <Link
                  href={`/airports/${code}`}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors ${
                    !l.phone ? 'col-span-2' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">explore</span>
                  All {code} lounges
                </Link>
              </div>
            </div>

            {/* Terminal Navigation */}
            {l.airport?.latitude && l.airport?.longitude && (
              <div id="wayfinding" className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em]">
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    Terminal Navigation
                  </div>
                  {l.terminal && (
                    <span className="text-xs font-mono font-bold text-[#0e2a38]">
                      Terminal {l.terminal}
                    </span>
                  )}
                </div>
                <div className="w-full h-40 rounded-lg overflow-hidden bg-[#f4f3f0]">
                  <LoungeMapClient
                    latitude={l.airport.latitude}
                    longitude={l.airport.longitude}
                    name={l.name}
                  />
                </div>
                {l.location_detail && (
                  <p className="text-[13px] text-[#42474b] leading-relaxed">{l.location_detail}</p>
                )}
                {l.airport?.terminal_map_url && (
                  <a
                    href={l.airport.terminal_map_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#0e2a38] font-semibold text-sm rounded-lg transition-colors"
                  >
                    Open full airport terminal map →
                  </a>
                )}
              </div>
            )}

            {/* Airfield Conditions — wraps existing WeatherWidget */}
            {weather && l.airport && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#059669] text-[11px] font-bold uppercase tracking-[0.08em]">
                      <span className="material-symbols-outlined text-[16px]">cloud</span>
                      Airfield Conditions
                    </div>
                    <span className="text-xs font-mono text-[#0e2a38]">{code}</span>
                  </div>
                </div>
                <WeatherWidget weather={weather} city={l.airport.city} iata={code} />
              </div>
            )}

            {/* Google Places enrichment */}
            <GooglePlacesEnrichment place={googlePlace} loungeName={l.name} />

            {/* Newsletter */}
            <NewsletterCTA
              source={`lounge:${l.slug}`}
              variant="light"
              heading="Get updates for this lounge"
              subheading={`Monthly briefing on access-rule changes at ${l.name} and other Canadian lounges.`}
            />
          </aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CALLOUT — Compare other lounges at this airport             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0e2a38] text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#68dba9]">Airport Network</div>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] lg:text-[28px] font-bold text-white leading-tight">
              Compare other lounges at {l.airport?.city ?? code} Airport
            </h2>
            <p className="text-white/70 max-w-xl text-sm">
              Evaluate every catalogued lounge at {code} side-by-side — access rules, amenities, and traveller ratings.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/airports/${code}`}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              All {code} lounges
            </Link>
            <Link
              href="/airports"
              className="bg-[#059669] text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#047857] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>All Canadian hubs</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Small presentational sub-component for the 4-tile meta strip under the hero.
function MetaTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-[#68dba9]/15 flex items-center justify-center text-[#68dba9] shrink-0">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#afcadc]">{label}</div>
        <div className="text-sm font-semibold text-white truncate">{value}</div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Hero photos: prefer local uploads (curated), fall back to Google Places
// photos (up to 3 total). Every entry carries provenance so the UI can render
// the "via Google" attribution required by Google Places API terms.
// ────────────────────────────────────────────────────────────────────────────
interface HeroPhoto {
  url: string
  alt: string
  provenance: 'local' | 'google' | 'ai'
}

function buildHeroPhotos(
  localImages: Array<{ storage_path: string; alt_text: string | null; is_ai_generated?: boolean }>,
  googlePlace: GooglePlace | null,
  loungeName: string,
): HeroPhoto[] {
  const HERO_COUNT = 3
  const locals: HeroPhoto[] = localImages.slice(0, HERO_COUNT).map((img, i) => ({
    url: getImageUrl(img.storage_path),
    alt: img.alt_text ?? `${loungeName} — interior view ${i + 1}`,
    provenance: img.is_ai_generated ? 'ai' : 'local',
  }))
  if (locals.length >= HERO_COUNT) return locals
  const need = HERO_COUNT - locals.length
  const gPhotos = (googlePlace?.photos ?? []).slice(0, need).map((p, i) => ({
    url: googlePhotoUrl(p.name, 1600),
    alt: `${loungeName} — photo ${locals.length + i + 1} (via Google)`,
    provenance: 'google' as const,
  }))
  return [...locals, ...gPhotos]
}

// ────────────────────────────────────────────────────────────────────────────
// Amenity-highlight builder for the booking sidebar card. Uses only real DB
// amenities — never invented perks. Returns up to 3 icon + label pairs.
// ────────────────────────────────────────────────────────────────────────────
interface AmenityHighlight { icon: string; label: string }

function buildAmenityHighlights(amenities: { name: string }[]): AmenityHighlight[] {
  const names = amenities.map(a => a.name.toLowerCase())
  const has = (needle: string) => names.some(n => n.includes(needle))

  const picks: AmenityHighlight[] = []
  if (has('wifi') || has('wi-fi'))                           picks.push({ icon: 'wifi',        label: 'Wi-Fi' })
  if (has('shower'))                                          picks.push({ icon: 'shower',      label: 'Showers' })
  if (has('hot food') || has('buffet') || has('dining'))     picks.push({ icon: 'soup_kitchen', label: 'Hot food' })
  if (picks.length < 3 && (has('bar') || has('wine') || has('drinks'))) picks.push({ icon: 'local_bar',   label: 'Full bar' })
  if (picks.length < 3 && (has('coffee') || has('barista'))) picks.push({ icon: 'local_cafe',  label: 'Barista coffee' })
  if (picks.length < 3 && (has('quiet') || has('sleep') || has('nap'))) picks.push({ icon: 'do_not_disturb', label: 'Quiet zone' })
  if (picks.length < 3 && (has('business') || has('printing'))) picks.push({ icon: 'business_center', label: 'Business area' })
  return picks.slice(0, 3)
}
