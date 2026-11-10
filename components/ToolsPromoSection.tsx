import Link from 'next/link'

/**
 * Home-page promo for the two interactive tools:
 *   - /tools/which-lounges-can-i-use (the matcher)
 *   - /tools/lounge-finder (the 3-step quiz)
 *
 * Positioned mid-scroll to catch returning readers and give new readers an
 * interactive hook before the content-heavy sections below.
 */
export default function ToolsPromoSection() {
  return (
    <section className="py-section-gap bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,#94d1d1_0%,transparent_60%)]" />
      <div className="relative max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-14">
          <span className="font-label-caps text-[11px] uppercase tracking-[0.2em] text-primary-fixed-dim block mb-3">
            Interactive tools
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl leading-tight mb-4">
            Don&apos;t guess. Know before you go.
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Two tools that answer the only questions that matter at an airport: which
            lounge can I walk into, and which card would get me into more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Matcher */}
          <Link
            href="/tools/which-lounges-can-i-use"
            className="group block bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold-500/50 p-8 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <span
                className="material-symbols-outlined text-gold-400"
                style={{ fontSize: '42px' }}
              >
                credit_card
              </span>
              <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary-fixed-dim">
                Tool · 1 min
              </span>
            </div>
            <h3 className="font-headline-md text-2xl md:text-3xl mb-3 group-hover:text-gold-400 transition-colors">
              Which lounges can I use?
            </h3>
            <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6">
              Pick the cards in your wallet. We&apos;ll show you every Canadian airport
              lounge you can walk into right now — grouped by airport, with the exact
              access rule for each one.
            </p>
            <span className="inline-flex items-center gap-2 text-gold-400 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold">
              Match my cards
              <span
                className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                style={{ fontSize: '16px' }}
              >
                arrow_forward
              </span>
            </span>
          </Link>

          {/* Quiz */}
          <Link
            href="/tools/lounge-finder"
            className="group block bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold-500/50 p-8 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <span
                className="material-symbols-outlined text-gold-400"
                style={{ fontSize: '42px' }}
              >
                flight_takeoff
              </span>
              <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary-fixed-dim">
                Quiz · 30 sec
              </span>
            </div>
            <h3 className="font-headline-md text-2xl md:text-3xl mb-3 group-hover:text-gold-400 transition-colors">
              Find my best lounge
            </h3>
            <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6">
              Three questions — airport, cards, status — and we recommend your top
              lounge at any Canadian airport, with the card that would unlock better
              options if you don&apos;t already have it.
            </p>
            <span className="inline-flex items-center gap-2 text-gold-400 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold">
              Start the quiz
              <span
                className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                style={{ fontSize: '16px' }}
              >
                arrow_forward
              </span>
            </span>
          </Link>
        </div>

        <p className="text-center text-xs text-white/50 mt-10 leading-relaxed">
          Free. No signup. Data from 55 Canadian lounges across 13 airports — verified by
          our editorial team.
        </p>
      </div>
    </section>
  )
}
