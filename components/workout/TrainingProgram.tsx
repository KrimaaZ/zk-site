'use client'
import { useState } from 'react'

// ─── Color tokens ──────────────────────────────────────────────────────────
const G = { c: '#1D9E75', bg: '#ebf7f3', border: '#1D9E75', tc: '#0d6b49' }  // chest / back
const B = { c: '#378ADD', bg: '#eaf2fc', border: '#378ADD', tc: '#1e5a9e' }  // shoulder / delt
const P = { c: '#7F77DD', bg: '#f0effc', border: '#7F77DD', tc: '#4a45a0' }  // triceps
const A = { c: '#BA7517', bg: '#fbf3e4', border: '#BA7517', tc: '#7a4c0f' }  // calves / legs
const R = { c: '#E05252', bg: '#fdeaea', border: '#E05252', tc: '#9e2020' }  // lower
const V = { c: '#9B6FE0', bg: '#f5f0fd', border: '#9B6FE0', tc: '#6030a0' }  // biceps / arms

type Token = typeof G
type Ex = { num: number; tok: Token; name: string; detail: string; tip?: string; tipTok?: Token; sets: string; label: string }
type SSEx = { letter: string; tok: Token; name: string; detail: string; tip?: string; tipTok?: Token; sets: string; label: string }
type SS = { header: string; a: SSEx; b: SSEx }
type Pill = { label: string; tok: Token }
type Day = {
  tab: { day: string; name: string; sub: string }
  badge: string; headerBg: string
  title: string; subtitle: string; pills: Pill[]
  compoundLabel: string
  compound?: Ex[]; supersets?: SS[]
  isolation: Ex[]
  coachTip: string
}

// ─── Program data ──────────────────────────────────────────────────────────
const DAYS: Day[] = [
  {
    tab: { day: 'MON', name: 'Push', sub: 'Chest · Delts · Tris' },
    badge: G.c, headerBg: '#f0faf6',
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
    badge: B.c, headerBg: '#f0f6fd',
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
    badge: A.c, headerBg: '#fdf8f0',
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
    badge: P.c, headerBg: '#f5f4fd',
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
    badge: R.c, headerBg: '#fdf5f5',
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
    badge: V.c, headerBg: '#f5f4fd',
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

// ─── Sub-components ────────────────────────────────────────────────────────
function ExerciseRow({ ex }: { ex: Ex }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f9f5ef' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: ex.tok.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2 }}>
        {ex.num}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a1a', marginBottom: 3, lineHeight: 1.3 }}>{ex.name}</div>
        <div style={{ fontSize: 12, color: '#8b5e3c', marginBottom: ex.tip ? 7 : 0 }}>{ex.detail}</div>
        {ex.tip && ex.tipTok && (
          <div style={{ padding: '6px 11px', borderRadius: 7, fontSize: 11, lineHeight: 1.5, background: ex.tipTok.bg, borderLeft: `3px solid ${ex.tipTok.border}`, color: ex.tipTok.tc }}>{ex.tip}</div>
        )}
      </div>
      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 46, paddingTop: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1a3a1a' }}>{ex.sets}</div>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#a07850', marginTop: 1 }}>{ex.label}</div>
      </div>
    </div>
  )
}

function SupersetGroup({ ss }: { ss: SS }) {
  const renderSSEx = (ex: SSEx) => (
    <div style={{ padding: '11px 14px', display: 'flex', gap: 11, alignItems: 'flex-start', borderBottom: '1px solid #f0e8d8' }}>
      <div style={{ width: 22, height: 22, borderRadius: 5, background: ex.tok.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 1 }}>
        {ex.letter}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a1a', marginBottom: 2 }}>{ex.name}</div>
        <div style={{ fontSize: 11, color: '#8b5e3c', marginBottom: ex.tip ? 5 : 0 }}>{ex.detail}</div>
        {ex.tip && ex.tipTok && (
          <div style={{ padding: '5px 9px', borderRadius: 6, fontSize: 11, lineHeight: 1.5, background: ex.tipTok.bg, borderLeft: `3px solid ${ex.tipTok.border}`, color: ex.tipTok.tc }}>{ex.tip}</div>
        )}
      </div>
      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#1a3a1a' }}>{ex.sets}</div>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, color: '#a07850', letterSpacing: '.05em' }}>{ex.label}</div>
      </div>
    </div>
  )
  return (
    <div style={{ border: '1px solid #e8dcc8', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ background: '#f9f5ef', padding: '6px 14px', fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#8b5e3c', borderBottom: '1px solid #e8dcc8', display: 'flex', alignItems: 'center', gap: 6 }}>
        ↺ {ss.header}
      </div>
      {renderSSEx(ss.a)}
      <div style={{ borderBottom: 'none' }}>{renderSSEx(ss.b)}</div>
    </div>
  )
}

function SectionHead({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 0 10px', borderBottom: '1px solid #f0e8d8', marginBottom: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#a07850' }}>{label}</span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function TrainingProgram() {
  const [active, setActive] = useState(0)
  const day = DAYS[active]

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 20 }}>
        {DAYS.map((d, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ flex: 1, minWidth: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '9px 5px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${i === active ? '#1D9E75' : '#e8dcc8'}`, background: i === active ? '#1D9E75' : '#fff', transition: 'all .15s', gap: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', color: i === active ? 'rgba(255,255,255,.7)' : '#a07850' }}>{d.tab.day}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: i === active ? '#fff' : '#1a3a1a' }}>{d.tab.name}</span>
            <span style={{ fontSize: 9, color: i === active ? 'rgba(255,255,255,.8)' : '#8b5e3c', textAlign: 'center', lineHeight: 1.3 }}>{d.tab.sub}</span>
          </button>
        ))}
      </div>

      {/* Day card */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e8dcc8' }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 20px', background: day.headerBg }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', background: day.badge, color: '#fff', marginBottom: 10 }}>
            DAY {active + 1}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a3a1a', marginBottom: 3, letterSpacing: '-.3px' }}>{day.title}</div>
          <div style={{ fontSize: 13, color: '#8b5e3c', marginBottom: 14, lineHeight: 1.5 }}>{day.subtitle}</div>
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
            <div key={i} style={{ borderBottom: i < (day.compound!.length - 1) || day.isolation.length > 0 ? '1px solid #f9f5ef' : 'none' }}>
              <ExerciseRow ex={ex} />
            </div>
          ))}
          {day.supersets && day.supersets.map((ss, i) => <SupersetGroup key={i} ss={ss} />)}
        </div>

        {/* Isolation */}
        <div style={{ padding: '0 24px 8px' }}>
          <SectionHead label="Isolation & Detail Work" />
          {day.isolation.map((ex, i) => (
            <div key={i} style={{ borderBottom: i < day.isolation.length - 1 ? '1px solid #f9f5ef' : 'none' }}>
              <ExerciseRow ex={ex} />
            </div>
          ))}
        </div>

        {/* Coach tip */}
        <div style={{ margin: '4px 24px 24px', padding: '14px 16px', borderRadius: 12, background: '#ebf7f3', borderLeft: '4px solid #1D9E75', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💬</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 3 }}>Coach's Note</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#1a3a1a' }}>{day.coachTip}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
