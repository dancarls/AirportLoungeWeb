import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import AmenityBadge from '@/components/AmenityBadge'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'
import FlightStatusWidget from '@/components/FlightStatusWidget'
import LoungeMapClient from '@/components/LoungeMapClient'
import { MapPin, Phone, Globe, Clock, Users, DollarSign, ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import type { Lounge, Review } from '@/lib/types'

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

const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS: Record<string, string> = {
  monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu',
  friday:'Fri', saturday:'Sat', sunday:'Sun',
}

export default async function LoungeDetailPage({ params }: Props) {
  const { iata, slug } = await params
  const code = iata.toUpperCase()
  const supabase = await createClient()

  const { data: lounge } = await supabase
    .from('lounges')
    .select(`*, airport:airports(*), amenities(*), images:lounge_images(*) `)
    .eq('slug', slug)
    .single()

  if (!lounge) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profile:profiles(display_name, avatar_url)')
    .eq('lounge_id', lounge.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: crowdData } = await supabase
    .from('current_crowd_levels')
    .select('*')
    .eq('lounge_id', lounge.id)
    .single()

  const { data: { user } } = await supabase.auth.getUser()

  const l = lounge as Lounge
  const images = l.images ?? []
  const primaryIdx = images.findIndex(i => i.is_primary)
  const orderedImages = primaryIdx > 0
    ? [images[primaryIdx], ...images.filter((_, i) => i !== primaryIdx)]
    : images

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/airports" className="hover:text-gray-700">Airports</Link>
        <span>/</span>
        <Link href={`/airports/${code}`} className="hover:text-gray-700">{code}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{l.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image gallery */}
          {orderedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-72">
              <div className="col-span-2 relative">
                <Image src={getImageUrl(orderedImages[0].storage_path)}
                  alt={orderedImages[0].alt_text ?? l.name} fill className="object-cover" priority />
              </div>
              <div className="grid grid-rows-2 gap-2">
                {orderedImages.slice(1, 3).map((img, i) => (
                  <div key={img.id} className="relative">
                    <Image src={getImageUrl(img.storage_path)}
                      alt={img.alt_text ?? `${l.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title & rating */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{l.name}</h1>
              {crowdData && (
                <div className="badge bg-amber-50 text-amber-700 text-sm">
                  {crowdData.avg_crowd <= 2 ? '🟢 Quiet' : crowdData.avg_crowd <= 3.5 ? '🟡 Moderate' : '🔴 Busy'}
                  <span className="text-amber-500 ml-1 text-xs">({crowdData.report_count} reports)</span>
                </div>
              )}
            </div>
            {l.airport && (
              <p className="text-gray-500 flex items-center gap-1.5 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {l.airport.name} ({code}) {l.terminal && `· Terminal ${l.terminal}`}
                {l.location_detail && ` · ${l.location_detail}`}
              </p>
            )}
            {l.rating && (
              <StarRating rating={l.rating} size="lg" showNumber count={l.review_count} />
            )}
          </div>

          {/* Description */}
          {l.description && (
            <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: l.description }} />
          )}

          {/* Amenities */}
          {l.amenities && l.amenities.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {l.amenities.map(a => <AmenityBadge key={a.id} amenity={a} />)}
              </div>
            </div>
          )}

          {/* Access */}
          {l.access_types && (l.access_types as Lounge['access_types']).length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">How to access this lounge</h2>
              <div className="space-y-2">
                {(l.access_types as Lounge['access_types']).map((at, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="badge bg-brand-100 text-brand-700 text-xs shrink-0 mt-0.5">
                      {at.type.replace(/_/g, ' ')}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{at.name}</p>
                      {at.details && <p className="text-xs text-gray-500 mt-0.5">{at.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opening hours */}
          {l.opening_hours && Object.keys(l.opening_hours).length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Opening Hours
              </h2>
              {l.opening_hours.is_24_7 ? (
                <p className="text-sm text-green-600 font-medium">Open 24/7</p>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {DAY_ORDER.map(day => {
                    const hours = l.opening_hours[day as keyof typeof l.opening_hours]
                    if (!hours || typeof hours !== 'string') return null
                    const isToday = DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === day
                    return (
                      <div key={day} className={`flex justify-between text-sm py-1 ${isToday ? 'font-semibold text-brand-600' : 'text-gray-600'}`}>
                        <span>{DAY_LABELS[day]}</span>
                        <span>{hours}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {l.opening_hours.notes && (
                <p className="text-xs text-gray-500 mt-2">{l.opening_hours.notes}</p>
              )}
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-xl">
              Reviews ({l.review_count})
            </h2>

            {user ? (
              <div className="card p-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Write a review</h3>
                <ReviewForm loungeId={l.id} />
              </div>
            ) : (
              <div className="card p-5 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Sign in to leave a review</p>
                <Link href={`/auth/login?redirectTo=/airports/${code}/lounges/${l.slug}`} className="btn-primary text-sm">
                  Sign in to review
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {(reviews as Review[])?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {(!reviews || reviews.length === 0) && (
                <p className="text-gray-400 text-sm text-center py-8">No reviews yet — be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick info card */}
          <div className="card p-5 space-y-3">
            {l.guest_fee && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">${l.guest_fee} {l.guest_fee_currency}</span>
                <span className="text-gray-400">/ guest day pass</span>
              </div>
            )}
            {l.capacity && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" /> Capacity: ~{l.capacity}
              </div>
            )}
            {l.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${l.phone}`} className="hover:text-brand-600">{l.phone}</a>
              </div>
            )}
            {l.website && (
              <a href={l.website} target="_blank" rel="noreferrer" className="btn-secondary w-full justify-center text-sm">
                <Globe className="w-4 h-4" /> Visit website
              </a>
            )}
          </div>

          {/* Map */}
          {l.airport?.latitude && l.airport?.longitude && (
            <div className="card overflow-hidden">
              <LoungeMapClient
                latitude={l.airport.latitude}
                longitude={l.airport.longitude}
                name={l.name}
              />

              <div className="p-3 text-xs text-gray-400 text-center">
                Airport location — check the lounge's website for exact terminal directions
              </div>
            </div>
          )}

          {/* Flight status */}
          <FlightStatusWidget />

          {/* Back link */}
          <Link href={`/airports/${code}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4" /> All lounges at {code}
          </Link>
        </div>
      </div>
    </div>
  )
}
