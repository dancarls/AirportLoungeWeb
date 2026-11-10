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

interface Props {
  lounges: MatchableLounge[]
}

export default function LoungeMatcherClient({ lounges }: Props) {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])

  const toggleCard = (slug: string) =>
    setSelectedCards((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  const toggleStatus = (slug: string) =>
    setSelectedStatus((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )

  const userKeys = useMemo(
    () => aggregateAccessKeys(selectedCards, selectedStatus),
    [selectedCards, selectedStatus],
  )

  const matched = useMemo(() => {
    if (userKeys.size === 0) return [] as { lounge: MatchableLounge; via: string }[]
    const out: { lounge: MatchableLounge; via: string }[] = []
    for (const l of lounges) {
      const via = matchLoungeToAccess(l, userKeys)
      if (via) out.push({ lounge: l, via })
    }
    return out
  }, [lounges, userKeys])

  const byAirport = useMemo(() => {
    const map: Record<string, { lounge: MatchableLounge; via: string }[]> = {}
    for (const m of matched) {
      map[m.lounge.iata] = map[m.lounge.iata] ?? []
      map[m.lounge.iata].push(m)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [matched])

  const hasSelection = selectedCards.length + selectedStatus.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
      {/* Input side */}
      <div className="lg:col-span-5 space-y-10">
        <section>
          <h2 className="font-headline-md text-2xl text-primary mb-4">
            1. Which cards do you carry?
          </h2>
          <p className="text-sm text-secondary mb-5">
            Tap every card in your wallet. Multiple is fine — many Canadians hold two or
            three.
          </p>
          <div className="space-y-2">
            {CARDS.map((card) => {
              const on = selectedCards.includes(card.slug)
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
        </section>

        <section>
          <h2 className="font-headline-md text-2xl text-primary mb-4">
            2. Any airline status?
          </h2>
          <p className="text-sm text-secondary mb-5">
            Optional. If you have elite status with an airline, your access expands.
          </p>
          <div className="space-y-2">
            {AIRLINE_STATUSES.map((s) => {
              const on = selectedStatus.includes(s.slug)
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
        </section>
      </div>

      {/* Results side */}
      <div className="lg:col-span-7">
        <div className="sticky top-6">
          <h2 className="font-headline-md text-2xl text-primary mb-4">Your access</h2>

          {!hasSelection && (
            <div className="bg-champagne-glint/60 border border-sand-dark/20 p-8 text-center">
              <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">
                flight_takeoff
              </span>
              <p className="text-on-surface-variant">
                Pick at least one card to see your lounges.
              </p>
            </div>
          )}

          {hasSelection && matched.length === 0 && (
            <div className="bg-champagne-glint/60 border border-sand-dark/20 p-8 text-center">
              <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">
                info
              </span>
              <p className="text-on-surface-variant mb-4">
                No lounges match your current setup. Most lounges in Canada need Priority
                Pass, a Maple Leaf Lounge card, or an airline status.
              </p>
              <a
                href={affiliate('finlywealth-lounge-access-cards')}
                target="_blank"
                rel={AFFILIATE_REL}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em]"
              >
                See lounge-access cards →
              </a>
            </div>
          )}

          {matched.length > 0 && (
            <>
              <div className="bg-primary text-white p-5 mb-6">
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed-dim mb-1">
                  You can access
                </p>
                <p className="text-3xl font-headline-md">
                  {matched.length} {matched.length === 1 ? 'lounge' : 'lounges'}
                </p>
                <p className="text-sm text-white/70 mt-1">
                  across {byAirport.length} Canadian {byAirport.length === 1 ? 'airport' : 'airports'}
                </p>
              </div>

              <div className="space-y-6">
                {byAirport.map(([iata, items]) => (
                  <div key={iata}>
                    <h3 className="font-label-caps text-[11px] uppercase tracking-widest text-sand-dark mb-3">
                      {iata} — {items.length} {items.length === 1 ? 'lounge' : 'lounges'}
                    </h3>
                    <div className="space-y-2">
                      {items.map(({ lounge, via }) => (
                        <Link
                          key={lounge.id}
                          href={`/airports/${iata}/lounges/${lounge.slug}`}
                          className="block bg-white border border-outline-variant/40 hover:border-primary/40 p-4 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-primary text-sm leading-tight">
                                {lounge.name}
                              </p>
                              {lounge.terminal && (
                                <p className="text-xs text-secondary mt-1">
                                  Terminal {lounge.terminal}
                                </p>
                              )}
                              <p className="text-xs text-on-surface-variant mt-2 leading-snug">
                                <span className="material-symbols-outlined align-middle text-gold-500 mr-1" style={{ fontSize: '14px' }}>
                                  verified
                                </span>
                                Access via: <span className="font-medium">{via}</span>
                              </p>
                            </div>
                            <span
                              className="material-symbols-outlined text-primary/50 shrink-0 mt-1"
                              style={{ fontSize: '18px' }}
                            >
                              arrow_forward
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-champagne-glint/60 border-l-4 border-gold-500 p-5">
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-sand-dark mb-2">
                  Unlock more
                </p>
                <p className="text-sm text-on-surface-variant mb-3">
                  Want access to lounges your current cards don&apos;t cover? See which
                  Canadian cards add Priority Pass, Maple Leaf, or Plaza Premium access.
                </p>
                <a
                  href={affiliate('finlywealth-lounge-access-cards')}
                  target="_blank"
                  rel={AFFILIATE_REL}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold"
                >
                  Compare lounge cards →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
