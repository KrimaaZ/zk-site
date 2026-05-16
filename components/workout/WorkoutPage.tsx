'use client'
import { useState } from 'react'
import { Exercise, TrainingType } from '@/lib/types'
import WorkoutCard from './WorkoutCard'

const TRAINING_TABS: { key: TrainingType; label: string }[] = [
  { key: 'pull',   label: '💪 Pull Day'    },
  { key: 'push',   label: '🏋️ Push Day'   },
  { key: 'abs',    label: '🦵 Abs & Legs'  },
  { key: 'cardio', label: '🏃 Cardio'      },
]

const VIEW_TABS = [
  { key: 'library', label: '🏋️ Library' },
  { key: 'log',     label: '📋 Log'     },
  { key: 'week',    label: '📅 Week'    },
  { key: 'videos',  label: '🎬 Videos'  },
]

export default function WorkoutPage({ exercises }: { exercises: Exercise[] }) {
  const [viewTab,  setViewTab]  = useState('library')
  const [training, setTraining] = useState<TrainingType>('pull')
  const [favFilter, setFavFilter] = useState(false)
  const [favs, setFavs] = useState<Set<number>>(new Set())

  const toggleFav = (id: number) =>
    setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const list = exercises
    .filter(e => e.training_type === training)
    .filter(e => !favFilter || favs.has(e.id))

  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${active ? 'bg-[#1e3829] text-white' : 'bg-[#f4efe6] text-gray-800 hover:bg-[#ede7db]'}`

  return (
    <div className="max-w-[1380px] mx-auto px-5 py-4">

      {/* Title */}
      <div className="my-4">
        <h1 className="text-[28px] font-extrabold">💪 Workout</h1>
        <p className="text-sm text-gray-500 mt-1">4 training types</p>
      </div>

      {/* View tabs */}
      <div className="flex gap-2 flex-wrap mb-3">
        {VIEW_TABS.map(t => (
          <button key={t.key} onClick={() => setViewTab(t.key)} className={tabCls(viewTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Training type tabs */}
      <div className="flex gap-2 flex-wrap mb-3">
        {TRAINING_TABS.map(t => (
          <button key={t.key} onClick={() => { setTraining(t.key); setFavFilter(false) }} className={tabCls(training === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* All / Favs + count */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <button onClick={() => setFavFilter(false)}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${!favFilter ? 'bg-red-600 text-white' : 'bg-[#f4efe6] text-gray-800 hover:bg-[#ede7db]'}`}>
            All
          </button>
          <button onClick={() => setFavFilter(true)}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${favFilter ? 'bg-gray-900 text-white' : 'bg-[#f4efe6] text-rose-600 hover:bg-[#ede7db]'}`}>
            ❤️ Favs
          </button>
        </div>
        <span className="text-sm text-gray-400">{list.length} exercise{list.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          {favFilter ? 'No favourites in this category yet — tap ❤️!' : 'No exercises found.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map(ex => (
            <WorkoutCard key={ex.id} exercise={ex} isFav={favs.has(ex.id)} onToggleFav={toggleFav} />
          ))}
        </div>
      )}
    </div>
  )
}
