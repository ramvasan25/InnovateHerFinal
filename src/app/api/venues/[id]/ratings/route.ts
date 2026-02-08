import { dbConnect } from '@/lib/db'
import Venue from '@/models/Venue'
import VenueRating from '@/models/VenueRating'
import { ratingSchema } from '@/lib/validate'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const ratings = await VenueRating.find({ venue: id }).sort({ createdAt: -1 }).limit(50).lean()
  return NextResponse.json(ratings)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const body = await req.json()
  const parsed = ratingSchema.safeParse({ ...body, venueId: id })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { safety, fairPay, respect, comment } = parsed.data
  const rating = await VenueRating.create({ venue: id, safety, fairPay, respect, comment })

  // Update venue aggregates
  const agg = await VenueRating.aggregate([
    { $match: { venue: rating.venue } },
    {
      $group: {
        _id: null,
        avgSafety: { $avg: '$safety' },
        avgFairPay: { $avg: '$fairPay' },
        avgRespect: { $avg: '$respect' },
        count: { $sum: 1 },
      },
    },
  ])

  if (agg.length) {
    await Venue.findByIdAndUpdate(id, {
      avgSafety: Math.round(agg[0].avgSafety * 10) / 10,
      avgFairPay: Math.round(agg[0].avgFairPay * 10) / 10,
      avgRespect: Math.round(agg[0].avgRespect * 10) / 10,
      totalRatings: agg[0].count,
    })
  }

  return NextResponse.json(rating, { status: 201 })
}
