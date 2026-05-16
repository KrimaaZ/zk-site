'use client'
import { useState } from 'react'
import { Meal, MealCategory } from '@/lib/types'
import FoodCard from './FoodCard'

const FILTERS = [
  { key: 'all',       label: 'ALL' },
  { key: 'breakfast', label: '☀️ Breakfast' },
  { key: 'main',      label: '🍽️ Main meal' },
  { key: 'snack',     label: '🍎 Snack' },
  { key: 'smoothie',  label: '🥤 Smoothie' },
  { key: 'night',     label: '🌙 Night' },
] as const

const TABS = [
  { key: 'meal-rotation', label: '📅 Meal Rotation' },
  { key: 'week',          label: '🗓️ Week' },
  { key: 'my-recipes',    label: '📖 My Recipes' },
  { key: 'videos',        label: '🎬 Vidéos' },
]

const Pill = ({ active, onClick, children, red }: { active: boolean; onClick: () => void; children: React.ReactNode; red?: boolean }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors ${
      active
        ? red ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        : 'bg-[#f4efe6] text-gray-800 hover:bg-[#ede7db]'
    }`}
  >
    {children}
  </button>
)

export default function FoodPage({ meals }: { meals: Meal[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [tab,    setTab]    = useState('meal-rotation')
  const [favs,   setFavs]   = useState<Set<number>>(new Set())

  const counts = meals.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1; return acc
  }, {})

  const filtered = meals.filter(m => {
    if (filter === 'favs') return favs.has(m.id)
    if (filter === 'all')  return true
    return m.category === filter
  })

  const toggleFav = (id: number) =>
    setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="max-w-[1380px] mx-auto px-5 py-4">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#152b1e] via-[#1a4a2a] to-[#22c55e] rounded-[18px] px-6 py-5 text-white mb-1">
        <span className="inline-block bg-white/15 border border-white/25 rounded-full px-3 py-1 text-[10.5px] font-bold tracking-wider uppercase mb-3">
          🍽️ DERNIÈRE RECETTE
        </span>
        <div className="text-xl font-bold">Strawberry banana bread</div>
        <div className="text-sm opacity-80 mt-1">snack · 0 min · 0 pers.</div>
      </div>

      {/* Title */}
      <div className="my-4">
        <h1 className="text-[28px] font-extrabold">🍽️ Food Plan</h1>
        <p className="text-sm text-gray-500 mt-1">{meals.length} meals · {FILTERS.length - 1} categories</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 flex-wrap mb-3">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-[#1e3829] text-white' : 'bg-[#f4efe6] text-gray-800 hover:bg-[#ede7db]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <Pill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}{f.key === 'all' ? ` (${meals.length})` : counts[f.key] ? ` (${counts[f.key]})` : ''}
            </Pill>
          ))}
          <Pill active={filter === 'favs'} onClick={() => setFilter('favs')}>
            ❤️ Favs ({favs.size})
          </Pill>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className="px-4 py-1.5 rounded-full text-[12.5px] font-medium border border-gray-300 hover:bg-[#f4efe6] transition-colors">
            ↺ Reset
          </button>
          <button className="px-4 py-1.5 rounded-full text-[12.5px] font-medium border border-gray-300 hover:bg-[#f4efe6] transition-colors">
            ☑ Select
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          {filter === 'favs' ? 'No favourites yet — tap ❤️ on a meal!' : 'No meals found.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(m => (
            <FoodCard key={m.id} meal={m} isFav={favs.has(m.id)} onToggleFav={toggleFav} />
          ))}
        </div>
      )}
    </div>
  )
}
