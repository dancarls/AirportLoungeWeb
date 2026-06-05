import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'
import FlightStatusWidget from '@/components/FlightStatusWidget'
import LoungeMapClient from '@/components/LoungeMapClient'
import WeatherWidget from '@/components/WeatherWidget'
import { getWeather } from '@/lib/weather'
import type { Metadata } from 'next'
import type { Lounge, Review, AccessType } from '@/lib/types'

interface Props { params: Promise<{ iata: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('lounges').select('name').eq('slug', slug).single()
  return { title: data?.name ?? 'Lounge' }
}

export const revalidate = 60

function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

// Reliable Material Symbols icon names for airport lounge amenities.
// We intentionally ignore the DB icon field — many stored values use
// names that are not valid Material Symbols ligatures (e.g. "wine", "utensils").
const AMENITY_ICON_MAP: [string[], string][] = [
  [['wifi', 'wi-fi', 'internet', 'wireless'],                            'wifi'],
  [['free wifi', 'high-speed'],                                          'wifi'],
  [['bar', 'cocktail', 'alcohol', 'spirits', 'wine', 'beer', 'drinks'], 'local_bar'],
  [['hot food', 'buffet', 'hot buffet', 'dining', 'restaurant', 'meal'],'soup_kitchen'],
  [['snack', 'light bites', 'sandwiches'],                              'bakery_dining'],
  [['coffee', 'barista', 'espresso', 'latte'],                          'local_cafe'],
  [['tea'],                                                              'emoji_food_beverage'],
  [['shower'],                                                           'shower'],
  [['spa', 'massage', 'wellness', 'relaxation'],                        'spa'],
  [['gym', 'fitness', 'exercise'],                                       'fitness_center'],
  [['pool', 'swimming'],                                                 'pool'],
  [['business center', 'business centre', 'work'],                      'business_center'],
  [['printing', 'printer', 'print'],                                    'print'],
  [['conference', 'meeting room'],                                       'meeting_room'],
  [['phone', 'telephone', 'landline'],                                   'phone'],
  [['charging', 'power outlet', 'usb'],                                  'electrical_services'],
  [['tv', 'television'],                                                  'tv'],
  [['news', 'newspaper', 'magazine', 'press', 'periodical'],            'newspaper'],
  [['flight info', 'departure', 'arrivals board', 'flight screen'],      'flight'],
  [['quiet', 'silent', 'rest zone'],                                     'do_not_disturb'],
  [['sleep', 'nap', 'daybed', 'day bed'],                               'hotel'],
  [['family', 'kids', 'children'],                                       'family_restroom'],
  [['accessible', 'wheelchair', 'disability'],                           'accessible'],
  [['luggage', 'storage', 'bag drop'],                                   'luggage'],
  [['atm', 'cash machine'],                                              'local_atm'],
  [['smoking'],                                                          'smoking_rooms'],
  [['outdoor', 'terrace', 'deck'],                                       'deck'],
  [['lounge', 'seating'],                                                'chair'],
]

function amenityIcon(name: string): string {
  const lower = name.toLowerCase().trim()
  for (const [keys, sym] of AMENITY_ICON_MAP) {
    if (keys.some(k => lower.includes(k))) return sym
  }
  return 'check_circle'
}

const ACCESS_ICON_MAP: Record<string, string> = {
  elite: 'stars', status: 'stars', gold: 'stars', silver: 'stars',
  credit: 'credit_card', card: 'credit_card', amex: 'credit_card', visa: 'credit_card',
  class: 'confirmation_number', business: 'confirmation_number', ticket: 'confirmation_number',
}

function accessIcon(type: string): string {
  const lower = type.toLowerCase()
  for (const [key, sym] of Object.entries(ACCESS_ICON_MAP)) {
    if (lower.includes(key)) return sym
  }
  return 'confirmation_number'
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export default async function LoungeDetailPage({ params }: Props) {
  const { iata, slug } = await params
  const code = iata.toUpperCase()
  const supabase = await createClient()

  const { data: lounge } = await supabase
    .from('lounges')
    .select('*, airport:airports(*), amenities(*), images:lounge_images(*)')
    .eq('slug', slug)
    .single()

  if (!lounge) notFound()

  const [{ data: reviews }, { data: { user } }, weather] = await Promise.all([
    supabase
      .from('reviews')
      .select('*, profile:profiles(display_name, avatar_url)')
      .eq('lounge_id', lounge.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.auth.getUser(),
    lounge.airport?.latitude && lounge.airport?.longitude
      ? getWeather(lounge.airport.latitude, lounge.airport.longitude)
      : Promise.resolve(null),
  ])

  const l = lounge as Lounge
  const images = l.images ?? []
  const primaryIdx = images.findIndex(i => i.is_primary)
  const orderedImages = primaryIdx > 0
    ? [images[primaryIdx], ...images.filter((_, i) => i !== primaryIdx)]
    : images

  const heroImg = orderedImages[0]
  const accessTypes = (l.access_types ?? []) as AccessType[]

  return (
    <div className="bg-bone-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-margin-desktop pt-8">
        <section className="relative h-[460px] min-h-[360px] overflow-hidden">
          {heroImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="w-full h-full object-cover"
              src={getImageUrl(heroImg.storage_path)}
              alt={heroImg.alt_text ?? l.name}
            />
          ) : (
            <div className="w-full h-full bg-aviation-navy" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(26,36,47,0) 55%, rgba(26,36,47,0.85) 100%)' }}
          />
          <div className="absolute bottom-0 left-0 w-full px-10 pb-10 text-white">
            <nav className="flex items-center gap-2 mb-3 opacity-80 text-sm">
              <Link className="hover:underline" href="/airports">Airports</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:underline" href={`/airports/${code}`}>{code}</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>{l.name}</span>
            </nav>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-2">{l.name}</h1>
            <p className="font-headline-md text-headline-md opacity-90">
              {l.terminal ? `Terminal ${l.terminal}, ` : ''}{l.airport?.name ?? code}
            </p>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ───────────────────────────────── */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-section-gap grid grid-cols-1 lg:grid-cols-4 gap-gutter">

        {/* Main content (3/4) */}
        <div className="lg:col-span-3 space-y-12">

          {/* Editorial intro */}
          <div className="border-b border-outline-variant/30 pb-12">
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
              <div>
                <span className="font-label-caps text-label-caps text-sand-dark mb-2 block uppercase tracking-widest">
                  {l.location_detail
                    ? l.location_detail.toUpperCase()
                    : l.terminal
                      ? `TERMINAL ${l.terminal}`
                      : code}
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="font-headline-lg text-headline-lg">
                    {l.description ? 'About This Lounge' : 'A Refined Travel Experience'}
                  </h2>
                  {l.rating && (
                    <div className="bg-primary/5 px-3 py-1 flex items-center gap-1 border border-primary/10">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>star</span>
                      <span className="font-bold text-primary">{l.rating.toFixed(1)}</span>
                      <span className="text-on-surface-variant text-sm">/ 5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {l.description ? (
              <div
                className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl"
                dangerouslySetInnerHTML={{ __html: l.description }}
              />
            ) : (
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
                {l.name} offers premium travellers a refined sanctuary from the terminal concourse.
                {l.airport?.name ? ` Located at ${l.airport.name}` : ''}
                {l.terminal ? `, Terminal ${l.terminal}` : ''}, this lounge delivers premium amenities
                and attentive service in a calm environment before departure.
              </p>
            )}
          </div>

          {/* Amenities */}
          {l.amenities && l.amenities.length > 0 && (
            <div>
              <h3 className="font-headline-md text-headline-md mb-6">Refined Amenities</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {l.amenities.map(a => (
                  <div
                    key={a.id}
                    className="flex flex-col items-center gap-2 p-3 bg-champagne-glint/30 rounded-lg transition-transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
                      {amenityIcon(a.name)}
                    </span>
                    <span className="font-label-caps text-[9px] text-center leading-tight">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo gallery */}
          {orderedImages.length > 1 && (
            <div>
              <h3 className="font-headline-md text-headline-md mb-8">Gallery</h3>
              <div className="grid grid-cols-12 gap-4 h-[420px]">
                <div className="col-span-8 h-full overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    src={getImageUrl(orderedImages[0].storage_path)}
                    alt={orderedImages[0].alt_text ?? l.name}
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                  {orderedImages.slice(1, 3).map((img, i) => (
                    <div key={img.id} className="h-1/2 overflow-hidden rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        src={getImageUrl(img.storage_path)}
                        alt={img.alt_text ?? `${l.name} ${i + 2}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sponsored slot */}
          <div className="bg-primary text-white p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="relative z-10">
              <span className="font-label-caps text-[10px] opacity-70 mb-2 block uppercase tracking-widest">Sponsored</span>
              <h4 className="font-headline-md text-headline-md mb-2">Discover Priority Pass</h4>
              <p className="font-body-md text-body-md opacity-80 max-w-md">
                Access 1,300+ lounges worldwide — regardless of your airline or class. Apply today.
              </p>
            </div>
            <a
              href="https://www.prioritypass.com"
              target="_blank"
              rel="noreferrer"
              className="relative z-10 bg-white text-primary px-8 py-3 rounded font-label-caps text-label-caps uppercase tracking-wider hover:bg-champagne-glint transition-colors shrink-0"
            >
              Learn More
            </a>
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
          </div>

          {/* Access eligibility */}
          {accessTypes.length > 0 && (
            <div className="bg-white border border-outline-variant/30 p-10 rounded-xl">
              <h3 className="font-headline-md text-headline-md mb-8">Access Eligibility</h3>
              <div className="space-y-6">
                {accessTypes.map((at, i) => (
                  <div
                    key={i}
                    className={`flex gap-6 pb-6 ${i < accessTypes.length - 1 ? 'border-b border-outline-variant/20' : ''}`}
                  >
                    <span className="material-symbols-outlined text-primary text-3xl shrink-0">
                      {accessIcon(at.type)}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{at.name}</h4>
                      {at.details && <p className="text-on-surface-variant">{at.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opening hours */}
          {l.opening_hours && Object.keys(l.opening_hours).length > 0 && (
            <div className="bg-white border border-outline-variant/30 p-10 rounded-xl">
              <h3 className="font-headline-md text-headline-md mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Opening Hours
              </h3>
              {l.opening_hours.is_24_7 ? (
                <p className="text-green-600 font-bold text-lg">Open 24 / 7</p>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {DAY_ORDER.map(day => {
                    const hours = l.opening_hours[day]
                    if (!hours) return null
                    return (
                      <div key={day} className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                        <span className="capitalize text-on-surface-variant">{day.slice(0, 3)}</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {l.opening_hours.notes && (
                <p className="text-xs text-secondary mt-4">{l.opening_hours.notes}</p>
              )}
            </div>
          )}

          {/* Reviews */}
          <div id="reviews">
            <h3 className="font-headline-md text-headline-md mb-8">
              Guest Reviews
              {l.review_count > 0 && (
                <span className="text-secondary text-lg font-normal ml-2">({l.review_count})</span>
              )}
            </h3>

            {user ? (
              <div className="bg-white border border-outline-variant/30 p-8 rounded-xl mb-8">
                <h4 className="font-bold text-lg mb-6">Write a Review</h4>
                <ReviewForm loungeId={l.id} />
              </div>
            ) : (
              <div className="bg-white border border-outline-variant/30 p-8 rounded-xl mb-8 text-center">
                <p className="text-secondary mb-4">Sign in to share your experience</p>
                <Link
                  href={`/auth/login?redirectTo=/airports/${code}/lounges/${l.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  Sign In to Review
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {(reviews as Review[])?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {(!reviews || reviews.length === 0) && (
                <div className="text-center py-16 text-secondary">
                  <span className="material-symbols-outlined mb-3 block" style={{ fontSize: '48px' }}>rate_review</span>
                  <p>No reviews yet — be the first to share your experience.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/4) */}
        <aside className="space-y-8">

          {/* Quick info card */}
          <div className="bg-white border border-outline-variant/30 p-8 rounded-xl shadow-sm">
            {l.guest_fee ? (
              <div className="mb-6">
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">SINGLE ENTRY</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg text-headline-lg text-primary">${l.guest_fee}</span>
                  <span className="text-on-surface-variant">{l.guest_fee_currency ?? 'CAD'}</span>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">ACCESS</span>
                <span className="font-headline-md text-primary">Member / Status</span>
              </div>
            )}

            <div className="space-y-3 mb-8">
              {l.capacity && (
                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Capacity</span>
                  <span className="font-medium">{l.capacity} guests</span>
                </div>
              )}
              {l.terminal && (
                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Terminal</span>
                  <span className="font-medium">{l.terminal}</span>
                </div>
              )}
              {l.review_count > 0 && (
                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Reviews</span>
                  <span className="font-medium">{l.review_count}</span>
                </div>
              )}
              {l.rating && (
                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Rating</span>
                  <span className="font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>star</span>
                    {l.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {l.website && (
              <a
                href={l.website}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-primary text-white py-4 rounded font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity mb-4"
              >
                Visit Website
              </a>
            )}
            <Link
              href={`/airports/${code}`}
              className="block w-full text-center border border-primary text-primary py-4 rounded font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/5 transition-colors"
            >
              All {code} Lounges
            </Link>
          </div>

          {/* Terminal location map — interactive Mapbox */}
          {l.airport?.latitude && l.airport?.longitude && (
            <div className="bg-white border border-outline-variant/30 overflow-hidden rounded-xl">
              <div className="p-6 border-b border-outline-variant/20">
                <h4 className="font-bold text-lg">Terminal Location</h4>
              </div>
              <div className="h-52 overflow-hidden">
                <LoungeMapClient
                  latitude={l.airport.latitude}
                  longitude={l.airport.longitude}
                  name={l.name}
                />
              </div>
              {l.location_detail && (
                <div className="p-4 bg-champagne-glint/20">
                  <p className="text-xs text-on-surface-variant leading-relaxed">{l.location_detail}</p>
                </div>
              )}
              {l.airport?.terminal_map_url && (
                <div className="p-4">
                  <a
                    href={l.airport.terminal_map_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 w-full font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                    Official Terminal Map
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Weather */}
          {weather && l.airport && (
            <WeatherWidget weather={weather} city={l.airport.city} iata={code} />
          )}

          {/* Flight status */}
          <FlightStatusWidget />

          {/* Sidebar ad */}
          <div className="bg-bone-white border border-dashed border-outline text-on-surface-variant p-6 rounded-xl flex flex-col items-center text-center">
            <span className="font-label-caps text-[10px] opacity-40 mb-4 tracking-widest">ADVERTISEMENT</span>
            <h5 className="font-bold mb-2">Priority Pass</h5>
            <p className="text-sm opacity-70 mb-6">Access 1,300+ lounges worldwide regardless of your airline.</p>
            <a
              href="https://www.prioritypass.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-bold text-sm underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Join Today
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
