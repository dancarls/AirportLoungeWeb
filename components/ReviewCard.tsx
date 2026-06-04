import { format, parseISO } from 'date-fns'
import { ThumbsUp, BadgeCheck } from 'lucide-react'
import StarRating from './StarRating'
import type { Review } from '@/lib/types'

const VISIT_TYPE_LABELS: Record<string, string> = {
  business_travel:   'Business Travel',
  leisure_travel:    'Leisure Travel',
  layover:           'Layover',
  day_pass:          'Day Pass',
  first_class:       'First Class',
  credit_card_access:'Credit Card Access',
  membership:        'Membership',
  lounge_pass:       'Lounge Pass',
}

interface Props { review: Review }

export default function ReviewCard({ review }: Props) {
  const initials = review.profile?.display_name
    ? review.profile.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AN'

  return (
    <div className="card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm text-gray-900">
                {review.profile?.display_name ?? 'Anonymous'}
              </span>
              {review.is_verified && (
                <BadgeCheck className="w-4 h-4 text-brand-500" aria-label="Verified review" />
              )}
            </div>
            <p className="text-xs text-gray-400">
              {format(parseISO(review.visit_date), 'MMMM yyyy')}
              {review.visit_type && ` · ${VISIT_TYPE_LABELS[review.visit_type] ?? review.visit_type}`}
            </p>
          </div>
        </div>
        <StarRating rating={review.overall_rating} size="sm" />
      </div>

      {/* Title & body */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
      </div>

      {/* Sub-ratings */}
      {(review.food_rating || review.cleanliness_rating || review.staff_rating || review.wifi_rating) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
          {review.food_rating        && <span className="flex items-center gap-2">Food & Drink <StarRating rating={review.food_rating}        size="sm" /></span>}
          {review.cleanliness_rating && <span className="flex items-center gap-2">Cleanliness  <StarRating rating={review.cleanliness_rating} size="sm" /></span>}
          {review.staff_rating       && <span className="flex items-center gap-2">Staff        <StarRating rating={review.staff_rating}       size="sm" /></span>}
          {review.wifi_rating        && <span className="flex items-center gap-2">WiFi         <StarRating rating={review.wifi_rating}        size="sm" /></span>}
        </div>
      )}

      {/* Pros / Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {review.pros && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">Pros</p>
              <p className="text-xs text-green-800">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Cons</p>
              <p className="text-xs text-red-800">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-xs text-gray-400">
        {review.access_method && <span>Access: <span className="text-gray-600">{review.access_method}</span></span>}
        <span className={`ml-auto font-medium ${review.would_return ? 'text-green-600' : 'text-red-500'}`}>
          {review.would_return ? '✓ Would return' : '✗ Would not return'}
        </span>
      </div>
    </div>
  )
}
