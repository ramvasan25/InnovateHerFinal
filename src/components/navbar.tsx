'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/context/role'

const communityLinks = [
  { href: '/opportunities', label: 'Gallery' },
  { href: '/report', label: 'Report' },
]

const artistLinks = [
  { href: '/opportunities', label: 'Gallery' },
  { href: '/whispers', label: 'Whispers' },
  { href: '/report', label: 'Report' },
]

export function Navbar() {
  const pathname = usePathname()
  const { role, clearRole } = useRole()

  if (!role) return null

  const links = role === 'artist' ? artistLinks : communityLinks

  return (
    <nav className="sticky top-0 z-10 border-b border-border/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold text-primary transition hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          HerFrame
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    pathname.startsWith(link.href)
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={clearRole}
            className="rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-primary/10 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Switch Role
          </button>
        </div>
      </div>
    </nav>
  )
}
