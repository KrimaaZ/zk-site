import mealsData from '@/data/meals.json'
import { getDb } from '@/lib/db'
import FoodPage from '@/components/food/FoodPage'
import { Meal } from '@/lib/types'

async function getMeals(): Promise<Meal[]> {
  const db = getDb()
  if (db) {
    try {
      const rows = await db`SELECT id, name, category, protein, kcal, time_min as time FROM meals ORDER BY id`
      return rows as Meal[]
    } catch {
      /* fall through to JSON */
    }
  }
  return mealsData as Meal[]
}

export default async function Page() {
  const meals = await getMeals()
  return <FoodPage meals={meals} />
}
