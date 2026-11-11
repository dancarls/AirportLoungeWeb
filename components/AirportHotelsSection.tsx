import { AIRPORT_HOTELS, priceBandLabel } from '@/lib/airport-hotels'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

interface Props {
  iata: string
  airportName: string
  city?: string | null
}

/**
 * "Where to stay at {IATA}" section for the airport hub page.
 * Renders a 3-card grid (budget / mid / premium) linking to Booking.com via
 * Travelpayouts. Returns null if we have no curated data for the airport —
 * layout stays stable; no empty section appears.
 */
export default function AirportHotelsSection({ iata, airportName, city }: Props) {
  const hotels = AIRPORT_HOTELS[iata]
  if (!hotels || hotels.length === 0) return null

  const bookingUrl = affiliate('booking-airport-hotels')
  const label = city ?? airportName

  return (
    <section className="my-16 bg-champagne-glint/40 border-l-4 border-gold-500">
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-sand-dark block mb-3">
            Sponsored · Booking.com
          </span>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-primary mb-3">
            Where to stay at {iata}
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">
            Hand-picked airport-adjacent hotels at {label} — from on-terminal premium to
            shuttle-accessible budget. Prices and availability via Booking.com.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {hotels.map((h) => (
            <div
              key={h.name}
              className="bg-white border border-outline-variant/30 p-5 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-gold-500 font-semibold">
                  {priceBandLabel(h.priceBand)}
                </span>
                <span className="text-xs text-secondary">·</span>
                <span className="text-xs text-secondary">{h.distance}</span>
              </div>
              <h3 className="font-semibold text-primary leading-tight mb-3">{h.name}</h3>
              <ul className="space-y-1.5 mb-5 flex-1">
                {h.highlights.map((hl, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-on-surface-variant"
                  >
                    <span
                      className="material-symbols-outlined text-sand-dark shrink-0 mt-0.5"
                      style={{ fontSize: '14px' }}
                    >
                      check
                    </span>
                    <span className="leading-snug">{hl}</span>
                  </li>
                ))}
              </ul>
              <a
                href={bookingUrl}
                target="_blank"
                rel={AFFILIATE_REL}
                className="block w-full text-center bg-primary hover:bg-primary-container text-white px-4 py-2.5 font-label-caps text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors"
              >
                Check prices →
              </a>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-4 border-t border-sand-dark/20">
          <p className="text-[11px] text-sand-dark/70 leading-relaxed">
            Sponsored — we may earn a commission when you book at no cost to you.
            Prices and availability change daily.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel={AFFILIATE_REL}
            className="shrink-0 inline-flex items-center gap-2 text-primary font-label-caps text-[10px] uppercase tracking-[0.15em] font-semibold hover:text-primary-container"
          >
            See more {iata} hotels →
          </a>
        </div>
      </div>
    </section>
  )
}
