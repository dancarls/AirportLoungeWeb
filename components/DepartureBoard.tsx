import type { FlightStatus } from '@/lib/types'

interface Props {
  iata: string
  departures: FlightStatus[] | null
}

/**
 * Compact live-departures board rendered on each airport hub page. Shows the
 * next ~12 flights with airline, flight number, destination, scheduled time
 * and status. Data source: AeroDataBox via lib/flights.ts (5-minute revalidate).
 *
 * When AeroDataBox returns [] (rate limit, network error, unauthenticated
 * key) the component renders a friendly empty state instead of failing.
 */
export default function DepartureBoard({ iata, departures }: Props) {
  if (!departures || departures.length === 0) {
    return (
      <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
        <h4 className="font-label-caps text-label-caps text-sand-dark mb-2">DEPARTURES</h4>
        <p className="text-sm text-secondary leading-relaxed">
          Live departures unavailable right now. Check FlightAware for the current board.
        </p>
      </div>
    )
  }

  const rows = departures.slice(0, 12)

  return (
    <div className="bg-surface border border-sand-dark/10 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
        <h4 className="font-label-caps text-label-caps text-sand-dark">DEPARTURES · {iata}</h4>
        <span className="text-[10px] text-secondary uppercase tracking-widest">Next {rows.length}</span>
      </div>
      <ul className="divide-y divide-outline-variant/10">
        {rows.map((f, i) => (
          <li key={`${f.flightNumber}-${i}`} className="p-3 flex items-center gap-3">
            <div className="w-14 shrink-0 text-center">
              <p className="text-sm font-bold text-primary">{formatHm(f.departure.scheduledTime)}</p>
              {f.departure.estimatedTime && f.departure.estimatedTime !== f.departure.scheduledTime && (
                <p className="text-[10px] text-amber-600">est {formatHm(f.departure.estimatedTime)}</p>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {f.arrival.iata || f.arrival.airport}
                {f.arrival.airport && f.arrival.iata && (
                  <span className="text-secondary font-normal"> · {f.arrival.airport}</span>
                )}
              </p>
              <p className="text-[11px] text-secondary truncate">
                {f.airline}
                {f.flightNumber && ` · ${f.flightNumber}`}
                {f.departure.terminal && ` · T${f.departure.terminal}`}
                {f.departure.gate && ` · Gate ${f.departure.gate}`}
              </p>
            </div>
            <span className={`text-[10px] font-label-caps uppercase px-2 py-1 shrink-0 ${statusStyle(f.status)}`}>
              {f.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-outline-variant/20 text-center">
        <a
          href={`https://www.flightaware.com/live/airport/${iata}`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-label-caps uppercase tracking-widest text-primary hover:underline"
        >
          Full board on FlightAware →
        </a>
      </div>
    </div>
  )
}

function formatHm(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso.split(' ')[1]?.slice(0, 5) ?? '—'
    return d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return '—'
  }
}

function statusStyle(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('cancel'))   return 'text-red-700 bg-red-50'
  if (s.includes('delay'))    return 'text-amber-700 bg-amber-50'
  if (s.includes('board'))    return 'text-green-700 bg-green-50'
  if (s.includes('depart'))   return 'text-blue-700 bg-blue-50'
  return 'text-secondary bg-secondary-container/40'
}
