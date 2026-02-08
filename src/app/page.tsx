'use client'
import Link from 'next/link'
import { useRole } from '@/context/role'

const CARD_BASE = 'glass-card rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50'
const TAGLINE = 'A marketplace and community for women artists. By women artists.'

function RoleSelect() {
  const { setRole } = useRole()
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Her<span className="text-primary">Frame</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{TAGLINE}</p>
      </div>

      <p className="text-sm font-medium text-slate-500">I am a...</p>

      <div className="grid gap-6 md:grid-cols-2">
        <button
          onClick={() => setRole('community')}
          className={`${CARD_BASE} group text-left`}
        >
          <div className="mb-3 text-4xl">🖼️</div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            Art Lover
          </h2>
          <p className="mt-2 text-slate-600">
            Browse the gallery, discover new artists, and help keep art spaces safe.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-500">
            <li>• Browse the art gallery</li>
            <li>• Report incidents at art spaces</li>
          </ul>
        </button>

        <button
          onClick={() => setRole('artist')}
          className={`${CARD_BASE} group text-left`}
        >
          <div className="mb-3 text-4xl">🎨</div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            Artist
          </h2>
          <p className="mt-2 text-slate-600">
            Post your art, share your story, and connect with the community.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-500">
            <li>• Post art to the gallery</li>
            <li>• Share the story behind your work</li>
            <li>• Post and read whispers</li>
            <li>• Report incidents at art spaces</li>
          </ul>
        </button>
      </div>
    </div>
  )
}

function CommunityHome() {
  return (
    <div className="space-y-16">
      <section className="py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Her<span className="text-primary">Frame</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{TAGLINE}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/opportunities"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Browse Gallery
          </Link>
          <Link
            href="/report"
            className="rounded-xl border-2 border-danger bg-danger-bg px-6 py-3 font-semibold text-danger transition hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
          >
            Report an Incident
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className={CARD_BASE}>
          <div className="mb-3 text-3xl">🎨</div>
          <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
          <p className="mt-2 text-slate-600">
            Discover art from the community — digital art, pottery, graffiti, paintings, and more.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Explore gallery →
          </Link>
        </div>
        <div className={CARD_BASE}>
          <div className="mb-3 text-3xl">🚨</div>
          <h2 className="text-xl font-bold text-gray-900">Report Incidents</h2>
          <p className="mt-2 text-slate-600">
            Experienced harassment or unfair treatment at an art space? Report it anonymously to protect others.
          </p>
          <Link
            href="/report"
            className="mt-4 inline-block text-sm font-medium text-danger hover:underline focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 rounded"
          >
            File a report →
          </Link>
        </div>
      </section>
    </div>
  )
}

function ArtistHome() {
  return (
    <div className="space-y-16">
      <section className="py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Her<span className="text-primary">Frame</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{TAGLINE}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/opportunities"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Post Art
          </Link>
          <Link
            href="/whispers"
            className="rounded-xl border-2 border-primary bg-white/80 px-6 py-3 font-semibold text-primary transition hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Whispers
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className={CARD_BASE}>
          <div className="mb-3 text-3xl">🎨</div>
          <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
          <p className="mt-2 text-slate-600">
            Post your pottery, digital art, paintings, graffiti, and more. Share the story behind each piece.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Post your art →
          </Link>
        </div>
        <div className={CARD_BASE}>
          <div className="mb-3 text-3xl">💬</div>
          <h2 className="text-xl font-bold text-gray-900">Whispers</h2>
          <p className="mt-2 text-slate-600">
            Anonymous tips about pricing, techniques, supplies, and safety at art spaces.
          </p>
          <Link
            href="/whispers"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Read whispers →
          </Link>
        </div>
        <div className={CARD_BASE}>
          <div className="mb-3 text-3xl">🚨</div>
          <h2 className="text-xl font-bold text-gray-900">Report Incidents</h2>
          <p className="mt-2 text-slate-600">
            Experienced harassment or unfair treatment at an art space? Report it anonymously.
          </p>
          <Link
            href="/report"
            className="mt-4 inline-block text-sm font-medium text-danger hover:underline focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 rounded"
          >
            File a report →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { role } = useRole()
  if (!role) return <RoleSelect />
  if (role === 'artist') return <ArtistHome />
  return <CommunityHome />
}
