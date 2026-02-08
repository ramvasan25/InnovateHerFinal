import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { RoleProvider } from '@/context/role'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'HerFrame', template: '%s | HerFrame' },
  description: 'A marketplace and community for women artists. By women artists.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-600 antialiased">
        <RoleProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </RoleProvider>
      </body>
    </html>
  )
}
