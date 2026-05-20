'use client'

import { useEffect, useRef, useState } from 'react'

const WORK_MIN       = 25
const SHORT_REST_MIN = 5
const LONG_REST_MIN  = 15

type Mode = 'work' | 'short' | 'long'

const MODES: { key: Mode; label: string; emoji: string; min: number; color: string; bg: string; border: string }[] = [
  { key: 'work',  label: 'Focus',       emoji: '💪', min: WORK_MIN,       color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  { key: 'short', label: 'Pause courte',emoji: '☕', min: SHORT_REST_MIN, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)' },
  { key: 'long',  label: 'Pause longue',emoji: '🛌', min: LONG_REST_MIN,  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)' },
]

function beep(ctx: AudioContext, freq: number, duration: number, vol = 0.4) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playTransition(ctx: AudioContext, toWork: boolean) {
  if (toWork) {
    beep(ctx, 440, 0.15)
    setTimeout(() => beep(ctx, 550, 0.15), 160)
    setTimeout(() => beep(ctx, 660, 0.25), 320)
  } else {
    beep(ctx, 660, 0.2, 0.3)
    setTimeout(() => beep(ctx, 550, 0.2, 0.3), 220)
    setTimeout(() => beep(ctx, 440, 0.35, 0.3), 440)
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function PomodoroPage() {
  const [mode,    setMode]    = useState<Mode>('work')
  const [seconds, setSeconds] = useState(WORK_MIN * 60)
  const [running, setRunning] = useState(false)
  const [cycles,  setCycles]  = useState(0)

  const audioRef    = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getAudio = () => {
    if (!audioRef.current) audioRef.current = new AudioContext()
    return audioRef.current
  }

  const currentMode = MODES.find(m => m.key === mode)!

  // Switch mode manually — stops timer and resets to new duration
  const switchMode = (m: Mode) => {
    setRunning(false)
    setMode(m)
    setSeconds(MODES.find(x => x.key === m)!.min * 60)
  }

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1
        // Auto-transition: rest → work only
        const next: Mode = mode !== 'work' ? 'work' : 'short'
        playTransition(getAudio(), next === 'work')
        setMode(next)
        setSeconds(MODES.find(x => x.key === next)!.min * 60)
        if (mode === 'work') setCycles(c => c + 1)
        return 0
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode])

  const start = () => { getAudio(); setRunning(true) }
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setMode('work')
    setSeconds(WORK_MIN * 60)
    setCycles(0)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const total = currentMode.min * 60
  const pct   = ((total - seconds) / total) * 100

  const r           = 110
  const cx          = 140
  const circumference = 2 * Math.PI * r
  const dash        = circumference - (pct / 100) * circumference

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingTop: 32, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 16px', borderRadius: 999,
          background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 14 }}>🍅</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#8B5CF6' }}>
            Pomodoro
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#E2E8F0', margin: 0 }}>
          Focus Timer
        </h1>
      </div>

      {/* Mode selector tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {MODES.map(m => {
          const active = mode === m.key
          return (
            <button key={m.key} onClick={() => switchMode(m.key)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 14,
                border: `1px solid ${active ? m.color : '#1e1e2e'}`,
                background: active ? m.bg : '#0d0d1a',
                color: active ? m.color : '#475569',
                cursor: 'pointer', transition: 'all .2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
              <span style={{ fontSize: 18 }}>{m.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' as const }}>
                {m.label}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 800,
                color: active ? m.color : '#334155',
                background: active ? m.color + '20' : '#12121f',
                borderRadius: 99, padding: '1px 7px',
              }}>
                {m.min} min
              </span>
            </button>
          )
        })}
      </div>

      {/* Main card */}
      <div style={{
        background: '#0d0d1a', borderRadius: 24,
        border: `1px solid ${currentMode.border}`,
        padding: '32px 28px 28px',
        transition: 'border-color .4s',
        boxShadow: `0 0 40px ${currentMode.color}10`,
      }}>

        {/* Current mode badge */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 20px', borderRadius: 999,
            background: currentMode.bg, border: `1px solid ${currentMode.border}`,
            transition: 'all .4s',
          }}>
            <span style={{ fontSize: 16 }}>{currentMode.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: currentMode.color, transition: 'color .4s' }}>
              {currentMode.label}
            </span>
          </div>
        </div>

        {/* Circular timer */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 280, height: 280 }}>
            <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={cx} cy={cx} r={r} fill="none" stroke="#12121f" strokeWidth="10" />
              <circle
                cx={cx} cy={cx} r={r}
                fill="none"
                stroke={currentMode.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset .8s ease, stroke .4s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 52, fontWeight: 800, color: '#E2E8F0', letterSpacing: '-2px', lineHeight: 1 }}>
                {pad(mins)}:{pad(secs)}
              </span>
              <span style={{ fontSize: 12, color: currentMode.color, marginTop: 6, fontWeight: 700, letterSpacing: '.06em', transition: 'color .4s' }}>
                {currentMode.label}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          {!running ? (
            <button onClick={start}
              style={{
                padding: '12px 36px', borderRadius: 14, border: 'none',
                background: currentMode.color, color: '#fff',
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                letterSpacing: '.04em', transition: 'opacity .15s',
                boxShadow: `0 4px 20px ${currentMode.color}40`,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              ▶ Démarrer
            </button>
          ) : (
            <button onClick={pause}
              style={{
                padding: '12px 36px', borderRadius: 14,
                border: `1px solid ${currentMode.border}`, background: currentMode.bg,
                color: currentMode.color, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                letterSpacing: '.04em', transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              ⏸ Pause
            </button>
          )}
          <button onClick={reset}
            style={{
              padding: '12px 20px', borderRadius: 14,
              border: '1px solid #1e1e2e', background: '#12121f',
              color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            ↺ Reset
          </button>
        </div>

        {/* Cycles */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '11px 20px', borderRadius: 12, background: '#09091a', border: '1px solid #1e1e2e',
        }}>
          <span style={{ fontSize: 15 }}>🍅</span>
          <span style={{ fontSize: 13, color: '#64748B' }}>Cycles complétés</span>
          <span style={{
            fontSize: 15, fontWeight: 800, color: '#8B5CF6',
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 8, padding: '2px 12px',
          }}>{cycles}</span>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
        {[
          { emoji: '💪', label: 'Focus',        val: `${WORK_MIN} min`,       color: '#10B981' },
          { emoji: '☕', label: 'Pause courte',  val: `${SHORT_REST_MIN} min`, color: '#8B5CF6' },
          { emoji: '🛌', label: 'Pause longue',  val: `${LONG_REST_MIN} min`,  color: '#3B82F6' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#0d0d1a', borderRadius: 14, border: '1px solid #1e1e2e',
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>{item.emoji}</span>
            <div>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' as const }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Long break tip */}
      <div style={{
        marginTop: 14, padding: '12px 16px', borderRadius: 14,
        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
        <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
          <span style={{ color: '#60A5FA', fontWeight: 700 }}>Pause longue</span> — quand tu te sens fatigué ou surchargé,
          switche sur la pause longue (15 min) pour récupérer vraiment avant de reprendre.
        </p>
      </div>
    </div>
  )
}
