'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Color tokens (dark theme) ────────────────────────────────────────────────
const G = { c: '#1D9E75', bg: 'rgba(29,158,117,0.10)', border: '#1D9E75', tc: '#4DC99A' }
const B = { c: '#378ADD', bg: 'rgba(55,138,221,0.10)', border: '#378ADD', tc: '#7BBFED' }
const P = { c: '#7F77DD', bg: 'rgba(127,119,221,0.10)', border: '#7F77DD', tc: '#B0ABEE' }
const A = { c: '#BA7517', bg: 'rgba(186,117,23,0.10)', border: '#BA7517', tc: '#DDA44B' }
const R = { c: '#E05252', bg: 'rgba(224,82,82,0.10)', border: '#E05252', tc: '#EE8A8A' }
const V = { c: '#9B6FE0', bg: 'rgba(155,111,224,0.10)', border: '#9B6FE0', tc: '#C4A9EE' }

type Token = typeof G
type Ex    = { num: number; tok: Token; name: string; detail: string; tip?: string; tipTok?: Token; sets: string; label: string }
type SSEx  = { letter: string; tok: Token; name: string; detail: string; tip?: string; tipTok?: Token; sets: string; label: string }
type SS    = { header: string; a: SSEx; b: SSEx }
type Pill  = { label: string; tok: Token }
type Day   = {
  tab: { day: string; name: string; sub: string }
  badge: string; headerBg: string
  title: string; subtitle: string; pills: Pill[]
  compoundLabel: string
  compound?: Ex[]; supersets?: SS[]
  isolation: Ex[]
  coachTip: string
}

// ─── Tracking storage (DB-backed) ────────────────────────────────────────────
type SetEntry = { id: number; reps: number; kg: number }
type LogData  = Record<string, SetEntry[]>

function useLog() {
  const [log, setLog]       = useState<LogData>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/workout-sets')
      .then(r => r.json())
      .then((sets: SetEntry[] & { logKey: string }[]) => {
        const map: LogData = {}
        for (const s of sets) {
          const k = (s as unknown as { logKey: string }).logKey
          if (!map[k]) map[k] = []
          map[k].push({ id: s.id, reps: s.reps, kg: s.kg })
        }
        setLog(map)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const addSet = useCallback(async (key: string, entry: Omit<SetEntry, 'id'>) => {
    const res = await fetch('/api/workout-sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logKey: key, reps: entry.reps, kg: entry.kg }),
    })
    const saved: SetEntry & { logKey: string } = await res.json()
    setLog(prev => ({ ...prev, [key]: [...(prev[key] || []), { id: saved.id, reps: saved.reps, kg: saved.kg }] }))
  }, [])

  const removeSet = useCallback(async (key: string, id: number) => {
    setLog(prev => ({ ...prev, [key]: (prev[key] || []).filter(s => s.id !== id) }))
    await fetch(`/api/workout-sets?id=${id}`, { method: 'DELETE' })
  }, [])

  return { log, addSet, removeSet, loaded }
}

// ─── Tracking section ─────────────────────────────────────────────────────────
function TrackRow({
  logKey, log, addSet, removeSet, color,
}: {
  logKey: string; log: LogData
  addSet: (k: string, e: Omit<SetEntry, 'id'>) => void
  removeSet: (k: string, id: number) => void
  color: string
}) {
  const [open, setOpen]   = useState(false)
  const [reps, setReps]   = useState('')
  const [kg,   setKg]     = useState('')
  const sets = log[logKey] || []

  const confirm = () => {
    const r = parseInt(reps), k = parseFloat(kg)
    if (!r || isNaN(k) || k < 0) return
    addSet(logKey, { reps: r, kg: k })
    setReps(''); setKg('')
    setOpen(false)
  }

  const inp: React.CSSProperties = {
    width: 64, padding: '5px 8px', borderRadius: 8,
    border: '1px solid #2a2a2a', backgroundColor: '#0a0a0a',
    color: '#E8E8E8', fontSize: 12, outline: 'none', textAlign: 'center',
  }

  return (
    <div style={{ marginTop: 8, marginBottom: 2 }}>
      {/* Logged sets table */}
      {sets.length > 0 && (
        <div style={{ marginBottom: 7, borderRadius: 8, overflow: 'hidden', border: '1px solid #1a1a1a' }}>
          {sets.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px',
              backgroundColor: i % 2 === 0 ? '#111111' : '#0f0f0f',
              borderBottom: i < sets.length - 1 ? '1px solid #1a1a1a' : 'none',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: color, minWidth: 54, letterSpacing: '.04em' }}>
                Série {i + 1}
              </span>
              <span style={{ fontSize: 11, color: '#C0C0C0', flex: 1 }}>
                {s.reps} reps
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37' }}>
                {s.kg} kg
              </span>
              <button
                onClick={() => removeSet(logKey, s.id)}
                style={{ fontSize: 13, color: '#c0303e', background: 'rgba(192,48,62,0.12)', border: 'none', borderRadius: 6, padding: '1px 7px', cursor: 'pointer', lineHeight: 1.5 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add row */}
      {open ? (
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number" value={reps} onChange={e => setReps(e.target.value)}
            placeholder="Reps" min={1}
            style={inp}
            onKeyDown={e => e.key === 'Enter' && confirm()}
          />
          <input
            type="number" value={kg} onChange={e => setKg(e.target.value)}
            placeholder="Kg" min={0} step={0.5}
            style={inp}
            onKeyDown={e => e.key === 'Enter' && confirm()}
          />
          <button onClick={confirm}
            style={{ padding: '5px 12px', borderRadius: 8, backgroundColor: color, color: '#fff', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ✓
          </button>
          <button onClick={() => { setOpen(false); setReps(''); setKg('') }}
            style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: '#1a1a1a', color: '#555', fontSize: 13, border: '1px solid #2a2a2a', cursor: 'pointer' }}>
            ×
          </button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 11px', borderRadius: 8,
            backgroundColor: 'rgba(212,175,55,0.06)',
            border: '1px dashed rgba(212,175,55,0.25)',
            color: '#D4AF37', fontSize: 10, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '.04em',
          }}>
          + Ajouter une série{sets.length > 0 ? ` · ${sets.length} enregistrée${sets.length > 1 ? 's' : ''}` : ''}
        </button>
      )}
    </div>
  )
}

// ─── Program data ──────────────────────────────────────────────────────────────
const DAYS: Day[] = [
  {
    tab: { day: 'MON', name: 'Push', sub: 'Chest · Delts · Tris' },
    badge: G.c, headerBg: 'rgba(29,158,117,0.06)',
    title: 'Push Day',
    subtitle: 'Chest · Shoulders · Triceps — Building V-taper width and upper chest mass',
    pills: [{ label: 'Upper Chest', tok: G }, { label: 'Mid Chest', tok: G }, { label: 'Front Delt', tok: B }, { label: 'Side Delt', tok: B }, { label: 'Triceps Long Head', tok: P }],
    compoundLabel: 'Compound Foundation',
    compound: [
      { num: 1, tok: G, name: 'Incline Barbell Press',            detail: '4 sets · 8 reps · 2 min rest',   tip: 'Upper chest builds the V-taper illusion — prioritise this movement', tipTok: G, sets: '4×8',  label: 'primary'    },
      { num: 2, tok: G, name: 'Flat Dumbbell Press',               detail: '3 sets · 10 reps · 90 sec rest',                                                                                        sets: '3×10', label: 'chest'      },
      { num: 3, tok: B, name: 'Seated Dumbbell Shoulder Press',    detail: '3 sets · 10 reps · 90 sec rest',                                                                                        sets: '3×10', label: 'primary'    },
    ],
    isolation: [
      { num: 4, tok: B, name: 'Cable Lateral Raise',               detail: '3 sets · 15 reps · 60 sec rest', tip: 'Cable keeps tension at peak contraction — this is your width builder',           tipTok: B, sets: '3×15', label: 'width'      },
      { num: 5, tok: G, name: 'Cable Fly — Low to High',           detail: '3 sets · 12 reps · 60 sec rest', tip: 'Targets upper chest fiber direction for maximum development',                     tipTok: G, sets: '3×12', label: 'upper chest'},
      { num: 6, tok: P, name: 'Overhead Cable Tricep Extension',   detail: '3 sets · 12 reps · 60 sec rest', tip: 'Long head stretch under load = arm mass and definition',                         tipTok: P, sets: '3×12', label: 'mass'       },
      { num: 7, tok: P, name: 'Rope Tricep Pushdown',              detail: '3 sets · 15 reps · Drop set on last',                                                                                   sets: '3×15', label: 'finisher'   },
    ],
    coachTip: 'End with a brutal pump drop set to failure on the last exercise. The pump drives nutrient delivery and hypertrophic signalling into the muscle.',
  },
  {
    tab: { day: 'TUE', name: 'Pull', sub: 'Back · Rear · Bis' },
    badge: B.c, headerBg: 'rgba(55,138,221,0.06)',
    title: 'Pull Day',
    subtitle: 'Back · Rear Delt · Biceps — Back width is V-taper width',
    pills: [{ label: 'Lats', tok: G }, { label: 'Upper Back', tok: G }, { label: 'Rhomboids', tok: G }, { label: 'Rear Delt', tok: B }, { label: 'Biceps', tok: P }],
    compoundLabel: 'Compound Foundation',
    compound: [
      { num: 1, tok: G, name: 'Wide-Grip Pull-Up / Lat Pulldown',  detail: '4 sets · 8 reps · 2 min rest',   tip: 'Think elbows to pockets — pull with your back, not your arms',  tipTok: G, sets: '4×8',  label: 'width'     },
      { num: 2, tok: G, name: 'Barbell Bent-Over Row',             detail: '4 sets · 8 reps · 2 min rest',   tip: 'Overhand grip, 45° torso, drive elbows back through the movement', tipTok: G, sets: '4×8',  label: 'thickness' },
      { num: 3, tok: G, name: 'Seated Cable Row — Close Grip',     detail: '3 sets · 10 reps · 90 sec rest', tip: 'Pause 1 sec at peak contraction — squeeze shoulder blades hard',   tipTok: G, sets: '3×10', label: 'detail'    },
    ],
    isolation: [
      { num: 4, tok: B, name: 'Face Pull',                         detail: '3 sets · 15 reps · 60 sec rest', tip: 'Non-negotiable for V-shape — pull to forehead, external rotate at peak', tipTok: B, sets: '3×15', label: 'health' },
      { num: 5, tok: G, name: 'Single-Arm Dumbbell Row',           detail: '3 sets · 10 reps each · 60 sec rest',                                                                                   sets: '3×10', label: 'mass'   },
      { num: 6, tok: P, name: 'Incline Dumbbell Curl',             detail: '3 sets · 10 reps · 60 sec rest', tip: 'Full stretch at the bottom = peak bicep development',                tipTok: P, sets: '3×10', label: 'peak'   },
      { num: 7, tok: P, name: 'Hammer Curl',                       detail: '3 sets · 12 reps · 60 sec rest',                                                                                        sets: '3×12', label: 'width'  },
    ],
    coachTip: 'Back width equals V-taper width. Visualize your lats spreading like wings on every single rep — the mind-muscle connection on pull day is everything.',
  },
  {
    tab: { day: 'WED', name: 'Legs', sub: 'Quads · Hams · Glutes' },
    badge: A.c, headerBg: 'rgba(186,117,23,0.06)',
    title: 'Leg Day',
    subtitle: 'Quads · Hamstrings · Glutes · Calves — Go deep, go heavy, embrace the burn',
    pills: [{ label: 'Quads', tok: A }, { label: 'Hamstrings', tok: A }, { label: 'Glutes', tok: A }, { label: 'Calves', tok: A }],
    compoundLabel: 'Compound Foundation',
    compound: [
      { num: 1, tok: A, name: 'Barbell Back Squat',                detail: '4 sets · 8 reps · 2–3 min rest', tip: 'Break parallel, drive knees out, keep chest tall through the range', tipTok: A, sets: '4×8',  label: 'primary' },
      { num: 2, tok: A, name: 'Romanian Deadlift',                 detail: '3 sets · 10 reps · 2 min rest',  tip: 'Hinge not squat — feel the hamstring stretch at the bottom',         tipTok: A, sets: '3×10', label: 'hinge'   },
      { num: 3, tok: A, name: 'Leg Press — Feet High & Wide',      detail: '3 sets · 12 reps · 90 sec rest',                                                                                        sets: '3×12', label: 'volume'  },
    ],
    isolation: [
      { num: 4, tok: A, name: 'Leg Extension',                     detail: '3 sets · 12 reps · 60 sec rest', tip: 'Hold peak contraction for 1 full second on every rep',               tipTok: A, sets: '3×12', label: 'quad'     },
      { num: 5, tok: A, name: 'Lying Leg Curl',                    detail: '3 sets · 12 reps · 60 sec rest',                                                                                        sets: '3×12', label: 'hamstring' },
      { num: 6, tok: A, name: 'Standing Calf Raise',               detail: '4 sets · 20 reps · 60 sec rest', tip: '3 sec negative, full stretch at the bottom — range of motion is key', tipTok: A, sets: '4×20', label: 'calves'   },
    ],
    coachTip: 'Go deep, go heavy, embrace the burn. Leg training is where mental toughness meets physical results — nobody built a great physique skipping leg day.',
  },
  {
    tab: { day: 'THU', name: 'Upper', sub: 'Chest · Back · Delts' },
    badge: P.c, headerBg: 'rgba(127,119,221,0.06)',
    title: 'Upper Day',
    subtitle: 'Chest · Back · Shoulders — Antagonist superset format for maximum volume',
    pills: [{ label: 'Chest', tok: G }, { label: 'Lats', tok: G }, { label: 'Upper Back', tok: G }, { label: 'Side Delt', tok: B }],
    compoundLabel: 'Compound Foundation — Superset Pairs',
    supersets: [
      {
        header: 'Superset 1 — A then B, no rest between · 90 sec after B',
        a: { letter: 'A', tok: G, name: 'Dumbbell Incline Press',         detail: '4 sets · 10 reps', tip: 'Upper chest emphasis — 2 sec eccentric, explosive press',             tipTok: G, sets: '4×10', label: 'push' },
        b: { letter: 'B', tok: G, name: 'Chest-Supported Dumbbell Row',   detail: '4 sets · 10 reps', tip: 'Antagonist superset = more volume, better pump, less time',           tipTok: G, sets: '4×10', label: 'pull' },
      },
      {
        header: 'Superset 2 — A then B, no rest between · 60 sec after B',
        a: { letter: 'A', tok: B, name: 'Lateral Raise Drop Set',         detail: '3 sets · 15 reps, drop, 15 more', tip: "Width builder — don't chase weight at the cost of form", tipTok: B, sets: '3×15+', label: 'width' },
        b: { letter: 'B', tok: G, name: 'Straight-Arm Pulldown',          detail: '3 sets · 15 reps', tip: 'Pure lat isolation — keep arms straight and feel the sweep',         tipTok: G, sets: '3×15', label: 'lat'  },
      },
    ],
    isolation: [
      { num: 3, tok: G, name: 'Cable Crossover — High to Low',     detail: '3 sets · 12 reps · 60 sec rest',                                                                sets: '3×12', label: 'chest' },
      { num: 4, tok: B, name: 'Upright Row — Cable or EZ Bar',     detail: '3 sets · 12 reps · 60 sec rest',                                                                sets: '3×12', label: 'delt'  },
    ],
    coachTip: 'Every push pairs with a pull. Antagonist training builds the symmetry that separates a great physique from a good one — push the pace, minimal rest between pairs.',
  },
  {
    tab: { day: 'FRI', name: 'Lower', sub: 'Quads · PC · Glutes' },
    badge: R.c, headerBg: 'rgba(224,82,82,0.06)',
    title: 'Lower Day',
    subtitle: 'Quad Focus · Posterior Chain — Two leg days is the difference between good and great',
    pills: [{ label: 'Quads', tok: R }, { label: 'Hamstrings', tok: R }, { label: 'Glutes', tok: R }, { label: 'Soleus', tok: A }],
    compoundLabel: 'Compound Foundation',
    compound: [
      { num: 1, tok: R, name: 'Hack Squat Machine',                detail: '4 sets · 10 reps · 2 min rest',  tip: 'Feet low for max quad recruitment — narrow stance for teardrop', tipTok: R, sets: '4×10', label: 'quad'      },
      { num: 2, tok: R, name: 'Sumo Deadlift / Trap Bar Deadlift', detail: '3 sets · 6 reps · 3 min rest',                                                                                 sets: '3×6',  label: 'hinge'     },
      { num: 3, tok: R, name: 'Bulgarian Split Squat',             detail: '3 sets · 10 reps per leg · 90 sec rest',                                                                       sets: '3×10', label: 'unilateral' },
    ],
    isolation: [
      { num: 4, tok: R, name: 'Seated Leg Curl',                   detail: '3 sets · 12 reps · 60 sec rest', tip: 'Seated hits the upper hamstring head — different feel to lying curl', tipTok: R, sets: '3×12', label: 'hamstring' },
      { num: 5, tok: A, name: 'Seated Calf Raise',                 detail: '4 sets · 20 reps · 60 sec rest', tip: 'Targets the soleus — a completely different muscle to standing',      tipTok: A, sets: '4×20', label: 'soleus'    },
      { num: 6, tok: R, name: 'Hip Thrust — Barbell or Machine',   detail: '3 sets · 12 reps · 90 sec rest',                                                                               sets: '3×12', label: 'glutes'    },
    ],
    coachTip: 'Two dedicated leg days is the difference between good and great physiques. Your lower body is half your muscle mass — train it like it matters, because it does.',
  },
  {
    tab: { day: 'SAT', name: 'Arms', sub: 'Bis · Tris · Forearms' },
    badge: V.c, headerBg: 'rgba(155,111,224,0.06)',
    title: 'Arms Day',
    subtitle: 'Biceps · Triceps · Forearms — Sculpted, not just big',
    pills: [{ label: 'Biceps Long Head', tok: V }, { label: 'Biceps Short Head', tok: V }, { label: 'Triceps Long Head', tok: P }, { label: 'Forearms', tok: P }],
    compoundLabel: 'Compound Foundation',
    compound: [
      { num: 1, tok: V, name: 'EZ-Bar Preacher Curl',              detail: '4 sets · 10 reps · 90 sec rest', tip: "Larry Scott's signature move — best for bicep peak development",    tipTok: V, sets: '4×10', label: 'peak'    },
      { num: 2, tok: V, name: 'Cable Curl — Low Pulley',           detail: '3 sets · 12 reps · 60 sec rest', tip: 'Constant tension throughout full range — cable never lets up',       tipTok: V, sets: '3×12', label: 'tension' },
      { num: 3, tok: P, name: 'Close-Grip Bench Press',            detail: '4 sets · 8 reps · 2 min rest',   tip: 'Heaviest tricep movement — elbows tucked, press through the tris',  tipTok: P, sets: '4×8',  label: 'primary' },
    ],
    isolation: [
      { num: 4, tok: V, name: 'Concentration Curl',                detail: '3 sets · 12 reps · 60 sec rest', tip: "Arnold's signature isolation move — squeeze hard at the top",        tipTok: V, sets: '3×12', label: 'isolation' },
      { num: 5, tok: P, name: 'Skull Crusher — EZ Bar',            detail: '3 sets · 10 reps · 90 sec rest',                                                                               sets: '3×10', label: 'mass'      },
      { num: 6, tok: P, name: 'Single-Arm Overhead DB Extension',  detail: '3 sets · 12 reps · 60 sec rest',                                                                               sets: '3×12', label: 'stretch'   },
      { num: 7, tok: P, name: 'Reverse Curl + Wrist Curl',         detail: '2 sets · 15 reps · 60 sec rest', tip: 'Thick forearms signal strength — the finishing touch to complete arms', tipTok: P, sets: '2×15', label: 'forearms'  },
    ],
    coachTip: 'A dedicated arm session builds sculpted arms, not just big ones. Control every rep, feel every contraction — this day is about precision over ego.',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────
function ExerciseRow({ ex, dayIdx, log, addSet, removeSet }: {
  ex: Ex; dayIdx: number
  log: LogData
  addSet: (k: string, e: Omit<SetEntry, 'id'>) => void
  removeSet: (k: string, id: number) => void
}) {
  const logKey = `${dayIdx}_${ex.name}`
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: ex.tok.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2 }}>
          {ex.num}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F0F0', marginBottom: 3, lineHeight: 1.3 }}>{ex.name}</div>
          <div style={{ fontSize: 12, color: '#888888', marginBottom: ex.tip ? 7 : 0 }}>{ex.detail}</div>
          {ex.tip && ex.tipTok && (
            <div style={{ padding: '6px 11px', borderRadius: 7, fontSize: 11, lineHeight: 1.5, background: ex.tipTok.bg, borderLeft: `3px solid ${ex.tipTok.border}`, color: ex.tipTok.tc }}>
              {ex.tip}
            </div>
          )}
          <TrackRow logKey={logKey} log={log} addSet={addSet} removeSet={removeSet} color={ex.tok.c} />
        </div>
        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 46, paddingTop: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#F0F0F0' }}>{ex.sets}</div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#555555', marginTop: 1 }}>{ex.label}</div>
        </div>
      </div>
    </div>
  )
}

function SupersetGroup({ ss, dayIdx, log, addSet, removeSet }: {
  ss: SS; dayIdx: number
  log: LogData
  addSet: (k: string, e: Omit<SetEntry, 'id'>) => void
  removeSet: (k: string, id: number) => void
}) {
  const renderSSEx = (ex: SSEx) => {
    const logKey = `${dayIdx}_${ex.name}`
    return (
      <div style={{ padding: '11px 14px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: ex.tok.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 1 }}>
            {ex.letter}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 2 }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: '#888888', marginBottom: ex.tip ? 5 : 0 }}>{ex.detail}</div>
            {ex.tip && ex.tipTok && (
              <div style={{ padding: '5px 9px', borderRadius: 6, fontSize: 11, lineHeight: 1.5, background: ex.tipTok.bg, borderLeft: `3px solid ${ex.tipTok.border}`, color: ex.tipTok.tc }}>
                {ex.tip}
              </div>
            )}
            <TrackRow logKey={logKey} log={log} addSet={addSet} removeSet={removeSet} color={ex.tok.c} />
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#F0F0F0' }}>{ex.sets}</div>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, color: '#555555', letterSpacing: '.05em' }}>{ex.label}</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ background: '#1a1a1a', padding: '6px 14px', fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#888888', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 6 }}>
        ↺ {ss.header}
      </div>
      {renderSSEx(ss.a)}
      <div>{renderSSEx(ss.b)}</div>
    </div>
  )
}

function SectionHead({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 0 10px', borderBottom: '1px solid #1a1a1a', marginBottom: 2 }}>
      <span style={{ width: 3, height: 12, borderRadius: 2, background: '#D4AF37', flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#888888' }}>{label}</span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function TrainingProgram() {
  const [active, setActive] = useState(0)
  const { log, addSet, removeSet } = useLog()
  const day = DAYS[active]

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 20 }}>
        {DAYS.map((d, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{
              flex: 1, minWidth: 72, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '9px 5px', borderRadius: 12, cursor: 'pointer',
              border: `1px solid ${i === active ? d.badge : '#2a2a2a'}`,
              background: i === active ? `${d.badge}20` : '#111111',
              transition: 'all .15s', gap: 1,
            }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', color: i === active ? d.badge : '#555555' }}>{d.tab.day}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: i === active ? d.badge : '#C0C0C0' }}>{d.tab.name}</span>
            <span style={{ fontSize: 9, color: i === active ? `${d.badge}cc` : '#444444', textAlign: 'center', lineHeight: 1.3 }}>{d.tab.sub}</span>
          </button>
        ))}
      </div>

      {/* Day card */}
      <div style={{ background: '#111111', borderRadius: 16, overflow: 'hidden', border: '1px solid #2a2a2a' }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 20px', background: day.headerBg, borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', background: day.badge, color: '#fff', marginBottom: 10 }}>
            DAY {active + 1}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F0F0F0', marginBottom: 3, letterSpacing: '-.3px' }}>{day.title}</div>
          <div style={{ fontSize: 13, color: '#888888', marginBottom: 14, lineHeight: 1.5 }}>{day.subtitle}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {day.pills.map((p, i) => (
              <span key={i} style={{ padding: '3px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: p.tok.bg, color: p.tok.tc }}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* Compound / Supersets */}
        <div style={{ padding: '0 24px 8px' }}>
          <SectionHead label={day.compoundLabel} />
          {day.compound && day.compound.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} dayIdx={active} log={log} addSet={addSet} removeSet={removeSet} />
          ))}
          {day.supersets && day.supersets.map((ss, i) => (
            <SupersetGroup key={i} ss={ss} dayIdx={active} log={log} addSet={addSet} removeSet={removeSet} />
          ))}
        </div>

        {/* Isolation */}
        <div style={{ padding: '0 24px 8px' }}>
          <SectionHead label="Isolation & Detail Work" />
          {day.isolation.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} dayIdx={active} log={log} addSet={addSet} removeSet={removeSet} />
          ))}
        </div>

        {/* Coach tip */}
        <div style={{ margin: '4px 24px 24px', padding: '14px 16px', borderRadius: 12, background: 'rgba(29,158,117,0.08)', borderLeft: '4px solid #1D9E75', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💬</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 3 }}>Coach's Note</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#C0C0C0' }}>{day.coachTip}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
