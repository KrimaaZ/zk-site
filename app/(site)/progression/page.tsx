'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const HABITS = [
  'DIET',
  'GYM',
  'SITEWEB / STUDY',
  'LEARNING NEW LANGUAGE',
  'Hydratation 3L',
  'JOURNALING',
  'MEDITATION',
  'MORNING / NIGHT ROUTINE',
  'BEING GRATEFUL',
  '8H SLEEP',
]

const GREEN  = '#1D9E75'
const RED    = '#ef4444'
const GOLD   = '#D4AF37'
const LS_KEY = 'mak_habits_v2'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// ─── Timezone helpers (Africa/Casablanca) ─────────────────────────────────────

function getCasaDate(): string {
  // Returns "YYYY-MM-DD" in Casablanca time
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Casablanca',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

function getCasaDateInfo() {
  const dateStr = getCasaDate()
  const [year, month, day] = dateStr.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  // First day of month: 0=Sun … 6=Sat → convert to Mon=0 … Sun=6
  const firstDaySun  = new Date(year, month - 1, 1).getDay()
  const firstDayMon  = (firstDaySun + 6) % 7
  return { year, month, day, daysInMonth, firstDayMon }
}

function getMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long', year: 'numeric', timeZone: 'Africa/Casablanca',
  }).format(new Date(year, month - 1, 1))
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsLoad(): { date: string; checked: boolean[] } | null {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') }
  catch { return null }
}

function lsSave(date: string, checked: boolean[]) {
  localStorage.setItem(LS_KEY, JSON.stringify({ date, checked }))
}

// ─── Types ────────────────────────────────────────────────────────────────────

type DayRecord = { date: string; count: number }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgressionPage() {
  const [checked,   setChecked]   = useState<boolean[]>(Array(10).fill(false))
  const [todayDate, setTodayDate] = useState('')
  const [records,   setRecords]   = useState<DayRecord[]>([])
  const [saving,    setSaving]    = useState(false)
  const [savedMsg,  setSavedMsg]  = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch DB records ──────────────────────────────────────────────────────

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/progression')
      const data = await res.json()
      if (Array.isArray(data)) setRecords(data)
    } catch {}
  }

  // ── Save a day record to DB ───────────────────────────────────────────────

  const saveDayToDB = async (date: string, count: number) => {
    try {
      await fetch('/api/progression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, count }),
      })
    } catch {}
  }

  // ── Initialize on mount ───────────────────────────────────────────────────

  useEffect(() => {
    const today = getCasaDate()
    setTodayDate(today)

    const stored = lsLoad()

    if (stored && stored.date === today) {
      // Same day — restore state
      setChecked(stored.checked)
    } else if (stored && stored.date !== today) {
      // New day — save previous day to DB then reset
      const count = stored.checked.filter(Boolean).length
      saveDayToDB(stored.date, count).then(fetchRecords)
      const fresh = Array(10).fill(false)
      setChecked(fresh)
      lsSave(today, fresh)
    } else {
      // First ever open
      const fresh = Array(10).fill(false)
      setChecked(fresh)
      lsSave(today, fresh)
    }

    fetchRecords()
  }, []) // eslint-disable-line

  // ── Watch for midnight (check every 30s) ─────────────────────────────────

  useEffect(() => {
    if (!todayDate) return
    const interval = setInterval(() => {
      const now = getCasaDate()
      if (now !== todayDate) {
        // Midnight crossed: save then reset
        const count = checked.filter(Boolean).length
        saveDayToDB(todayDate, count).then(fetchRecords)
        const fresh = Array(10).fill(false)
        setChecked(fresh)
        setTodayDate(now)
        lsSave(now, fresh)
      }
    }, 30_000)
    return () => clearInterval(interval)
  }, [todayDate, checked]) // eslint-disable-line

  // ── Toggle a habit ────────────────────────────────────────────────────────

  const toggle = (i: number) => {
    const next = checked.map((v, idx) => idx === i ? !v : v)
    setChecked(next)
    lsSave(todayDate, next)
  }

  // ── Manual save to calendar ───────────────────────────────────────────────

  const saveNow = async () => {
    setSaving(true)
    await saveDayToDB(todayDate, checked.filter(Boolean).length)
    await fetchRecords()
    setSaving(false)
    setSavedMsg(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSavedMsg(false), 2500)
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const count = checked.filter(Boolean).length
  const pct   = Math.round((count / 10) * 100)
  const scoreColor = count >= 6 ? GREEN : count >= 3 ? GOLD : RED

  // Calendar data
  const { year, month, day: todayDay, daysInMonth, firstDayMon } = getCasaDateInfo()
  const monthLabel = getMonthLabel(year, month)

  // Build a map: day number → count (only for this month)
  const recordMap: Record<number, number> = {}
  records.forEach(r => {
    const [ry, rm, rd] = r.date.split('-').map(Number)
    if (ry === year && rm === month) recordMap[rd] = r.count
  })

  // Monthly stats
  const daysLogged  = Object.keys(recordMap).length
  const greenDays   = Object.values(recordMap).filter(c => c >= 6).length
  const redDays     = Object.values(recordMap).filter(c => c < 6).length

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,32px) 100px' }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          Progression
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: '#F0F0F0', margin: '0 0 8px' }}>
          📊 Suivi des habitudes
        </h1>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
          {todayDate && new Date(todayDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── HABITS LIST ────────────────────────────────────── */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 18, padding: 'clamp(20px,4vw,32px)', marginBottom: 20 }}>

        {/* Score header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Aujourd'hui
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor, transition: 'color .3s' }}>
            {count} <span style={{ fontSize: 14, color: '#444', fontWeight: 400 }}>/ 10</span>
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 7, background: '#1a1a1a', borderRadius: 100, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: count >= 6 ? `linear-gradient(90deg, ${GREEN}, #52e0a8)` : count >= 3 ? `linear-gradient(90deg, ${GOLD}, #FFD700)` : `linear-gradient(90deg, ${RED}, #ff7070)`,
            borderRadius: 100, transition: 'width .4s ease, background .4s',
          }} />
        </div>

        {/* Habit items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {HABITS.map((habit, i) => {
            const done = checked[i]
            return (
              <div key={i} onClick={() => toggle(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', userSelect: 'none',
                  background: done ? 'rgba(29,158,117,0.07)' : '#111',
                  border: `1px solid ${done ? 'rgba(29,158,117,0.25)' : 'rgba(255,255,255,0.04)'}`,
                  transition: 'all .18s',
                }}>

                {/* Checkbox */}
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  border: `2px solid ${done ? GREEN : '#2a2a2a'}`,
                  background: done ? GREEN : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .2s', transform: done ? 'scale(1.05)' : 'scale(1)',
                }}>
                  {done && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>

                {/* Number */}
                <span style={{ fontSize: 11, fontWeight: 700, color: done ? '#2a4a3a' : '#333', minWidth: 18, transition: 'color .2s' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Label */}
                <span style={{
                  flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
                  color: done ? '#3a6a50' : '#C0C0C0',
                  textDecoration: done ? 'line-through' : 'none',
                  transition: 'all .2s',
                }}>
                  {habit}
                </span>

                {/* Done badge */}
                {done && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: '0.06em' }}>DONE</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Save button */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 11, color: '#333', margin: 0, fontStyle: 'italic' }}>
            Coché en local · Se réinitialise à minuit (Casablanca)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {savedMsg && (
              <span style={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>✓ Sauvegardé dans le calendrier</span>
            )}
            <button onClick={saveNow} disabled={saving}
              style={{
                background: saving ? '#1a1a1a' : GOLD, color: saving ? '#555' : '#000',
                border: 'none', borderRadius: 8, padding: '10px 22px',
                fontSize: 13, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all .2s',
              }}>
              {saving ? 'Sauvegarde…' : '📅 Enregistrer dans le calendrier'}
            </button>
          </div>
        </div>
      </div>

      {/* ── CALENDAR ───────────────────────────────────────── */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 18, padding: 'clamp(20px,4vw,32px)' }}>

        {/* Calendar header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#F0F0F0', textTransform: 'capitalize' }}>{monthLabel}</div>
            <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>
              {daysLogged} jour{daysLogged !== 1 ? 's' : ''} enregistré{daysLogged !== 1 ? 's' : ''}
            </div>
          </div>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8, padding: '8px 16px' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{greenDays}</div>
              <div style={{ fontSize: 10, color: '#2a5a40', fontWeight: 600, letterSpacing: '0.06em' }}>BONS</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 16px' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: RED }}>{redDays}</div>
              <div style={{ fontSize: 10, color: '#5a2a2a', fontWeight: 600, letterSpacing: '0.06em' }}>FAIBLES</div>
            </div>
          </div>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#333', padding: '4px 0', letterSpacing: '0.08em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {/* Offset cells */}
          {Array.from({ length: firstDayMon }, (_, i) => (
            <div key={`off-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d        = i + 1
            const isToday  = d === todayDay
            const isFuture = d > todayDay
            const rec      = recordMap[d]
            const hasData  = rec !== undefined
            const isGreen  = hasData && rec >= 6
            const isRed    = hasData && rec < 6

            let bg      = '#111'
            let border  = 'rgba(255,255,255,0.04)'
            let color   = isFuture ? '#222' : '#555'

            if (isToday)  { bg = 'rgba(212,175,55,0.1)';  border = GOLD;   color = GOLD   }
            if (isGreen)  { bg = 'rgba(29,158,117,0.18)'; border = 'rgba(29,158,117,0.45)'; color = GREEN }
            if (isRed)    { bg = 'rgba(239,68,68,0.14)';  border = 'rgba(239,68,68,0.35)';  color = RED   }
            // Today overrides color even if it has data
            if (isToday && isGreen) border = GREEN
            if (isToday && isRed)   border = RED

            return (
              <div key={d} style={{
                aspectRatio: '1',
                borderRadius: 8,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                background: bg,
                border: `${isToday ? '2px' : '1px'} solid ${border}`,
                color,
                transition: 'all .2s',
                position: 'relative',
                minHeight: 42,
                cursor: hasData ? 'default' : 'default',
              }}>
                <span style={{ fontSize: 13, fontWeight: isToday ? 900 : 500, lineHeight: 1 }}>{d}</span>
                {hasData && (
                  <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.85, lineHeight: 1 }}>{rec}/10</span>
                )}
                {isToday && !hasData && (
                  <span style={{ fontSize: 8, fontWeight: 700, color: GOLD, opacity: 0.7, letterSpacing: '0.04em' }}>AUJ</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { color: GREEN,  bg: 'rgba(29,158,117,0.2)',  border: 'rgba(29,158,117,0.4)',  label: '≥ 6 habitudes' },
            { color: RED,    bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.35)',  label: '< 6 habitudes' },
            { color: GOLD,   bg: 'rgba(212,175,55,0.1)',  border: GOLD,                    label: "Aujourd'hui"   },
            { color: '#333', bg: '#111',                  border: 'rgba(255,255,255,0.05)', label: 'Pas encore'   },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: l.color }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1px solid ${l.border}`, flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
