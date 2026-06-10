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
