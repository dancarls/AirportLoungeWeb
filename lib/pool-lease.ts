/**
 * Tracks in-flight queries on one shared Postgres client.
 *
 * `begin()` increments the count and returns a function that must run when
 * that query settles. The idle callback is only invoked from `schedule`, and
 * only when the count is still zero at that moment. A query that is still
 * running therefore keeps the client open even if an earlier request already
 * queued a close.
 */
export function createIdleCloser(
  onIdle: () => void | Promise<void>,
  schedule: (run: () => void | Promise<void>) => void | Promise<void>,
) {
  let active = 0

  return {
    get size() {
      return active
    },
    begin() {
      active += 1
      let settled = false
      return () => {
        if (settled) return
        settled = true
        active -= 1
        if (active < 0) active = 0
        if (active === 0) {
          return schedule(() => {
            if (active === 0) return onIdle()
          })
        }
      }
    },
  }
}
