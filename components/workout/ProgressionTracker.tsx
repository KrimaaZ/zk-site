'use client'

import { useEffect, useState } from 'react'

const HABITS = [
  { key: 'DIET',            label: 'Diet',           emoji: '🥗' },
  { key: 'TRAINING',        label: 'Training',       emoji: '🏋️' },
  { key: 'STUDY',           label: 'Study',          emoji: '📚' },
  { key: '3L WATER',        label: '3L Water',       emoji: '💧' },
  { key: '2H SCREEN TIME',  label: '2h Screen Time', emoji: '📵' },
  { key: 'JOURNALING',      label: 'Journaling',     emoji: '📓' },
  { key: 'MEDITATION',      label: 'Meditation',     emoji: '🧘' },
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function formatToday() {
  return new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}

export default function ProgressionTracker() {
  const today = todayKey()
  const [habits, setHabits] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/habits?date=${today}`)
      .then(r => r.json())
      .then(d => { setHabits(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [today])

  const completedCount = HABITS.filter(h => habits[h.key]).length

  const toggleHabit = async (key: string) => {
    const next = !habits[key]
    setHabits(prev => ({ ...prev, [key]: next }))
    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, habitKey: key, done: next }),
    })
  }

  const resetHabits = async () => {
    if (!confirm('Décocher toutes les tâches ?')) return
    setHabits({})
    await fetch(`/api/habits?date=${today}`, { method: 'DELETE' })
  }

  return (
    <div style={{ background:'#111111', borderRadius:16, border:'1px solid #2a2a2a', padding:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:3, height:16, background:'#D4AF37', borderRadius:2, flexShrink:0 }} />
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'#888888' }}>
          Daily Habit Tracker
        </span>
      </div>

      <div style={{ fontSize:14, fontWeight:600, color:'#E8E8E8', marginBottom:14 }}>{formatToday()}</div>

      {/* Progress bar */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:12, color:'#888888' }}>Progression</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#1D9E75' }}>{completedCount} / {HABITS.length}</span>
        </div>
        <div style={{ height:8, background:'#1a1a1a', borderRadius:100, overflow:'hidden' }}>
          <div style={{
            height:'100%',
            width:`${(completedCount / HABITS.length) * 100}%`,
            background: completedCount === HABITS.length ? '#1D9E75' : completedCount >= 4 ? '#52b788' : '#BA7517',
            borderRadius:100, transition:'width .35s ease',
          }} />
        </div>
        {completedCount === HABITS.length && (
          <div style={{ marginTop:10, padding:'8px 14px', borderRadius:9, background:'rgba(29,158,117,0.1)', border:'1px solid rgba(29,158,117,0.3)', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:16 }}>🏆</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#1D9E75' }}>Toutes les tâches accomplies !</span>
          </div>
        )}
      </div>

      {/* Habit rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:18 }}>
        {loading ? (
          [...Array(HABITS.length)].map((_, i) => (
            <div key={i} style={{ height:46, borderRadius:12, background:'#1a1a1a', animation:'pulse 1.5s ease infinite' }} />
          ))
        ) : HABITS.map(h => {
          const checked = !!habits[h.key]
          return (
            <div key={h.key} onClick={() => toggleHabit(h.key)}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'11px 16px', borderRadius:12, cursor:'pointer',
                background: checked ? 'rgba(29,158,117,0.12)' : '#1a1a1a',
                border: `1px solid ${checked ? '#1D9E75' : '#2a2a2a'}`,
                transition:'background .2s, border-color .2s', userSelect:'none',
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:20, lineHeight:1 }}>{h.emoji}</span>
                <span style={{
                  fontSize:14, fontWeight:600,
                  color: checked ? '#4DC99A' : '#C0C0C0',
                  textDecoration: checked ? 'line-through' : 'none',
                  transition:'color .2s',
                }}>{h.label}</span>
              </div>
              <div style={{
                width:22, height:22, borderRadius:6, flexShrink:0,
                border:`2px solid ${checked ? '#1D9E75' : '#3a3a3a'}`,
                background: checked ? '#1D9E75' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'background .2s, border-color .2s',
              }}>
                {checked && <span style={{ color:'#fff', fontSize:12, fontWeight:900, lineHeight:1 }}>✓</span>}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={resetHabits}
        style={{ fontSize:12, fontWeight:600, color:'#888888', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
        🔄 Décocher les tâches
      </button>
    </div>
  )
}
