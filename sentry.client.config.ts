import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    ignoreErrors: [
      // Browser / extension noise we don't want to log
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      // MetaMask injection
      /MetaMask/i,
      /chrome-extension/i,
      // React hydration NotFoundError — false-positives from browser extensions
      // (Google Translate, Grammarly, LastPass, ad blockers) that mutate the DOM
      // between SSR and hydration. The extension's fingerprint is gone by the
      // time the reconciler throws, so these can't be filtered by frame origin.
      // The site works fine for the affected user on refresh.
      'The object can not be found here',
      /NotFoundError:.*Node/i,
      "Failed to execute 'removeChild' on 'Node'",
      "Failed to execute 'insertBefore' on 'Node'",
      // React minified errors #418 / #423 — hydration mismatches, same cause
      /Minified React error #418/,
      /Minified React error #423/,
      /Minified React error #425/,
      // Next.js internal control-flow exceptions that are not actual errors
      'NEXT_NOT_FOUND',
      'NEXT_REDIRECT',
    ],
    beforeSend(event) {
      // Drop events from unsupported third-party origins
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        f => f.filename?.includes('chrome-extension://')
      )) return null
      return event
    },
  })
}
