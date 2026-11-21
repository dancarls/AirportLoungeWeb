/**
 * Closure-status copy. The live chip must follow `closure_status`. Only the
 * literal status `closed` is labelled "Closed". A reduced-capacity lounge is
 * still operating in a temporary space.
 */
export interface ClosureStatusCopy {
  /** Long label shown next to the status chip. */
  label: string
  /** Short badge. Distinct from `label` so a reduced-capacity lounge is not badged "Closed". */
  badge: string
  tone: 'open' | 'closed' | 'unknown'
  /** Weekly hours still apply — the temporary space is open. */
  scheduleApplies: boolean
}

export function closureStatusCopy(
  status: string | null | undefined,
  reopenEstimate: string | null | undefined,
): ClosureStatusCopy | null {
  if (!status || status === 'open') return null
  const estimate = reopenEstimate?.trim() || null

  switch (status) {
    case 'reduced_capacity':
      return {
        label: estimate
          ? `Temporary lounge open · main lounge reopens ${estimate}`
          : 'Reduced capacity',
        badge: 'Reduced capacity',
        tone: 'closed',
        scheduleApplies: true,
      }
    case 'temporary_closure':
      return {
        label: estimate ? `Temporarily closed · reopens ${estimate}` : 'Temporarily closed',
        badge: 'Temporarily closed',
        tone: 'closed',
        scheduleApplies: false,
      }
    case 'permanent_closure':
      return {
        label: 'Permanently closed',
        badge: 'Permanently closed',
        tone: 'closed',
        scheduleApplies: false,
      }
    case 'closed':
      return {
        label: estimate ? `Closed · reopens ${estimate}` : 'Closed',
        badge: 'Closed',
        tone: 'closed',
        scheduleApplies: false,
      }
    default:
      return {
        label: estimate ? `${status} · reopens ${estimate}` : status,
        badge: status,
        tone: 'closed',
        scheduleApplies: false,
      }
  }
}
