import exercisesData from '@/data/exercises.json'
import { getDb } from '@/lib/db'
import WorkoutPage from '@/components/workout/WorkoutPage'
import { Exercise } from '@/lib/types'

async function getExercises(): Promise<Exercise[]> {
  const db = getDb()
  if (db) {
    try {
      const rows = await db`SELECT id, name, muscle, equipment, training_type, steps, footer FROM exercises ORDER BY id`
      return rows as Exercise[]
    } catch {
      /* fall through to JSON */
    }
  }
  return exercisesData as Exercise[]
}

export default async function Page() {
  const exercises = await getExercises()
  return <WorkoutPage exercises={exercises} />
}
