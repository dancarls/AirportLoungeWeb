import assert from 'node:assert/strict'
import { test } from 'node:test'
import { closureStatusCopy } from './closure-status.ts'

test('reduced_capacity names the temporary lounge and the main-lounge estimate', () => {
  const copy = closureStatusCopy('reduced_capacity', 'June 2028 (approximate)')
  assert.ok(copy)
  assert.equal(copy.badge, 'Reduced capacity')
  assert.equal(copy.label, 'Temporary lounge open · main lounge reopens June 2028 (approximate)')
  assert.equal(copy.scheduleApplies, true)
  assert.equal(copy.label.includes('Closed'), false)
})

test('reduced_capacity without an estimate stays on the short label', () => {
  const copy = closureStatusCopy('reduced_capacity', '  ')
  assert.equal(copy?.label, 'Reduced capacity')
  assert.equal(copy?.badge, 'Reduced capacity')
})

test('only the closed status says Closed', () => {
  const closed = closureStatusCopy('closed', 'early 2027')
  assert.equal(closed?.badge, 'Closed')
  assert.equal(closed?.label, 'Closed · reopens early 2027')

  const temporary = closureStatusCopy('temporary_closure', 'early 2027')
  assert.equal(temporary?.badge, 'Temporarily closed')
  assert.equal(temporary?.label, 'Temporarily closed · reopens early 2027')
  assert.equal(temporary?.label.startsWith('Closed'), false)

  const permanent = closureStatusCopy('permanent_closure', 'never')
  assert.equal(permanent?.badge, 'Permanently closed')
  assert.equal(permanent?.label, 'Permanently closed')
  assert.equal(permanent?.scheduleApplies, false)
})

test('open and empty statuses do not invent a closure label', () => {
  assert.equal(closureStatusCopy('open', 'June 2028'), null)
  assert.equal(closureStatusCopy(null, null), null)
  assert.equal(closureStatusCopy(undefined, undefined), null)
})
