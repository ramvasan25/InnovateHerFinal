'use client'
import { inputBase } from '@/lib/ui-classes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Venue {
  _id: string
  name: string
  city: string
  category: string
  avgSafety: number
  avgFairPay: number
  avgRespect: number
  totalRatings: number
  totalIncidents: number
}

const categoryLabels: Record<string, string> = {
  gallery: 'Gallery',
  studio: 'Studio',
  pottery_studio: 'Pottery Studio',
  graffiti_spot: 'Graffiti Spot',
  makerspace: 'Makerspace',
  outdoor: 'Outdoor',
  other: 'Other',
}

const categoryIcons: Record<string, string> = {
  gallery: '🏛️',
  studio: '🎨',
  pottery_studio: '🏺',
  graffiti_spot: '🖌️',
  makerspace: '🔧',
  outdoor: '🌳',
  other: '📍',
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="font-semibold text-primary">
      {value > 0 ? value.toFixed(1) : '—'}
      <span className="text-xs text-slate-400">/5</span>
    </span>
  )
}

export default function ArtMapPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      fetch(`/api/venues?${params}`)
        .then((r) => r.json())
        .then(setVenues)
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Art Map</h1>
        <p className="mt-1 text-slate-600">
          Discover and rate art spaces — galleries, studios, graffiti spots, and more.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search art spaces by name or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputBase}
      />

      {loading ? (
        <p className="text-slate-500">Loading art spaces...</p>
      ) : venues.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-slate-500">No art spaces found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <Link
              key={v._id}
              href={`/venues/${v._id}`}
              className="glass-card block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    <span className="mr-2">{categoryIcons[v.category] || '📍'}</span>
                    {v.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {v.city} · {categoryLabels[v.category] || v.category}
                  </p>
                </div>
                {v.totalIncidents > 0 && (
                  <span className="rounded-full bg-danger-bg px-2 py-0.5 text-xs font-medium text-danger">
                    {v.totalIncidents} incident{v.totalIncidents > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-slate-500">Safety</div>
                  <StarRating value={v.avgSafety} />
                </div>
                <div>
                  <div className="text-slate-500">Fair Pay</div>
                  <StarRating value={v.avgFairPay} />
                </div>
                <div>
                  <div className="text-slate-500">Respect</div>
                  <StarRating value={v.avgRespect} />
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-slate-400">
                {v.totalRatings} rating{v.totalRatings !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
