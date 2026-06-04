// Open-Meteo — completely free, no API key required
// https://open-meteo.com/

export interface WeatherData {
  temperature: number
  apparentTemperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
  label: string
  icon: string
  isDay: boolean
}

const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',            icon: 'clear_day' },
  1:  { label: 'Mainly clear',         icon: 'sunny' },
  2:  { label: 'Partly cloudy',        icon: 'partly_cloudy_day' },
  3:  { label: 'Overcast',             icon: 'cloud' },
  45: { label: 'Foggy',                icon: 'foggy' },
  48: { label: 'Icy fog',              icon: 'foggy' },
  51: { label: 'Light drizzle',        icon: 'water_drop' },
  53: { label: 'Drizzle',              icon: 'water_drop' },
  55: { label: 'Heavy drizzle',        icon: 'water_drop' },
  56: { label: 'Freezing drizzle',     icon: 'weather_mix' },
  57: { label: 'Heavy freezing drizzle',icon:'weather_mix' },
  61: { label: 'Light rain',           icon: 'rainy' },
  63: { label: 'Rain',                 icon: 'rainy' },
  65: { label: 'Heavy rain',           icon: 'rainy' },
  66: { label: 'Freezing rain',        icon: 'weather_mix' },
  67: { label: 'Heavy freezing rain',  icon: 'weather_mix' },
  71: { label: 'Light snow',           icon: 'weather_snowy' },
  73: { label: 'Snow',                 icon: 'weather_snowy' },
  75: { label: 'Heavy snow',           icon: 'weather_snowy' },
  77: { label: 'Snow grains',          icon: 'weather_snowy' },
  80: { label: 'Rain showers',         icon: 'rainy' },
  81: { label: 'Rain showers',         icon: 'rainy' },
  82: { label: 'Heavy showers',        icon: 'rainy' },
  85: { label: 'Snow showers',         icon: 'weather_snowy' },
  86: { label: 'Heavy snow showers',   icon: 'weather_snowy' },
  95: { label: 'Thunderstorm',         icon: 'thunderstorm' },
  96: { label: 'Thunderstorm + hail',  icon: 'thunderstorm' },
  99: { label: 'Thunderstorm + hail',  icon: 'thunderstorm' },
}

export async function getWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,is_day&wind_speed_unit=kmh&temperature_unit=celsius&timezone=auto`
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return null
    const data = await res.json()
    const c = data.current
    const code = c.weather_code as number
    const meta = WEATHER_CODES[code] ?? { label: 'Unknown', icon: 'device_thermostat' }
    return {
      temperature:         Math.round(c.temperature_2m),
      apparentTemperature: Math.round(c.apparent_temperature),
      weatherCode:         code,
      windSpeed:           Math.round(c.wind_speed_10m),
      humidity:            c.relative_humidity_2m,
      label:               meta.label,
      icon:                meta.icon,
      isDay:               c.is_day === 1,
    }
  } catch {
    return null
  }
}
