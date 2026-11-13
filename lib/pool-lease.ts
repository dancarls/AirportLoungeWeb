/**
 * Counts in-flight uses of a shared pool inside one isolate.
 * `release` drops the count and runs `onIdle` when the last user finishes.
 * `cancel` drops the count without closing — used when there is no request
 * scope in which to defer the close (build scripts, `after()` unavailable).
 */
export function createLeaseCounter(onIdle: () => void) {
  let users = 0

  return {
    get size() {
      return users
    },
    acquire() {
      users += 1
      let settled = false
      const finish = (close: boolean) => {
        if (settled) return
        settled = true
        users -= 1
        if (close && users <= 0) {
          users = 0
          onIdle()
        }
      }
      return {
        release: () => finish(true),
        cancel: () => finish(false),
      }
    },
  }
}
