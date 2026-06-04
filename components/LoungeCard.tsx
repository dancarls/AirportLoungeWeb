import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import StarRating from './StarRating'
import AmenityBadge from './AmenityBadge'
import type { Lounge } from '@/lib/types'

interface Props {
  lounge: Lounge
  airportIata?: string
}

function getImageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/lounge-images/${path}`
}

function isOpenNow(hours: Lounge['opening_hours']): boolean | null {
  if (!hours || hours.is_24_7) return hours?.is_24_7 ? true : null
  const day = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()]
  const todayHours = hours[day as keyof typeof hours]
  if (!todayHours || typeof todayHours !== 'string') return null
  const [open, close] = (todayHours as string).split('-').map(t => {
    const [h, m] = t.trim().split(':').map(Number)
    return h * 60 + (m || 0)
  })
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  return now >= open && now <= close
}

export default function LoungeCard({ lounge, airportIata }: Props) {
  const iata = airportIata ?? lounge.airport?.iata_code
  const href = iata ? `/airports/${iata}/lounges/${lounge.slug}` : `/lounges/${lounge.slug}`
  const primaryImage = lounge.images?.find(i => i.is_primary) ?? lounge.images?.[0]
  const openStatus = isOpenNow(lounge.opening_hours)

  return (
    <Link href={href} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={getImageUrl(primaryImage.storage_path)}
            alt={primaryImage.alt_text ?? lounge.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        {openStatus !== null && (
          <span className={`absolute top-3 left-3 badge ${openStatus ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {openStatus ? 'Open now' : 'Closed'}
          </span>
        )}
        {lounge.terminal && (
          <span className="absolute top-3 right-3 badge bg-black/60 text-white">
            Terminal {lounge.terminal}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
          {lounge.name}
        </h3>

        {lounge.rating ? (
          <div className="mb-2">
            <StarRating rating={lounge.rating} showNumber count={lounge.review_count} />
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-2">No reviews yet</p>
        )}

        {lounge.location_detail && (
          <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3 shrink-0" /> {lounge.location_detail}
          </p>
        )}

        {/* Amenities preview */}
        {lounge.amenities && lounge.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lounge.amenities.slice(0, 4).map(a => (
              <AmenityBadge key={a.id} amenity={a} size="sm" />
            ))}
            {lounge.amenities.length > 4 && (
              <span className="badge bg-gray-100 text-gray-500 text-xs">
                +{lounge.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {lounge.guest_fee ? (
            <span className="text-sm font-semibold text-gray-900">
              ${lounge.guest_fee} {lounge.guest_fee_currency} <span className="font-normal text-gray-400 text-xs">/ guest</span>
            </span>
          ) : (
            <span className="text-xs text-gray-400">Access required</span>
          )}
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
        </div>
      </div>
    </Link>
  )
}
