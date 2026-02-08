import { dbConnect } from '@/lib/db'
import Venue from '@/models/Venue'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const venue = await Venue.findById(id).lean()
  if (!venue) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(venue)
}
