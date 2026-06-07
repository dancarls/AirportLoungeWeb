'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Lounge, Airport, Amenity } from '@/lib/types'

type FullLounge = Lounge & { airport?: Airport; amenities?: Amenity[]; images?: { storage_path: string; is_primary: boolean }[] }

const ACCESS_OPTIONS = [
  { label: 'All Access Types', value: '' },
  // Membership passes
  { label: 'Priority Pass', value: 'Priority Pass' },
  { label: 'DragonPass', value: 'DragonPass' },
  { label: 'LoungeKey', value: 'LoungeKey' },
  // Credit cards
  { label: 'Amex Platinum', value: 'Amex Platinum' },
  { label: 'Amex Centurion', value: 'Centurion' },
  { label: 'TD Aeroplan Visa Infinite Privilege', value: 'TD Aeroplan Visa Infinite Privilege' },
  { label: 'CIBC Aeroplan Visa Infinite Privilege', value: 'CIBC Aeroplan Visa Infinite Privilege' },
  { label: 'Scotiabank Passport Visa Infinite', value: 'Scotiabank Passport Visa Infinite' },
  { label: 'RBC Avion Visa Infinite Privilege', value: 'RBC Avion' },
  { label: 'National Bank World Elite', value: 'National Bank' },
  // Airline status
  { label: 'Air Canada Altitude', value: 'Air Canada Altitude' },
  { label: 'Star Alliance Gold', value: 'Star Alliance Gold' },
  { label: 'Air France / KLM', value: 'Air France' },
  { label: 'WestJet Rewards', value: 'WestJet' },
  // Fare class / day pass
  { label: 'Business Class', value: 'Business Class' },
  { label: 'Day Pass / Walk-in', value: 'Day Pass' },
  { label: 'Aspire Lounge', value: 'Aspire' },
]

const AMENITY_OPTIONS = [
  { slug: 'shower',     label: 'Shower' },
  { slug: 'hot-food',   label: 'Hot Food' },
  { slug: 'bar',        label: 'Bar' },
  { slug: 'spa',        label: 'Spa' },
  { slug: 'free-wifi',  label: 'WiFi' },
  { slug: 'quiet-room', label: 'Quiet Room' },
  { slug: 'sleeping-pods', label: 'Sleep Pods' },
  { slug: 'meeting-rooms', label: 'Meeting Rooms' },
]

function getImg(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

function isOpenNow(hours: Lounge['opening_hours']): boolean | null {
  if (!hours || Object.keys(hours).length === 0) return null
  if (hours.is_24_7) return true
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const today = days[new Date().getDay()]
  const todayHours = hours[today as keyof typeof hours]
  if (!todayHours || typeof todayHours !== 'string') return null
  const [open, close] = (todayHours as string).split('-').map(t => {
    const [h, m] = t.trim().split(':').map(Number)
    return h * 60 + (m || 0)
  })
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  return now >= open && now <= close
}

interface Props {
  lounges: FullLounge[]
  airports: { iata_code: string; name: string }[]
}

export default function LoungeGrid({ lounges, airports }: Props) {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()

  // Initialise from URL params
  const [airport,  setAirport]  = useState(searchParams.get('airport') ?? '')
  const [access,   setAccess]   = useState(searchParams.get('access')  ?? '')
  const [amenity,  setAmenity]  = useState(searchParams.get('amenity') ?? '')
  const [openNow,  setOpenNow]  = useState(searchParams.get('open') === '1')
  const [sort,     setSort]     = useState(searchParams.get('sort')    ?? 'rating')

  // Auto-expand if any filter came from URL
  const hasUrlFilters = !!(searchParams.get('airport') || searchParams.get('access') || searchParams.get('amenity') || searchParams.get('open'))
  const [showFilters, setShowFilters] = useState(hasUrlFilters)

  // Update URL without scroll
  function pushParams(overrides: Record<string, string>) {
    const next = new URLSearchParams()
    const state = { airport, access, amenity, open: openNow ? '1' : '', sort, ...overrides }
    if (state.airport)                        next.set('airport', state.airport)
    if (state.access)                         next.set('access',  state.access)
    if (state.amenity)                        next.set('amenity', state.amenity)
    if (state.open === '1')                   next.set('open',    '1')
    if (state.sort && state.sort !== 'rating') next.set('sort',   state.sort)
    const qs = next.toString()
    router.replace(pathname + (qs ? '?' + qs : ''), { scroll: false })
  }

  function handleAirport(v: string)  { setAirport(v);  pushParams({ airport: v }) }
  function handleAccess(v: string)   { setAccess(v);   pushParams({ access: v }) }
  function handleAmenity(v: string)  { setAmenity(v);  pushParams({ amenity: v }) }
  function handleOpenNow()           { const next = !openNow; setOpenNow(next); pushParams({ open: next ? '1' : '' }) }
  function handleSort(v: string)     { setSort(v);     pushParams({ sort: v }) }
  function handleClearAll() {
    setAirport(''); setAccess(''); setAmenity(''); setOpenNow(false)
    router.replace(pathname, { scroll: false })
  }

  const filtered = useMemo(() => {
    let result = [...lounges]

    if (airport) result = result.filter(l => l.airport?.iata_code === airport)

    if (access) {
      result = result.filter(l =>
        Array.isArray(l.access_types) &&
        (l.access_types as { name: string }[]).some(at =>
          at.name.toLowerCase().includes(access.toLowerCase())
        )
      )
    }

    if (amenity) {
      result = result.filter(l =>
        l.amenities?.some((a: Amenity) =>
          a.slug === amenity || a.name.toLowerCase().includes(amenity.replace('-', ' '))
        )
      )
    }

    if (openNow) result = result.filter(l => isOpenNow(l.opening_hours) === true)

    if (sort === 'rating')  result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    else if (sort === 'reviews') result.sort((a, b) => b.review_count - a.review_count)
    else result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [lounges, airport, access, amenity, openNow, sort])

  const activeFilterCount = [airport, access, amenity, openNow].filter(Boolean).length

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white fine-border mb-8">
        {/* Top row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-sand-dark/10">
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-widest text-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3">
            {openNow && (
              <span className="bg-green-100 text-green-700 text-[10px] px-2.5 py-1 font-semibold uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Open Now
              </span>
            )}
            <p className="font-label-caps text-[11px] text-secondary">{filtered.length} lounge{filtered.length !== 1 ? 's' : ''}</p>
            <select
              value={sort}
              onChange={e => handleSort(e.target.value)}
              className="border-none bg-transparent font-label-caps text-[11px] text-primary focus:ring-0 outline-none cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">A – Z</option>
            </select>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Airport */}
            <div>
              <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1 block">Airport</label>
              <select value={airport} onChange={e => handleAirport(e.target.value)}
                className="w-full bg-transparent border border-outline-variant px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none">
                <option value="">All Airports</option>
                {airports.map(a => <option key={a.iata_code} value={a.iata_code}>{a.iata_code} — {a.name}</option>)}
              </select>
            </div>

            {/* Access */}
            <div>
              <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1 block">Access / Pass</label>
              <select value={access} onChange={e => handleAccess(e.target.value)}
                className="w-full bg-transparent border border-outline-variant px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none">
                {ACCESS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Amenity */}
            <div>
              <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1 block">Must Have</label>
              <select value={amenity} onChange={e => handleAmenity(e.target.value)}
                className="w-full bg-transparent border border-outline-variant px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none">
                <option value="">Any Amenity</option>
                {AMENITY_OPTIONS.map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}
              </select>
            </div>

            {/* Open Now */}
            <div>
              <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1 block">Availability</label>
              <button
                onClick={handleOpenNow}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm border transition-all ${
                  openNow
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant bg-transparent text-on-surface hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {openNow ? 'check_circle' : 'schedule'}
                </span>
                Open Right Now
              </button>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="col-span-2 md:col-span-4 text-xs text-sand-dark hover:text-primary underline text-right transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Quick amenity chips — shown when filter panel is collapsed */}
        {!showFilters && (
          <div className="flex gap-2 px-5 py-3 flex-wrap">
            {AMENITY_OPTIONS.slice(0, 6).map(a => (
              <button
                key={a.slug}
                onClick={() => handleAmenity(amenity === a.slug ? '' : a.slug)}
                className={`font-label-caps text-[10px] px-3 py-1.5 uppercase tracking-wide transition-all ${
                  amenity === a.slug
                    ? 'bg-primary text-white'
                    : 'bg-champagne-glint text-sand-dark hover:bg-primary hover:text-white'
                }`}
              >
                {a.label}
              </button>
            ))}
            <button
              onClick={handleOpenNow}
              className={`font-label-caps text-[10px] px-3 py-1.5 uppercase tracking-wide transition-all flex items-center gap-1 ${
                openNow
                  ? 'bg-green-600 text-white'
                  : 'bg-champagne-glint text-sand-dark hover:bg-green-600 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
              Open Now
            </button>
          </div>
        )}
      </div>

      {/* Active filter summary */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest">Filtered by:</span>
          {airport && (
            <span className="bg-primary/10 text-primary text-[11px] px-3 py-1 flex items-center gap-1">
              {airport}
              <button onClick={() => handleAirport('')} className="ml-1 hover:text-red-500">×</button>
            </span>
          )}
          {access && (
            <span className="bg-primary/10 text-primary text-[11px] px-3 py-1 flex items-center gap-1">
              {access}
              <button onClick={() => handleAccess('')} className="ml-1 hover:text-red-500">×</button>
            </span>
          )}
          {amenity && (
            <span className="bg-primary/10 text-primary text-[11px] px-3 py-1 flex items-center gap-1">
              {AMENITY_OPTIONS.find(a => a.slug === amenity)?.label ?? amenity}
              <button onClick={() => handleAmenity('')} className="ml-1 hover:text-red-500">×</button>
            </span>
          )}
          {openNow && (
            <span className="bg-green-100 text-green-700 text-[11px] px-3 py-1 flex items-center gap-1">
              Open Now
              <button onClick={handleOpenNow} className="ml-1 hover:text-red-500">×</button>
            </span>
          )}
          <button onClick={handleClearAll} className="text-[11px] text-sand-dark underline hover:text-primary ml-2">
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-secondary">
          <span className="material-symbols-outlined text-4xl mb-4 block text-sand-dark">search_off</span>
          <p className="font-headline-md text-headline-md text-primary mb-2">No lounges match your filters</p>
          <p className="text-sm">Try removing a filter or selecting a different airport.</p>
          <button onClick={handleClearAll} className="mt-6 bg-primary text-white px-8 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(lounge => {
            const iata = lounge.airport?.iata_code
            const img  = lounge.images?.find(i => i.is_primary) ?? lounge.images?.[0]
            const openStatus = isOpenNow(lounge.opening_hours)
            const href = iata ? `/airports/${iata}/lounges/${lounge.slug}` : `/lounges/${lounge.slug}`
            return (
              <Link
                key={lounge.id}
                href={href}
                className="bg-white fine-border group cursor-pointer overflow-hidden block hover:editorial-shadow transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-secondary-container">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getImg(img.storage_path)} alt={lounge.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>local_bar</span>
                    </div>
                  )}
                  {iata && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] px-2 py-1 uppercase tracking-tighter">
                      {iata}{lounge.terminal ? ` • T - ${lounge.terminal}` : ''}
                    </div>
                  )}
                  {openStatus !== null && (
                    <div className={`absolute top-4 right-4 text-[10px] px-2 py-1 uppercase font-semibold ${openStatus ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {openStatus ? 'Open' : 'Closed'}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-headline-md text-primary text-[18px] leading-snug">{lounge.name}</h3>
                    {lounge.rating && (
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-bold text-sm">{lounge.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Access badges */}
                  {Array.isArray(lounge.access_types) && (lounge.access_types as { name: string }[]).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(lounge.access_types as { name: string }[]).slice(0, 2).map((at, i) => (
                        <span key={i} className="bg-champagne-glint text-sand-dark text-[10px] px-2 py-0.5 uppercase font-semibold">
                          {at.name.length > 24 ? at.name.slice(0, 22) + '…' : at.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {lounge.guest_fee && (
                    <p className="text-xs text-secondary mb-4">
                      Day pass: <span className="font-semibold text-on-surface">${lounge.guest_fee} {lounge.guest_fee_currency}</span>
                    </p>
                  )}

                  <div className="pt-3 border-t border-primary/10 group-hover:border-primary transition-all text-primary font-label-caps text-[10px] uppercase flex justify-between">
                    View Lounge <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
