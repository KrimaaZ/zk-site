import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const strategies = await prisma.backtestStrategy.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(strategies)
}

export async function POST(req: Request) {
  const body = await req.json()
  const strategy = await prisma.backtestStrategy.create({
    data: {
      name: body.name,
      description: body.description,
      rules: JSON.stringify(body.rules),
      timeframe: body.timeframe,
      winRate: body.winRate ? Number(body.winRate) : null,
      riskReward: body.riskReward ? Number(body.riskReward) : null,
      notes: body.notes || null,
    },
  })
  return NextResponse.json(strategy, { status: 201 })
}
