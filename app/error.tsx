'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      try {
        // @ts-expect-error gtag is injected at runtime
        window.gtag('event', 'exception', {
          description: error.message ?? 'unknown',
          fatal: false,
        })
      } catch {}
    }
  }, [error])

  return (
    <div className="bg-bone-white min-h-[80vh] flex items-center justify-center px-gutter">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <span className="font-display-lg text-[120px] md:text-[160px] leading-none text-primary/8 select-none block">
            !
          </span>
          <span
            className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary"
            style={{ fontSize: '64px' }}
          >
            error
          </span>
        </div>

        <span className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest block mb-3">
          Turbulence Detected
        </span>

        <h1 className="font-display-lg text-[32px] md:text-[42px] text-primary leading-tight mb-4">
          Something didn&apos;t go to plan.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-sm mx-auto leading-relaxed">
          We hit an unexpected error loading this page. You can try again, or head back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-primary text-white font-label-caps text-[11px] uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="fine-border bg-white text-primary font-label-caps text-[11px] uppercase tracking-widest px-8 py-4 hover:bg-champagne-glint transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] text-secondary mt-8 font-mono">Ref: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
