import Link from 'next/link'
import Image from 'next/image'
import type { Lounge } from '@/lib/types'
import LoungePlaceholder from './LoungePlaceholder'

interface Props {
  lounge: Lounge
  airportIata?: string
}

function getImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

function isOpenNow(hours: Lounge['opening_hours']): boolean | null {
  if (!hours) return null
  if (hours.is_24_7) return true
  const day = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()]
  const todayHours = hours[day as keyof typeof hours]
  if (!todayHours || typeof todayHours !== 'string') return null
  const [open, close] = todayHours.split('-').map(t => {
    const [h, m] = t.trim().split(':').map(Number)
    return h * 60 + (m || 0)
  })
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  return now >= open && now <= close
}

function StarRow({ rating, count }: { rating: number; count: number }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-sm" style={{ color: '#F59E0B' }}>{rating.toFixed(1)}</span>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f${i}`} className="material-symbols-outlined" style={{ fontSize: '15px', color: '#FBBF24', fontVariationSettings: "'FILL' 1" }}>star</span>
        ))}
        {half && (
          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#FBBF24', fontVariationSettings: "'FILL' 1" }}>star_half</span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} className="material-symbols-outlined" style={{ fontSize: '15px', color: '#D1D5DB' }}>star</span>
        ))}
      </div>
      {count > 0 && (
        <span className="text-xs text-secondary">({count})</span>
      )}
    </div>
  )
}

export default function LoungeCard({ lounge, airportIata }: Props) {
  const iata         = airportIata ?? lounge.airport?.iata_code
  const href         = iata ? `/airports/${iata}/lounges/${lounge.slug}` : `/lounges/${lounge.slug}`
  const primaryImage = lounge.images?.find(i => i.is_primary) ?? lounge.images?.[0]
  const openStatus   = isOpenNow(lounge.opening_hours)
  const accessTypes  = (lounge.access_types ?? []) as Array<{ type: string; name: string }>

  return (
    <Link href={href} className="bg-white fine-border group block overflow-hidden hover:shadow-md transition-shadow">

      {/* Image */}
      <div className="relative h-48 bg-secondary-fixed overflow-hidden">
        {primaryImage ? (
          <Image
            src={getImageUrl(primaryImage.storage_path)}
            alt={primaryImage.alt_text ?? lounge.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <LoungePlaceholder name={lounge.name} variant="card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* IATA + terminal badge */}
        {iata && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[9px] px-2 py-1 font-bold uppercase tracking-wider">
            {iata}{lounge.terminal ? ` · T - ${lounge.terminal}` : ''}
          </div>
        )}

        {/* Open / closed */}
        {openStatus !== null && (
          <div className={`absolute top-3 right-3 text-[9px] px-2 py-1 font-bold uppercase tracking-wider ${
            openStatus ? 'bg-green-500 text-white' : 'bg-red-500/90 text-white'
          }`}>
            {openStatus ? 'Open' : 'Closed'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-headline-md text-base text-primary font-semibold mb-2 line-clamp-2 group-hover:text-primary/80 transition-colors">
          {lounge.name}
        </h3>

        {/* Google-style stars */}
        {lounge.rating ? (
          <div className="mb-3">
            <StarRow rating={lounge.rating} count={lounge.review_count} />
          </div>
        ) : (
          <p className="text-xs text-secondary mb-3">No reviews yet — be first</p>
        )}

        {/* Access type chips */}
        {accessTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {accessTypes.slice(0, 2).map((at, i) => (
              <span key={i} className="bg-champagne-glint text-sand-dark text-[9px] px-2 py-0.5 font-semibold uppercase tracking-wide">
                {at.name}
              </span>
            ))}
            {accessTypes.length > 2 && (
              <span className="bg-champagne-glint text-sand-dark text-[9px] px-2 py-0.5 font-semibold uppercase tracking-wide">
                +{accessTypes.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Price + arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
          {lounge.guest_fee ? (
            <span className="text-sm font-semibold text-primary">
              ${lounge.guest_fee}{' '}
              <span className="font-normal text-secondary text-xs">{lounge.guest_fee_currency} / guest</span>
            </span>
          ) : (
            <span className="text-xs text-secondary">Access required</span>
          )}
          <span
            className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors"
            style={{ fontSize: '18px' }}
          >
            arrow_forward
          </span>
        </div>
      </div>
    </Link>
  )
}
