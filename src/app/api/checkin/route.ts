import { dbConnect } from '@/lib/db'
import GigSession from '@/models/GigSession'
import { checkinSchema } from '@/lib/validate'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const parsed = checkinSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { sessionId, venueName, durationMinutes } = parsed.data
  const startTime = new Date()
  const expectedEnd = new Date(startTime.getTime() + durationMinutes * 60 * 1000)

  const session = await GigSession.create({ sessionId, venueName, startTime, expectedEnd })
  return NextResponse.json(session, { status: 201 })
}
