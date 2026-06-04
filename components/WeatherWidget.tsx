import type { WeatherData } from '@/lib/weather'

interface Props {
  weather: WeatherData | null
  city: string
  iata: string
}

export default function WeatherWidget({ weather, city, iata }: Props) {
  if (!weather) return null

  return (
    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-3 fine-border">
      {/* Icon */}
      <span
        className="material-symbols-outlined text-primary"
        style={{
          fontSize: '36px',
          fontVariationSettings: weather.isDay
            ? "'FILL' 1"
            : "'FILL' 0",
        }}
      >
        {weather.isDay ? weather.icon : weather.icon === 'clear_day' ? 'clear_night' : weather.icon}
      </span>

      {/* Temp */}
      <div>
        <p className="font-headline-md text-headline-md text-primary leading-none">
          {weather.temperature}°C
        </p>
        <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest">
          Feels {weather.apparentTemperature}°
        </p>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-sand-dark/20" />

      {/* Details */}
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-on-surface">{weather.label}</p>
        <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest">
          {iata} · {city}
        </p>
        <p className="font-label-caps text-[10px] text-secondary">
          Wind {weather.windSpeed} km/h · Humidity {weather.humidity}%
        </p>
      </div>
    </div>
  )
}
