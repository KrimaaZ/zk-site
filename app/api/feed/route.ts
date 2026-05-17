import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [recipes, sessions] = await Promise.all([
      prisma.recipe.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.workoutSession.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ])

    const feed = [
      ...recipes.map(r => ({
        id: r.id, category: 'food',
        title: r.title, excerpt: r.description,
        date: new Date(r.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
        href: '/food', sortDate: new Date(r.createdAt).getTime(),
      })),
      ...sessions.map(s => ({
        id: s.id, category: 'workout',
        title: `${s.type} — ${s.title}`,
        excerpt: s.notes || 'Séance enregistrée',
        date: s.date, href: '/workout', sortDate: new Date(s.createdAt).getTime(),
      })),
    ].sort((a, b) => b.sortDate - a.sortDate)

    return NextResponse.json(feed)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
