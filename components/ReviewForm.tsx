'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

const VISIT_TYPES = [
  { value: 'business_travel',   label: 'Business Travel' },
  { value: 'leisure_travel',    label: 'Leisure Travel' },
  { value: 'layover',           label: 'Layover' },
  { value: 'day_pass',          label: 'Day Pass' },
  { value: 'first_class',       label: 'First Class' },
  { value: 'credit_card_access',label: 'Credit Card Access' },
  { value: 'membership',        label: 'Membership' },
  { value: 'lounge_pass',       label: 'Lounge Pass' },
]

function StarPicker({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
          >
            <Star className={`w-6 h-6 transition-colors ${n <= (hovered || value) ? 'text-gold-500 fill-gold-500' : 'text-gray-200 fill-gray-200'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

interface Props { loungeId: string; onSuccess?: () => void }

export default function ReviewForm({ loungeId, onSuccess }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '', body: '', overall_rating: 0, food_rating: 0,
    cleanliness_rating: 0, staff_rating: 0, wifi_rating: 0,
    visit_date: '', visit_type: '', access_method: '',
    pros: '', cons: '', would_return: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, value: string | number | boolean) =>
    setForm(f => ({ ...f, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.overall_rating) { setError('Please add an overall rating.'); return }
    if (!form.visit_date)     { setError('Please add your visit date.'); return }

    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const payload = {
      lounge_id: loungeId,
      user_id: user.id,
      title: form.title,
      body: form.body,
      overall_rating: form.overall_rating,
      food_rating: form.food_rating || null,
      cleanliness_rating: form.cleanliness_rating || null,
      staff_rating: form.staff_rating || null,
      wifi_rating: form.wifi_rating || null,
      visit_date: form.visit_date,
      visit_type: form.visit_type || null,
      access_method: form.access_method || null,
      pros: form.pros || null,
      cons: form.cons || null,
      would_return: form.would_return,
    }

    const { error: err } = await supabase.from('reviews').upsert(payload, { onConflict: 'lounge_id,user_id' })
    setSubmitting(false)

    if (err) { setError(err.message); return }
    onSuccess?.()
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <StarPicker value={form.overall_rating} onChange={v => set('overall_rating', v)} label="Overall Rating *" />

      <div className="grid grid-cols-2 gap-4">
        <StarPicker value={form.food_rating}        onChange={v => set('food_rating', v)}        label="Food & Drink" />
        <StarPicker value={form.cleanliness_rating} onChange={v => set('cleanliness_rating', v)} label="Cleanliness" />
        <StarPicker value={form.staff_rating}       onChange={v => set('staff_rating', v)}       label="Staff" />
        <StarPicker value={form.wifi_rating}        onChange={v => set('wifi_rating', v)}        label="WiFi" />
      </div>

      <input className="input" placeholder="Review title" required value={form.title}
        onChange={e => set('title', e.target.value)} />

      <textarea className="input resize-none h-28" placeholder="Share your experience…" required value={form.body}
        onChange={e => set('body', e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Visit date *</label>
          <input type="date" className="input" required value={form.visit_date}
            onChange={e => set('visit_date', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Visit type</label>
          <select className="input" value={form.visit_type} onChange={e => set('visit_type', e.target.value)}>
            <option value="">Select…</option>
            {VISIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <input className="input" placeholder="How did you access? (e.g. Amex Platinum, Priority Pass)" value={form.access_method}
        onChange={e => set('access_method', e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <textarea className="input resize-none h-20" placeholder="Pros" value={form.pros}
          onChange={e => set('pros', e.target.value)} />
        <textarea className="input resize-none h-20" placeholder="Cons" value={form.cons}
          onChange={e => set('cons', e.target.value)} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.would_return} onChange={e => set('would_return', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-sm text-gray-700">I would return to this lounge</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
