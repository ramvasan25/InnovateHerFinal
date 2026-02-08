import { dbConnect } from '@/lib/db'
import Tip from '@/models/Tip'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const tip = await Tip.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true })
  if (!tip) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(tip)
}
