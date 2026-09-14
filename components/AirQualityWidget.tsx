import type { AirQualityReading } from '@/lib/air-quality'

interface Props {
  reading: AirQualityReading | null
  airportCity: string
  iata: string
}

/**
 * Sidebar widget rendered on each airport hub page — shows the current AQI
 * (0-500 index) with a category label and dominant pollutant. Renders
 * nothing when no reading is available so the page degrades cleanly.
 *
 * Categories mapped to Tailwind background classes with reasonable contrast
 * on both light and dark themes. The Google Air Quality API returns a
 * `color` object with normalized 0-1 RGB values — we ignore that in favour
 * of category-based bands for consistent brand appearance.
 */
export default function AirQualityWidget({ reading, airportCity, iata }: Props) {
  if (!reading || reading.aqi == null) return null

  const { aqi, category, dominantPollutant } = reading
  const band = aqiBand(aqi)

  return (
    <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-label-caps text-label-caps text-sand-dark">AIR QUALITY</h4>
          <p className="font-headline-md text-headline-md text-primary mt-0.5">{airportCity}</p>
        </div>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${band.bg}`}
          title={band.label}
        >
          {aqi}
        </div>
      </div>
      <div className="text-sm text-secondary leading-relaxed">
        <p className="font-semibold text-primary mb-1">{category ?? band.label}</p>
        {dominantPollutant && (
          <p className="text-xs text-on-surface-variant">
            Dominant pollutant: <span className="uppercase">{dominantPollutant}</span>
          </p>
        )}
      </div>
      <p className="text-[10px] text-secondary/50 mt-3 leading-relaxed">
        Air quality at {iata} — updated hourly from Google Air Quality API.
      </p>
    </div>
  )
}

function aqiBand(aqi: number): { label: string; bg: string } {
  // Health Canada AQHI adaptations — Google returns CA AQI when available.
  if (aqi <= 50)  return { label: 'Good',                       bg: 'bg-green-600' }
  if (aqi <= 100) return { label: 'Moderate',                   bg: 'bg-yellow-500' }
  if (aqi <= 150) return { label: 'Unhealthy for sensitive',    bg: 'bg-orange-500' }
  if (aqi <= 200) return { label: 'Unhealthy',                  bg: 'bg-red-600' }
  if (aqi <= 300) return { label: 'Very unhealthy',             bg: 'bg-purple-700' }
  return              { label: 'Hazardous',                     bg: 'bg-rose-900' }
}
