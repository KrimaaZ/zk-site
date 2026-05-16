import { neon } from '@neondatabase/serverless'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const meals    = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/meals.json'),    'utf8'))
const exercises = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/exercises.json'), 'utf8'))
const schedule  = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedule.json'),  'utf8'))

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env.local')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  console.log('🔌 Connected to Neon')

  await sql`CREATE TABLE IF NOT EXISTS meals (
    id       SERIAL  PRIMARY KEY,
    name     TEXT    NOT NULL,
    category TEXT    NOT NULL,
    protein  INTEGER NOT NULL,
    kcal     INTEGER NOT NULL,
    time_min INTEGER NOT NULL
  )`

  await sql`CREATE TABLE IF NOT EXISTS exercises (
    id            SERIAL  PRIMARY KEY,
    name          TEXT    NOT NULL,
    muscle        TEXT    NOT NULL,
    equipment     TEXT    NOT NULL,
    training_type TEXT    NOT NULL,
    steps         TEXT[]  NOT NULL,
    footer        TEXT    NOT NULL
  )`

  await sql`CREATE TABLE IF NOT EXISTS schedule_items (
    id         SERIAL  PRIMARY KEY,
    name       TEXT    NOT NULL,
    time_label TEXT    NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    done       BOOLEAN NOT NULL DEFAULT FALSE
  )`

  console.log('✅ Tables ready')

  await sql`TRUNCATE meals RESTART IDENTITY CASCADE`
  for (const m of meals) {
    await sql`INSERT INTO meals (id,name,category,protein,kcal,time_min)
              VALUES (${m.id},${m.name},${m.category},${m.protein},${m.kcal},${m.time})`
  }
  console.log(`✅ ${meals.length} meals seeded`)

  await sql`TRUNCATE exercises RESTART IDENTITY CASCADE`
  for (const e of exercises) {
    await sql`INSERT INTO exercises (id,name,muscle,equipment,training_type,steps,footer)
              VALUES (${e.id},${e.name},${e.muscle},${e.equipment},${e.training_type},${e.steps},${e.footer})`
  }
  console.log(`✅ ${exercises.length} exercises seeded`)

  await sql`TRUNCATE schedule_items RESTART IDENTITY CASCADE`
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i]
    await sql`INSERT INTO schedule_items (id,name,time_label,sort_order)
              VALUES (${s.id},${s.name},${s.time},${i})`
  }
  console.log(`✅ ${schedule.length} schedule items seeded`)

  console.log('🎉 Database seeded successfully!')
}

seed().catch(err => { console.error(err); process.exit(1) })
