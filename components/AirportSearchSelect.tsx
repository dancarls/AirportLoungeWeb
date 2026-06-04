'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { Airport } from '@/lib/types'

export default function AirportSearchSelect({ airports }: { airports: Airport[] }) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-xl mx-auto shadow-xl">
      <div className="flex-1 flex items-center gap-3 px-4">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <select
          className="flex-1 py-2 text-gray-900 bg-transparent outline-none text-sm"
          defaultValue=""
          onChange={e => { if (e.target.value) router.push(`/airports/${e.target.value}`) }}
        >
          <option value="" disabled>Search by airport…</option>
          {airports.map(a => (
            <option key={a.id} value={a.iata_code}>
              {a.iata_code} — {a.name}, {a.city}
            </option>
          ))}
        </select>
      </div>
      <button
        className="btn-primary rounded-xl"
        onClick={() => {}}
      >
        Find Lounges
      </button>
    </div>
  )
}
