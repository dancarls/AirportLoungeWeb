import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

function source(name: string): string {
  return readFileSync(new URL(`./${name}`, import.meta.url), 'utf8')
}

function sliceBetween(text: string, start: string, end: string): string {
  const from = text.indexOf(start)
  assert.ok(from >= 0, `missing ${start}`)
  const to = text.indexOf(end, from)
  assert.ok(to > from, `missing ${end}`)
  return text.slice(from, to)
}

test('the YUL day-pass article matches the lounge pages', () => {
  const blog = source('blog.ts')
  const article = sliceBetween(blog, "slug: 'yul-airport-lounge-day-pass'", "slug: 'yyz-airport-lounge-day-pass'")
  assert.match(article, /iata: 'YUL'/)
  assert.match(article, /Opened August 2025/)
  assert.match(article, /\$70 CAD/)
  assert.match(article, /8 free visits/)
  assert.match(article, /12 free visits/)
  assert.match(article, /Odyssey Gold Visa is 50% off/)
  assert.match(article, /1 August 2026/)
  assert.match(article, /expected in 2027/)
  assert.equal(article.includes('July 2025'), false)
  assert.equal(article.includes('$45'), false)
  assert.equal(article.includes('June 2028'), false)
  assert.equal(article.includes('late 2026'), false)
  assert.equal(article.includes('any Desjardins'), false)
})

test('no blog source still states the corrected claims', () => {
  for (const name of ['blog.ts', 'blog-fr.ts']) {
    const text = source(name)
    assert.equal(text.includes('July 2025') || text.includes('juillet 2025'), false, name)
    assert.equal(text.includes('June 2028') || text.includes('juin 2028'), false, name)
    assert.equal(text.includes('any Desjardins Odyssey card gets in free'), false, name)
  }
})
