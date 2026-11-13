/**
 * Tracks in-flight queries on one shared Postgres client.
 *
 * `begin()` increments the count and returns a function that must run when
 * that query settles. The idle callback is armed only when the count hits
 * zero, and a new `begin()` cancels a pending close. A query that is still
 * running therefore keeps the client open even if another request finishes
 * and tries to clean up.
 */
export function createIdleCloser(
  onIdle: () => void,
  schedule: (run: () => void) => () => void,
) {
  let active = 0
  let cancelPending: (() => void) | null = null

  function arm() {
    if (cancelPending) return
    cancelPending = schedule(() => {
      cancelPending = null
      if (active === 0) onIdle()
    })
  }

  return {
    get size() {
      return active
    },
    begin() {
      if (cancelPending) {
        cancelPending()
        cancelPending = null
      }
      active += 1
      let settled = false
      return () => {
        if (settled) return
        settled = true
        active -= 1
        if (active < 0) active = 0
        if (active === 0) arm()
      }
    },
  }
}
