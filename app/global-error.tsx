'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { Sentry.captureException(error) }, [error])
  return (
    <html lang="en-CA">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#F5EFE6',
          color: '#003434',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>Something went very wrong.</h1>
          <p style={{ marginBottom: 24, lineHeight: 1.5 }}>
            We hit a critical error loading AirportLounges.ca. Please try again, or return to the home page.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                background: '#003434', color: '#fff', border: 0,
                padding: '14px 28px', fontSize: 12, letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: '#fff', color: '#003434',
                padding: '14px 28px', fontSize: 12, letterSpacing: 2,
                textTransform: 'uppercase', textDecoration: 'none',
                border: '1px solid #003434',
              }}
            >
              Home
            </a>
          </div>
          {error.digest && (
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 24, fontFamily: 'monospace' }}>
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
