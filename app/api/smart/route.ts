import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic()

export async function POST(req: Request) {
  try {
    const { objectif, domaine, delai, niveau, obstacles } = await req.json()

    if (!objectif?.trim()) {
      return NextResponse.json({ error: 'Objectif requis.' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are a personal development coach expert in SMART goals.
The user gives you a vague goal and you transform it into a precise,
motivating and realistic SMART goal. Always respond in the same language
as the user. Return only a valid JSON, no markdown, no explanation.`,
      messages: [{
        role: 'user',
        content: `Transforme cet objectif en objectif SMART complet :

Objectif : ${objectif}
Domaine : ${domaine}
Délai disponible : ${delai}
Niveau actuel : ${niveau}${obstacles?.trim() ? `\nObstacles possibles : ${obstacles}` : ''}

Retourne UNIQUEMENT ce JSON valide :
{
  "objectif_smart": "L'objectif reformulé de façon SMART (1-2 phrases précises)",
  "specifique": "Explication du S — ce qui est précisément visé",
  "mesurable": "Comment mesurer la progression concrètement",
  "atteignable": "Pourquoi c'est réaliste compte tenu du niveau et du délai",
  "relevant": "Pourquoi cet objectif est important et aligné avec la vie de la personne",
  "temporel": "La deadline précise et les jalons intermédiaires",
  "plan_action": ["Étape 1 : ...", "Étape 2 : ...", "Étape 3 : ...", "Étape 4 : ..."],
  "indicateurs": ["Indicateur mesurable 1", "Indicateur mesurable 2", "Indicateur mesurable 3"],
  "conseil_motivation": "Un conseil personnalisé, direct et motivant (2-3 phrases)"
}`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const clean = text.replace(/^```json?\s*/m, '').replace(/\s*```$/m, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur Claude API' }, { status: 500 })
  }
}
