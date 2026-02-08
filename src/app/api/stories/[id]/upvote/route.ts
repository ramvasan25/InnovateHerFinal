import { dbConnect } from '@/lib/db'
import ArtStory from '@/models/ArtStory'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const story = await ArtStory.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true })
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ upvotes: story.upvotes })
}
