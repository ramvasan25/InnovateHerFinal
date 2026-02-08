'use client'
import { useRole } from '@/context/role'
import Link from 'next/link'

export function ArtistOnly({ children }: { children: React.ReactNode }) {
  const { role } = useRole()

  if (role !== 'artist') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="text-4xl">🔒</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Artist Only</h2>
        <p className="mt-2 text-slate-600">This feature is available to artists.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl border-2 border-primary bg-white/80 px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          ← Switch role on homepage
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
