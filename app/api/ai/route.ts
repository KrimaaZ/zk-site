import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: Request) {
  const body = await req.json()
  const { type, data } = body

  const prompts: Record<string, string> = {
    recipe: `Generate a healthy recipe using these ingredients: ${data?.ingredients || 'seasonal vegetables'}.
Return ONLY a JSON object: { "title": string, "description": string, "ingredients": string[], "instructions": string, "prepTime": number, "cookTime": number, "servings": number, "category": "breakfast"|"lunch"|"dinner"|"snack" }`,

    workout: `Suggest a complete ${data?.sessionType || 'PUSH'} day workout session.
Return ONLY a JSON object: { "title": string, "exercises": [{ "name": string, "sets": number, "reps": string, "notes": string }], "notes": string }`,

    valorant_tip: `Generate a practical Valorant improvement tip for category: ${data?.category || 'MECHANICS'}${data?.agent ? `, agent: ${data.agent}` : ''}.
Return ONLY a JSON object: { "title": string, "content": string, "drill": string }`,

    trade_analysis: `Analyze this trade journal entry: ${JSON.stringify(data?.trade || {})}.
Return ONLY a JSON object: { "analysis": string, "lessons": string, "rating": number }`,

    backtest: `Create a trading backtest strategy for: ${data?.description || 'EMA crossover strategy'}.
Return ONLY a JSON object: { "name": string, "description": string, "rules": string[], "timeframe": string, "notes": string }`,
  }

  const prompt = prompts[type]
  if (!prompt) return NextResponse.json({ error: 'Unknown type' }, { status: 400 })

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: 'You are a helpful assistant. Always respond with valid JSON only, no markdown, no code blocks, no explanation.',
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })

    const result = JSON.parse(content.text)
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
