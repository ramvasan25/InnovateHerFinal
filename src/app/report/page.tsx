'use client'
import { inputBase, btnPrimary, btnDanger } from '@/lib/ui-classes'
import { useEffect, useState } from 'react'

interface VenueOption {
  _id: string
  name: string
  city: string
}

export default function ReportPage() {
  const [venues, setVenues] = useState<VenueOption[]>([])
  const [form, setForm] = useState({
    venueId: '',
    type: 'harassment',
    severity: 'medium',
    description: '',
    dateOfIncident: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/venues')
      .then((r) => r.json())
      .then((data: VenueOption[]) => setVenues(data))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.venueId) return
    setSubmitting(true)
    const res = await fetch(`/api/venues/${form.venueId}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: form.type,
        severity: form.severity,
        description: form.description,
        dateOfIncident: form.dateOfIncident,
      }),
    })
    if (res.ok) {
      setSubmitted(true)
      setForm({ venueId: '', type: 'harassment', severity: 'medium', description: '', dateOfIncident: new Date().toISOString().split('T')[0] })
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="glass-card rounded-2xl border-2 border-success/50 bg-success-bg p-8">
          <div className="text-4xl">✓</div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Report Submitted</h2>
          <p className="mt-2 text-slate-600">
            Your anonymous report has been recorded. Thank you for helping keep the community safe.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className={`mt-4 ${btnPrimary}`}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report an Incident</h1>
        <p className="mt-2 text-slate-600">
          Your report is completely anonymous. Help other artists stay safe at art spaces.
        </p>
      </div>

      <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Venue</label>
          <select
            value={form.venueId}
            onChange={(e) => setForm({ ...form, venueId: e.target.value })}
            required
            className={`mt-1 ${inputBase}`}
          >
            <option value="">Select a venue...</option>
            {venues.map((v) => (
              <option key={v._id} value={v._id}>{v.name} — {v.city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Incident Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={`mt-1 ${inputBase}`}
          >
            <option value="harassment">Harassment</option>
            <option value="unsafe_conditions">Unsafe Conditions</option>
            <option value="nonpayment">Non-Payment</option>
            <option value="discrimination">Discrimination</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Severity</label>
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className={`mt-1 ${inputBase}`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Date of Incident</label>
          <input
            type="date"
            value={form.dateOfIncident}
            onChange={(e) => setForm({ ...form, dateOfIncident: e.target.value })}
            className={`mt-1 ${inputBase}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={2000}
            rows={5}
            required
            minLength={10}
            placeholder="Describe what happened. Be as specific as you feel comfortable with."
            className={`mt-1 ${inputBase}`}
          />
        </div>

        <button type="submit" disabled={submitting || !form.venueId} className={btnDanger}>
          {submitting ? 'Submitting...' : 'Submit Anonymous Report'}
        </button>
      </form>
    </div>
  )
}
