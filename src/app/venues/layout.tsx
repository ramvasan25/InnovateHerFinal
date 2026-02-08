import { ArtistOnly } from '@/components/role-guard'

export default function VenuesLayout({ children }: { children: React.ReactNode }) {
  return <ArtistOnly>{children}</ArtistOnly>
}
