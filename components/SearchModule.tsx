'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Airport { id: string; name: string; iata_code: string; city: string }

const ACCESS_TYPES = [
  'Priority Pass',
  'Business Class',
  'Amex Platinum',
  'Air Canada Altitude',
  'TD Aeroplan Visa Infinite Privilege',
  'CIBC Aeroplan Visa Infinite Privilege',
  'Scotiabank Passport Visa Infinite',
  'DragonPass',
  'LoungeKey',
  'Day Pass',
]

export default function SearchModule({ airports }: { airports: Airport[] }) {
  const router  = useRouter()
  const [iata, setIata]     = useState('')
  const [access, setAccess] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (iata)   params.set('airport', iata)
    if (access) params.set('access', access)
    router.push(`/lounges${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="bg-bone-white editorial-shadow flex flex-col md:flex-row items-stretch border border-sand-dark/10">
      {/* Location */}
      <div className="flex-1 px-6 py-4 flex flex-col border-b md:border-b-0 md:border-r border-sand-dark/20">
        <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1">Location</label>
        <select
          value={iata}
          onChange={e => setIata(e.target.value)}
          className="bg-transparent border-none p-0 text-primary focus:ring-0 font-medium appearance-none text-sm"
        >
          <option value="">Airport or City</option>
          {airports.map(a => (
            <option key={a.id} value={a.iata_code}>
              {a.iata_code} — {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Access Type */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1">Access Type</label>
        <select
          value={access}
          onChange={e => setAccess(e.target.value)}
          className="bg-transparent border-none p-0 text-primary focus:ring-0 font-medium appearance-none text-sm"
        >
          <option value="">Any Access</option>
          {ACCESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Icon-only search trigger */}
      <button
        onClick={handleSearch}
        aria-label="Search lounges"
        className="px-7 py-4 bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>search</span>
      </button>
    </div>
  )
}
