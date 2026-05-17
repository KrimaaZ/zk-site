'use client'

import { useEffect, useRef, useState } from 'react'

const HABITS = [
  { key: 'DIET',            label: 'Diet',           emoji: '🥗' },
  { key: 'TRAINING',        label: 'Training',       emoji: '🏋️' },
  { key: 'STUDY',           label: 'Study',          emoji: '📚' },
  { key: '3L WATER',        label: '3L Water',       emoji: '💧' },
  { key: '2H SCREEN TIME',  label: '2h Screen Time', emoji: '📵' },
  { key: 'JOURNALING',      label: 'Journaling',     emoji: '📓' },
  { key: 'MEDITATION',      label: 'Meditation',     emoji: '🧘' },
]

type DayData  = { habits: Record<string, boolean>; score: number; completedCount: number }
type ProgData = Record<string, DayData>

const STORAGE_KEY = 'progression_data'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function loadProg(): ProgData {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveProg(d: ProgData) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }
function formatToday() {
  return new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}
function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i))
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  })
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
      <div style={{ width:3, height:16, background:'#D4AF37', borderRadius:2, flexShrink:0 }} />
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'#888888' }}>{label}</span>
    </div>
  )
}

export default function ProgressionTracker() {
  const today = todayKey()
  const [prog, setProg]       = useState<ProgData>({})
  const [habits, setHabits]   = useState<Record<string,boolean>>({})
  const [score, setScore]     = useState(0)
  const [saved, setSaved]     = useState(false)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const data = loadProg()
    setProg(data)
    if (data[today]) { setHabits(data[today].habits || {}); setScore(data[today].score || 0); setSaved(true) }
  }, [today])

  useEffect(() => {
    if (!canvasRef.current) return
    const days      = lastNDays(30)
    const scores    = days.map(d => prog[d]?.score ?? null)
    const habitPcts = days.map(d => prog[d] ? parseFloat(((prog[d].completedCount / HABITS.length) * 10).toFixed(1)) : null)
    const labels    = days.map(d => { const [,m,day] = d.split('-'); return `${day}/${m}` })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any
    async function build() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }
      if (!canvasRef.current) return
      chart = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Day Score',
              data: scores,
              borderColor: '#1D9E75',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pointBackgroundColor: scores.map((s: any) => s !== null && s >= 6 ? '#1D9E75' : '#ef4444') as string[],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pointBorderColor: scores.map((s: any) => s !== null && s >= 6 ? '#1D9E75' : '#ef4444') as string[],
              spanGaps: true,
            },
            {
              label: 'Habit %',
              data: habitPcts,
              borderColor: '#D4AF37',
              backgroundColor: 'transparent',
              borderWidth: 2,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              borderDash: [5,5] as any,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#D4AF37',
              spanGaps: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, position: 'top',
              labels: { font:{ size:11 }, color:'#888888', usePointStyle:true, padding:16 },
            },
            tooltip: { mode:'index', intersect:false },
          },
          scales: {
            y: {
              min: 0, max: 10,
              ticks: { stepSize:2, color:'#555555', font:{ size:10 } },
              grid: { color:'#1a1a1a' },
            },
            x: {
              ticks: { color:'#555555', font:{ size:9 }, maxRotation:45, minRotation:0 },
              grid: { display:false },
            },
          },
        },
        plugins: [{
          id: 'threshold',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          afterDraw(ch: any) {
            const { ctx, chartArea, scales } = ch
            if (!chartArea) return
            const y = scales.y.getPixelForValue(6)
            ctx.save()
            ctx.setLineDash([6,4])
            ctx.strokeStyle = 'rgba(239,68,68,0.45)'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(chartArea.left, y); ctx.lineTo(chartArea.right, y); ctx.stroke()
            ctx.restore()
          },
        }],
      })
      chartRef.current = chart
    }
    build()
    return () => { chart?.destroy(); chartRef.current = null }
  }, [prog])

  const completedCount = HABITS.filter(h => habits[h.key]).length

  const toggleHabit = (key: string) => { setHabits(prev => ({ ...prev, [key]: !prev[key] })); setSaved(false) }

  const resetDay = () => {
    if (!confirm('Reset all habits for today?')) return
    setHabits({}); setScore(0); setSaved(false)
    const updated = { ...prog }; delete updated[today]
    setProg(updated); saveProg(updated)
  }

  const saveDay = () => {
    const entry: DayData = { habits, score, completedCount }
    const updated = { ...prog, [today]: entry }
    setProg(updated); saveProg(updated); setSaved(true)
  }

  const calCells = () => {
    let startDow = new Date(calYear, calMonth, 1).getDay()
    startDow = startDow === 0 ? 6 : startDow - 1
    const total = new Date(calYear, calMonth + 1, 0).getDate()
    const cells: (number|null)[] = []
    for (let i = 0; i < startDow; i++) cells.push(null)
    for (let i = 1; i <= total; i++) cells.push(i)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }
  const calKey = (day: number) =>
    `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const nowDate   = new Date()
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString('en-GB', { month:'long', year:'numeric' })

  const navBtn = (label: string, onClick: () => void) => (
    <button onClick={onClick}
      style={{ width:32, height:32, borderRadius:8, border:'1px solid #2a2a2a', background:'#1a1a1a', cursor:'pointer', fontSize:16, color:'#C0C0C0', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {label}
    </button>
  )

  const card: React.CSSProperties = {
    background: '#111111',
    borderRadius: 16,
    border: '1px solid #2a2a2a',
    padding: 24,
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* ══ SECTION 1: Habit Tracker ══ */}
      <div style={card}>
        <SectionTitle label="Daily Habit Tracker" />
        <div style={{ fontSize:14, fontWeight:600, color:'#E8E8E8', marginBottom:14 }}>{formatToday()}</div>

        {/* Progress bar */}
        <div style={{ marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:'#888888' }}>Daily Progress</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#1D9E75' }}>{completedCount} / 7</span>
          </div>
          <div style={{ height:8, background:'#1a1a1a', borderRadius:100, overflow:'hidden' }}>
            <div style={{
              height:'100%',
              width:`${(completedCount/7)*100}%`,
              background: completedCount===7 ? '#1D9E75' : completedCount>=4 ? '#52b788' : '#BA7517',
              borderRadius:100, transition:'width .35s ease',
            }} />
          </div>
        </div>

        {/* Habit rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:18 }}>
          {HABITS.map(h => {
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

        <button onClick={resetDay}
          style={{ fontSize:12, fontWeight:600, color:'#888888', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
          Reset Day
        </button>
      </div>

      {/* ══ SECTION 2: Score + Chart ══ */}
      <div style={card}>
        <SectionTitle label="Daily Score & Progression" />
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#C0C0C0', marginBottom:10 }}>Rate your day</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
            {Array.from({ length:10 }, (_,i) => i+1).map(n => (
              <button key={n} onClick={() => { setScore(n); setSaved(false) }}
                style={{
                  width:38, height:38, borderRadius:9,
                  border:`2px solid ${score===n ? '#D4AF37' : '#2a2a2a'}`,
                  background: score===n ? '#D4AF37' : '#1a1a1a',
                  color: score===n ? '#0a0a0a' : '#888888',
                  fontWeight:700, fontSize:13, cursor:'pointer', transition:'all .15s',
                }}>
                {n}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={saveDay} disabled={score===0}
              style={{
                padding:'9px 22px', borderRadius:10, border:'none',
                background: score===0 ? '#1a1a1a' : '#1D9E75',
                color: score===0 ? '#555' : '#fff',
                fontWeight:700, fontSize:13,
                cursor: score===0 ? 'not-allowed' : 'pointer', transition:'background .15s',
              }}>
              Save Day
            </button>
            {saved && <span style={{ fontSize:12, fontWeight:700, color:'#1D9E75', display:'flex', alignItems:'center', gap:4 }}>✓ Day saved</span>}
          </div>
        </div>
        <div style={{ height:260, position:'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* ══ SECTION 3: Monthly Calendar ══ */}
      <div style={card}>
        <SectionTitle label="Monthly Overview" />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          {navBtn('‹', () => { const d = new Date(calYear, calMonth-1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()) })}
          <span style={{ fontWeight:700, fontSize:14, color:'#F0F0F0' }}>{monthLabel}</span>
          {navBtn('›', () => { const d = new Date(calYear, calMonth+1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()) })}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3, marginBottom:4 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#555555', letterSpacing:'.04em', padding:'3px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3 }}>
          {calCells().map((day, i) => {
            if (!day) return <div key={i} style={{ aspectRatio:'1' }} />
            const key   = calKey(day)
            const entry = prog[key]
            const isToday = calYear===nowDate.getFullYear() && calMonth===nowDate.getMonth() && day===nowDate.getDate()
            let bg = '#1a1a1a', textColor = '#555555', border = '1px solid #2a2a2a'
            if (entry?.score) {
              bg = entry.score >= 6 ? '#1D9E75' : '#ef4444'
              textColor = '#fff'
              border = `1px solid ${entry.score >= 6 ? '#158a61' : '#dc2626'}`
            }
            if (isToday) border = `2px solid ${entry?.score ? '#D4AF37' : '#D4AF37'}`
            return (
              <div key={i} style={{ aspectRatio:'1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', borderRadius:8, background:bg, border, color:textColor }}>
                <span style={{ fontSize:12, fontWeight:isToday ? 800 : 500, lineHeight:1 }}>{day}</span>
                {entry?.score ? <span style={{ fontSize:9, fontWeight:700, opacity:.9, lineHeight:1, marginTop:1 }}>{entry.score}</span> : null}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
