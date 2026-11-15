import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatRating } from './format-rating.ts'

test('formatRating prints one decimal for numbers and numeric strings', () => {
  assert.equal(formatRating(4.5), '4.5')
  assert.equal(formatRating('4.50'), '4.5')
})

test('formatRating returns null for empty and non-numeric values', () => {
  assert.equal(formatRating(null), null)
  assert.equal(formatRating(undefined), null)
  assert.equal(formatRating(''), null)
  assert.equal(formatRating('abc'), null)
})
