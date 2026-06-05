'use client'

import { useState, useMemo } from 'react'
import LoungeCard from './LoungeCard'
import type { Lounge, AccessType } from '@/lib/types'

interface Props {
  lounges: Lounge[]
  airportIata: string
}

const ACCESS_LABELS: Record<string, string> = {
  membership:       'Priority Pass',
  class_of_service: 'Business / First',
  airline_status:   'Airline Status',
  credit_card:      'Credit Card',
  day_pass:         'Day Pass',
}

function deriveOperator(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('air canada')) return 'Air Canada'
  if (n.includes('cathay'))     return 'Cathay Pacific'
  if (n.includes('plaza premium')) return 'Plaza Premium'
  if (n.includes('skyteam'))    return 'SkyTeam'
  if (n.includes('westjet'))    return 'WestJet'
  if (n.includes('klm'))        return 'KLM'
  if (n.includes('united'))     return 'United Airlines'
  if (n.includes('american airlines')) return 'American Airlines'
  if (n.includes('delta'))      return 'Delta'
  return name
}

type FilterGroup = { operators: Set<string>; access: Set<string>; terminals: Set<string> }

export default function AirportLoungeGrid({ lounges, airportIata }: Props) {
  const [filters, setFilters] = useState<FilterGroup>({
    operators: new Set(), access: new Set(), terminals: new Set(),
  })

  const { operators, accessTypes, terminals } = useMemo(() => {
    const ops  = new Map<string, number>() // operator → count
    const acc  = new Set<string>()
    const term = new Set<string>()
    for (const l of lounges) {
      const op = deriveOperator(l.name)
      ops.set(op, (ops.get(op) ?? 0) + 1)
      for (const at of (l.access_types ?? []) as AccessType[]) acc.add(at.type)
      if (l.terminal) term.add(l.terminal)
    }
    return {
      operators:   [...ops.keys()].sort(),
      accessTypes: [...acc],
      terminals:   term.size > 1 ? [...term].sort() : [],
    }
  }, [lounges])

  const filtered = useMemo(() => {
    const { operators: selOps, access: selAcc, terminals: selTerm } = filters
    return lounges.filter(l => {
      const opOk   = selOps.size  === 0 || selOps.has(deriveOperator(l.name))
      const accOk  = selAcc.size  === 0 || (l.access_types ?? []).some((at: AccessType) => selAcc.has(at.type))
      const termOk = selTerm.size === 0 || (l.terminal != null && selTerm.has(l.terminal))
      return opOk && accOk && termOk
    })
  }, [lounges, filters])

  const totalActive = filters.operators.size + filters.access.size + filters.terminals.size

  function toggle(group: keyof FilterGroup, val: string) {
    setFilters(prev => {
      const next = new Set(prev[group])
      next.has(val) ? next.delete(val) : next.add(val)
      return { ...prev, [group]: next }
    })
  }

  function clearAll() {
    setFilters({ operators: new Set(), access: new Set(), terminals: new Set() })
  }

  const showFilters = operators.length > 1 || accessTypes.length > 0 || terminals.length > 0

  return (
    <div>
      {/* ── Filter strip ──────────────────────────────────────────── */}
      {showFilters && (
        <div className="mb-6 space-y-2.5">

          {operators.length > 1 && (
            <FilterRow
              label="Operator"
              items={operators}
              selected={filters.operators}
              onToggle={val => toggle('operators', val)}
            />
          )}

          {accessTypes.length > 0 && (
            <FilterRow
              label="Access"
              items={accessTypes}
              selected={filters.access}
              onToggle={val => toggle('access', val)}
              labels={ACCESS_LABELS}
            />
          )}

          {terminals.length > 0 && (
            <FilterRow
              label="Terminal"
              items={terminals}
              selected={filters.terminals}
              onToggle={val => toggle('terminals', val)}
              formatLabel={t => t.toLowerCase().startsWith('terminal') ? t : `Terminal ${t}`}
            />
          )}

          {totalActive > 0 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-secondary">
                Showing {filtered.length} of {lounges.length} lounge{lounges.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAll}
                className="font-label-caps text-[9px] uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Grid ──────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="fine-border bg-white p-10 text-center">
          <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">search_off</span>
          <p className="font-medium text-on-surface mb-1">No lounges match those filters</p>
          <p className="text-sm text-secondary mb-4">Try removing a filter to see more results.</p>
          <button
            onClick={clearAll}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map(lounge => (
            <LoungeCard key={lounge.id} lounge={lounge} airportIata={airportIata} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Filter row sub-component ─────────────────────────────────── */
function FilterRow({
  label,
  items,
  selected,
  onToggle,
  labels = {},
  formatLabel,
}: {
  label: string
  items: string[]
  selected: Set<string>
  onToggle: (val: string) => void
  labels?: Record<string, string>
  formatLabel?: (val: string) => string
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest shrink-0 w-14">
        {label}
      </span>
      {items.map(item => {
        const display = formatLabel ? formatLabel(item) : (labels[item] ?? item)
        const active  = selected.has(item)
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`font-label-caps text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all whitespace-nowrap ${
              active
                ? 'bg-primary text-white border-primary'
                : 'border-outline-variant/60 text-secondary bg-white hover:border-primary hover:text-primary'
            }`}
          >
            {display}
          </button>
        )
      })}
    </div>
  )
}
