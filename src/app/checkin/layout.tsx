import { ArtistOnly } from '@/components/role-guard'

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <ArtistOnly>{children}</ArtistOnly>
}
