'use client'

import { useEffect, useState } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const MORNING = [
  { key: 'water',   label: 'Boire un verre d\'eau',        emoji: '💧' },
  { key: 'stretch', label: 'Stretch 5 min',                emoji: '🧘' },
  { key: 'breath',  label: '5 min de respiration profonde', emoji: '🌬️' },
  { key: 'bed',     label: 'Faire le lit',                  emoji: '🛏️' },
  { key: 'skin',    label: 'Skin care routine',             emoji: '✨' },
]

const NIGHT = [
  { key: 'meal',       label: 'Dernier repas avant 3h du coucher', emoji: '🍽️' },
  { key: 'noscreen',   label: 'Aucun écran avant 1h du coucher',   emoji: '📵' },
  { key: 'journal',    label: 'Journaling 10 min',                  emoji: '📓' },
  { key: 'meditation', label: 'Méditation 10 min',                  emoji: '🧘' },
  { key: 'supps',      label: 'Magnésium + Zinc',                   emoji: '💊' },
]

const SILVER = '#C0C0C0'
const NIGHT_COLOR = '#8B7FD4'  // soft purple
const NIGHT_BLUE  = '#5B8DD9'  // soft blue

const STORAGE_KEY = 'routines_data'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

type RoutineData = {
  date: string
  morning: Record<string, boolean>
  night:   Record<string, boolean>
}

function load(): RoutineData {
  const today = todayKey()
  if (typeof window === 'undefined') return { date: today, morning: {}, night: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: today, morning: {}, night: {} }
    const parsed: RoutineData = JSON.parse(raw)
    // New day → reset checkboxes automatically
    if (parsed.date !== today) return { date: today, morning: {}, night: {} }
    return parsed
  } catch { return { date: today, morning: {}, night: {} } }
}

function save(d: RoutineData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch {}
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoutineCard({
  title, subtitle, emoji, items, checks, color, colorSub, glowColor,
  onToggle,
}: {
  title: string
  subtitle: string
  emoji: string
  items: { key: string; label: string; emoji: string }[]
  checks: Record<string, boolean>
  color: string
  colorSub: string
  glowColor: string
  onToggle: (key: string) => void
}) {
  const done  = items.filter(i => checks[i.key]).length
  const total = items.length
  const allDone = done === total

  return (
    <div style={{
      background: '#111111',
      borderRadius: 20,
      border: `1px solid ${color}30`,
      overflow: 'hidden',
      boxShadow: allDone ? `0 0 32px ${glowColor}20` : 'none',
      transition: 'box-shadow .4s',
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        borderBottom: `1px solid ${color}20`,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${color}15`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: color }}>{title}</div>
              <div style={{ fontSize: 11, color: '#555555', marginTop: 1 }}>{subtitle}</div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: allDone ? color : '#F0F0F0' }}>
              {done}/{total}
            </div>
            <div style={{ fontSize: 10, color: '#555555' }}>complétés</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#1a1a1a', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(done / total) * 100}%`,
            background: allDone
              ? `linear-gradient(90deg, ${color}, ${colorSub})`
              : color,
            borderRadius: 100,
            transition: 'width .35s ease',
          }} />
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => {
          const checked = !!checks[item.key]
          return (
            <div key={item.key} onClick={() => onToggle(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                background: checked ? `${color}10` : '#1a1a1a',
                border: `1px solid ${checked ? color + '50' : '#2a2a2a'}`,
                transition: 'all .2s',
                userSelect: 'none',
              }}>
              {/* Emoji */}
              <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: 14, fontWeight: 600,
                color: checked ? color : '#C0C0C0',
                textDecoration: checked ? 'line-through' : 'none',
                transition: 'all .2s',
              }}>
                {item.label}
              </span>

              {/* Checkbox */}
              <div style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                border: `2px solid ${checked ? color : '#3a3a3a'}`,
                background: checked ? color : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s',
              }}>
                {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* All done banner */}
      {allDone && (
        <div style={{
          margin: '0 16px 16px',
          padding: '10px 16px', borderRadius: 12,
          background: `${color}12`,
          border: `1px solid ${color}35`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>
            Routine complète — bien joué !
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RoutinesPage() {
  const [data, setData] = useState<RoutineData>({ date: todayKey(), morning: {}, night: {} })

  useEffect(() => { setData(load()) }, [])

  const toggle = (routine: 'morning' | 'night', key: string) => {
    setData(prev => {
      const updated: RoutineData = {
        ...prev,
        [routine]: { ...prev[routine], [key]: !prev[routine][key] },
      }
      save(updated)
      return updated
    })
  }

  const dateLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 32, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:3, height:20, background:'#D4AF37', borderRadius:2 }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' as const, color:'#888888' }}>
            Routines
          </span>
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#F0F0F0', margin:0 }}>
          Mes Routines
        </h1>
        <p style={{ fontSize:13, color:'#555555', marginTop:6, textTransform:'capitalize' as const }}>
          📅 {dateLabel} — les cases se remettent à zéro chaque jour automatiquement
        </p>
      </div>

      {/* Cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <RoutineCard
          title="Morning Routine"
          subtitle="Commence la journée du bon pied"
          emoji="🌅"
          items={MORNING}
          checks={data.morning}
          color={SILVER}
          colorSub="#E8E8E8"
          glowColor={SILVER}
          onToggle={key => toggle('morning', key)}
        />
        <RoutineCard
          title="Night Routine"
          subtitle="Prépare ton corps et ton esprit pour la nuit"
          emoji="🌙"
          items={NIGHT}
          checks={data.night}
          color={NIGHT_COLOR}
          colorSub={NIGHT_BLUE}
          glowColor={NIGHT_COLOR}
          onToggle={key => toggle('night', key)}
        />
      </div>
    </div>
  )
}
