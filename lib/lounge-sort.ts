export interface RatedLounge {
  rating: number | null
  name: string
  slug?: string
}

/**
 * Stable lounge order for ties and null ratings.
 * Null is treated as 0 so a missing rating sorts with an explicit zero,
 * matching the in-memory featured-lounge sort that production already used.
 * Name, then slug, breaks remaining ties so equal ratings do not follow
 * heap order.
 */
export function compareRatingThenName(a: RatedLounge, b: RatedLounge): number {
  const byRating = (b.rating ?? 0) - (a.rating ?? 0)
  if (byRating !== 0) return byRating
  const byName = a.name.localeCompare(b.name)
  if (byName !== 0) return byName
  return (a.slug ?? '').localeCompare(b.slug ?? '')
}

export interface ScoredAlternative {
  score: number
  name: string
  slug: string
}

/** Highest shared-access score first; name then slug when scores tie. */
export function compareAlternatives(a: ScoredAlternative, b: ScoredAlternative): number {
  if (b.score !== a.score) return b.score - a.score
  const byName = a.name.localeCompare(b.name)
  if (byName !== 0) return byName
  return a.slug.localeCompare(b.slug)
}
