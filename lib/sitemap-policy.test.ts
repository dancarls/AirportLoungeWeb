import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sitemapDbFailureMode } from './sitemap-policy.ts'

test('production requests do not publish a partial sitemap', () => {
  assert.equal(sitemapDbFailureMode({ nodeEnv: 'production' }), 'throw')
})

test('the production build phase may fall back instead of failing the compile', () => {
  assert.equal(
    sitemapDbFailureMode({ nodeEnv: 'production', nextPhase: 'phase-production-build' }),
    'static-fallback',
  )
})

test('local development falls back', () => {
  assert.equal(sitemapDbFailureMode({ nodeEnv: 'development' }), 'static-fallback')
})
