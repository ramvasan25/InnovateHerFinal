import { dbConnect } from '@/lib/db'
import Tip from '@/models/Tip'
import { tipSchema } from '@/lib/validate'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await dbConnect()
  const category = req.nextUrl.searchParams.get('category')
  const filter: Record<string, unknown> = {}
  if (category && category !== 'all') filter.category = category

  const tips = await Tip.find(filter).sort({ createdAt: -1 }).limit(100).lean()
  return NextResponse.json(tips)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const parsed = tipSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const tip = await Tip.create(parsed.data)
  return NextResponse.json(tip, { status: 201 })
}
