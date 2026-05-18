'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Outfit   = { id: string; data: string; label: string; createdat: string }
type APhoto   = { id: string; data: string; context: string; createdat: string }
type Proche   = { id: string; data: string; who: string; moment: string; rotation: number; createdat: string }
type Physique = { id: string; data: string; date: string; note: string; createdat: string }

type Tab = 'outfits' | 'aesthetic' | 'proches' | 'physique'

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'outfits',   emoji: '👔', label: 'Outfits'   },
  { id: 'aesthetic', emoji: '📷', label: 'Aesthetic'  },
  { id: 'proches',   emoji: '👥', label: 'Proches'    },
  { id: 'physique',  emoji: '💪', label: 'Physique'   },
]

// ─── Shared ───────────────────────────────────────────────────────────────────

const inp: React.CSSProperties = { backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: 4, padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36, paddingTop: 8 }}>
      <h2 style={{ fontSize: 'clamp(28px,6vw,46px)', fontWeight: 300, color: '#fff', margin: 0, fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}>{title}</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginTop: 10, fontSize: 14 }}>{sub}</p>
      <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)', margin: '14px auto 0' }} />
    </div>
  )
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <button onClick={onClick}
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 6, padding: '9px 22px', fontSize: 13, cursor: 'pointer', letterSpacing: '0.05em', transition: 'all .2s' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.color = '#000' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#fff' }}>
        + Ajouter
      </button>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 0', color: '#444' }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ marginTop: 10, fontSize: 13 }}>{text}</div>
    </div>
  )
}

// ─── Save row ─────────────────────────────────────────────────────────────────

function SaveRow({ onCancel, onSave, saving }: { onCancel: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={onCancel} disabled={saving}
        style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 4, padding: 10, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13 }}>
        Annuler
      </button>
      <button onClick={onSave} disabled={saving}
        style={{ flex: 2, background: saving ? '#444' : '#fff', border: 'none', color: saving ? '#aaa' : '#000', borderRadius: 4, padding: 10, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {saving ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #888', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'aeSpin .7s linear infinite' }} /> Sauvegarde…</> : 'Ajouter'}
      </button>
    </div>
  )
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 8, padding: 28, width: '100%', maxWidth: 460 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 18, letterSpacing: '0.04em' }}>{title}</div>
        {children}
        <button onClick={onClose} style={{ position: 'absolute', display: 'none' }} />
      </div>
    </div>
  )
}

// ─── Image compression (canvas) ──────────────────────────────────────────────

function compressImage(file: File, maxPx = 1200, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx }
        else { width = Math.round(width * maxPx / height); height = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

// ─── Upload drop zone ─────────────────────────────────────────────────────────

function DropZone({ img, setImg }: { img: string; setImg: (v: string) => void }) {
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const read = async (f: File) => {
    setLoading(true)
    try { setImg(await compressImage(f)) } catch { /* fallback to raw */ const r = new FileReader(); r.onload = e => setImg(e.target!.result as string); r.readAsDataURL(f) }
    setLoading(false)
  }

  return (
    <div onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) read(f) }}
      onClick={() => !loading && ref.current?.click()}
      style={{ border: `1px dashed ${drag ? '#fff' : '#333'}`, borderRadius: 4, padding: img ? 0 : '28px 0', cursor: loading ? 'wait' : 'pointer', overflow: 'hidden', marginBottom: 14, textAlign: 'center', background: drag ? 'rgba(255,255,255,0.04)' : '#0a0a0a', transition: 'all .2s', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading
        ? <div style={{ fontSize: 12, color: '#666' }}>Compression…</div>
        : img
          ? <img src={img} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
          : <div><div style={{ fontSize: 28, opacity: 0.4 }}>📷</div><div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>Glisse ou clique pour uploader</div></div>
      }
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) read(f); e.target.value = '' }} />
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ items, index, onClose, onNav }: { items: string[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(Math.min(index + 1, items.length - 1))
      if (e.key === 'ArrowLeft') onNav(Math.max(index - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, items, onClose, onNav])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', opacity: 0.7, lineHeight: 1 }}>✕</button>
      {index > 0 && (
        <button onClick={e => { e.stopPropagation(); onNav(index - 1) }}
          style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, width: 44, height: 44, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ‹
        </button>
      )}
      <img src={items[index]} alt="" onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 4, userSelect: 'none' }} />
      {index < items.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onNav(index + 1) }}
          style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, width: 44, height: 44, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ›
        </button>
      )}
      <div style={{ position: 'absolute', bottom: 20, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        {index + 1} / {items.length}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AestheticPage() {
  const [tab, setTab] = useState<Tab>('outfits')

  // Data
  const [outfits,   setOutfits]   = useState<Outfit[]>([])
  const [aphotos,   setAPhotos]   = useState<APhoto[]>([])
  const [proches,   setProches]   = useState<Proche[]>([])
  const [physiques, setPhysiques] = useState<Physique[]>([])

  // Lightbox
  const [lb, setLb] = useState<{ items: string[]; index: number } | null>(null)

  // Modal
  const [modal, setModal] = useState<Tab | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  // Form fields
  const [fImg, setFImg]         = useState('')
  const [fLabel, setFLabel]     = useState('')
  const [fContext, setFContext]  = useState('')
  const [fWho, setFWho]         = useState('')
  const [fMoment, setFMoment]   = useState('')
  const [fDate, setFDate]       = useState('')
  const [fNote, setFNote]       = useState('')

  const resetForm = () => { setFImg(''); setFLabel(''); setFContext(''); setFWho(''); setFMoment(''); setFDate(''); setFNote(''); setSaveErr('') }
  const openModal = (t: Tab) => { resetForm(); setModal(t) }

  // Load data
  useEffect(() => {
    fetch('/api/aesthetic/outfits').then(r => r.json()).then(d => Array.isArray(d) && setOutfits(d))
    fetch('/api/aesthetic/photos').then(r => r.json()).then(d => Array.isArray(d) && setAPhotos(d))
    fetch('/api/aesthetic/proches').then(r => r.json()).then(d => Array.isArray(d) && setProches(d))
    fetch('/api/aesthetic/physique').then(r => r.json()).then(d => Array.isArray(d) && setPhysiques(d))
  }, [])

  // ── Add handlers ──────────────────────────────────────────────────────────

  const save = async (url: string, body: object, onSuccess: (item: any) => void) => {
    if (!fImg) { setSaveErr('Sélectionne une photo d\'abord.'); return }
    setSaving(true); setSaveErr('')
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Erreur ${res.status}`) }
      const item = await res.json()
      onSuccess(item); setModal(null); resetForm()
    } catch (e: any) {
      setSaveErr(e.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const addOutfit  = () => save('/api/aesthetic/outfits', { data: fImg, label: fLabel }, (item: Outfit) => setOutfits(p => [item, ...p]))
  const addAPhoto  = () => save('/api/aesthetic/photos',  { data: fImg, context: fContext }, (item: APhoto) => setAPhotos(p => [item, ...p]))
  const addProche  = () => {
    const rotation = parseFloat((Math.random() * 8 - 4).toFixed(2))
    save('/api/aesthetic/proches', { data: fImg, who: fWho, moment: fMoment, rotation }, (item: Proche) => setProches(p => [item, ...p]))
  }
  const addPhysique = () => save('/api/aesthetic/physique', { data: fImg, date: fDate, note: fNote }, (item: Physique) => setPhysiques(p => [item, ...p].sort((a, b) => (b.date || '').localeCompare(a.date || ''))))

  // ── Delete handlers ───────────────────────────────────────────────────────

  const del = async (endpoint: string, id: string, setter: (fn: (p: any[]) => any[]) => void) => {
    if (!confirm('Supprimer ?')) return
    await fetch(`/api/aesthetic/${endpoint}/${id}`, { method: 'DELETE' })
    setter(p => p.filter((x: any) => x.id !== id))
    if (lb) setLb(null)
  }

  // ── Lightbox opener ───────────────────────────────────────────────────────

  const openLb = (items: string[], index: number) => setLb({ items, index })

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingBottom: 120 }}>

      <style>{`
        .ae-inp:focus { border-color: #fff !important; outline: none; }
        .out-card:hover .out-overlay { opacity: 1 !important; }
        .aph-card:hover .aph-overlay { opacity: 1 !important; }
        .proche-pol:hover { transform: rotate(0deg) scale(1.05) !important; box-shadow: 0 12px 40px rgba(255,255,255,0.15) !important; }
        .proche-pol:hover .proche-del { opacity: 1 !important; }
        .proche-pol:hover img { filter: grayscale(0%) !important; }
        .phy-entry:hover img { box-shadow: 0 0 30px rgba(255,255,255,0.12); }
        .phy-entry:hover .phy-del { opacity: 1 !important; }
        @keyframes aeFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .ae-fade { animation: aeFadeIn .3s ease forwards; }
        @keyframes aeSpin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(40px,7vw,72px) 20px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(24px,5vw,40px)', fontWeight: 200, letterSpacing: '0.25em', color: '#fff', margin: 0, fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>
          Aesthetic
        </h1>
        <p style={{ color: '#444', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 8 }}>Espace personnel · Privé</p>
      </div>

      {/* ── TABS ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', marginTop: 36, marginBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: 'none', border: 'none', borderBottom: tab === t.id ? '2px solid #fff' : '2px solid transparent',
              color: tab === t.id ? '#fff' : '#555', padding: 'clamp(10px,2vw,14px) clamp(14px,3vw,28px)',
              fontSize: 'clamp(11px,2vw,14px)', cursor: 'pointer', transition: 'all .2s', fontWeight: tab === t.id ? 600 : 400,
              letterSpacing: '0.04em', marginBottom: -1,
            }}>
            <span style={{ marginRight: 6 }}>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,48px) 0' }}>

        {/* ════ OUTFITS ════ */}
        {tab === 'outfits' && (
          <div className="ae-fade">
            <SectionHeader title="Outfits" sub="Inspirations vestimentaires" />
            <AddBtn onClick={() => openModal('outfits')} />
            {outfits.length === 0 ? <EmptyState icon="👔" text="Aucun outfit ajouté pour l'instant." /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {outfits.map((o, i) => (
                  <div key={o.id} className="out-card" style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4' }} onClick={() => openLb(outfits.map(x => x.data), i)}>
                    <img src={o.data} alt={o.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div className="out-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', opacity: 0, transition: 'opacity .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 13, textAlign: 'center', padding: '0 12px', fontWeight: 500 }}>{o.label || '—'}</span>
                      <button onClick={e => { e.stopPropagation(); del('outfits', o.id, setOutfits) }}
                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.8)', border: 'none', color: '#fff', borderRadius: 4, width: 28, height: 28, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ AESTHETIC PHOTOS ════ */}
        {tab === 'aesthetic' && (
          <div className="ae-fade">
            <SectionHeader title="Aesthetic" sub="Photos qui me parlent" />
            <AddBtn onClick={() => openModal('aesthetic')} />
            {aphotos.length === 0 ? <EmptyState icon="📷" text="Aucune photo ajoutée." /> : (
              <div style={{ columns: 'clamp(160px,30vw,320px) 3', gap: 8 }}>
                {aphotos.map((p, i) => (
                  <div key={p.id} className="aph-card" style={{ breakInside: 'avoid' as const, marginBottom: 8, borderRadius: 4, overflow: 'hidden', position: 'relative', cursor: 'pointer' }} onClick={() => openLb(aphotos.map(x => x.data), i)}>
                    <img src={p.data} alt="" style={{ width: '100%', display: 'block', transition: 'filter .2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.filter = 'brightness(0.75)'}
                      onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.filter = 'none'} />
                    <div className="aph-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7), transparent)', padding: '20px 10px 10px', opacity: p.context ? 1 : 0, transition: 'opacity .2s' }}>
                      {p.context && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>{p.context}</div>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); del('photos', p.id, setAPhotos) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, width: 26, height: 26, fontSize: 11, cursor: 'pointer', opacity: 0, transition: 'opacity .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      className="aph-del-btn"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ PROCHES ════ */}
        {tab === 'proches' && (
          <div className="ae-fade">
            <SectionHeader title="Proches" sub="Famille · Amis · Moments" />
            <AddBtn onClick={() => openModal('proches')} />
            {proches.length === 0 ? <EmptyState icon="👥" text="Aucun souvenir ajouté." /> : (
              <div style={{ columns: 'clamp(160px,28vw,260px) 3', gap: 20 }}>
                {proches.map(p => (
                  <div key={p.id} className="proche-pol" style={{
                    background: '#fff', padding: '10px 10px 48px', boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
                    borderRadius: 2, marginBottom: 20, breakInside: 'avoid' as const,
                    transform: `rotate(${p.rotation}deg)`, transition: 'all .35s ease',
                    position: 'relative',
                  }}>
                    <div className="proche-del" onClick={() => del('proches', p.id, setProches)}
                      style={{ position: 'absolute', top: 6, right: 8, opacity: 0, transition: 'opacity .2s', background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, zIndex: 2 }}>✕</div>
                    <img src={p.data} alt={p.who} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', filter: 'grayscale(100%)', transition: 'filter .4s ease' }} />
                    {p.who && <div style={{ fontFamily: 'cursive', fontSize: 12, color: '#333', marginTop: 8, lineHeight: 1.4 }}>{p.who}</div>}
                    {p.moment && <div style={{ fontSize: 10, color: '#999', marginTop: 3 }}>{p.moment}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ PHYSIQUE ════ */}
        {tab === 'physique' && (
          <div className="ae-fade">
            <SectionHeader title="Physique" sub="Le travail ne ment pas" />
            <AddBtn onClick={() => openModal('physique')} />
            {physiques.length === 0 ? <EmptyState icon="💪" text="Aucune photo ajoutée." /> : (
              <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
                {/* Timeline vertical line */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.12)', transform: 'translateX(-50%)' }} className="ae-timeline-line" />

                {physiques.map((p, i) => {
                  const isLeft = i % 2 === 0
                  return (
                    <div key={p.id} className="phy-entry" style={{
                      display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 56,
                      flexDirection: isLeft ? 'row' : 'row-reverse',
                      position: 'relative',
                    }}>
                      {/* Timeline dot */}
                      <div style={{ position: 'absolute', left: '50%', top: 20, transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#fff', border: '2px solid #000', zIndex: 2 }} />

                      {/* Content side */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: isLeft ? 'flex-end' : 'flex-start' }}>
                        {p.date && (
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '0.05em' }}>
                            {new Date(p.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        )}
                        <div style={{ position: 'relative', cursor: 'pointer', borderRadius: 4, overflow: 'hidden', maxWidth: 280, width: '100%' }} onClick={() => openLb(physiques.map(x => x.data), i)}>
                          <img src={p.data} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', transition: 'box-shadow .2s' }} />
                          <div className="phy-del" onClick={e => { e.stopPropagation(); del('physique', p.id, setPhysiques) }}
                            style={{ position: 'absolute', top: 8, right: 8, opacity: 0, transition: 'opacity .2s', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, width: 28, height: 28, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</div>
                        </div>
                        {p.note && <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 8, maxWidth: 280, textAlign: isLeft ? 'right' : 'left' }}>{p.note}</div>}
                      </div>

                      {/* Spacer */}
                      <div style={{ flex: 1 }} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────── */}

      {modal === 'outfits' && (
        <Modal onClose={() => !saving && setModal(null)} title="👔 Ajouter un outfit">
          <DropZone img={fImg} setImg={setFImg} />
          <input className="ae-inp" value={fLabel} onChange={e => setFLabel(e.target.value)} placeholder="Style, marques, occasion..." style={{ ...inp, marginBottom: 16 }} />
          {saveErr && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 4 }}>{saveErr}</div>}
          <SaveRow onCancel={() => setModal(null)} onSave={addOutfit} saving={saving} />
        </Modal>
      )}

      {modal === 'aesthetic' && (
        <Modal onClose={() => !saving && setModal(null)} title="📷 Ajouter une photo">
          <DropZone img={fImg} setImg={setFImg} />
          <input className="ae-inp" value={fContext} onChange={e => setFContext(e.target.value)} placeholder="Où, quand, pourquoi..." style={{ ...inp, marginBottom: 16 }} />
          {saveErr && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 4 }}>{saveErr}</div>}
          <SaveRow onCancel={() => setModal(null)} onSave={addAPhoto} saving={saving} />
        </Modal>
      )}

      {modal === 'proches' && (
        <Modal onClose={() => !saving && setModal(null)} title="👥 Ajouter un souvenir">
          <DropZone img={fImg} setImg={setFImg} />
          <input className="ae-inp" value={fWho} onChange={e => setFWho(e.target.value)} placeholder="Famille, amis, nom..." style={{ ...inp, marginBottom: 10 }} />
          <input className="ae-inp" value={fMoment} onChange={e => setFMoment(e.target.value)} placeholder="C'était quand, où..." style={{ ...inp, marginBottom: 16 }} />
          {saveErr && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 4 }}>{saveErr}</div>}
          <SaveRow onCancel={() => setModal(null)} onSave={addProche} saving={saving} />
        </Modal>
      )}

      {modal === 'physique' && (
        <Modal onClose={() => !saving && setModal(null)} title="💪 Ajouter une photo">
          <DropZone img={fImg} setImg={setFImg} />
          <input className="ae-inp" type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={{ ...inp, marginBottom: 10 }} />
          <textarea className="ae-inp" value={fNote} onChange={e => setFNote(e.target.value)} placeholder="Séance du jour, ressenti..." rows={2} style={{ ...inp, resize: 'none', marginBottom: 16 }} />
          {saveErr && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 4 }}>{saveErr}</div>}
          <SaveRow onCancel={() => setModal(null)} onSave={addPhysique} saving={saving} />
        </Modal>
      )}

      {/* ── LIGHTBOX ───────────────────────────────────────── */}
      {lb && <Lightbox items={lb.items} index={lb.index} onClose={() => setLb(null)} onNav={i => setLb({ ...lb, index: i })} />}

      <style>{`
        @media (max-width: 600px) {
          .ae-timeline-line { left: 16px !important; transform: none !important; }
          .phy-entry { flex-direction: column !important; padding-left: 36px; }
          .phy-entry > div:last-child { display: none !important; }
          .phy-entry > div:first-child { align-items: flex-start !important; text-align: left !important; }
        }
      `}</style>
    </div>
  )
}
