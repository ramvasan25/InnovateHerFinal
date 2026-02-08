'use client'
import { useEffect, useState } from 'react'

interface Story {
  _id: string
  title: string
  body: string
  category: string
  upvotes: number
  createdAt: string
}

const categories = ['all', 'journey', 'inspiration', 'challenge', 'advice', 'general'] as const
const categoryLabels: Record<string, string> = {
  journey: 'My Journey',
  inspiration: 'Inspiration',
  challenge: 'Challenges',
  advice: 'Advice',
  general: 'General',
}
const categoryColors: Record<string, string> = {
  journey: 'bg-accent-light text-primary',
  inspiration: 'bg-warning-bg text-warning',
  challenge: 'bg-danger-bg text-danger',
  advice: 'bg-info-bg text-info',
  general: 'bg-surface text-slate-600',
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', category: 'general' })

  function loadStories(cat: string) {
    setLoading(true)
    const params = cat !== 'all' ? `?category=${cat}` : ''
    fetch(`/api/stories${params}`)
      .then((r) => r.json())
      .then(setStories)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadStories(filter) }, [filter])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setSubmitting(true)
    await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ title: '', body: '', category: 'general' })
    setShowForm(false)
    loadStories(filter)
    setSubmitting(false)
  }

  async function upvote(id: string) {
    await fetch(`/api/stories/${id}/upvote`, { method: 'POST' })
    setStories((prev) => prev.map((s) => s._id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Art Stories</h1>
          <p className="mt-1 text-slate-600">Anonymous stories from the creative community. Share your journey, inspire others.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          {showForm ? 'Cancel' : '+ Share Story'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="glass-card space-y-4 rounded-xl p-6">
          <p className="text-sm text-gray-500">Share your art story anonymously. Your identity stays hidden.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required maxLength={200} value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. How I Found My Style Through Pottery"
              className="mt-1 w-full rounded-xl border border-border bg-white/80 px-3 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white/80 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
                {categories.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Story</label>
            <textarea required minLength={10} maxLength={3000} rows={6} value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Tell your story... What inspired you? What challenges did you face? What advice would you give?"
              className="mt-1 w-full rounded-xl border border-border bg-white/80 px-3 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
            <p className="mt-1 text-xs text-gray-400">{3000 - form.body.length} characters remaining</p>
          </div>
          <button type="submit" disabled={submitting || !form.title.trim() || !form.body.trim()}
            className="rounded-xl bg-primary px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50">
            {submitting ? 'Posting...' : 'Share Anonymously'}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${filter === c ? 'bg-primary text-white' : 'bg-surface text-slate-600 hover:bg-border/50'}`}>
            {c === 'all' ? 'All' : categoryLabels[c]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading stories...</p>
      ) : stories.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-slate-500">No stories shared yet. Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story._id} className="glass-card rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{story.title}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[story.category] || ''}`}>
                      {categoryLabels[story.category] || story.category}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => upvote(story._id)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-slate-500 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  ▲ {story.upvotes}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-line text-gray-700">{story.body}</p>
              <p className="mt-3 text-xs text-gray-400">Shared anonymously</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
