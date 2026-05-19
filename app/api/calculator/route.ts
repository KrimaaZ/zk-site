import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { NUTRITION_DATA } from '@/lib/nutrition-data'

const anthropic = new Anthropic()

type IngredientInput = { name: string; grams: number }

export async function POST(req: Request) {
  try {
    const { ingredients }: { ingredients: IngredientInput[] } = await req.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'Aucun ingrédient fourni.' }, { status: 400 })
    }

    // ── 1. Calcul précis des totaux (mathématique, pas Claude) ────────────────
    let totalCalories = 0
    let totalProteins = 0
    let totalCarbs    = 0
    let totalFats     = 0

    const breakdown: string[] = []

    for (const ing of ingredients) {
      const item = NUTRITION_DATA.find(n => n.name === ing.name)
      if (!item) continue

      const ratio = ing.grams / item.per
      const cal   = item.calories * ratio
      const prot  = item.proteins * ratio
      const carb  = item.carbs    * ratio
      const fat   = item.fats     * ratio

      totalCalories += cal
      totalProteins += prot
      totalCarbs    += carb
      totalFats     += fat

      breakdown.push(
        `• ${ing.name} (${ing.grams}g) → ${Math.round(cal)} kcal | ${round1(prot)}g P | ${round1(carb)}g G | ${round1(fat)}g L`
      )
    }

    // Arrondi final
    totalCalories = Math.round(totalCalories)
    totalProteins = round1(totalProteins)
    totalCarbs    = round1(totalCarbs)
    totalFats     = round1(totalFats)

    // ── 2. Claude génère un commentaire sur la composition du repas ───────────
    let summary = ''
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 250,
        system: 'Tu es un coach nutritionniste spécialisé en fitness et prise de masse musculaire. Réponds uniquement en JSON valide, sans markdown ni code block.',
        messages: [{
          role: 'user',
          content: `Analyse ce repas pour quelqu'un qui vise la prise de masse :

${breakdown.join('\n')}

TOTAUX : ${totalCalories} kcal | ${totalProteins}g protéines | ${totalCarbs}g glucides | ${totalFats}g lipides

Donne un commentaire concis (2-3 phrases max) : est-ce bien adapté pour la prise de masse ? Bon ratio protéines/calories ? Un conseil pratique.

Réponds UNIQUEMENT avec ce JSON : { "summary": "ton commentaire ici" }`,
        }],
      })

      if (message.content[0].type === 'text') {
        const text = message.content[0].text.trim()
        const parsed = JSON.parse(text.replace(/^```json?\n?/, '').replace(/```$/, ''))
        summary = parsed.summary ?? text
      }
    } catch {
      // Si Claude échoue, on renvoie quand même les valeurs calculées
      summary = ''
    }

    return NextResponse.json({ totalCalories, totalProteins, totalCarbs, totalFats, summary })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
