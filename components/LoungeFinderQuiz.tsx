'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CARDS,
  AIRLINE_STATUSES,
  aggregateAccessKeys,
  matchLoungeToAccess,
  type MatchableLounge,
} from '@/lib/card-access'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

type QuizLounge = MatchableLounge & {
  rating: number | null
  reviewCount: number | null
}

interface Airport {
  iata: string
  name: string
  city: string
}

interface Props {
  lounges: QuizLounge[]
  airports: Airport[]
}

type Step = 1 | 2 | 3 | 'result'

export default function LoungeFinderQuiz({ lounges, airports }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [airport, setAirport] = useState<string | null>(null)
  const [cards, setCards] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])

  const userKeys = useMemo(() => aggregateAccessKeys(cards, status), [cards, status])

  const airportLounges = useMemo(
    () => (airport ? lounges.filter((l) => l.iata === airport) : []),
    [lounges, airport],
  )

  const results = useMemo(() => {
    if (!airport) return { accessible: [], locked: [] }
    const accessible: { lounge: QuizLounge; via: string }[] = []
    const locked: QuizLounge[] = []
    for (const l of airportLounges) {
      if (userKeys.size === 0) {
        locked.push(l)
        continue
      }
      const via = matchLoungeToAccess(l, userKeys)
      if (via) accessible.push({ lounge: l, via })
      else locked.push(l)
    }
    accessible.sort((a, b) =>
      (b.lounge.rating ?? 0) - (a.lounge.rating ?? 0) ||
      a.lounge.name.localeCompare(b.lounge.name) ||
      a.lounge.slug.localeCompare(b.lounge.slug)
    )
    locked.sort((a, b) =>
      (b.rating ?? 0) - (a.rating ?? 0) ||
      a.name.localeCompare(b.name) ||
      a.slug.localeCompare(b.slug)
    )
    return { accessible, locked }
  }, [airport, airportLounges, userKeys])

  const canGoNext =
    (step === 1 && airport) ||
    (step === 2) ||
    (step === 3)

  const toggleCard = (slug: string) =>
    setCards((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  const toggleStatus = (slug: string) =>
    setStatus((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))

  const reset = () => {
    setStep(1)
    setAirport(null)
    setCards([])
    setStatus([])
  }

  return (
    <div className="mt-6">
      {/* Progress */}
      {step !== 'result' && (
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-colors ${
                n <= step ? 'bg-primary' : 'bg-outline-variant/40'
              }`}
            />
          ))}
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-sand-dark ml-3 whitespace-nowrap">
            {step} of 3
          </span>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-headline-lg text-3xl text-primary mb-2">
            Which airport are you flying from?
          </h2>
          <p className="text-secondary mb-8">Pick the Canadian airport you need a lounge at.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {airports.map((a) => (
              <button
                key={a.iata}
                type="button"
                onClick={() => setAirport(a.iata)}
                className={`text-left p-5 border transition-colors ${
                  airport === a.iata
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <p className={`font-headline-md text-xl ${airport === a.iata ? 'text-white' : 'text-primary'}`}>
                  {a.iata}
                </p>
                <p className={`text-xs mt-1 ${airport === a.iata ? 'text-white/70' : 'text-secondary'}`}>
                  {a.city}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-headline-lg text-3xl text-primary mb-2">
            Which cards do you carry?
          </h2>
          <p className="text-secondary mb-8">
            Tap every card in your wallet. Skip if you don&apos;t carry any premium cards.
          </p>
          <div className="space-y-2">
            {CARDS.map((card) => {
              const on = cards.includes(card.slug)
              return (
                <button
                  key={card.slug}
                  type="button"
                  onClick={() => toggleCard(card.slug)}
                  className={`w-full text-left p-4 border transition-colors ${
                    on
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-outline-variant/40 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm leading-tight ${on ? 'text-white' : 'text-primary'}`}>
                        {card.name}
                      </p>
                      <p className={`text-xs mt-1 leading-snug ${on ? 'text-white/70' : 'text-secondary'}`}>
                        {card.blurb}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined shrink-0 ${on ? 'text-gold-400' : 'text-outline-variant'}`}
                      style={{ fontSize: '22px' }}
                    >
                      {on ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-headline-lg text-3xl text-primary mb-2">
            Any airline status?
          </h2>
          <p className="text-secondary mb-8">
            Optional. Skip if you don&apos;t have elite status.
          </p>
          <div className="space-y-2">
            {AIRLINE_STATUSES.map((s) => {
              const on = status.includes(s.slug)
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => toggleStatus(s.slug)}
                  className={`w-full text-left p-4 border transition-colors ${
                    on
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-outline-variant/40 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm leading-tight ${on ? 'text-white' : 'text-primary'}`}>
                        {s.name}
                      </p>
                      <p className={`text-xs mt-1 leading-snug ${on ? 'text-white/70' : 'text-secondary'}`}>
                        {s.blurb}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined shrink-0 ${on ? 'text-gold-400' : 'text-outline-variant'}`}
                      style={{ fontSize: '22px' }}
                    >
                      {on ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 'result' && airport && (
        <div>
          <p className="font-label-caps text-[10px] uppercase tracking-widest text-sand-dark mb-2">
            Your lounges at {airport}
          </p>
          <h2 className="font-headline-lg text-3xl text-primary mb-6">
            {results.accessible.length > 0
              ? `${results.accessible.length} ${results.accessible.length === 1 ? 'lounge is' : 'lounges are'} open to you`
              : "Here's what's at this airport"}
          </h2>

          {results.accessible.length > 0 && (
            <div className="space-y-3 mb-10">
              {results.accessible.slice(0, 2).map(({ lounge, via }, i) => (
                <Link
                  key={lounge.id}
                  href={`/airports/${lounge.iata}/lounges/${lounge.slug}`}
                  className="block bg-primary text-white p-6 hover:bg-primary-container transition-colors"
                >
                  {i === 0 && (
                    <span className="inline-block bg-gold-500 text-primary px-3 py-1 font-label-caps text-[9px] uppercase tracking-[0.1em] font-bold mb-3">
                      Top pick for you
                    </span>
                  )}
                  <h3 className="font-headline-md text-2xl mb-2">{lounge.name}</h3>
                  {lounge.terminal && (
                    <p className="text-sm text-white/70 mb-2">Terminal {lounge.terminal}</p>
                  )}
                  {lounge.rating && (
                    <p className="text-sm text-gold-400 mb-3">
                      ★ {lounge.rating.toFixed(1)}{' '}
                      {lounge.reviewCount && (
                        <span className="text-white/60">({lounge.reviewCount.toLocaleString()} reviews)</span>
                      )}
                    </p>
                  )}
                  <p className="text-sm text-white/85">
                    <span className="material-symbols-outlined align-middle text-gold-400 mr-1" style={{ fontSize: '16px' }}>
                      verified
                    </span>
                    You get in via: <span className="font-medium">{via}</span>
                  </p>
                </Link>
              ))}
              {results.accessible.length > 2 && (
                <Link
                  href={`/tools/which-lounges-can-i-use`}
                  className="block text-center text-primary text-sm underline underline-offset-4 py-2"
                >
                  See all {results.accessible.length} lounges you can access →
                </Link>
              )}
            </div>
          )}

          {results.locked.length > 0 && (
            <div className="mb-10">
              <h3 className="font-headline-md text-xl text-sand-dark mb-4">
                {results.accessible.length === 0 ? 'At this airport' : 'Could unlock with the right card'}
              </h3>
              <div className="space-y-2">
                {results.locked.slice(0, 3).map((lounge) => (
                  <Link
                    key={lounge.id}
                    href={`/airports/${lounge.iata}/lounges/${lounge.slug}`}
                    className="block bg-white border border-outline-variant/40 hover:border-primary/40 p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary text-sm">{lounge.name}</p>
                        {lounge.terminal && (
                          <p className="text-xs text-secondary mt-1">Terminal {lounge.terminal}</p>
                        )}
                      </div>
                      <span
                        className="material-symbols-outlined text-outline-variant shrink-0"
                        style={{ fontSize: '18px' }}
                      >
                        lock
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-champagne-glint/60 border-l-4 border-gold-500 p-6">
            <p className="font-label-caps text-[10px] uppercase tracking-widest text-sand-dark mb-2">
              Upgrade your access
            </p>
            <h3 className="font-headline-md text-xl text-primary mb-2">
              {results.accessible.length === 0
                ? 'The right card gets you into these lounges'
                : 'Want access to every lounge at this airport?'}
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              The best Canadian cards include Priority Pass, Maple Leaf Lounge access, or
              Plaza Premium — plus welcome bonuses worth up to $800 in travel value.
            </p>
            <a
              href={affiliate('finlywealth-lounge-access-cards')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold"
            >
              Compare lounge-access cards →
            </a>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-6 text-sm text-secondary underline underline-offset-4 hover:text-primary"
          >
            Start over
          </button>
        </div>
      )}

      {/* Nav */}
      {step !== 'result' && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => setStep((step === 3 ? 2 : step === 2 ? 1 : 1) as Step)}
            disabled={step === 1}
            className="text-sm text-secondary disabled:text-outline-variant hover:text-primary disabled:hover:text-outline-variant"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setStep((step === 1 ? 2 : step === 2 ? 3 : 'result') as Step)}
            disabled={!canGoNext}
            className="bg-primary text-white px-6 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold disabled:bg-outline-variant disabled:cursor-not-allowed hover:bg-primary-container"
          >
            {step === 3 ? 'See my lounge →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}
