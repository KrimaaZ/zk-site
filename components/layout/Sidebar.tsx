'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/components/Providers'
import { ScheduleItem } from '@/lib/types'

export default function Sidebar({ schedule }: { schedule: ScheduleItem[] }) {
  const { isOpen, close } = useSidebar()
  const [tab, setTab] = useState<'menu' | 'day'>('menu')
  const [done, setDone] = useState<Set<number>>(new Set())

  const toggleDone = (id: number) =>
    setDone(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const pct = schedule.length ? Math.round((done.size / schedule.length) * 100) : 0

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/30 z-[200] transition-opacity duration-250 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside className={`fixed top-0 right-0 w-[310px] h-dvh bg-white z-[300] flex flex-col overflow-hidden transition-transform duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 shrink-0">
          <span className="text-xl font-extrabold text-[#1e3829]">ZK</span>
          <button onClick={close} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-3 shrink-0">
          {(['menu', 'day'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-[12.5px] font-medium transition-colors ${tab === t ? 'bg-[#f4efe6] text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {t === 'menu' ? '📌 Menu' : '📅 Ma journée'}
            </button>
          ))}
        </div>

        {/* Menu panel */}
        {tab === 'menu' && (
          <div className="flex-1 overflow-y-auto">
            {[
              { href: '/food',    label: '🥗 Food Plan' },
              { href: '/workout', label: '💪 Workout' },
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={close}
                className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-gray-800 hover:bg-[#eef8ee] transition-colors">
                {item.label}
              </Link>
            ))}
            {['🎮 Valorant', '📈 Trading'].map(label => (
              <button key={label} className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-gray-800 hover:bg-[#eef8ee] transition-colors">
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Day panel */}
        {tab === 'day' && (
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-between items-center px-5 py-2 bg-gray-50 border-b border-gray-100 sticky top-0 text-[13px] font-semibold">
              <span>Ma journée</span>
              <span className="text-[#16a34a]">{done.size}/{schedule.length} · {pct}%</span>
            </div>
            {schedule.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => toggleDone(item.id)}
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${done.has(item.id) ? 'bg-[#22c55e] border-[#22c55e]' : 'border-gray-300'}`}
                >
                  {done.has(item.id) && <span className="text-white text-[10px] font-bold">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-[#16a34a] font-medium mt-0.5">{item.time}</div>
                </div>
                <button className="text-orange-400 opacity-60 hover:opacity-100 text-sm transition-opacity">✏️</button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}
