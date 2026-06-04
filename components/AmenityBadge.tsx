import type { Amenity } from '@/lib/types'
import {
  Wifi, Wine, UtensilsCrossed, Cookie, Coffee, ShowerHead,
  Sparkles, Moon, BedDouble, Printer, Users, Tv, Newspaper,
  Baby, Accessibility, Building, Monitor,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi, wine: Wine, utensils: UtensilsCrossed, cookie: Cookie,
  coffee: Coffee, 'shower-head': ShowerHead, sparkles: Sparkles, moon: Moon,
  bed: BedDouble, printer: Printer, users: Users, tv: Tv,
  newspaper: Newspaper, baby: Baby, accessibility: Accessibility,
  building: Building, monitor: Monitor,
}

const CATEGORY_COLOURS: Record<string, string> = {
  food_drink:    'bg-amber-50 text-amber-700',
  connectivity:  'bg-blue-50 text-blue-700',
  wellness:      'bg-green-50 text-green-700',
  business:      'bg-purple-50 text-purple-700',
  entertainment: 'bg-pink-50 text-pink-700',
  accessibility: 'bg-teal-50 text-teal-700',
  other:         'bg-gray-50 text-gray-600',
}

interface Props {
  amenity: Amenity
  size?: 'sm' | 'md'
}

export default function AmenityBadge({ amenity, size = 'md' }: Props) {
  const Icon = amenity.icon ? ICON_MAP[amenity.icon] : null
  const colour = CATEGORY_COLOURS[amenity.category] ?? CATEGORY_COLOURS.other

  return (
    <span className={`badge ${colour} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {amenity.name}
    </span>
  )
}
