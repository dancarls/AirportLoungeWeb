import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createLeaseCounter } from './pool-lease.ts'
import { PG_POOL } from './pg-pool.ts'

test('pool stays inside the 30-connection app role under a 20-way burst', () => {
  assert.equal(PG_POOL.max, 1)
  assert.ok(PG_POOL.idleTimeoutSeconds > 0)
  assert.ok(PG_POOL.idleTimeoutSeconds <= 5)
  assert.ok(20 * PG_POOL.max < 30)
})

test('the last release closes the pool and a cancel does not', () => {
  const closed: number[] = []
  const leases = createLeaseCounter(() => closed.push(leases.size))
  const a = leases.acquire()
  const b = leases.acquire()
  a.cancel()
  assert.equal(closed.length, 0)
  assert.equal(leases.size, 1)
  b.release()
  assert.deepEqual(closed, [0])
  assert.equal(leases.size, 0)
})

test('a second release is ignored', () => {
  let closes = 0
  const leases = createLeaseCounter(() => { closes += 1 })
  const a = leases.acquire()
  a.release()
  a.release()
  assert.equal(closes, 1)
  assert.equal(leases.size, 0)
})
