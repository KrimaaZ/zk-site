'use client'

import { useEffect, useState } from 'react'

type Goal    = { id: string; text: string; done: boolean; tab: string; createdAt: string }
type GoalTab = 'daily' | 'monthly' | 'annual'

const TABS: { key: GoalTab; label: string; emoji: string; color: string; desc: string }[] = [
  { key: 'daily',   label: 'Quotidien', emoji: '📅', color: '#1D9E75', desc: 'Objectifs du jour' },
  { key: 'monthly', label: 'Mensuel',   emoji: '📆', color: '#8B5CF6', desc: 'Objectifs du mois' },
  { key: 'annual',  label: 'Annuel',    emoji: '🎯', color: '#9B6FE0', desc: 'Objectifs de l\'année' },
]

export default function GoalsPage() {
  const [goals,   setGoals]   = useState<Goal[]>([])
  const [tab,     setTab]     = useState<GoalTab>('daily')
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/goals')
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`)
        return data
      })
      .then(d => { setGoals(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])

  const active    = TABS.find(t => t.key === tab)!
  const tabGoals  = goals.filter(g => g.tab === tab)
  const doneCount = tabGoals.filter(g => g.done).length

  const addGoal = async () => {
    const text = input.trim()
    if (!text || saving) return
    setSaving(true)
    setInput('')
    const res  = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab, text, position: tabGoals.length }),
    })
    if (res.ok) {
      const goal = await res.json()
      if (goal?.id) setGoals(prev => [...prev, goal])
    }
    setSaving(false)
  }

  const toggle = async (id: string) => {
    const goal = goals.find(g => g.id === id)!
    const done = !goal.done
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done } : g))
    await fetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    })
  }

  const remove = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    await fetch(`/api/goals/${id}`, { method: 'DELETE' })
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 32, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <div style={{ width:3, height:20, background:'#8B5CF6', borderRadius:2 }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' as const, color:'#64748B' }}>
            Mes Objectifs
          </span>
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#E2E8F0', margin:0 }}>
          Objectifs & Buts
        </h1>
        <p style={{ fontSize:13, color:'#475569', marginTop:6 }}>
          Tes objectifs restent enregistrés jusqu&apos;à ce que tu les supprimes toi-même.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {TABS.map(t => {
          const isActive = t.key === tab
          const count    = goals.filter(g => g.tab === t.key).length
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex:1, padding:'12px 8px', borderRadius:14,
                border:`1px solid ${isActive ? t.color : '#1e1e2e'}`,
                background: isActive ? `${t.color}15` : '#0d0d1a',
                color: isActive ? t.color : '#475569',
                cursor:'pointer', transition:'all .15s',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              }}>
              <span style={{ fontSize:22 }}>{t.emoji}</span>
              <span style={{ fontSize:12, fontWeight:700 }}>{t.label}</span>
              {count > 0 && (
                <span style={{
                  fontSize:10, fontWeight:700,
                  background: isActive ? `${t.color}25` : '#12121f',
                  color: isActive ? t.color : '#444',
                  borderRadius:999, padding:'1px 8px',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active tab card */}
      <div style={{ background:'#0d0d1a', borderRadius:18, border:`1px solid ${active.color}30`, overflow:'hidden' }}>

        {/* Card header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color: active.color }}>{active.emoji} {active.label}</div>
            <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{active.desc}</div>
          </div>
          {tabGoals.length > 0 && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:18, fontWeight:800, color: active.color }}>{doneCount}/{tabGoals.length}</div>
              <div style={{ fontSize:10, color:'#475569' }}>complétés</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {tabGoals.length > 0 && (
          <div style={{ height:3, background:'#12121f' }}>
            <div style={{
              height:'100%',
              width:`${(doneCount / tabGoals.length) * 100}%`,
              background: doneCount === tabGoals.length
                ? `linear-gradient(90deg, ${active.color}, #8B5CF6)`
                : active.color,
              transition:'width .4s ease',
            }} />
          </div>
        )}

        {/* Goals list */}
        <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8, minHeight:80 }}>

          {error ? (
            <div style={{ padding:'16px', borderRadius:10, background:'rgba(192,48,62,0.08)', border:'1px solid rgba(192,48,62,0.2)', fontSize:12, color:'#c0303e', textAlign:'center' }}>
              ⚠️ {error}
            </div>
          ) : loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} style={{ height:48, borderRadius:12, background:'#12121f', opacity: 1 - i * 0.2 }} />
            ))
          ) : tabGoals.length === 0 ? (
            <div style={{ padding:'28px 0', textAlign:'center', color:'#333333', fontSize:13 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{active.emoji}</div>
              Aucun objectif {active.label.toLowerCase()} pour l&apos;instant<br />
              <span style={{ fontSize:11, color:'#1e1e2e' }}>Ajoute-en un ci-dessous ↓</span>
            </div>
          ) : tabGoals.map(g => (
            <div key={g.id} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'11px 14px', borderRadius:12,
              background: g.done ? 'rgba(255,255,255,0.02)' : '#12121f',
              border:`1px solid ${g.done ? '#12121f' : '#1e1e2e'}`,
              transition:'all .2s',
            }}>
              {/* Checkbox */}
              <div onClick={() => toggle(g.id)} style={{
                width:22, height:22, borderRadius:7, flexShrink:0, cursor:'pointer',
                border:`2px solid ${g.done ? active.color : '#2a2a40'}`,
                background: g.done ? active.color : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s',
              }}>
                {g.done && <span style={{ color:'#fff', fontSize:12, fontWeight:900 }}>✓</span>}
              </div>

              {/* Text */}
              <span style={{
                flex:1, fontSize:14, lineHeight:1.4,
                color: g.done ? '#2a2a40' : '#C0C0C0',
                textDecoration: g.done ? 'line-through' : 'none',
                transition:'all .2s',
              }}>
                {g.text}
              </span>

              {/* Delete */}
              <button onClick={() => remove(g.id)} style={{
                flexShrink:0, padding:'5px 10px', borderRadius:8,
                background:'rgba(192,48,62,0.08)', border:'1px solid rgba(192,48,62,0.18)',
                color:'#c0303e', fontSize:11, fontWeight:600, cursor:'pointer',
                transition:'all .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,48,62,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(192,48,62,0.08)' }}>
                🗑 Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* Add input */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid #1a1a1a', display:'flex', gap:8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder={`Nouvel objectif ${active.label.toLowerCase()}…`}
            disabled={saving}
            style={{
              flex:1, padding:'11px 14px', borderRadius:12,
              border:`1px solid #2a2a2a`, background:'#07070f',
              color:'#CBD5E1', fontSize:13, outline:'none',
              transition:'border-color .15s',
              opacity: saving ? 0.6 : 1,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = active.color)}
            onBlur={e  => (e.currentTarget.style.borderColor = '#1e1e2e')}
          />
          <button onClick={addGoal} disabled={saving || !input.trim()}
            style={{
              padding:'11px 20px', borderRadius:12, border:'none',
              background: (!input.trim() || saving) ? '#12121f' : active.color,
              color: (!input.trim() || saving) ? '#444' : (tab === 'monthly' ? '#07070f' : '#fff'),
              fontWeight:700, fontSize:13, cursor: (!input.trim() || saving) ? 'not-allowed' : 'pointer',
              transition:'all .15s', flexShrink:0,
            }}>
            {saving ? '…' : '+ Ajouter'}
          </button>
        </div>
      </div>

      {/* All done banner */}
      {tabGoals.length > 0 && doneCount === tabGoals.length && (
        <div style={{
          marginTop:16, padding:'14px 20px', borderRadius:14,
          background:`${active.color}12`, border:`1px solid ${active.color}40`,
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:22 }}>🏆</span>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color: active.color }}>
              Tous les objectifs {active.label.toLowerCase()}s accomplis !
            </div>
            <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>
              Les objectifs restent ici jusqu&apos;à ce que tu les supprimes.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
