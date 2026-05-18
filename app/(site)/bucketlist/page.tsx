'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Types & constants ────────────────────────────────────────────────────────

type Item = { id: string; category: string; text: string; deadline: string; priority: number; done: boolean; createdat: string }

const GOLD = '#F5C518'
const GREEN = '#1D9E75'

const DEFAULT_CATS = [
  '🌍 Voyages & Aventures',
  '🎵 Musique & Créativité',
  '💪 Sport & Physique',
  '💰 Argent & Succès',
  '❤️ Famille & Amour',
  '🧠 Expériences & Sensations',
  '🏆 Accomplissements',
]

const STARS: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }
const PRIORITY_LABEL: Record<number, string> = { 1: 'Normal', 2: 'Important', 3: 'Essentiel' }

// ─── Confetti burst ───────────────────────────────────────────────────────────

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null
  const particles = Array.from({ length: 8 }, (_, i) => i)
  return (
    <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(i => (
        <span key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 5, height: 5, borderRadius: '50%',
          backgroundColor: [GOLD, '#fff', '#FFD700', '#F5C518', '#fffbe6', GOLD, '#fff', '#FFD700'][i],
          animation: `confetti${i} 0.6s ease forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confetti0 { to { transform: translate(-18px,-22px) scale(0); opacity:0 } }
        @keyframes confetti1 { to { transform: translate(18px,-22px) scale(0); opacity:0 } }
        @keyframes confetti2 { to { transform: translate(-24px,0px) scale(0); opacity:0 } }
        @keyframes confetti3 { to { transform: translate(24px,0px) scale(0); opacity:0 } }
        @keyframes confetti4 { to { transform: translate(-18px,20px) scale(0); opacity:0 } }
        @keyframes confetti5 { to { transform: translate(18px,20px) scale(0); opacity:0 } }
        @keyframes confetti6 { to { transform: translate(0,-26px) scale(0); opacity:0 } }
        @keyframes confetti7 { to { transform: translate(0,26px) scale(0); opacity:0 } }
      `}</style>
    </span>
  )
}

// ─── Item row ─────────────────────────────────────────────────────────────────

function ItemRow({ item, onToggle, onDelete, justDone }: {
  item: Item; onToggle: () => void; onDelete: () => void; justDone: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
        background: hov ? 'rgba(245,197,24,0.04)' : 'transparent',
        borderRadius: 8, transition: 'background .2s', position: 'relative',
      }}>

      {/* Checkbox */}
      <div onClick={onToggle} style={{ position: 'relative', flexShrink: 0, width: 22, height: 22, cursor: 'pointer' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: `2px solid ${item.done ? GOLD : 'rgba(245,197,24,0.5)'}`,
          background: item.done ? GOLD : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .25s', transform: item.done ? 'scale(1.1)' : 'scale(1)',
        }}>
          {item.done && <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <ConfettiBurst active={justDone} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 14, color: item.done ? '#555' : '#F0F0F0',
          textDecoration: item.done ? 'line-through' : 'none',
          opacity: item.done ? 0.55 : 1, transition: 'all .3s',
        }}>
          {item.text}
        </span>
        {item.deadline && !item.done && (
          <span style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginLeft: 8 }}>{item.deadline}</span>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {item.done
          ? <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>✅ Accompli</span>
          : <span style={{ fontSize: 13, lineHeight: 1 }} title={PRIORITY_LABEL[item.priority]}>{STARS[item.priority]}</span>
        }
        {hov && (
          <button onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 15, cursor: 'pointer', padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}>
            🗑
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Category accordion ───────────────────────────────────────────────────────

function CategoryBlock({ cat, items, openCats, toggleCat, onToggle, onDelete, justDoneId }: {
  cat: string; items: Item[]; openCats: Set<string>; toggleCat: (c: string) => void
  onToggle: (id: string) => void; onDelete: (id: string) => void; justDoneId: string | null
}) {
  const open = openCats.has(cat)
  const done = items.filter(i => i.done).length
  const total = items.length
  const pending = items.filter(i => !i.done)
  const accomplished = items.filter(i => i.done)
  const sorted = [...pending, ...accomplished]

  return (
    <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden', borderLeft: `3px solid ${GOLD}`, marginBottom: 10 }}>
      {/* Accordion header */}
      <div onClick={() => toggleCat(cat)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', cursor: 'pointer', userSelect: 'none',
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#F0F0F0' }}>{cat}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{done}/{total}</span>
          <span style={{ color: '#555', fontSize: 14, transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </div>

      {/* Items */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(245,197,24,0.08)', padding: '4px 0 8px' }}>
          {sorted.map(item => (
            <ItemRow key={item.id} item={item}
              onToggle={() => onToggle(item.id)}
              onDelete={() => onDelete(item.id)}
              justDone={justDoneId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BucketListPage() {
  const [items, setItems]         = useState<Item[]>([])
  const [loading, setLoading]     = useState(true)
  const [openCats, setOpenCats]   = useState<Set<string>>(new Set(DEFAULT_CATS))
  const [showForm, setShowForm]   = useState(false)
  const [showDone, setShowDone]   = useState(false)
  const [justDoneId, setJustDoneId] = useState<string | null>(null)
  const [flashMsg, setFlashMsg]   = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const justDoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Form state
  const [fCat, setFCat]           = useState(DEFAULT_CATS[0])
  const [fCustomCat, setFCustomCat] = useState('')
  const [fUseCustom, setFUseCustom] = useState(false)
  const [fText, setFText]         = useState('')
  const [fDeadline, setFDeadline] = useState('')
  const [fPriority, setFPriority] = useState(1)

  useEffect(() => {
    fetch('/api/bucketlist').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    })
  }, [])

  // ── Stats ────────────────────────────────────────────────────────────────
  const total      = items.length
  const done       = items.filter(i => i.done).length
  const essential  = items.filter(i => i.priority === 3 && !i.done).length
  const pct        = total === 0 ? 0 : Math.round((done / total) * 100)

  // ── Categories ───────────────────────────────────────────────────────────
  const allCats = Array.from(new Set(items.map(i => i.category)))
  const pendingItems = items.filter(i => !i.done)
  const doneItems    = items.filter(i => i.done)

  // ── Actions ──────────────────────────────────────────────────────────────

  const toggleCat = (c: string) => setOpenCats(p => {
    const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n
  })

  const toggleItem = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const newDone = !item.done
    setItems(p => p.map(i => i.id === id ? { ...i, done: newDone } : i))
    await fetch(`/api/bucketlist/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: newDone }) })
    if (newDone) {
      setJustDoneId(id)
      setFlashMsg(true)
      if (justDoneTimer.current) clearTimeout(justDoneTimer.current)
      if (flashTimer.current) clearTimeout(flashTimer.current)
      justDoneTimer.current = setTimeout(() => setJustDoneId(null), 800)
      flashTimer.current = setTimeout(() => setFlashMsg(false), 2200)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Supprimer ce rêve ?')) return
    await fetch(`/api/bucketlist/${id}`, { method: 'DELETE' })
    setItems(p => p.filter(i => i.id !== id))
  }

  const addItem = async () => {
    const cat = fUseCustom ? fCustomCat.trim() : fCat
    if (!cat || !fText.trim()) return
    const res = await fetch('/api/bucketlist', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: cat, text: fText.trim(), deadline: fDeadline, priority: fPriority }) })
    const item: Item = await res.json()
    setItems(p => [...p, item])
    setOpenCats(p => { const n = new Set(p); n.add(cat); return n })
    setShowForm(false); setFText(''); setFDeadline(''); setFPriority(1); setFCustomCat(''); setFUseCustom(false)
  }

  // ─────────────────────────────────────────────────────────────────────────

  const inp: React.CSSProperties = { backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px) 80px' }}>

      <style>{`
        .bl-inp:focus { border-color: ${GOLD} !important; }
        @keyframes flashIn { 0%{opacity:0;transform:translateY(-10px)} 15%{opacity:1;transform:none} 85%{opacity:1} 100%{opacity:0} }
        .bl-flash { animation: flashIn 2.2s ease forwards; }
        @keyframes progressFill { from{width:0} }
        .bl-progress { animation: progressFill .6s ease; }
      `}</style>

      {/* Flash message */}
      {flashMsg && (
        <div className="bl-flash" style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#1a1a00', border: `1px solid ${GOLD}`, borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, color: GOLD, whiteSpace: 'nowrap', boxShadow: `0 4px 20px rgba(245,197,24,0.2)` }}>
          🎉 Un rêve de plus accompli !
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────── */}
      <div style={{ background: '#0a0a0a', borderRadius: 18, padding: 'clamp(24px,5vw,40px)', marginBottom: 24, border: '1px solid rgba(245,197,24,0.12)' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(245,197,24,0.08)', border: `1px solid rgba(245,197,24,0.2)`, borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Bucket List de Vie
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>🗺 Ma Bucket List</h1>
          <p style={{ color: '#666', fontStyle: 'italic', fontSize: 14, margin: 0 }}>Les choses que je veux vivre avant de mourir</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}
          className="bl-stats">
          <style>{`.bl-stats { grid-template-columns: repeat(4, 1fr) !important; } @media(max-width:500px){.bl-stats{grid-template-columns:repeat(2,1fr)!important}}`}</style>
          {[
            { val: total,     label: 'Total rêves' },
            { val: done,      label: 'Accomplis'   },
            { val: total - done, label: 'Restants'  },
            { val: essential, label: 'Essentiels'  },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: GOLD, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 4, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 6 }}>
            <span>Progression</span>
            <span style={{ color: GOLD, fontWeight: 700 }}>{done} / {total} accomplis · {pct}%</span>
          </div>
          <div style={{ height: 8, background: '#1a1a1a', borderRadius: 100, overflow: 'hidden' }}>
            <div className="bl-progress" style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${GOLD}, #FFD700)`, borderRadius: 100, transition: 'width .5s ease' }} />
          </div>
        </div>
      </div>

      {/* ── ADD BUTTON ───────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={() => setShowForm(f => !f)}
          style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '11px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.04em', transition: 'opacity .2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
          {showForm ? '✕ Annuler' : '+ Ajouter un rêve'}
        </button>
      </div>

      {/* ── ADD FORM ─────────────────────────────────────── */}
      {showForm && (
        <div style={{ background: '#0a0a0a', border: `1px solid rgba(245,197,24,0.2)`, borderRadius: 14, padding: '22px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Category */}
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>CATÉGORIE</label>
              {!fUseCustom
                ? <div style={{ display: 'flex', gap: 8 }}>
                    <select className="bl-inp" value={fCat} onChange={e => setFCat(e.target.value)} style={{ ...inp, flex: 1 }}>
                      {allCats.length > 0
                        ? Array.from(new Set([...DEFAULT_CATS, ...allCats])).map(c => <option key={c} value={c}>{c}</option>)
                        : DEFAULT_CATS.map(c => <option key={c} value={c}>{c}</option>)
                      }
                    </select>
                    <button onClick={() => setFUseCustom(true)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '0 14px', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Nouvelle</button>
                  </div>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <input className="bl-inp" value={fCustomCat} onChange={e => setFCustomCat(e.target.value)} placeholder="Emoji + Nom de catégorie..." style={{ ...inp, flex: 1 }} />
                    <button onClick={() => setFUseCustom(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '0 14px', fontSize: 12, cursor: 'pointer' }}>← Retour</button>
                  </div>
              }
            </div>

            {/* Text */}
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>LE RÊVE</label>
              <input className="bl-inp" value={fText} onChange={e => setFText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Ce que je veux vivre..." style={inp} />
            </div>

            {/* Deadline + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>DATE / ÂGE CIBLE</label>
                <input className="bl-inp" value={fDeadline} onChange={e => setFDeadline(e.target.value)} placeholder="Avant mes 30 ans..." style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>PRIORITÉ</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3].map(p => (
                    <button key={p} onClick={() => setFPriority(p)} style={{
                      flex: 1, background: fPriority === p ? 'rgba(245,197,24,0.15)' : '#1a1a1a',
                      border: `1px solid ${fPriority === p ? GOLD : '#333'}`, color: fPriority === p ? GOLD : '#666',
                      borderRadius: 8, padding: '9px 4px', fontSize: 13, cursor: 'pointer', transition: 'all .15s',
                    }}>{STARS[p]}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addItem} style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginTop: 4 }}>
              Ajouter à ma liste
            </button>
          </div>
        </div>
      )}

      {/* ── CATEGORY LIST ────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#444', fontSize: 14 }}>Chargement...</div>
      ) : (
        <>
          {allCats.filter(c => items.some(i => i.category === c && !i.done)).map(cat => {
            const catItems = items.filter(i => i.category === cat && !i.done)
            if (catItems.length === 0) return null
            return (
              <CategoryBlock key={cat} cat={cat}
                items={catItems}
                openCats={openCats} toggleCat={toggleCat}
                onToggle={toggleItem} onDelete={deleteItem}
                justDoneId={justDoneId}
              />
            )
          })}

          {/* ── ACCOMPLISSEMENTS ─────────────────────────── */}
          {doneItems.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <button onClick={() => setShowDone(s => !s)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#0a0a0a', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', color: '#fff', borderLeft: `3px solid ${GREEN}` }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>✅ Déjà accomplis <span style={{ color: GREEN }}>({doneItems.length})</span></span>
                <span style={{ color: '#555', transition: 'transform .2s', display: 'inline-block', transform: showDone ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </button>

              {showDone && (
                <div style={{ background: '#0a0a0a', border: '1px solid rgba(29,158,117,0.15)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '8px 0' }}>
                  {allCats.filter(c => doneItems.some(i => i.category === c)).map(cat => {
                    const catDone = doneItems.filter(i => i.category === cat)
                    return (
                      <div key={cat} style={{ padding: '4px 12px' }}>
                        <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.08em', padding: '8px 4px 2px', textTransform: 'uppercase' }}>{cat}</div>
                        {catDone.map(item => (
                          <ItemRow key={item.id} item={item} onToggle={() => toggleItem(item.id)} onDelete={() => deleteItem(item.id)} justDone={false} />
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
