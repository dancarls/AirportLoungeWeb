import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createIdleCloser } from './pool-lease.ts'
import { PG_POOL } from './pg-pool.ts'

test('pool stays inside the 30-connection app role under a 20-way burst', () => {
  assert.equal(PG_POOL.max, 1)
  assert.ok(PG_POOL.idleTimeoutSeconds > 0)
  assert.ok(PG_POOL.idleTimeoutSeconds <= 5)
  assert.ok(20 * PG_POOL.max < 30)
  assert.equal('idleCloseDelayMs' in PG_POOL, false)
})

/** Models `after()`: callbacks are queued and cannot be cancelled. */
function queueScheduler() {
  const queue: Array<() => void | Promise<void>> = []
  return {
    schedule(run: () => void | Promise<void>) {
      queue.push(run)
    },
    flush() {
      const batch = queue.splice(0, queue.length)
      for (const run of batch) run()
    },
  }
}

test('a queued close does not end the client while another query is in flight', () => {
  const clock = queueScheduler()
  const closed: number[] = []
  const gate = createIdleCloser(() => closed.push(gate.size), clock.schedule)
  const background = gate.begin()
  const request = gate.begin()
  request()
  clock.flush()
  assert.equal(closed.length, 0)
  assert.equal(gate.size, 1)
  background()
  assert.equal(closed.length, 0)
  clock.flush()
  assert.deepEqual(closed, [0])
})

test('a close queued before the next query still sees that query', () => {
  const clock = queueScheduler()
  let closes = 0
  const gate = createIdleCloser(() => { closes += 1 }, clock.schedule)
  const first = gate.begin()
  first()
  const second = gate.begin()
  clock.flush()
  assert.equal(closes, 0)
  assert.equal(gate.size, 1)
  second()
  clock.flush()
  assert.equal(closes, 1)
})

test('settling a query twice queues one close', () => {
  const clock = queueScheduler()
  let closes = 0
  const gate = createIdleCloser(() => { closes += 1 }, clock.schedule)
  const done = gate.begin()
  done()
  done()
  clock.flush()
  clock.flush()
  assert.equal(closes, 1)
  assert.equal(gate.size, 0)
})
