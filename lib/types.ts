export type MealCategory = 'breakfast' | 'main' | 'snack' | 'smoothie' | 'night'
export type TrainingType = 'pull' | 'push' | 'abs' | 'cardio'

export interface Meal {
  id: number
  name: string
  category: MealCategory
  protein: number
  kcal: number
  time: number
}

export interface Exercise {
  id: number
  name: string
  muscle: string
  equipment: string
  training_type: TrainingType
  steps: string[]
  footer: string
}

export interface ScheduleItem {
  id: number
  name: string
  time: string
}
