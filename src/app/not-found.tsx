import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-slate-600">Page not found.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl border-2 border-primary bg-white/80 px-6 py-2.5 font-semibold text-primary transition hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Go home
      </Link>
    </div>
  )
}
