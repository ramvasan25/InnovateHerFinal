import { dbConnect } from '@/lib/db'
import Venue from '@/models/Venue'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await dbConnect()
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')
  const city = searchParams.get('city')

  const filter: Record<string, unknown> = {}
  if (q) filter.$text = { $search: q }
  if (city) filter.city = { $regex: city, $options: 'i' }

  const venues = await Venue.find(filter).sort({ totalRatings: -1 }).limit(50).lean()
  return NextResponse.json(venues)
}
