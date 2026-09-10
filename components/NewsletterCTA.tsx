'use client'

import { useState } from 'react'

interface Props {
  /** Where this widget is rendered — recorded on the subscriber row for conversion analysis. */
  source: string
  /** Optional heading override. */
  heading?: string
  /** Optional subheading override. */
  subheading?: string
  /** Visual variant — "dark" for footer/hero, "light" for sidebars and blog. */
  variant?: 'dark' | 'light'
  /** Optional CTA label override. */
  buttonLabel?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate'

export default function NewsletterCTA({
  source,
  heading = 'Lounge intelligence, monthly.',
  subheading = 'Access-rule changes, new lounge openings, and Canadian card benefit shifts — no spam, unsubscribe any time.',
  variant = 'light',
  buttonLabel = 'Subscribe',
}: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || state === 'submitting') return
    setState('submitting')
    setMessage(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          referrer_url: typeof window !== 'undefined' ? window.location.href : null,
        }),
      })
      if (res.ok) {
        setState('success')
        setMessage("You're in — thanks. Check your inbox on the first of next month.")
        setEmail('')
      } else if (res.status === 409) {
        setState('duplicate')
        setMessage("You're already on the list — nothing more to do.")
      } else {
        setState('error')
        setMessage('Could not save that — please try again in a moment.')
      }
    } catch {
      setState('error')
      setMessage('Network hiccup — please try again.')
    }
  }

  const isDark = variant === 'dark'

  return (
    <div
      className={
        isDark
          ? 'bg-primary text-white p-6'
          : 'bg-champagne-glint/50 border border-outline-variant/30 p-6 rounded-xl'
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`material-symbols-outlined ${isDark ? 'text-primary-fixed' : 'text-primary'}`}
          style={{ fontSize: '20px' }}
        >
          mail
        </span>
        <span
          className={`font-label-caps text-[10px] uppercase tracking-widest ${
            isDark ? 'text-primary-fixed/80' : 'text-secondary'
          }`}
        >
          Newsletter
        </span>
      </div>
      <h4
        className={`font-headline-md text-headline-md mb-2 ${
          isDark ? 'text-primary-fixed' : 'text-primary'
        }`}
      >
        {heading}
      </h4>
      <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-bone-white/70' : 'text-secondary'}`}>
        {subheading}
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={state === 'submitting' || state === 'success' || state === 'duplicate'}
          className={
            isDark
              ? 'w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-sm focus:outline-none focus:border-primary-fixed transition-colors disabled:opacity-60'
              : 'w-full bg-white border border-outline-variant text-on-surface placeholder:text-secondary/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60'
          }
        />
        <button
          type="submit"
          disabled={state === 'submitting' || state === 'success' || state === 'duplicate'}
          className={
            isDark
              ? 'w-full bg-primary-fixed text-on-primary-fixed py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60'
              : 'w-full bg-primary text-white py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60'
          }
        >
          {state === 'submitting' ? 'Saving…' : buttonLabel}
        </button>
      </form>

      {message && (
        <p
          role={state === 'error' ? 'alert' : 'status'}
          className={`text-xs mt-3 leading-relaxed ${
            state === 'error'
              ? isDark ? 'text-red-200' : 'text-red-700'
              : isDark ? 'text-primary-fixed' : 'text-primary'
          }`}
        >
          {message}
        </p>
      )}

      <p className={`text-[10px] mt-3 leading-relaxed ${isDark ? 'text-white/40' : 'text-secondary/60'}`}>
        We never sell email addresses. See our{' '}
        <a href="/privacy" className="underline underline-offset-2 hover:opacity-80">privacy policy</a>.
      </p>
    </div>
  )
}
