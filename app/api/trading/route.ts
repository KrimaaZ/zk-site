import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const trades = await prisma.trade.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(trades)
}

export async function POST(req: Request) {
  const body = await req.json()
  const trade = await prisma.trade.create({
    data: {
      date: body.date,
      instrument: body.instrument,
      type: body.type,
      entry: Number(body.entry),
      exit: body.exit ? Number(body.exit) : null,
      size: Number(body.size),
      pnl: body.pnl ? Number(body.pnl) : null,
      notes: body.notes || null,
      status: body.status || 'OPEN',
    },
  })
  return NextResponse.json(trade, { status: 201 })
}
