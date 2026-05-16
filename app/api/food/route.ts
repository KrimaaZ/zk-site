import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(recipes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const recipe = await prisma.recipe.create({
    data: {
      title: body.title,
      description: body.description,
      ingredients: JSON.stringify(body.ingredients),
      instructions: body.instructions,
      prepTime: Number(body.prepTime),
      cookTime: Number(body.cookTime),
      servings: Number(body.servings),
      category: body.category,
    },
  })
  return NextResponse.json(recipe, { status: 201 })
}
