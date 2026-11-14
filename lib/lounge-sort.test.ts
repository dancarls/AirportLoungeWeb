import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compareAlternatives, compareRatingThenName } from './lounge-sort.ts'

test('equal ratings sort by name then slug', () => {
  const rows = [
    { rating: 4.5, name: 'Plaza Premium Domestic', slug: 'pp-domestic' },
    { rating: 4.5, name: 'Plaza Premium International', slug: 'pp-intl' },
    { rating: 4.8, name: 'Maple Leaf', slug: 'mll' },
  ]
  const sorted = [...rows].sort(compareRatingThenName)
  assert.deepEqual(sorted.map(r => r.slug), ['mll', 'pp-domestic', 'pp-intl'])
})

test('null ratings tie-break by name and do not reorder between sorts', () => {
  const rows = [
    { rating: null, name: 'Zebra Lounge', slug: 'z' },
    { rating: null, name: 'Alpha Lounge', slug: 'a' },
    { rating: null, name: 'Alpha Lounge', slug: 'b' },
  ]
  const once = [...rows].sort(compareRatingThenName).map(r => r.slug)
  const twice = [...rows].reverse().sort(compareRatingThenName).map(r => r.slug)
  assert.deepEqual(once, ['a', 'b', 'z'])
  assert.deepEqual(twice, once)
})

test('closure alternatives prefer shared access, then name', () => {
  const rows = [
    { score: 1, name: 'National Bank', slug: 'nb' },
    { score: 2, name: 'Aspire', slug: 'aspire' },
    { score: 1, name: 'Air France', slug: 'af' },
  ]
  const sorted = [...rows].sort(compareAlternatives).map(r => r.slug)
  assert.deepEqual(sorted, ['aspire', 'af', 'nb'])
})
