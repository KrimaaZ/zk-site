'use client'

import { useEffect, useRef, useState } from 'react'

const WORK_MIN  = 25
const REST_MIN  = 5

type Mode = 'work' | 'rest'

function beep(ctx: AudioContext, freq: number, duration: number, vol = 0.4) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type      = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playTransition(ctx: AudioContext, toWork: boolean) {
  if (toWork) {
    // Rising energetic tones → back to work
    beep(ctx, 440, 0.15)
    setTimeout(() => beep(ctx, 550, 0.15), 160)
    setTimeout(() => beep(ctx, 660, 0.25), 320)
  } else {
    // Soft descending tones → rest
    beep(ctx, 660, 0.2, 0.3)
    setTimeout(() => beep(ctx, 550, 0.2, 0.3), 220)
    setTimeout(() => beep(ctx, 440, 0.35, 0.3), 440)
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function PomodoroPage() {
  const [mode,     setMode]     = useState<Mode>('work')
  const [seconds,  setSeconds]  = useState(WORK_MIN * 60)
  const [running,  setRunning]  = useState(false)
  const [cycles,   setCycles]   = useState(0)

  const audioRef   = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // AudioContext — created on first user interaction
  const getAudio = () => {
    if (!audioRef.current) audioRef.current = new AudioContext()
    return audioRef.current
  }

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1
        // Transition
        setMode(m => {
          const next: Mode = m === 'work' ? 'rest' : 'work'
          playTransition(getAudio(), next === 'work')
          setSeconds(next === 'work' ? WORK_MIN * 60 : REST_MIN * 60)
          if (next === 'rest') setCycles(c => c + 1)
          return next
        })
        return 0
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const start = () => {
    getAudio() // unlock audio on user gesture
    setRunning(true)
  }
  const pause  = () => setRunning(false)
  const reset  = () => {
    setRunning(false)
    setMode('work')
    setSeconds(WORK_MIN * 60)
    setCycles(0)
  }

  const mins  = Math.floor(seconds / 60)
  const secs  = seconds % 60
  const total = mode === 'work' ? WORK_MIN * 60 : REST_MIN * 60
  const pct   = ((total - seconds) / total) * 100

  const accent = mode === 'work' ? '#1D9E75' : '#D4AF37'
  const accentBg = mode === 'work' ? 'rgba(29,158,117,0.12)' : 'rgba(212,175,55,0.12)'
  const accentBorder = mode === 'work' ? 'rgba(29,158,117,0.35)' : 'rgba(212,175,55,0.35)'

  // SVG circle progress
  const r  = 110
  const cx = 140
  const circumference = 2 * Math.PI * r
  const dash = circumference - (pct / 100) * circumference

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingTop: 40, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom: 36 }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'4px 16px', borderRadius:999,
          background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)',
          marginBottom:14,
        }}>
          <span style={{ fontSize:14 }}>🍅</span>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#D4AF37' }}>
            Pomodoro
          </span>
        </div>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#F0F0F0', margin:0 }}>
          Focus Timer
        </h1>
      </div>

      {/* Main card */}
      <div style={{
        background:'#111111', borderRadius:24, border:`1px solid ${accentBorder}`,
        padding:'36px 28px 32px', transition:'border-color .4s',
      }}>

        {/* Mode badge */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'6px 20px', borderRadius:999,
            background: accentBg, border:`1px solid ${accentBorder}`,
            transition:'all .4s',
          }}>
            <span style={{ fontSize:16 }}>{mode === 'work' ? '💪' : '☕'}</span>
            <span style={{ fontSize:13, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', color: accent, transition:'color .4s' }}>
              {mode === 'work' ? 'Temps de travail' : 'Temps de repos'}
            </span>
          </div>
        </div>

        {/* Circular timer */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ position:'relative', width:280, height:280 }}>
            <svg width="280" height="280" style={{ transform:'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1a1a1a" strokeWidth="10" />
              {/* Progress */}
              <circle
                cx={cx} cy={cx} r={r}
                fill="none"
                stroke={accent}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dash}
                style={{ transition:'stroke-dashoffset .8s ease, stroke .4s' }}
              />
            </svg>
            {/* Time display */}
            <div style={{
              position:'absolute', inset:0,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{ fontSize:52, fontWeight:800, color:'#F0F0F0', letterSpacing:'-2px', lineHeight:1 }}>
                {pad(mins)}:{pad(secs)}
              </span>
              <span style={{ fontSize:12, color:'#555555', marginTop:6, fontWeight:600, letterSpacing:'.06em' }}>
                {mode === 'work' ? `${WORK_MIN} min` : `${REST_MIN} min`}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:24 }}>
          {!running ? (
            <button onClick={start}
              style={{
                padding:'12px 32px', borderRadius:12, border:'none',
                background: accent, color: mode === 'work' ? '#fff' : '#0a0a0a',
                fontWeight:800, fontSize:14, cursor:'pointer',
                letterSpacing:'.04em', transition:'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              ▶ Démarrer
            </button>
          ) : (
            <button onClick={pause}
              style={{
                padding:'12px 32px', borderRadius:12,
                border:`1px solid ${accentBorder}`, background: accentBg,
                color: accent, fontWeight:800, fontSize:14, cursor:'pointer',
                letterSpacing:'.04em', transition:'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              ⏸ Pause
            </button>
          )}
          <button onClick={reset}
            style={{
              padding:'12px 24px', borderRadius:12,
              border:'1px solid #2a2a2a', background:'#1a1a1a',
              color:'#888888', fontWeight:700, fontSize:14, cursor:'pointer',
              transition:'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            ↺ Reset
          </button>
        </div>

        {/* Cycles */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          padding:'12px 20px', borderRadius:12, background:'#0f0f0f', border:'1px solid #1a1a1a',
        }}>
          <span style={{ fontSize:16 }}>🍅</span>
          <span style={{ fontSize:13, color:'#888888' }}>Cycles complétés</span>
          <span style={{
            fontSize:15, fontWeight:800, color:'#D4AF37',
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.25)',
            borderRadius:8, padding:'2px 12px',
          }}>{cycles}</span>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16 }}>
        {[
          { emoji:'💪', label:'Travail',  val:`${WORK_MIN} min`, color:'#1D9E75' },
          { emoji:'☕', label:'Repos',    val:`${REST_MIN} min`,  color:'#D4AF37' },
        ].map(item => (
          <div key={item.label} style={{
            background:'#111111', borderRadius:14, border:'1px solid #1a1a1a',
            padding:'14px 18px', display:'flex', alignItems:'center', gap:12,
          }}>
            <span style={{ fontSize:22 }}>{item.emoji}</span>
            <div>
              <div style={{ fontSize:11, color:'#555555', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{item.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color: item.color }}>{item.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
