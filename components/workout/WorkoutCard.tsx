'use client'
import { useState } from 'react'
import { Exercise, TrainingType } from '@/lib/types'

const TYPE_BADGE: Record<TrainingType, { label: string; cls: string }> = {
  pull:   { label: '💪 PULL',   cls: 'bg-[#1e3829]' },
  push:   { label: '🏋️ PUSH',  cls: 'bg-blue-900'  },
  abs:    { label: '🦵 ABS',    cls: 'bg-violet-700' },
  cardio: { label: '🏃 CARDIO', cls: 'bg-amber-700'  },
}

interface Props {
  exercise: Exercise
  isFav: boolean
  onToggleFav: (id: number) => void
}

export default function WorkoutCard({ exercise: ex, isFav, onToggleFav }: Props) {
  const [step, setStep] = useState(0)
  const badge = TYPE_BADGE[ex.training_type]
  const total = ex.steps.length

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150">

      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-1.5 items-center flex-wrap">
          <span className={`${badge.cls} text-white text-[11px] font-bold px-3 py-1 rounded-full`}>{badge.label}</span>
          <span className="bg-[#f4efe6] text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">{ex.equipment}</span>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button className="w-[30px] h-[30px] rounded-full bg-[#1e3829] text-white flex items-center justify-center text-xs hover:scale-110 transition-transform" title="Schedule">📅</button>
          <button className="w-[30px] h-[30px] rounded-full bg-orange-50  text-orange-600 flex items-center justify-center text-xs hover:scale-110 transition-transform" title="Edit">✏️</button>
          <button onClick={() => onToggleFav(ex.id)}
            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs hover:scale-110 transition-all ${isFav ? 'bg-red-100' : 'bg-violet-50'}`}
            title="Favourite">
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <h3 className="font-bold text-base mb-0.5">{ex.name}</h3>
      <p className="text-xs text-gray-500 mb-3">{ex.muscle}</p>

      {/* Step box */}
      <div className="bg-[#faf7f2] rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold">Step {step + 1}/{total}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="w-6 h-6 rounded-full border border-gray-200 bg-white text-gray-400 flex items-center justify-center text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >‹</button>
            <button
              onClick={() => setStep(s => Math.min(total - 1, s + 1))}
              disabled={step === total - 1}
              className="w-6 h-6 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-sm disabled:opacity-40 hover:bg-green-500 transition-colors"
            >›</button>
          </div>
        </div>
        <p className="text-[12.5px] leading-relaxed mb-2">{ex.steps[step]}</p>
        <div className="flex gap-1">
          {ex.steps.map((_, i) => (
            <div key={i} className={`w-[7px] h-[7px] rounded-full transition-colors ${i === step ? 'bg-[#22c55e]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex gap-1.5 mb-3">
        {['🌱', '🥋', '💪', '🔥', '⚡'].map(e => (
          <div key={e} className="w-[30px] h-[30px] rounded-full bg-[#f4efe6] flex items-center justify-center text-[14px]">{e}</div>
        ))}
      </div>

      <p className="text-xs text-green-700 font-medium">{ex.footer}</p>
    </div>
  )
}
