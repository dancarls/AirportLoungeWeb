import Link from 'next/link'

interface AlternativeLounge {
  slug: string
  name: string
  terminal: string | null
  airport_iata: string
}

interface Props {
  status: 'temporary_closure' | 'reduced_capacity' | 'permanent_closure'
  reason: string | null
  startedOn: string | null
  reopenEstimate: string | null
  alternatives: string | null           // free-text guidance
  alternativeLounges: AlternativeLounge[] // auto-suggested from same airport
  sourceUrl: string | null
  verifiedAt: string | null              // ISO date the closure was last verified
  loungeName: string
}

/**
 * The site's signature closure banner — one visual for every closed or
 * reduced-capacity lounge across Canada. Renders nothing when the lounge is
 * open (guarded upstream). Auto-lists 2-3 alternative lounges at the same
 * airport so a stranded traveller has a next step in one click.
 *
 * Visual language:
 *   - Warm amber (matches the site's champagne palette, not the aviation navy)
 *   - Clock icon for renovation / duration signal
 *   - Bold "Currently closed" / "Operating in reduced capacity" heading
 *   - Structured facts: what changed, when, expected return
 *   - Free-text guidance from the operator
 *   - Alternative lounges as tappable cards
 *   - Verified date + source URL for trust
 */
export default function LoungeClosureBanner({
  status,
  reason,
  startedOn,
  reopenEstimate,
  alternatives,
  alternativeLounges,
  sourceUrl,
  verifiedAt,
  loungeName,
}: Props) {
  const isReducedCapacity = status === 'reduced_capacity'
  const isPermanent       = status === 'permanent_closure'

  const heading = isReducedCapacity
    ? `${loungeName} is operating in a temporary space`
    : isPermanent
      ? `${loungeName} is permanently closed`
      : `${loungeName} is currently closed for renovation`

  return (
    <aside
      role="note"
      aria-label="Lounge closure notice"
      className="mb-8 border border-amber-300 bg-amber-50 shadow-sm"
    >
      {/* Header — the visual signature. Amber accent bar + icon + heading */}
      <div className="border-l-4 border-amber-500 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              {isReducedCapacity ? 'construction' : isPermanent ? 'do_not_disturb_on' : 'schedule'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-caps text-[10px] uppercase tracking-widest text-amber-800 mb-1">
              {isReducedCapacity ? 'Reduced capacity' : isPermanent ? 'Permanently closed' : 'Temporarily closed'}
            </p>
            <h2 className="font-headline-md text-headline-md text-primary leading-tight">
              {heading}
            </h2>
          </div>
        </div>

        {/* Facts row: reason / started / expected return */}
        {(reason || startedOn || reopenEstimate) && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-amber-200 pt-4">
            {reason && (
              <div>
                <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-700 mb-1">Reason</p>
                <p className="text-sm text-on-surface leading-snug">{reason}</p>
              </div>
            )}
            {startedOn && (
              <div>
                <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-700 mb-1">Closed since</p>
                <p className="text-sm text-on-surface leading-snug">
                  <time dateTime={startedOn}>
                    {new Date(startedOn).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </p>
              </div>
            )}
            {reopenEstimate && (
              <div>
                <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-700 mb-1">Expected return</p>
                <p className="text-sm text-on-surface leading-snug">{reopenEstimate}</p>
              </div>
            )}
          </div>
        )}

        {/* Free-text guidance from the operator */}
        {alternatives && (
          <div className="mt-6 border-t border-amber-200 pt-4">
            <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-700 mb-2">What to do instead</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">{alternatives}</p>
          </div>
        )}

        {/* Alternative lounges — auto-suggested from same airport */}
        {alternativeLounges.length > 0 && (
          <div className="mt-6 border-t border-amber-200 pt-4">
            <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-700 mb-3">
              Other lounges at this airport
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alternativeLounges.slice(0, 3).map(alt => (
                <Link
                  key={alt.slug}
                  href={`/airports/${alt.airport_iata}/lounges/${alt.slug}`}
                  className="flex items-center justify-between bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100/40 transition-colors p-3 group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{alt.name}</p>
                    {alt.terminal && (
                      <p className="text-xs text-secondary uppercase tracking-widest">Terminal {alt.terminal}</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-amber-500 group-hover:text-amber-700 shrink-0 ml-2" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Verification footer — trust signal */}
        <div className="mt-6 pt-4 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-amber-700 leading-relaxed">
            {verifiedAt && (
              <>Verified <time dateTime={verifiedAt}>{new Date(verifiedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</time></>
            )}
            {verifiedAt && sourceUrl && ' · '}
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-amber-900">
                Source: {new URL(sourceUrl).hostname.replace('www.', '')}
              </a>
            )}
          </p>
          <p className="text-[10px] text-amber-700 italic">
            Rules change without notice — confirm before travelling.
          </p>
        </div>
      </div>
    </aside>
  )
}
