import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [recipes, sessions, tips, trades, strategies] = await Promise.all([
      prisma.recipe.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.workoutSession.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.valorantTip.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.trade.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.backtestStrategy.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ])

    const feed = [
      ...recipes.map(r => ({
        id: r.id, category: 'food',
        title: r.title, excerpt: r.description,
        date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        href: '/food', sortDate: new Date(r.createdAt).getTime(),
      })),
      ...sessions.map(s => ({
        id: s.id, category: 'workout',
        title: `${s.type} — ${s.title}`,
        excerpt: s.notes || `Workout session logged`,
        date: s.date, href: '/workout', sortDate: new Date(s.createdAt).getTime(),
      })),
      ...tips.map(t => ({
        id: t.id, category: 'valorant',
        title: t.title, excerpt: t.content.slice(0, 150),
        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        href: '/valorant', sortDate: new Date(t.createdAt).getTime(),
      })),
      ...trades.map(t => ({
        id: t.id, category: 'trading',
        title: `${t.type} ${t.instrument}`,
        excerpt: t.notes || `Entry: ${t.entry} — Status: ${t.status}`,
        date: t.date, href: '/trading', sortDate: new Date(t.createdAt).getTime(),
      })),
      ...strategies.map(s => ({
        id: s.id, category: 'backtest',
        title: s.name, excerpt: s.description,
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        href: '/trading', sortDate: new Date(s.createdAt).getTime(),
      })),
    ].sort((a, b) => b.sortDate - a.sortDate)

    return NextResponse.json(feed)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
