'use client'

import { useState } from 'react'

const TIERS = [
  { value: 'basic',    label: 'Basic Listing — Free' },
  { value: 'enhanced', label: 'Enhanced Listing — $99 CAD / month' },
  { value: 'featured', label: 'Featured Lounge — $499 CAD / month' },
] as const

type Tier = typeof TIERS[number]['value']

interface Props {
  /** Pre-select a tier from the pricing table CTA. */
  defaultTier?: Tier
}

type State = 'idle' | 'submitting' | 'success' | 'error'

export default function OperatorApplyForm({ defaultTier = 'basic' }: Props) {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [tier, setTier] = useState<Tier>(defaultTier)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'submitting') return
    setState('submitting')
    setMessage(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      lounge_name: form.get('lounge_name'),
      airport_iata: form.get('airport_iata'),
      operator_company: form.get('operator_company'),
      contact_name: form.get('contact_name'),
      contact_email: form.get('contact_email'),
      contact_phone: form.get('contact_phone'),
      tier_requested: tier,
      message: form.get('message'),
      referrer_url: typeof window !== 'undefined' ? window.location.href : null,
    }

    try {
      const res = await fetch('/api/operator-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setState('success')
        setMessage('Thanks — we\'ll reach out within two business days from hello@airportlounges.ca.')
        ;(e.currentTarget as HTMLFormElement).reset()
      } else {
        const err = await res.json().catch(() => ({}))
        setState('error')
        setMessage((err && err.error) || 'Could not save that — please try again.')
      }
    } catch {
      setState('error')
      setMessage('Network hiccup — please try again.')
    }
  }

  const disabled = state === 'submitting' || state === 'success'

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Tier — visible pill selector so it's obvious what was requested */}
      <fieldset>
        <legend className="font-label-caps text-[10px] uppercase tracking-widest text-secondary mb-3">
          Listing Tier
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIERS.map(t => (
            <label
              key={t.value}
              className={`cursor-pointer border p-3 text-sm text-center transition-colors ${
                tier === t.value
                  ? 'border-primary bg-primary/5 text-primary font-semibold'
                  : 'border-outline-variant text-secondary hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name="tier_requested"
                value={t.value}
                checked={tier === t.value}
                onChange={() => setTier(t.value)}
                className="sr-only"
                disabled={disabled}
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="lounge_name"      label="Lounge Name *"           required disabled={disabled} placeholder="e.g. Plaza Premium Lounge (Domestic)" />
        <Field name="airport_iata"     label="Airport IATA Code *"     required disabled={disabled} placeholder="e.g. YYZ" maxLength={8} />
        <Field name="operator_company" label="Operator / Company *"    required disabled={disabled} placeholder="Legal operator name" />
        <Field name="contact_name"     label="Your Name *"             required disabled={disabled} />
        <Field name="contact_email"    label="Contact Email *"         required disabled={disabled} type="email" autoComplete="email" />
        <Field name="contact_phone"    label="Contact Phone (optional)" disabled={disabled} type="tel" autoComplete="tel" />
      </div>

      <div>
        <label htmlFor="op-message" className="block font-label-caps text-[10px] uppercase tracking-widest text-secondary mb-2">
          Anything we should know
        </label>
        <textarea
          id="op-message"
          name="message"
          rows={4}
          disabled={disabled}
          maxLength={4000}
          placeholder="Renovation dates, updated hours, promotional campaigns, seasonal changes, or anything else."
          className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full sm:w-auto bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : 'Submit Application'}
      </button>

      {message && (
        <p
          role={state === 'error' ? 'alert' : 'status'}
          className={`text-sm mt-2 ${state === 'error' ? 'text-red-700' : 'text-primary'}`}
        >
          {message}
        </p>
      )}

      <p className="text-xs text-secondary leading-relaxed">
        By submitting, you confirm you are authorized to claim or manage the listing on behalf of the lounge operator.
        We reply from <a href="mailto:hello@airportlounges.ca" className="underline underline-offset-2 hover:text-primary">hello@airportlounges.ca</a> within two business days.
      </p>
    </form>
  )
}

function Field(props: {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  type?: string
  placeholder?: string
  maxLength?: number
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={`op-${props.name}`} className="block font-label-caps text-[10px] uppercase tracking-widest text-secondary mb-2">
        {props.label}
      </label>
      <input
        id={`op-${props.name}`}
        name={props.name}
        type={props.type ?? 'text'}
        required={props.required}
        disabled={props.disabled}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete}
        className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
      />
    </div>
  )
}
