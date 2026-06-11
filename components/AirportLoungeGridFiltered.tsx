'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoungePlaceholder from './LoungePlaceholder'

export interface LoungeSummary {
  id: string
  name: string
  slug: string
  terminal: string | null
  location_detail: string | null
  description: string | null
  rating: number | null
  review_count: number
  access_types: { type: string; name: string; details?: string }[] | null
  primaryImage: string | null
  updated_at: string | null
}

interface Props {
  lounges: LoungeSummary[]
  iata: string
}

// ── Access matching ───────────────────────────────────────
const ACCESS_OPTIONS = [
  { key: 'priority-pass',   label: 'Priority Pass',      icon: 'credit_card' },
  { key: 'dragonpass',      label: 'DragonPass',         icon: 'credit_card' },
  { key: 'ac-altitude',     label: 'AC Altitude',        icon: 'airplane_ticket' },
  { key: 'westjet',         label: 'WestJet Platinum',   icon: 'airplane_ticket' },
  { key: 'business-class',  label: 'Business / First',   icon: 'airline_seat_flat' },
  { key: 'day-pass',        label: 'Day Pass',           icon: 'sell' },
] as const

type AccessKey = typeof ACCESS_OPTIONS[number]['key']

function canAccess(types: LoungeSummary['access_types'], key: AccessKey): boolean {
  const t = types ?? []
  switch (key) {
    case 'priority-pass':
      return t.some(a => a.name.toLowerCase().includes('priority pass'))
    case 'dragonpass':
      return t.some(a =>
        a.name.toLowerCase().includes('dragonpass') ||
        a.name.toLowerCase().includes('dragon pass') ||
        a.name.toLowerCase().includes('mastercard airport')
      )
    case 'ac-altitude':
      return t.some(a =>
        (a.type === 'airline_status' && a.name.toLowerCase().includes('air canada')) ||
        a.type === 'class_of_service'
      )
    case 'westjet':
      return t.some(a =>
        a.name.toLowerCase().includes('westjet') ||
        a.type === 'class_of_service'
      )
    case 'business-class':
      return t.some(a => a.type === 'class_of_service')
    case 'day-pass':
      return t.some(a => a.type === 'day_pass')
  }
}

// ── Helpers ───────────────────────────────────────────────
function getOperator(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('air canada'))    return 'Air Canada'
  if (n.includes('plaza premium')) return 'Plaza Premium'
  if (n.includes('westjet'))       return 'WestJet'
  if (n.includes('swissport'))     return 'Swissport'
  if (n.includes('aspire'))        return 'Aspire'
  return 'Independent'
}

function getLoungeTier(name: string): string | null {
  const n = name.toLowerCase()
  if (n.includes('signature suite')) return 'SIGNATURE'
  if (n.includes('maple leaf'))      return 'MAPLE LEAF'
  if (n.includes('café') || n.includes('cafe')) return 'CAFÉ'
  if (n.includes('first'))           return 'FIRST CLASS'
  return null
}

function formatVerified(updated_at: string | null): string {
  if (!updated_at) return 'Verified 2026'
  const d = new Date(updated_at)
  return `Verified ${d.toLocaleString('en-CA', { month: 'short', year: 'numeric' })}`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// ── Component ─────────────────────────────────────────────
export default function AirportLoungeGridFiltered({ lounges, iata }: Props) {
  const [accessFilter,   setAccessFilter]   = useState<AccessKey | ''>('')
  const [operatorFilter, setOperatorFilter] = useState('')
  const [terminalFilter, setTerminalFilter] = useState('')

  const operators = [...new Set(lounges.map(l => getOperator(l.name)))].sort()
  const terminals = [...new Set(lounges.map(l => l.terminal).filter(Boolean) as string[])].sort()

  const filtered = lounges.filter(l => {
    const matchAccess   = !accessFilter   || canAccess(l.access_types, accessFilter)
    const matchOperator = !operatorFilter || getOperator(l.name) === operatorFilter
    const matchTerminal = !terminalFilter || l.terminal === terminalFilter
    return matchAccess && matchOperator && matchTerminal
  })

  const hasFilters = accessFilter || operatorFilter || terminalFilter

  return (
    <>
      {/* ── Access Calculator ────────────────────────────── */}
      <section className="mb-10 bg-primary/[0.03] border border-primary/10 p-6">
        <p className="font-label-caps text-label-caps text-primary mb-1">ACCESS CALCULATOR</p>
        <p className="text-sm text-secondary mb-5">
          Select what you have — we&apos;ll show only lounges you can walk into.
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCESS_OPTIONS.map(opt => {
            const active = accessFilter === opt.key
            const matchCount = lounges.filter(l => canAccess(l.access_types, opt.key)).length
            return (
              <button
                key={opt.key}
                onClick={() => setAccessFilter(active ? '' : opt.key)}
                className={`flex items-center gap-2 px-4 py-2 border font-label-caps text-label-caps transition-all text-xs ${
                  active
                    ? 'bg-primary text-bone-white border-primary'
                    : matchCount > 0
                      ? 'bg-bone-white text-primary border-primary/30 hover:border-primary'
                      : 'bg-bone-white text-secondary/50 border-sand-dark/20 cursor-not-allowed'
                }`}
                disabled={matchCount === 0}
                title={matchCount === 0 ? `No ${opt.label} access at ${iata}` : `${matchCount} lounge${matchCount !== 1 ? 's' : ''} accessible`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{opt.icon}</span>
                {opt.label}
                {matchCount > 0 && !active && (
                  <span className="ml-0.5 text-[10px] text-sand-dark">({matchCount})</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Access result message */}
        {accessFilter && (
          <p className="mt-4 text-sm text-secondary">
            {filtered.length > 0 ? (
              <>
                <span className="font-semibold text-primary">{filtered.length} lounge{filtered.length !== 1 ? 's' : ''}</span> accessible with {ACCESS_OPTIONS.find(o => o.key === accessFilter)?.label}.
                {' '}<span className="text-xs text-secondary/70">Confirm exact eligibility with your provider before travelling.</span>
              </>
            ) : (
              <span className="text-sand-dark">No lounges match this combination of filters. Try clearing one.</span>
            )}
          </p>
        )}
      </section>

      {/* ── Filter bar ───────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-sand-dark/20">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            {hasFilters ? (
              <>
                {filtered.length}
                <span className="text-secondary font-normal text-2xl"> of {lounges.length} lounges</span>
              </>
            ) : (
              <>Lounges at {iata}</>
            )}
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            {operators.length > 1 && (
              <div className="relative">
                <select
                  value={operatorFilter}
                  onChange={e => setOperatorFilter(e.target.value)}
                  className="appearance-none bg-bone-white border-b-2 border-primary/20 hover:border-primary px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Operator</option>
                  {operators.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-sand-dark text-sm">expand_more</span>
              </div>
            )}

            {terminals.length > 1 && (
              <div className="relative">
                <select
                  value={terminalFilter}
                  onChange={e => setTerminalFilter(e.target.value)}
                  className="appearance-none bg-bone-white border-b-2 border-primary/20 hover:border-primary px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Terminal</option>
                  {terminals.map(t => <option key={t} value={t}>T - {t}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-sand-dark text-sm">expand_more</span>
              </div>
            )}

            {hasFilters && (
              <button
                onClick={() => { setAccessFilter(''); setOperatorFilter(''); setTerminalFilter('') }}
                className="text-xs text-primary underline underline-offset-2 hover:no-underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Lounge cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {filtered.length === 0 && (
          <div className="col-span-2 border border-sand-dark/20 bg-white p-12 text-center">
            <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">search_off</span>
            <p className="font-medium text-on-surface">No lounges match your filters</p>
            <button
              onClick={() => { setAccessFilter(''); setOperatorFilter(''); setTerminalFilter('') }}
              className="mt-3 text-sm text-primary underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filtered.map(lounge => {
          const tier = getLoungeTier(lounge.name)
          return (
            <Link
              key={lounge.id}
              href={`/airports/${iata}/lounges/${lounge.slug}`}
              className="group bg-surface shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-sand-dark/10 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                {lounge.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lounge.primaryImage}
                    alt={lounge.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <LoungePlaceholder name={lounge.name} variant="card" />
                )}
                {tier && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-container text-on-primary-container text-[9px] font-label-caps px-2 py-0.5">
                      {tier}
                    </span>
                  </div>
                )}
                {/* Last verified badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-bone-white/90 backdrop-blur-sm text-[9px] font-label-caps text-primary px-2 py-1">
                    {formatVerified(lounge.updated_at)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-headline-md text-headline-md text-primary leading-tight">{lounge.name}</h3>
                  {lounge.rating && (
                    <div className="flex items-center text-sand-dark shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>star</span>
                      <span className="font-label-caps text-label-caps ml-1">{lounge.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Terminal + walk direction */}
                <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
                  {lounge.terminal && (
                    <span className="font-label-caps text-[10px] text-sand-dark">
                      T - {lounge.terminal}
                    </span>
                  )}
                  {lounge.location_detail && (
                    <span className="flex items-start gap-1 text-[10px] text-secondary leading-tight">
                      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '12px', marginTop: '1px' }}>directions_walk</span>
                      {lounge.location_detail}
                    </span>
                  )}
                </div>

                {/* Access tags */}
                {lounge.access_types && lounge.access_types.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {lounge.access_types.slice(0, 3).map((a, i) => (
                      <span key={i} className="bg-champagne-glint text-sand-dark text-[9px] font-label-caps px-2 py-0.5 uppercase">
                        {a.type === 'credit_card'      ? 'Credit Card'
                        : a.type === 'airline_status'  ? 'Airline Status'
                        : a.type === 'class_of_service' ? 'Business Class'
                        : a.type === 'day_pass'        ? 'Day Pass'
                        : a.type === 'membership'      ? 'Membership'
                        : a.name}
                      </span>
                    ))}
                    {lounge.access_types.length > 3 && (
                      <span className="text-[9px] text-secondary/60 self-center">+{lounge.access_types.length - 3} more</span>
                    )}
                  </div>
                )}

                {lounge.description && (
                  <p className="text-secondary text-sm line-clamp-2 leading-relaxed flex-1 mt-1">
                    {stripHtml(lounge.description)}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-sand-dark/10">
                  <span className="font-label-caps text-label-caps text-primary group-hover:underline transition-all">
                    VIEW DETAILS
                  </span>
                  <span className="text-sand-dark group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* CTA bento — always shown */}
        <div className="bg-primary-container shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-center p-8 border border-white/10 min-h-[280px] relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-on-primary-container opacity-15" style={{ fontSize: '64px' }}>travel_explore</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-primary-container mb-3">
            Discover the Perfect Sanctuary
          </h3>
          <p className="text-on-primary-container/75 text-sm mb-6 leading-relaxed max-w-xs">
            Compare access methods, walk times, and amenities across every Canadian lounge.
          </p>
          <Link
            href="/lounges"
            className="w-fit bg-bone-white text-primary px-6 py-2 font-label-caps text-label-caps hover:bg-champagne-glint transition-all"
          >
            EXPLORE FULL DIRECTORY
          </Link>
        </div>
      </div>
    </>
  )
}
