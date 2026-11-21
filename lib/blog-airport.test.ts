import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveBlogAirport } from './blog-airport.ts'

test('the YUL day-pass slug resolves to Montreal, not Vancouver', () => {
  const airport = resolveBlogAirport({ slug: 'yul-airport-lounge-day-pass' })
  assert.equal(airport?.iata, 'YUL')
  assert.equal(airport?.city, 'Montreal')
})

test('an explicit iata wins over a different code in the slug', () => {
  const airport = resolveBlogAirport({ iata: 'yyz', slug: 'yul-airport-lounge-day-pass' })
  assert.equal(airport?.iata, 'YYZ')
  assert.equal(airport?.city, 'Toronto')
})

test('an unknown explicit iata does not fall through to another city', () => {
  assert.equal(resolveBlogAirport({ iata: 'ZZZ', slug: 'yul-airport-lounge-day-pass' }), null)
})

test('no airport, or more than one, hides the widget', () => {
  assert.equal(resolveBlogAirport({ slug: 'priority-pass-lounges-canada' }), null)
  assert.equal(resolveBlogAirport({ slug: 'yul-and-yvr-lounge-comparison' }), null)
})

test('other day-pass slugs resolve to their own airport', () => {
  assert.equal(resolveBlogAirport({ slug: 'yyz-airport-lounge-day-pass' })?.iata, 'YYZ')
  assert.equal(resolveBlogAirport({ slug: 'yvr-airport-lounge-day-pass' })?.city, 'Vancouver')
  assert.equal(
    resolveBlogAirport({ slug: 'best-credit-card-montreal-yul-airport-lounge-access' })?.iata,
    'YUL',
  )
})
