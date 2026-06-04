'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

interface Airport { iata_code: string; name: string }

export default function LoungeFilters({ airports, currentAirport, currentSort }: {
  airports: Airport[]
  currentAirport: string
  currentSort: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/lounges?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <Filter className="w-4 h-4" /> Filter:
      </div>
      <select
        defaultValue={currentAirport}
        className="input w-auto py-1.5 text-sm"
        onChange={e => update('airport', e.target.value)}
      >
        <option value="">All airports</option>
        {airports.map(a => (
          <option key={a.iata_code} value={a.iata_code}>
            {a.iata_code} — {a.name}
          </option>
        ))}
      </select>
      <select
        defaultValue={currentSort}
        className="input w-auto py-1.5 text-sm"
        onChange={e => update('sort', e.target.value)}
      >
        <option value="rating">Sort: Top rated</option>
        <option value="reviews">Sort: Most reviewed</option>
        <option value="name">Sort: A–Z</option>
      </select>
    </div>
  )
}
