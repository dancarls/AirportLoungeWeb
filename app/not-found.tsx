import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This page could not be found. Browse all Canadian airport lounges at AirportLounges.ca.',
}

export default function NotFound() {
  return (
    <div className="bg-bone-white min-h-[80vh] flex items-center justify-center px-gutter">
      <div className="text-center max-w-lg">

        {/* Large 404 */}
        <div className="relative mb-8">
          <span className="font-display-lg text-[120px] md:text-[160px] leading-none text-primary/8 select-none block">
            404
          </span>
          <span
            className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary"
            style={{ fontSize: '64px' }}
          >
            flight_takeoff
          </span>
        </div>

        <span className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest block mb-3">
          Gate Not Found
        </span>

        <h1 className="font-display-lg text-[32px] md:text-[42px] text-primary leading-tight mb-4">
          Looks like this runway doesn&apos;t exist.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for has either moved or never existed.
          Let&apos;s get you back to your departure gate.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-primary text-white font-label-caps text-[11px] uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/lounges"
            className="fine-border bg-white text-primary font-label-caps text-[11px] uppercase tracking-widest px-8 py-4 hover:bg-champagne-glint transition-colors"
          >
            Browse Lounges
          </Link>
          <Link
            href="/airports"
            className="text-primary font-label-caps text-[11px] uppercase tracking-widest hover:underline"
          >
            All Airports →
          </Link>
        </div>

      </div>
    </div>
  )
}
