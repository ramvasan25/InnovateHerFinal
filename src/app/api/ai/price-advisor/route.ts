import { cortexComplete, isSnowflakeConfigured } from '@/lib/snowflake'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (!isSnowflakeConfigured()) {
    return NextResponse.json(
      { error: 'Snowflake AI not configured. Set SNOWFLAKE_ACCOUNT and SNOWFLAKE_TOKEN.' },
      { status: 503 },
    )
  }

  const { title, medium, description } = await req.json()
  if (!title || !medium || !description) {
    return NextResponse.json({ error: 'title, medium, and description are required' }, { status: 400 })
  }

  const prompt = `You are a fair-pricing advisor for artwork created by women artists. Your mission is to help artists price their work fairly — historically women are underpaid in the art world, and you help correct that.

Given the following artwork details, suggest a fair USD price range. Consider the medium, complexity described, and current art market rates.

Art Details:
- Title: ${title}
- Medium: ${medium}
- Description: ${description}

Respond with ONLY valid JSON, no other text:
{"minPrice": <number>, "maxPrice": <number>, "suggested": "<formatted price string like $200 - $400>", "reasoning": "<1-2 sentence explanation>"}`

  try {
    const raw = await cortexComplete(prompt, { temperature: 0.3, maxTokens: 300 })

    // Extract JSON from the response (handle markdown fences)
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse AI response', raw }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
