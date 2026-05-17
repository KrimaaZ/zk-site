'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'goals_data'

type Goal    = { id: string; text: string; done: boolean }
type GoalTab = 'daily' | 'monthly' | 'annual'
type GoalsData = Record<GoalTab, Goal[]>

const TABS: { key: GoalTab; label: string; emoji: string; color: string }[] = [
  { key: 'daily',   label: 'Quotidien', emoji: '📅', color: '#1D9E75' },
  { key: 'monthly', label: 'Mensuel',   emoji: '📆', color: '#D4AF37' },
  { key: 'annual',  label: 'Annuel',    emoji: '🎯', color: '#9B6FE0' },
]

const empty: GoalsData = { daily: [], monthly: [], annual: [] }

function load(): GoalsData {
  if (typeof window === 'undefined') return empty
  try { return { ...empty, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } } catch { return empty }
}
function save(d: GoalsData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch {}
}

export default function Goals() {
  const [data, setData]   = useState<GoalsData>(empty)
  const [tab, setTab]     = useState<GoalTab>('daily')
  const [input, setInput] = useState('')

  useEffect(() => { setData(load()) }, [])

  const update = (next: GoalsData) => { setData(next); save(next) }

  const addGoal = () => {
    const text = input.trim()
    if (!text) return
    const goal: Goal = { id: `${Date.now()}-${Math.random()}`, text, done: false }
    update({ ...data, [tab]: [...data[tab], goal] })
    setInput('')
  }

  const toggle = (id: string) =>
    update({ ...data, [tab]: data[tab].map(g => g.id === id ? { ...g, done: !g.done } : g) })

  const remove = (id: string) =>
    update({ ...data, [tab]: data[tab].filter(g => g.id !== id) })

  // Reset = uncheck all (keep goals, set done: false)
  const reset = () =>
    update({ ...data, [tab]: data[tab].map(g => ({ ...g, done: false })) })

  const active  = TABS.find(t => t.key === tab)!
  const goals   = data[tab]
  const done    = goals.filter(g => g.done).length
  const allDone = goals.length > 0 && done === goals.length

  return (
    <div style={{ borderRadius:16, border:'1px solid #1a1a1a', overflow:'hidden', marginBottom:32 }}>

      {/* Header */}
      <div style={{ padding:'18px 20px 14px', background:'#0f0f0f', borderBottom:'1px solid #1a1a1a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <div style={{ width:3, height:16, background:'#D4AF37', borderRadius:2 }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'#888888' }}>
            Mes Objectifs
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6 }}>
          {TABS.map(t => {
            const isActive = t.key === tab
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  flex:1, padding:'8px 4px', borderRadius:10,
                  border:`1px solid ${isActive ? t.color : '#2a2a2a'}`,
                  background: isActive ? `${t.color}18` : '#111111',
                  color: isActive ? t.color : '#555555',
                  fontSize:12, fontWeight:700, cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                  transition:'all .15s',
                }}>
                <span style={{ fontSize:16 }}>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ background:'#111111', padding:'16px 20px' }}>

        {/* Progress + reset */}
        {goals.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
              <span style={{ fontSize:11, color:'#555555' }}>Progression</span>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:11, fontWeight:700, color: allDone ? active.color : active.color }}>
                  {done}/{goals.length}
                </span>
                {/* Reset button — only when all done */}
                {allDone && (
                  <button onClick={reset}
                    style={{
                      display:'flex', alignItems:'center', gap:5,
                      padding:'3px 10px', borderRadius:7,
                      background:`${active.color}18`,
                      border:`1px solid ${active.color}`,
                      color: active.color,
                      fontSize:10, fontWeight:700, cursor:'pointer',
                      letterSpacing:'.04em', textTransform:'uppercase' as const,
                      animation:'pulse .8s ease infinite alternate',
                    }}>
                    🔄 Réinitialiser
                  </button>
                )}
              </div>
            </div>
            <div style={{ height:4, background:'#1a1a1a', borderRadius:100, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:100,
                width:`${goals.length ? (done/goals.length)*100 : 0}%`,
                background: allDone
                  ? `linear-gradient(90deg, ${active.color}, #D4AF37)`
                  : active.color,
                transition:'width .3s ease',
              }} />
            </div>
            {/* All done banner */}
            {allDone && (
              <div style={{
                marginTop:10, padding:'8px 14px', borderRadius:9,
                background:`${active.color}12`,
                border:`1px solid ${active.color}40`,
                display:'flex', alignItems:'center', gap:8,
              }}>
                <span style={{ fontSize:16 }}>🏆</span>
                <span style={{ fontSize:12, fontWeight:700, color: active.color }}>
                  Tous les objectifs accomplis !
                </span>
              </div>
            )}
          </div>
        )}

        {/* Goal list */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
          {goals.length === 0 ? (
            <div style={{ padding:'24px 0', textAlign:'center', color:'#333333', fontSize:13 }}>
              Aucun objectif — ajoute le premier ci-dessous ↓
            </div>
          ) : (
            goals.map(g => (
              <div key={g.id}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 14px', borderRadius:10,
                  background: g.done ? 'rgba(255,255,255,0.02)' : '#1a1a1a',
                  border:`1px solid ${g.done ? '#1a1a1a' : '#2a2a2a'}`,
                  transition:'all .2s',
                }}>

                {/* Checkbox */}
                <div onClick={() => toggle(g.id)}
                  style={{
                    width:20, height:20, borderRadius:6, flexShrink:0, cursor:'pointer',
                    border:`2px solid ${g.done ? active.color : '#3a3a3a'}`,
                    background: g.done ? active.color : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all .2s',
                  }}>
                  {g.done && <span style={{ color:'#fff', fontSize:11, fontWeight:900, lineHeight:1 }}>✓</span>}
                </div>

                {/* Text */}
                <span style={{
                  flex:1, fontSize:14, lineHeight:1.4,
                  color: g.done ? '#333333' : '#C0C0C0',
                  textDecoration: g.done ? 'line-through' : 'none',
                  transition:'color .2s',
                }}>
                  {g.text}
                </span>

                {/* Delete button — always visible */}
                <button onClick={() => remove(g.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:4,
                    padding:'4px 9px', borderRadius:7, flexShrink:0,
                    background:'rgba(192,48,62,0.08)',
                    border:'1px solid rgba(192,48,62,0.2)',
                    color:'#c0303e', fontSize:11, fontWeight:600,
                    cursor:'pointer', transition:'all .15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(192,48,62,0.2)'
                    e.currentTarget.style.borderColor = '#c0303e'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(192,48,62,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(192,48,62,0.2)'
                  }}>
                  🗑 Supprimer
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add input */}
        <div style={{ display:'flex', gap:8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder={`Nouvel objectif ${active.label.toLowerCase()}…`}
            style={{
              flex:1, padding:'10px 14px', borderRadius:10,
              border:'1px solid #2a2a2a', background:'#0a0a0a',
              color:'#E8E8E8', fontSize:13, outline:'none',
              transition:'border-color .15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = active.color)}
            onBlur={e  => (e.currentTarget.style.borderColor = '#2a2a2a')}
          />
          <button onClick={addGoal}
            style={{
              padding:'10px 18px', borderRadius:10, border:'none',
              background: active.color,
              color: tab === 'monthly' ? '#0a0a0a' : '#fff',
              fontWeight:700, fontSize:13, cursor:'pointer',
              transition:'opacity .15s', flexShrink:0,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
