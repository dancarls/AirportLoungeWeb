import { Star } from 'lucide-react'

interface Props {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  count?: number
}

export default function StarRating({ rating, max = 5, size = 'md', showNumber = false, count }: Props) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const fill = i < Math.floor(rating) ? 1 : i < rating ? rating - Math.floor(rating) : 0
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${s} text-gray-200`} fill="currentColor" />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${s} text-gold-500`} fill="currentColor" />
              </span>
            )}
          </span>
        )
      })}
      {showNumber && (
        <span className="text-sm font-semibold text-gray-900 ml-1">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-500">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
