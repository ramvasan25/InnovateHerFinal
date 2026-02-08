'use client'
import { inputBase, btnPrimary, btnDanger } from '@/lib/ui-classes'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Venue {
  _id: string; name: string; address: string; city: string; category: string
  avgSafety: number; avgFairPay: number; avgRespect: number; totalRatings: number; totalIncidents: number
}
interface Rating {
  _id: string; safety: number; fairPay: number; respect: number; comment: string; createdAt: string
}
interface Incident {
  _id: string; type: string; severity: string; description: string; dateOfIncident: string; createdAt: string
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-primary">{value > 0 ? value.toFixed(1) : '—'}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const severityColor: Record<string, string> = {
  low: 'bg-warning-bg text-warning',
  medium: 'bg-warning-bg text-warning',
  high: 'bg-danger-bg text-danger',
  critical: 'bg-danger-bg text-danger font-bold',
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [tab, setTab] = useState<'ratings' | 'incidents' | 'rate' | 'report'>('ratings')
  const [form, setForm] = useState({ safety: 5, fairPay: 5, respect: 5, comment: '' })
  const [reportForm, setReportForm] = useState({ type: 'harassment' as string, severity: 'medium' as string, description: '', dateOfIncident: new Date().toISOString().split('T')[0] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/venues/${id}`).then((r) => r.json()).then(setVenue)
    fetch(`/api/venues/${id}/ratings`).then((r) => r.json()).then(setRatings)
    fetch(`/api/venues/${id}/incidents`).then((r) => r.json()).then(setIncidents)
  }, [id])

  async function submitRating(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch(`/api/venues/${id}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const [v, r] = await Promise.all([
      fetch(`/api/venues/${id}`).then((res) => res.json()),
      fetch(`/api/venues/${id}/ratings`).then((res) => res.json()),
    ])
    setVenue(v); setRatings(r)
    setForm({ safety: 5, fairPay: 5, respect: 5, comment: '' })
    setTab('ratings'); setSubmitting(false)
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch(`/api/venues/${id}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportForm),
    })
    const [v, i] = await Promise.all([
      fetch(`/api/venues/${id}`).then((res) => res.json()),
      fetch(`/api/venues/${id}/incidents`).then((res) => res.json()),
    ])
    setVenue(v); setIncidents(i)
    setReportForm({ type: 'harassment', severity: 'medium', description: '', dateOfIncident: new Date().toISOString().split('T')[0] })
    setTab('incidents'); setSubmitting(false)
  }

  if (!venue) return <p className="text-slate-500">Loading...</p>

  return (
    <div className="space-y-6">
      <Link
        href="/venues"
        className="inline-block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
      >
        ← Back to Art Map
      </Link>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
            <p className="text-slate-500">{venue.address}, {venue.city} · {venue.category}</p>
          </div>
          {venue.totalIncidents > 0 && (
            <span className="rounded-full bg-danger-bg px-3 py-1 text-sm font-medium text-danger">
              {venue.totalIncidents} incident{venue.totalIncidents > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-6">
          <Bar label="Safety" value={venue.avgSafety} />
          <Bar label="Fair Pay" value={venue.avgFairPay} />
          <Bar label="Respect" value={venue.avgRespect} />
        </div>
        <p className="mt-3 text-sm text-slate-400">{venue.totalRatings} rating{venue.totalRatings !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(['ratings', 'incidents', 'rate', 'report'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              tab === t
                ? 'border border-border border-b-0 bg-white/90 text-primary -mb-px'
                : 'text-slate-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {t === 'rate' ? '+ Rate' : t === 'report' ? '+ Report' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'ratings' && (
        <div className="space-y-3">
          {ratings.length === 0 ? (
            <p className="text-slate-500">No ratings yet. Be the first!</p>
          ) : ratings.map((r) => (
            <div key={r._id} className="glass-card rounded-xl p-4">
              <div className="flex gap-4 text-sm">
                <span>Safety: <strong>{r.safety}</strong></span>
                <span>Pay: <strong>{r.fairPay}</strong></span>
                <span>Respect: <strong>{r.respect}</strong></span>
              </div>
              {r.comment && <p className="mt-2 text-slate-600">{r.comment}</p>}
              <p className="mt-1 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'incidents' && (
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <p className="text-slate-500">No incidents reported.</p>
          ) : incidents.map((i) => (
            <div key={i._id} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs ${severityColor[i.severity] || ''}`}>{i.severity}</span>
                <span className="text-sm font-medium text-slate-700">{i.type.replace('_', ' ')}</span>
              </div>
              <p className="mt-2 text-slate-600">{i.description}</p>
              <p className="mt-1 text-xs text-slate-400">Incident date: {new Date(i.dateOfIncident).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'rate' && (
        <form onSubmit={submitRating} className="max-w-md space-y-4">
          {(['safety', 'fairPay', 'respect'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 capitalize">{field === 'fairPay' ? 'Fair Pay' : field}</label>
              <input
                type="range"
                min={1}
                max={5}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400"><span>1</span><span>{form[field]}</span><span>5</span></div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700">Comment (optional)</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              maxLength={500}
              rows={3}
              className={`mt-1 ${inputBase}`}
            />
          </div>
          <button type="submit" disabled={submitting} className={btnPrimary}>
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      )}

      {tab === 'report' && (
        <form onSubmit={submitReport} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Incident Type</label>
            <select
              value={reportForm.type}
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
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
              value={reportForm.severity}
              onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
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
              value={reportForm.dateOfIncident}
              onChange={(e) => setReportForm({ ...reportForm, dateOfIncident: e.target.value })}
              className={`mt-1 ${inputBase}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              maxLength={2000}
              rows={4}
              required
              placeholder="Describe what happened. Your report is completely anonymous."
              className={`mt-1 ${inputBase}`}
            />
          </div>
          <button type="submit" disabled={submitting} className={btnDanger}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      )}
    </div>
  )
}
