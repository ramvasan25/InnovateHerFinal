import { dbConnect } from '@/lib/db'
import Tip from '@/models/Tip'
import { cortexComplete, isSnowflakeConfigured } from '@/lib/snowflake'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!isSnowflakeConfigured()) {
    return NextResponse.json(
      { error: 'Snowflake AI not configured. Set SNOWFLAKE_ACCOUNT and SNOWFLAKE_TOKEN.' },
      { status: 503 },
    )
  }

  await dbConnect()
  const tips = await Tip.find({}).sort({ createdAt: -1 }).limit(50).lean()

  if (tips.length === 0) {
    return NextResponse.json({
      overallSentiment: 'neutral',
      themes: [],
      insights: ['No whispers to analyze yet.'],
      sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 },
    })
  }

  const whisperTexts = tips
    .map((t, i) => `${i + 1}. [${(t as Record<string, unknown>).category}] ${(t as Record<string, unknown>).body}`)
    .join('\n')

  const prompt = `You are an AI analyst for an art marketplace and community for women artists called HerFrame. The platform helps women artists share tips ("whispers") about pricing, safety, techniques, supplies, and general advice.

Analyze these community whispers and provide insights:

${whisperTexts}

Respond with ONLY valid JSON, no other text:
{
  "overallSentiment": "positive" | "negative" | "mixed" | "neutral",
  "themes": ["theme1", "theme2", "theme3"],
  "insights": ["insight1", "insight2", "insight3"],
  "sentimentBreakdown": {"positive": <count>, "negative": <count>, "neutral": <count>},
  "topConcern": "<brief description of the biggest concern in the community>",
  "topPositive": "<brief description of the most positive trend>"
}`

  try {
    const raw = await cortexComplete(prompt, { temperature: 0.3, maxTokens: 600 })

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
