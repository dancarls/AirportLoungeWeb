/** Format a lounge rating for display. Postgres `numeric` can arrive as a string. */
export function formatRating(value: unknown, digits = 1): string | null {
  const n = typeof value === 'number' ? value : Number(value)
  return value == null || value === '' || !Number.isFinite(n) ? null : n.toFixed(digits)
}
