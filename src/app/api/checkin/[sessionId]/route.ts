import { dbConnect } from '@/lib/db'
import GigSession from '@/models/GigSession'
import { NextResponse } from 'next/server'

export async function PATCH(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  await dbConnect()
  const { sessionId } = await params
  const session = await GigSession.findOneAndUpdate(
    { sessionId },
    { status: 'checked_out' },
    { new: true }
  )
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  return NextResponse.json(session)
}

export async function GET(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  await dbConnect()
  const { sessionId } = await params
  const session = await GigSession.findOne({ sessionId }).lean()
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  return NextResponse.json(session)
}
