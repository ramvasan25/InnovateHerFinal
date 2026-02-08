import { dbConnect } from '@/lib/db'
import Opportunity from '@/models/Opportunity'
import { opportunitySchema } from '@/lib/validate'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = req.nextUrl
    const medium = searchParams.get('medium')
    const q = searchParams.get('q')

    const filter: Record<string, unknown> = {}
    if (medium && medium !== 'all') filter.medium = medium
    if (q) {
      // Use regex search as fallback if text index isn't ready
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ]
    }

    const opps = await Opportunity.find(filter).sort({ createdAt: -1 }).limit(50).lean()
    return NextResponse.json(opps)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect()
    const body = await req.json()
    const parsed = opportunitySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const opp = await Opportunity.create(parsed.data)
    return NextResponse.json(opp, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
