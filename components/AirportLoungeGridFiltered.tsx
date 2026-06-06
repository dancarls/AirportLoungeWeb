'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface LoungeSummary {
  id: string
  name: string
  slug: string
  terminal: string | null
  description: string | null
  rating: number | null
  review_count: number
  access_types: { type: string; name: string; details?: string }[] | null
  primaryImage: string | null
}

interface Props {
  lounges: LoungeSummary[]
  iata: string
}

function getOperator(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('air canada'))    return 'Air Canada'
  if (n.includes('plaza premium')) return 'Plaza Premium'
  if (n.includes('westjet'))       return 'WestJet'
  if (n.includes('swissport'))     return 'Swissport'
  if (n.includes('aspire'))        return 'Aspire'
  if (n.includes('priority pass')) return 'Priority Pass'
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

export default function AirportLoungeGridFiltered({ lounges, iata }: Props) {
  const [operatorFilter, setOperatorFilter] = useState('')
  const [accessFilter,   setAccessFilter]   = useState('')
  const [terminalFilter, setTerminalFilter] = useState('')

  const operators = [...new Set(lounges.map(l => getOperator(l.name)))].sort()
  const terminals = [...new Set(lounges.map(l => l.terminal).filter(Boolean) as string[])].sort()

  const filtered = lounges.filter(l => {
    const matchOp     = !operatorFilter || getOperator(l.name) === operatorFilter
    const matchTerm   = !terminalFilter || l.terminal === terminalFilter
    const matchAccess = !accessFilter || (l.access_types ?? []).some(a => a.type === accessFilter)
    return matchOp && matchTerm && matchAccess
  })

  const hasFilters = operatorFilter || accessFilter || terminalFilter

  return (
    <>
      {/* ── Filter bar ───────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand-dark/20">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Lounges at {iata}
            {hasFilters && (
              <span className="text-sm font-normal text-secondary ml-3">
                ({filtered.length} of {lounges.length})
              </span>
            )}
          </h2>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Operator */}
            {operators.length > 1 && (
              <div className="relative">
                <select
                  value={operatorFilter}
                  onChange={e => setOperatorFilter(e.target.value)}
                  className="appearance-none bg-bone-white border-b-2 border-primary/20 hover:border-primary px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Operator</option>
                  {operators.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sand-dark text-sm">expand_more</span>
              </div>
            )}

            {/* Access type */}
            <div className="relative">
              <select
                value={accessFilter}
                onChange={e => setAccessFilter(e.target.value)}
                className="appearance-none bg-bone-white border-b-2 border-primary/20 hover:border-primary px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="">Access Type</option>
                <option value="credit_card">Priority Pass / DragonPass</option>
                <option value="airline_status">Airline Status</option>
                <option value="class_of_service">Business Class</option>
                <option value="membership">Membership</option>
                <option value="day_pass">Day Pass</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sand-dark text-sm">expand_more</span>
            </div>

            {/* Terminal — only show if airport has multiple terminals */}
            {terminals.length > 1 && (
              <div className="relative">
                <select
                  value={terminalFilter}
                  onChange={e => setTerminalFilter(e.target.value)}
                  className="appearance-none bg-bone-white border-b-2 border-primary/20 hover:border-primary px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Terminal</option>
                  {terminals.map(t => <option key={t} value={t}>T - {t}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sand-dark text-sm">expand_more</span>
              </div>
            )}

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={() => { setOperatorFilter(''); setAccessFilter(''); setTerminalFilter('') }}
                className="text-xs text-primary underline underline-offset-2 hover:no-underline transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Lounge cards grid ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-2 border border-sand-dark/20 bg-white p-12 text-center">
            <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">search_off</span>
            <p className="font-medium text-on-surface">No lounges match your filters</p>
            <button
              onClick={() => { setOperatorFilter(''); setAccessFilter(''); setTerminalFilter('') }}
              className="mt-3 text-sm text-primary underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filtered.map(lounge => {
          const tier = getLoungeTier(lounge.name)
          return (
            <div
              key={lounge.id}
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
                  <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>local_bar</span>
                  </div>
                )}
                {/* Tier badge */}
                {tier && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-container text-on-primary-container text-[9px] font-label-caps px-2 py-0.5">
                      {tier}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-headline-md text-headline-md text-primary leading-tight">{lounge.name}</h3>
                  {lounge.rating && (
                    <div className="flex items-center text-sand-dark shrink-0">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>star</span>
                      <span className="font-label-caps text-label-caps ml-1">{lounge.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {lounge.terminal && (
                  <p className="font-label-caps text-[10px] text-sand-dark uppercase mb-4">
                    T - {lounge.terminal}
                  </p>
                )}

                {lounge.description && (
                  <p className="text-secondary text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                    {lounge.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-sand-dark/10">
                  <Link
                    href={`/airports/${iata}/lounges/${lounge.slug}`}
                    className="font-label-caps text-label-caps text-primary hover:underline transition-all"
                  >
                    VIEW DETAILS
                  </Link>
                  <Link
                    href={`/airports/${iata}/lounges/${lounge.slug}`}
                    className="text-sand-dark hover:text-primary transition-colors"
                    aria-label="View lounge details"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* CTA bento card — always shown */}
        <div className="group bg-primary-container shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-center p-8 border border-white/10 min-h-[300px] relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-on-primary-container opacity-20" style={{ fontSize: '64px' }}>travel_explore</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-primary-container mb-4">
            Discover the Perfect Sanctuary
          </h3>
          <p className="text-on-primary-container/75 text-sm mb-8 leading-relaxed max-w-xs">
            Find the shortest walk and best amenities for your next departure. Compare access methods, hours, and reviews.
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
