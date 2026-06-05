import type { WeatherData } from '@/lib/weather'

interface Props {
  weather: WeatherData | null
  city: string
  iata: string
}

// Colorful icon overrides — Material Symbols icon name → CSS color
const ICON_COLORS: Record<string, string> = {
  clear_day:         '#F59E0B',  // amber / sunny yellow
  sunny:             '#F59E0B',
  partly_cloudy_day: '#FBBF24',  // lighter amber
  cloud:             '#9CA3AF',  // mid grey
  foggy:             '#D1D5DB',  // light grey
  rainy:             '#3B82F6',  // blue
  water_drop:        '#60A5FA',  // light blue
  weather_mix:       '#7DD3FC',  // ice blue (freezing rain/mix)
  weather_snowy:     '#93C5FD',  // pale blue
  thunderstorm:      '#EAB308',  // yellow — lightning
  device_thermostat: '#6B7280',  // default neutral
}

export default function WeatherWidget({ weather, city, iata }: Props) {
  if (!weather) return null

  // Swap to a moon icon for clear nights
  const iconName = !weather.isDay && weather.icon === 'clear_day' ? 'bedtime' : weather.icon
  const iconColor = ICON_COLORS[weather.icon] ?? '#6B7280'

  return (
    <div className="bg-white border border-outline-variant/30 p-6 rounded-xl">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-base">Current Weather</h4>
        <span className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">
          {iata} · {city}
        </span>
      </div>

      {/* Main reading */}
      <div className="flex items-center gap-4 mb-4">
        <span
          className="material-symbols-outlined shrink-0"
          style={{ fontSize: '52px', color: iconColor, fontVariationSettings: "'FILL' 1" }}
        >
          {iconName}
        </span>
        <div>
          <p className="leading-none text-primary" style={{ fontSize: '32px', fontWeight: 700 }}>
            {weather.temperature}°<span className="text-base font-normal text-secondary ml-0.5">C</span>
          </p>
          <p className="text-secondary text-sm mt-1">{weather.label}</p>
          <p className="font-label-caps text-[9px] text-sand-dark uppercase tracking-wider mt-0.5">
            Feels like {weather.apparentTemperature}°
          </p>
        </div>
      </div>

      {/* Wind + humidity */}
      <div className="pt-4 border-t border-outline-variant/20 flex gap-5 text-xs text-secondary">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9CA3AF' }}>air</span>
          {weather.windSpeed} km/h
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#60A5FA' }}>water_drop</span>
          {weather.humidity}%
        </span>
      </div>
    </div>
  )
}
