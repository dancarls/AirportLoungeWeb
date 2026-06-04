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
  const [amenity, setAmenity] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (iata)   params.set('airport', iata)
    if (access) params.set('access', access)
    if (amenity) params.set('amenity', amenity)
    router.push(`/lounges${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="bg-bone-white editorial-shadow p-2 flex flex-col md:flex-row items-stretch gap-0 border border-sand-dark/10">
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
      <div className="flex-1 px-6 py-4 flex flex-col border-b md:border-b-0 md:border-r border-sand-dark/20">
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

      {/* Amenities */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <label className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-1">Amenities</label>
        <input
          type="text"
          value={amenity}
          onChange={e => setAmenity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Showers, Work, Spa..."
          className="bg-transparent border-none p-0 text-primary focus:ring-0 placeholder:text-sand-dark/50 font-medium text-sm outline-none"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-primary-container text-on-primary-container px-10 py-4 font-label-caps text-label-caps uppercase transition-all hover:bg-primary hover:text-white"
      >
        Search
      </button>
    </div>
  )
}
