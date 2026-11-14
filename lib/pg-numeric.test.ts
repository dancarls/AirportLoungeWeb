import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePgNumeric } from './pg-numeric.ts'

test('numeric text becomes a finite number', () => {
  assert.equal(parsePgNumeric('4.50'), 4.5)
  assert.equal(typeof parsePgNumeric('4.50'), 'number')
  assert.equal(parsePgNumeric('4.50').toFixed(1), '4.5')
})

test('coordinates and fees stay numbers', () => {
  assert.equal(parsePgNumeric('49.194538'), 49.194538)
  assert.equal(parsePgNumeric('-123.181280'), -123.18128)
  assert.equal(parsePgNumeric('45.00'), 45)
  assert.equal(parsePgNumeric('0'), 0)
  assert.equal(Number.isFinite(parsePgNumeric('-73.740799')), true)
})
