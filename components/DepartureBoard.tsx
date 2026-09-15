import type { FlightStatus } from '@/lib/types'

interface Props {
  iata: string
  departures: FlightStatus[] | null
}

/**
 * Compact live-departures board rendered on each airport hub page. Shows the
 * next 10 flights with airline, flight number, destination, scheduled time,
 * a normalised status pill (On time / Delayed / Boarding / Departed /
 * Cancelled / Scheduled) and — when the flight is delayed — the estimated
 * revised time. Source: AeroDataBox via lib/flights.ts (2-min revalidate).
 *
 * When the API returns [] (rate limit, network error, unauthenticated key)
 * the component renders a friendly empty state instead of failing.
 */
export default function DepartureBoard({ iata, departures }: Props) {
  if (!departures || departures.length === 0) {
    return (
      <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
        <h4 className="font-label-caps text-label-caps text-sand-dark mb-2">DEPARTURES · {iata}</h4>
        <p className="text-sm text-secondary leading-relaxed">
          Live departures unavailable right now. Check FlightAware for the current board.
        </p>
        <a
          href={`https://www.flightaware.com/live/airport/${iata}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline"
        >
          Open FlightAware
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
        </a>
      </div>
    )
  }

  const rows = departures.slice(0, 10)

  return (
    <div className="bg-surface border border-sand-dark/10 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
        <h4 className="font-label-caps text-label-caps text-sand-dark">DEPARTURES · {iata}</h4>
        <span className="text-[10px] text-secondary uppercase tracking-widest">Next {rows.length}</span>
      </div>
      <ul className="divide-y divide-outline-variant/10">
        {rows.map((f, i) => {
          const status = normalizeStatus(f)
          return (
            <li key={`${f.flightNumber}-${i}`} className="p-3 flex items-center gap-3">
              <div className="w-14 shrink-0 text-center">
                <p className={`text-sm font-bold ${status.tone === 'delay' || status.tone === 'cancel' ? 'text-secondary line-through' : 'text-primary'}`}>
                  {formatHm(f.departure.scheduledTime)}
                </p>
                {f.departure.estimatedTime && f.departure.estimatedTime !== f.departure.scheduledTime && (
                  <p className={`text-[10px] font-bold ${status.tone === 'delay' ? 'text-amber-700' : 'text-primary'}`}>
                    → {formatHm(f.departure.estimatedTime)}
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {f.arrival.iata || f.arrival.airport || 'Destination TBA'}
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
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 shrink-0 rounded ${status.className}`}>
                {status.label}
              </span>
            </li>
          )
        })}
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
    // AeroDataBox returns local times as "YYYY-MM-DD HH:MM" (no timezone).
    // JS's Date parses this as UTC on some engines and local on others,
    // so we grab the HH:MM substring directly when it's in that format.
    const m = iso.match(/(\d{2}):(\d{2})/)
    if (m) return `${m[1]}:${m[2]}`
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return '—'
  }
}

/**
 * Normalise the AeroDataBox status string plus delay info into a clean
 * on-screen label + tone + tailwind class. AeroDataBox emits statuses like
 * "Expected", "Boarding", "Departed", "Delayed", "Cancelled", "Arrived",
 * "Scheduled" — we collapse these into six presentational buckets.
 */
function normalizeStatus(f: FlightStatus): { label: string; className: string; tone: 'ontime' | 'delay' | 'board' | 'depart' | 'cancel' | 'sched' } {
  const raw = (f.status ?? '').toLowerCase().trim()
  const delayMin = typeof f.departure.delay === 'number' ? f.departure.delay : 0
  const hasRevised = !!(f.departure.estimatedTime && f.departure.estimatedTime !== f.departure.scheduledTime)

  if (/cancel/.test(raw))     return { label: 'Cancelled',          className: 'bg-red-100 text-red-700',       tone: 'cancel' }
  if (/divert/.test(raw))     return { label: 'Diverted',           className: 'bg-red-100 text-red-700',       tone: 'cancel' }
  if (/depart|airborne|en ?route/.test(raw)) return { label: 'Departed', className: 'bg-slate-200 text-slate-700', tone: 'depart' }
  if (/board/.test(raw))      return { label: 'Boarding',           className: 'bg-blue-100 text-blue-800',     tone: 'board' }
  if (/delay/.test(raw) || delayMin >= 15) {
    const mins = delayMin > 0 ? delayMin : null
    return { label: mins ? `Delayed ${mins}m` : 'Delayed', className: 'bg-amber-100 text-amber-800', tone: 'delay' }
  }
  if (/gate.*change/.test(raw)) return { label: 'Gate Change',      className: 'bg-amber-50 text-amber-700',    tone: 'delay' }
  if (/expected|active/.test(raw)) return { label: 'On Time',       className: 'bg-emerald-100 text-emerald-800', tone: 'ontime' }
  if (hasRevised)             return { label: 'Rescheduled',        className: 'bg-amber-50 text-amber-700',    tone: 'delay' }
  if (/scheduled/.test(raw))  return { label: 'Scheduled',          className: 'bg-slate-100 text-slate-600',   tone: 'sched' }
  // Fallback — capitalise the source value so we never invent a status
  return { label: (f.status ?? 'Scheduled').replace(/\b\w/g, c => c.toUpperCase()), className: 'bg-slate-100 text-slate-600', tone: 'sched' }
}
