'use client'

import { useState } from 'react'
import { Search, Plane, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import type { FlightStatus } from '@/lib/types'
import { format, parseISO } from 'date-fns'

const STATUS_STYLES: Record<string, { icon: React.ComponentType<{className?:string}>, colour: string, label: string }> = {
  Scheduled:  { icon: Clock,         colour: 'text-blue-600 bg-blue-50',   label: 'Scheduled' },
  Active:     { icon: Plane,         colour: 'text-green-600 bg-green-50',  label: 'In flight' },
  Landed:     { icon: CheckCircle,   colour: 'text-green-600 bg-green-50',  label: 'Landed' },
  Cancelled:  { icon: XCircle,       colour: 'text-red-600 bg-red-50',      label: 'Cancelled' },
  Delayed:    { icon: AlertCircle,   colour: 'text-amber-600 bg-amber-50',  label: 'Delayed' },
  Diverted:   { icon: AlertCircle,   colour: 'text-orange-600 bg-orange-50',label: 'Diverted' },
  Unknown:    { icon: Clock,         colour: 'text-gray-600 bg-gray-50',    label: 'Unknown' },
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'HH:mm') } catch { return iso }
}

interface Props {
  initialFlightNumber?: string
}

export default function FlightStatusWidget({ initialFlightNumber = '' }: Props) {
  const [query, setQuery]   = useState(initialFlightNumber)
  const [loading, setLoading] = useState(false)
  const [flight, setFlight] = useState<FlightStatus | null>(null)
  const [error, setError]   = useState<string | null>(null)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setFlight(null)
    try {
      const res = await fetch(`/api/flights?flight=${encodeURIComponent(query.trim().toUpperCase())}`)
      if (!res.ok) { setError('Flight not found. Check the flight number and try again.'); return }
      const data = await res.json()
      if (!data) { setError('No data available for this flight.'); return }
      setFlight(data)
    } catch {
      setError('Unable to fetch flight data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const status = flight ? (STATUS_STYLES[flight.status] ?? STATUS_STYLES.Unknown) : null
  const StatusIcon = status?.icon

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-lg text-gray-900">Flight Status</h2>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Flight number (e.g. AC123)"
          value={query}
          onChange={e => setQuery(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button onClick={search} disabled={loading} className="btn-primary px-4">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </p>
      )}

      {flight && status && StatusIcon && (
        <div className="space-y-4">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{flight.flightNumber}</p>
              <p className="text-sm text-gray-500">{flight.airline}</p>
            </div>
            <span className={`badge text-sm font-medium px-3 py-1.5 ${status.colour}`}>
              <StatusIcon className="w-4 h-4" /> {status.label}
            </span>
          </div>

          {/* Route */}
          <div className="grid grid-cols-3 gap-4 text-center py-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-2xl font-bold text-gray-900">{flight.departure.iata}</p>
              <p className="text-xs text-gray-500 mb-2 truncate">{flight.departure.airport}</p>
              <p className="text-lg font-semibold">
                {formatTime(flight.departure.actualTime ?? flight.departure.estimatedTime ?? flight.departure.scheduledTime)}
              </p>
              {flight.departure.delay && flight.departure.delay > 0 && (
                <p className="text-xs text-amber-600">+{flight.departure.delay}m delay</p>
              )}
              {flight.departure.gate && <p className="text-xs text-gray-400">Gate {flight.departure.gate}</p>}
              {flight.departure.terminal && <p className="text-xs text-gray-400">T{flight.departure.terminal}</p>}
            </div>
            <div className="flex flex-col items-center justify-center">
              <Plane className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{flight.arrival.iata}</p>
              <p className="text-xs text-gray-500 mb-2 truncate">{flight.arrival.airport}</p>
              <p className="text-lg font-semibold">
                {formatTime(flight.arrival.actualTime ?? flight.arrival.estimatedTime ?? flight.arrival.scheduledTime)}
              </p>
              {flight.arrival.delay && flight.arrival.delay > 0 && (
                <p className="text-xs text-amber-600">+{flight.arrival.delay}m delay</p>
              )}
              {flight.arrival.gate && <p className="text-xs text-gray-400">Gate {flight.arrival.gate}</p>}
              {flight.arrival.terminal && <p className="text-xs text-gray-400">T{flight.arrival.terminal}</p>}
            </div>
          </div>

          {flight.aircraft && (
            <p className="text-xs text-gray-400 text-center">Aircraft: {flight.aircraft}</p>
          )}
        </div>
      )}
    </div>
  )
}
