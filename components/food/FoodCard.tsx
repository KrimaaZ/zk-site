'use client'
import { Meal, MealCategory } from '@/lib/types'

const CAT: Record<MealCategory, { label: string; cls: string }> = {
  breakfast: { label: '☀️ Breakfast', cls: 'bg-amber-100 text-amber-600' },
  main:      { label: '🍽️ Main meal', cls: 'bg-green-100 text-green-700' },
  snack:     { label: '🍎 Snack',     cls: 'bg-red-100 text-red-600' },
  smoothie:  { label: '🥤 Smoothie',  cls: 'bg-blue-100 text-blue-600' },
  night:     { label: '🌙 Night',     cls: 'bg-violet-100 text-violet-600' },
}

interface Props {
  meal: Meal
  isFav: boolean
  onToggleFav: (id: number) => void
}

export default function FoodCard({ meal, isFav, onToggleFav }: Props) {
  const cat = CAT[meal.category]
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${cat.cls}`}>{cat.label}</span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-violet-100 text-violet-600">✏️ edited</span>
        </div>
        <button
          onClick={() => onToggleFav(meal.id)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-colors ${isFav ? 'bg-red-100' : 'bg-violet-50 hover:bg-violet-100'}`}
          aria-label="Toggle favourite"
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <h3 className="font-bold text-[15px] leading-snug mb-3">{meal.name}</h3>

      <div className="flex gap-1.5 flex-wrap">
        <span className="bg-green-100 text-green-700 text-[12px] font-medium px-3 py-1 rounded-full">💪 {meal.protein}g</span>
        <span className="bg-orange-100 text-orange-700 text-[12px] font-medium px-3 py-1 rounded-full">🔥 {meal.kcal} kcal</span>
        <span className="bg-yellow-100 text-yellow-700 text-[12px] font-medium px-3 py-1 rounded-full">⏱ {meal.time} min</span>
      </div>
    </div>
  )
}
