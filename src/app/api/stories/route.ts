import { dbConnect } from '@/lib/db'
import ArtStory from '@/models/ArtStory'
import { storySchema } from '@/lib/validate'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await dbConnect()
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')

  const filter: Record<string, unknown> = {}
  if (category && category !== 'all') filter.category = category

  const stories = await ArtStory.find(filter).sort({ createdAt: -1 }).limit(50).lean()
  return NextResponse.json(stories)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const parsed = storySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const story = await ArtStory.create(parsed.data)
  return NextResponse.json(story, { status: 201 })
}
