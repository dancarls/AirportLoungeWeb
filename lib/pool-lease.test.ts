import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createIdleCloser } from './pool-lease.ts'
import { PG_POOL } from './pg-pool.ts'

test('pool stays inside the 30-connection app role under a 20-way burst', () => {
  assert.equal(PG_POOL.max, 1)
  assert.ok(PG_POOL.idleTimeoutSeconds > 0)
  assert.ok(PG_POOL.idleTimeoutSeconds <= 5)
  assert.ok(20 * PG_POOL.max < 30)
})

function manualScheduler() {
  let pending: (() => void) | null = null
  return {
    schedule(run: () => void) {
      pending = run
      return () => {
        if (pending === run) pending = null
      }
    },
    flush() {
      const run = pending
      pending = null
      run?.()
    },
    get armed() {
      return pending !== null
    },
  }
}

test('the client is not closed while another query is still in flight', () => {
  const clock = manualScheduler()
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

test('a new query cancels a pending close', () => {
  const clock = manualScheduler()
  let closes = 0
  const gate = createIdleCloser(() => { closes += 1 }, clock.schedule)
  const first = gate.begin()
  first()
  assert.equal(clock.armed, true)
  const second = gate.begin()
  assert.equal(clock.armed, false)
  clock.flush()
  assert.equal(closes, 0)
  second()
  clock.flush()
  assert.equal(closes, 1)
})

test('settling a query twice does not close twice', () => {
  const clock = manualScheduler()
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
