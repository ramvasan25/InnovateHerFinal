'use client'
import { inputBase, btnPrimary } from '@/lib/ui-classes'
import { useRole } from '@/context/role'
import { useEffect, useState } from 'react'

interface ArtPost {
  _id: string
  title: string
  artistName: string
  description: string
  story: string
  medium: string
  imageUrl: string
  price: string
  negotiable: boolean
  createdAt: string
}

const mediums = ['all', 'digital', 'painting', 'pottery', 'sculpture', 'graffiti', 'photography', 'textile', 'mixed_media', 'other'] as const
const mediumLabels: Record<string, string> = {
  digital: 'Digital Art', painting: 'Painting', pottery: 'Pottery', sculpture: 'Sculpture',
  graffiti: 'Graffiti', photography: 'Photography', textile: 'Textile', mixed_media: 'Mixed Media', other: 'Other',
}
const mediumColors: Record<string, string> = {
  digital: 'bg-violet-100 text-violet-700', painting: 'bg-info-bg text-info',
  pottery: 'bg-amber-100 text-amber-700', sculpture: 'bg-info-bg text-info',
  graffiti: 'bg-pink-100 text-pink-700', photography: 'bg-slate-100 text-slate-700',
  textile: 'bg-rose-100 text-rose-700', mixed_media: 'bg-info-bg text-info',
  other: 'bg-gray-100 text-gray-700',
}
const placeholderColors = [
  'from-violet-200 to-pink-200', 'from-purple-200 to-violet-200', 'from-amber-200 to-orange-200',
  'from-purple-200 to-pink-200', 'from-orange-200 to-amber-200', 'from-violet-200 to-purple-200',
]

export default function GalleryPage() {
  const { role } = useRole()
  const isArtist = role === 'artist'
  const [posts, setPosts] = useState<ArtPost[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', artistName: '', description: '', story: '', medium: 'other',
    imageUrl: '', price: '', negotiable: false,
  })
  const [aiPricing, setAiPricing] = useState(false)
  const [aiResult, setAiResult] = useState<{ suggested?: string; reasoning?: string } | null>(null)

  async function suggestPrice() {
    if (!form.title || !form.description || form.description.length < 10) return
    setAiPricing(true)
    setAiResult(null)
    try {
      const res = await fetch('/api/ai/price-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, medium: form.medium, description: form.description }),
      })
      const data = await res.json()
      if (data.error) {
        setAiResult({ reasoning: data.error })
      } else {
        setAiResult(data)
        if (data.suggested) setForm((f) => ({ ...f, price: data.suggested }))
      }
    } catch {
      setAiResult({ reasoning: 'Could not reach AI pricing service.' })
    }
    setAiPricing(false)
  }

  function loadPosts(medium: string, q: string) {
    setLoading(true)
    const params = new URLSearchParams()
    if (medium !== 'all') params.set('medium', medium)
    if (q) params.set('q', q)
    fetch(`/api/opportunities?${params}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(() => loadPosts(filter, search), 300)
    return () => clearTimeout(timeout)
  }, [filter, search])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ title: '', artistName: '', description: '', story: '', medium: 'other', imageUrl: '', price: '', negotiable: false })
    setShowForm(false)
    loadPosts(filter, search)
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-slate-600">Discover art from the community. Every piece tells a story.</p>
        </div>
        {isArtist && (
          <button onClick={() => setShowForm(!showForm)} className={btnPrimary}>
            {showForm ? 'Cancel' : '+ Post Art'}
          </button>
        )}
      </div>

      {showForm && isArtist && (
        <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900">Post Your Art</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title of Work *</label>
              <input type="text" required maxLength={200} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Sunset Over Clay"
                className={`mt-1 ${inputBase}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Artist Name *</label>
              <input type="text" required maxLength={100} value={form.artistName}
                onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                placeholder="Your name or alias"
                className={`mt-1 ${inputBase}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medium *</label>
              <select value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })}
                className={`mt-1 ${inputBase}`}>
                {mediums.filter((t) => t !== 'all').map((t) => (
                  <option key={t} value={t}>{mediumLabels[t] || t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL *</label>
              <input type="url" required value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/my-art.jpg"
                className={`mt-1 ${inputBase}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="mt-1 flex gap-2">
                <input type="text" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. $200 or Not for sale"
                  className={`w-full ${inputBase}`} />
                <button type="button" onClick={suggestPrice}
                  disabled={aiPricing || !form.title || !form.description || form.description.length < 10}
                  className="shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                  title="AI will suggest a fair price based on your art details">
                  {aiPricing ? 'Thinking...' : 'AI Price'}
                </button>
              </div>
              {aiResult && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {aiResult.reasoning}
                </p>
              )}
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={form.negotiable}
                  onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 accent-primary" />
                Open to negotiation
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea required minLength={10} maxLength={2000} rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about this piece — materials, dimensions, inspiration..."
              className={`mt-1 ${inputBase}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Story Behind the Art <span className="text-gray-400">(optional)</span></label>
            <textarea maxLength={3000} rows={4} value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              placeholder="Share the story behind this piece — what inspired you, the process, what it means to you..."
              className={`mt-1 ${inputBase}`} />
          </div>
          <button type="submit" disabled={submitting}
            className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50">
            {submitting ? 'Posting...' : 'Post to Gallery'}
          </button>
        </form>
      )}

      {/* Search & Filters */}
      <input type="text" placeholder="Search artwork..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className={inputBase} />

      <div className="flex flex-wrap gap-2">
        {mediums.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${filter === t ? 'bg-primary text-white' : 'bg-surface text-slate-600 hover:bg-border/50'}`}>
            {t === 'all' ? 'All' : (mediumLabels[t] || t)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <p className="text-slate-500">Loading gallery...</p>
      ) : posts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-5xl">🎨</div>
          <p className="mt-3 text-slate-500">No artwork posted yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <div key={post._id} className="glass-card group overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              {/* Image */}
              {post.imageUrl ? (
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={post.imageUrl} alt={post.title}
                    className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
              ) : (
                <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${placeholderColors[i % placeholderColors.length]}`}>
                  <span className="text-6xl opacity-40">
                    {post.medium === 'pottery' ? '🏺' : post.medium === 'graffiti' ? '🎨' : post.medium === 'photography' ? '📷' : post.medium === 'sculpture' ? '🗿' : post.medium === 'textile' ? '🧵' : post.medium === 'digital' ? '💻' : '🖼️'}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
                <p className="mt-0.5 text-sm text-gray-500">by {post.artistName}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${mediumColors[post.medium] || 'bg-gray-100 text-gray-700'}`}>
                    {mediumLabels[post.medium] || post.medium}
                  </span>
                  {post.price && post.price !== 'Not for sale' && (
                    <span className="rounded-full bg-success-bg px-2 py-0.5 text-xs font-medium text-success">
                      {post.price}
                    </span>
                  )}
                  {post.negotiable && (
                    <span className="rounded-full bg-info-bg px-2 py-0.5 text-xs font-medium text-info">
                      Open to offers
                    </span>
                  )}
                  {post.price === 'Not for sale' && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      Not for sale
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.description}</p>

                {post.story && (
                  <div className="mt-3">
                    <button onClick={() => setExpanded(expanded === post._id ? null : post._id)}
                      className="text-sm font-medium text-primary hover:underline">
                      {expanded === post._id ? 'Hide story' : 'Read the story behind this piece →'}
                    </button>
                    {expanded === post._id && (
                      <div className="mt-2 rounded-xl bg-surface p-3">
                        <p className="whitespace-pre-line text-sm text-gray-700">{post.story}</p>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
