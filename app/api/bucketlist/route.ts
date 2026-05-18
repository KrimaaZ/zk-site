import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const DEFAULT_ITEMS = [
  { category: '🌍 Voyages & Aventures',    text: 'Visiter Tokyo',                             priority: 2, deadline: '' },
  { category: '🌍 Voyages & Aventures',    text: 'Voir le Machu Picchu',                      priority: 2, deadline: '' },
  { category: '🌍 Voyages & Aventures',    text: 'Road trip aux USA',                         priority: 1, deadline: '' },
  { category: '🎵 Musique & Créativité',   text: 'Sortir mon premier son',                    priority: 3, deadline: '' },
  { category: '🎵 Musique & Créativité',   text: 'Performer sur scène devant une salle',      priority: 3, deadline: '' },
  { category: '💪 Sport & Physique',       text: 'Atteindre mon physique idéal',              priority: 3, deadline: '' },
  { category: '💪 Sport & Physique',       text: 'Courir un marathon',                        priority: 1, deadline: '' },
  { category: '💰 Argent & Succès',        text: 'Avoir ma propre source de revenus passifs', priority: 3, deadline: '' },
  { category: '💰 Argent & Succès',        text: 'Acheter ma première voiture',               priority: 2, deadline: '' },
  { category: '❤️ Famille & Amour',       text: 'Rendre mes parents fiers',                  priority: 3, deadline: '' },
  { category: '❤️ Famille & Amour',       text: 'Construire ma propre famille',              priority: 2, deadline: '' },
  { category: '🧠 Expériences & Sensations', text: 'Sauter en parachute',                    priority: 1, deadline: '' },
  { category: '🧠 Expériences & Sensations', text: 'Voir le soleil se lever depuis une montagne', priority: 2, deadline: '' },
  { category: '🏆 Accomplissements',       text: 'Maîtriser une langue étrangère',            priority: 2, deadline: '' },
  { category: '🏆 Accomplissements',       text: 'Lire 50 livres',                            priority: 1, deadline: '' },
]

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS "BucketItem" (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      text TEXT NOT NULL,
      deadline TEXT NOT NULL DEFAULT '',
      priority INT NOT NULL DEFAULT 1,
      done BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  // Seed default items on first run
  const count = await sql`SELECT COUNT(*) as n FROM "BucketItem"`
  if (Number(count[0].n) === 0) {
    for (const item of DEFAULT_ITEMS) {
      const id = crypto.randomUUID()
      await sql`
        INSERT INTO "BucketItem" (id, category, text, deadline, priority, done, "createdAt")
        VALUES (${id}, ${item.category}, ${item.text}, ${item.deadline}, ${item.priority}, false, NOW())
      `
    }
  }
}

export async function GET() {
  try {
    await init()
    const rows = await sql`SELECT * FROM "BucketItem" ORDER BY done ASC, priority DESC, "createdAt" ASC`
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await init()
    const { category, text, deadline, priority } = await req.json()
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO "BucketItem" (id, category, text, deadline, priority, done, "createdAt")
      VALUES (${id}, ${category}, ${text}, ${deadline || ''}, ${priority || 1}, false, NOW())
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
