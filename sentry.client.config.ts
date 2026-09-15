import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Session Replay's DOM cloner recurses over the page structure. A handful
  // of blog posts here render very long, deeply nested HTML tables. On iOS
  // WebKit inside the Google Search in-app browser, that traversal overflows
  // the JS call stack (RangeError). Skip Replay on those specific pages.
  const REPLAY_SKIP_PATHS = ['/blog/canadian-airport-lounges-shower-access']
  const shouldReplay =
    typeof window === 'undefined' ||
    !REPLAY_SKIP_PATHS.includes(window.location.pathname)

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: shouldReplay ? 1.0 : 0,
    integrations: shouldReplay
      ? [Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })]
      : [],
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
      // Call-stack overflows fired from Sentry's own Session Replay traversal
      // on iOS WebKit in-app browsers (Google Search app, ChatGPT app). Not
      // actionable from app code; scope is narrowed above by REPLAY_SKIP_PATHS.
      'Maximum call stack size exceeded',
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
