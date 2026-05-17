'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Memory   = { id: string; data: string; caption: string; date: string; location: string; rotation: number; createdat: string }
type MoodItem = { id: string; type: 'image'|'color'|'quote'; data: string; color: string; quote: string; author: string; label: string; createdat: string }
type Track    = { id: string; title: string; artist: string; url: string; note: string; createdat: string }

// ─── Countdown target ────────────────────────────────────────────────────────

const TARGET   = new Date('2026-08-17T00:00:00')
const START    = new Date('2026-06-01T00:00:00')

function useCountdown() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const now  = new Date()
  const diff = TARGET.getTime() - now.getTime()
  const done = diff <= 0
  const days  = done ? 0 : Math.floor(diff / 86400000)
  const hours = done ? 0 : Math.floor((diff % 86400000) / 3600000)
  const mins  = done ? 0 : Math.floor((diff % 3600000) / 60000)
  const secs  = done ? 0 : Math.floor((diff % 60000) / 1000)
  const pct   = Math.min(100, Math.max(0, ((now.getTime() - START.getTime()) / (TARGET.getTime() - START.getTime())) * 100))
  return { days, hours, mins, secs, done, pct }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const O = '#FF6B35'
const inp: React.CSSProperties = { backgroundColor: '#fff', border: '1px solid #ddd', color: '#1a1a1a', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }
const btnO: React.CSSProperties = { backgroundColor: O, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s' }

function SectionTitle({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <h2 style={{ fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif' }}>
        {emoji} {title}
      </h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginTop: 8, fontSize: 15 }}>{sub}</p>
      <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${O}, #FFD700)`, borderRadius: 100, margin: '12px auto 0' }} />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SummerPage() {

  // Memories
  const [memories, setMemories]     = useState<Memory[]>([])
  const [memModal, setMemModal]     = useState(false)
  const [memImg, setMemImg]         = useState('')
  const [memCaption, setMemCaption] = useState('')
  const [memDate, setMemDate]       = useState('')
  const [memLoc, setMemLoc]         = useState('')
  const [memDrag, setMemDrag]       = useState(false)
  const memFileRef = useRef<HTMLInputElement>(null)

  // Moodboard
  const [mood, setMood]             = useState<MoodItem[]>([])
  const [moodModal, setMoodModal]   = useState<'image'|'color'|'quote'|null>(null)
  const [moodImg, setMoodImg]       = useState('')
  const [moodColor, setMoodColor]   = useState('#FF6B35')
  const [moodColorLabel, setMoodColorLabel] = useState('')
  const [moodQuote, setMoodQuote]   = useState('')
  const [moodAuthor, setMoodAuthor] = useState('')
  const [moodLightbox, setMoodLightbox] = useState<MoodItem|null>(null)
  const moodFileRef = useRef<HTMLInputElement>(null)

  // Playlist
  const [tracks, setTracks]         = useState<Track[]>([])
  const [trkTitle, setTrkTitle]     = useState('')
  const [trkArtist, setTrkArtist]   = useState('')
  const [trkUrl, setTrkUrl]         = useState('')
  const [trkNote, setTrkNote]       = useState('')

  // Countdown
  const { days, hours, mins, secs, done, pct } = useCountdown()

  // ── Load data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/summer/memories').then(r => r.json()).then(d => Array.isArray(d) && setMemories(d))
    fetch('/api/summer/moodboard').then(r => r.json()).then(d => Array.isArray(d) && setMood(d))
    fetch('/api/summer/playlist').then(r => r.json()).then(d => Array.isArray(d) && setTracks(d))
  }, [])

  // ── Image reader helper ────────────────────────────────────────────────────

  const readFile = (file: File): Promise<string> => new Promise(res => {
    const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file)
  })

  // ── Memories ──────────────────────────────────────────────────────────────

  const onMemDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setMemDrag(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) setMemImg(await readFile(f))
  }
  const onMemFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) setMemImg(await readFile(f)); e.target.value = ''
  }
  const addMemory = async () => {
    if (!memImg) return
    const rotation = parseFloat((Math.random() * 6 - 3).toFixed(2))
    const res = await fetch('/api/summer/memories', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: memImg, caption: memCaption, date: memDate, location: memLoc, rotation }) })
    const m: Memory = await res.json()
    setMemories(p => [m, ...p])
    setMemModal(false); setMemImg(''); setMemCaption(''); setMemDate(''); setMemLoc('')
  }
  const delMemory = async (id: string) => {
    if (!confirm('Supprimer ce souvenir ?')) return
    await fetch(`/api/summer/memories/${id}`, { method: 'DELETE' })
    setMemories(p => p.filter(m => m.id !== id))
  }

  // ── Moodboard ─────────────────────────────────────────────────────────────

  const onMoodFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) setMoodImg(await readFile(f)); e.target.value = ''
  }
  const addMoodItem = async () => {
    const body: Partial<MoodItem> = { type: moodModal! }
    if (moodModal === 'image') { if (!moodImg) return; body.data = moodImg }
    if (moodModal === 'color') { body.color = moodColor; body.label = moodColorLabel }
    if (moodModal === 'quote') { if (!moodQuote.trim()) return; body.quote = moodQuote; body.author = moodAuthor }
    const res = await fetch('/api/summer/moodboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const item: MoodItem = await res.json()
    setMood(p => [item, ...p])
    setMoodModal(null); setMoodImg(''); setMoodColorLabel(''); setMoodQuote(''); setMoodAuthor('')
  }
  const delMood = async (id: string) => {
    await fetch(`/api/summer/moodboard/${id}`, { method: 'DELETE' })
    setMood(p => p.filter(m => m.id !== id))
  }

  // ── Playlist ──────────────────────────────────────────────────────────────

  const addTrack = async () => {
    if (!trkTitle.trim()) return
    const res = await fetch('/api/summer/playlist', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trkTitle, artist: trkArtist, url: trkUrl, note: trkNote }) })
    const t: Track = await res.json()
    setTracks(p => [...p, t])
    setTrkTitle(''); setTrkArtist(''); setTrkUrl(''); setTrkNote('')
  }
  const delTrack = async (id: string) => {
    await fetch(`/api/summer/playlist/${id}`, { method: 'DELETE' })
    setTracks(p => p.filter(t => t.id !== id))
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: 'linear-gradient(180deg, #fff8f0 0%, #fff3e6 50%, #fff8f0 100%)', minHeight: '100vh', color: '#1a1a1a', paddingBottom: 120 }}>

      <style>{`
        .sum-inp:focus { border-color: #FF6B35 !important; outline: none; }
        .sum-btn:hover { opacity: 0.85; }
        .polaroid:hover { transform: rotate(0deg) scale(1.05) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.25) !important; z-index: 10 !important; }
        .polaroid:hover .pol-del { opacity: 1 !important; }
        .mood-card:hover .mood-del { opacity: 1 !important; }
        .mood-card:hover { transform: scale(1.03); box-shadow: 0 8px 30px rgba(255,107,53,0.2) !important; }
        .track-row:hover { background: rgba(255,107,53,0.05) !important; }
        .track-row:hover .trk-del { opacity: 1 !important; }
        @keyframes flipIn { 0%{transform:rotateX(0)} 50%{transform:rotateX(90deg)} 100%{transform:rotateX(0)} }
        .flip { animation: flipIn 0.3s ease; }
        @keyframes confetti { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(-40px) rotate(360deg); opacity:0} }
        .scrollbar-orange { scrollbar-width: thin; scrollbar-color: #FF6B35 #fff3e6; }
        .mem-drop:hover { border-color: #FF6B35 !important; background: rgba(255,107,53,0.05) !important; }
      `}</style>

      {/* ── HERO HEADER ────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 40%, #FFD700 100%)', padding: 'clamp(40px,8vw,80px) 20px clamp(50px,10vw,100px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.15), transparent 60%)' }} />
        <h1 style={{ fontSize: 'clamp(32px,7vw,64px)', fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'Georgia, serif', position: 'relative', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
          ☀️ Summer 2026
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', fontSize: 'clamp(14px,2.5vw,20px)', marginTop: 10, position: 'relative' }}>
          Souvenirs, ambiances & vibes de l'été
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)' }}>

        {/* ════════════════════════════════════════════════════
            BLOC 1 — MEMORIES WALL
        ════════════════════════════════════════════════════ */}
        <section style={{ paddingTop: 72 }}>
          <SectionTitle emoji="📸" title="Memories Wall" sub="Les moments qui comptent" />

          {/* Add button */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button className="sum-btn" onClick={() => setMemModal(true)} style={btnO}>
              + Ajouter un souvenir
            </button>
          </div>

          {/* Add modal */}
          {memModal && (
            <div onClick={() => setMemModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18, color: '#1a1a1a' }}>📸 Nouveau souvenir</div>

                {/* Drop zone */}
                <div className="mem-drop" onDragOver={e => { e.preventDefault(); setMemDrag(true) }}
                  onDragLeave={() => setMemDrag(false)} onDrop={onMemDrop} onClick={() => memFileRef.current?.click()}
                  style={{ border: `2px dashed ${memDrag ? O : '#ddd'}`, borderRadius: 12, padding: memImg ? 0 : '28px 20px', marginBottom: 14, cursor: 'pointer', transition: 'all .2s', overflow: 'hidden', background: memDrag ? 'rgba(255,107,53,0.05)' : '#fafafa', textAlign: 'center' }}>
                  {memImg
                    ? <img src={memImg} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block', borderRadius: 10 }} />
                    : <><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Glisse ou clique pour uploader</div></>
                  }
                  <input ref={memFileRef} type="file" accept="image/*" onChange={onMemFile} style={{ display: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input className="sum-inp" value={memCaption} onChange={e => setMemCaption(e.target.value)} placeholder="Un mot sur ce moment..." style={inp} />
                  <input className="sum-inp" type="date" value={memDate} onChange={e => setMemDate(e.target.value)} style={inp} />
                  <input className="sum-inp" value={memLoc} onChange={e => setMemLoc(e.target.value)} placeholder="Où c'était ?" style={inp} />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button onClick={() => setMemModal(false)} style={{ flex: 1, background: '#f5f5f5', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, cursor: 'pointer', color: '#888', fontWeight: 600 }}>Annuler</button>
                  <button className="sum-btn" onClick={addMemory} style={{ ...btnO, flex: 2 }}>Ajouter au mur</button>
                </div>
              </div>
            </div>
          )}

          {/* Polaroid wall */}
          {memories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
              <div style={{ fontSize: 40 }}>🌅</div>
              <div style={{ marginTop: 10, fontSize: 14 }}>Aucun souvenir pour l'instant — ajoutes-en un !</div>
            </div>
          ) : (
            <div style={{ columns: 'clamp(200px,30vw,280px) 3', gap: 24 }}>
              {memories.map(m => (
                <div key={m.id} className="polaroid" style={{
                  background: '#fffef5', padding: '12px 12px 44px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  borderRadius: 4, marginBottom: 24, breakInside: 'avoid' as const,
                  transform: `rotate(${m.rotation}deg)`, transition: 'all .3s ease',
                  position: 'relative', cursor: 'default',
                }}>
                  <div className="pol-del" onClick={() => delMemory(m.id)} style={{
                    position: 'absolute', top: 6, right: 8, opacity: 0, transition: 'opacity .2s',
                    background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none', borderRadius: '50%',
                    width: 24, height: 24, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900,
                  }}>✕</div>
                  <img src={m.data} alt={m.caption} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                  {m.caption && <div style={{ fontFamily: 'cursive', fontSize: 13, color: '#333', marginTop: 10, lineHeight: 1.4 }}>{m.caption}</div>}
                  {(m.date || m.location) && (
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>
                      {m.date && <span>📅 {m.date}</span>}
                      {m.date && m.location && ' · '}
                      {m.location && <span>📍 {m.location}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════
            BLOC 2 — MOOD BOARD
        ════════════════════════════════════════════════════ */}
        <section style={{ paddingTop: 80 }}>
          <SectionTitle emoji="🌅" title="Mood Board" sub="L'ambiance de mon été" />

          {/* Add buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
            {(['image','color','quote'] as const).map((t, i) => (
              <button key={t} className="sum-btn" onClick={() => setMoodModal(t)} style={{ ...btnO, background: ['#FF6B35','#FF8E53','#FFD700'][i], fontSize: 13 }}>
                {['🖼 Image','🎨 Couleur','💬 Citation'][i]}
              </button>
            ))}
          </div>

          {/* Mood modal */}
          {moodModal && (
            <div onClick={() => setMoodModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

                {moodModal === 'image' && (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>🖼 Ajouter une image</div>
                    <div onClick={() => moodFileRef.current?.click()} style={{ border: '2px dashed #ddd', borderRadius: 12, padding: moodImg ? 0 : '36px 20px', cursor: 'pointer', textAlign: 'center', overflow: 'hidden', marginBottom: 14 }}>
                      {moodImg ? <img src={moodImg} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10 }} /> : <><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Clic pour uploader</div></>}
                      <input ref={moodFileRef} type="file" accept="image/*" onChange={onMoodFile} style={{ display: 'none' }} />
                    </div>
                  </>
                )}

                {moodModal === 'color' && (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>🎨 Choisir une couleur</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                      <input type="color" value={moodColor} onChange={e => setMoodColor(e.target.value)} style={{ width: 64, height: 64, border: 'none', borderRadius: 12, cursor: 'pointer', padding: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{moodColor}</div>
                        <input className="sum-inp" value={moodColorLabel} onChange={e => setMoodColorLabel(e.target.value)} placeholder="Nom de la couleur..." style={{ ...inp, marginTop: 8 }} />
                      </div>
                    </div>
                    <div style={{ width: '100%', height: 80, borderRadius: 12, background: moodColor, marginBottom: 14 }} />
                  </>
                )}

                {moodModal === 'quote' && (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>💬 Ajouter une citation</div>
                    <textarea className="sum-inp" value={moodQuote} onChange={e => setMoodQuote(e.target.value)} placeholder="Ta citation de l'été..." rows={4} style={{ ...inp, resize: 'vertical', marginBottom: 10 }} />
                    <input className="sum-inp" value={moodAuthor} onChange={e => setMoodAuthor(e.target.value)} placeholder="Auteur (optionnel)..." style={inp} />
                  </>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button onClick={() => setMoodModal(null)} style={{ flex: 1, background: '#f5f5f5', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, cursor: 'pointer', color: '#888', fontWeight: 600 }}>Annuler</button>
                  <button className="sum-btn" onClick={addMoodItem} style={{ ...btnO, flex: 2 }}>Ajouter</button>
                </div>
              </div>
            </div>
          )}

          {/* Mood lightbox */}
          {moodLightbox && (
            <div onClick={() => setMoodLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <button onClick={() => setMoodLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, width: 40, height: 40, fontSize: 20, cursor: 'pointer' }}>✕</button>
              <img src={moodLightbox.data} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} />
            </div>
          )}

          {/* Grid */}
          {mood.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb', fontSize: 14 }}>
              <div style={{ fontSize: 36 }}>🎨</div>
              <div style={{ marginTop: 10 }}>Ton mood board est vide — ajoute des images, couleurs et citations !</div>
            </div>
          ) : (
            <div style={{ columns: 'clamp(180px,22vw,260px) 4', gap: 12 }}>
              {mood.map(item => (
                <div key={item.id} className="mood-card" style={{ breakInside: 'avoid' as const, marginBottom: 12, borderRadius: 16, overflow: 'hidden', position: 'relative', transition: 'all .2s', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

                  <button className="mood-del" onClick={() => delMood(item.id)} style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 5, opacity: 0, transition: 'opacity .2s',
                    background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none', borderRadius: '50%',
                    width: 26, height: 26, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>

                  {item.type === 'image' && (
                    <div onClick={() => setMoodLightbox(item)} style={{ cursor: 'zoom-in' }}>
                      <img src={item.data} alt={item.label} style={{ width: '100%', display: 'block' }} />
                      {item.label && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 12, padding: '6px 10px' }}>{item.label}</div>}
                    </div>
                  )}

                  {item.type === 'color' && (
                    <div style={{ background: item.color, height: 150, display: 'flex', alignItems: 'flex-end', padding: '10px 12px' }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{item.color}</div>
                        {item.label && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: 2 }}>{item.label}</div>}
                      </div>
                    </div>
                  )}

                  {item.type === 'quote' && (
                    <div style={{ background: '#fffef5', padding: '24px 18px 20px', minHeight: 120, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: -8, left: 12, fontSize: 80, color: O, opacity: 0.15, fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>"</span>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1a1a1a', lineHeight: 1.6, margin: '0 0 10px', position: 'relative', zIndex: 1 }}>{item.quote}</p>
                      {item.author && <p style={{ fontSize: 12, color: O, fontStyle: 'italic', margin: 0 }}>— {item.author}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════
            BLOC 3 — PLAYLIST DE L'ÉTÉ
        ════════════════════════════════════════════════════ */}
        <section style={{ paddingTop: 80 }}>
          <SectionTitle emoji="🎵" title="Playlist de l'été" sub="Les sons de ma saison" />

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 4px 20px rgba(255,107,53,0.1)', marginBottom: 28, border: '1px solid #ffe8dc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input className="sum-inp" value={trkTitle} onChange={e => setTrkTitle(e.target.value)} placeholder="Titre..." style={inp} />
              <input className="sum-inp" value={trkArtist} onChange={e => setTrkArtist(e.target.value)} placeholder="Artiste..." style={inp} />
            </div>
            <input className="sum-inp" value={trkUrl} onChange={e => setTrkUrl(e.target.value)} placeholder="Colle ton lien YouTube / Spotify..." style={{ ...inp, marginBottom: 10 }} />
            <textarea className="sum-inp" value={trkNote} onChange={e => setTrkNote(e.target.value)} placeholder="Ce son me rappelle..." maxLength={120}
              rows={2} style={{ ...inp, resize: 'none', marginBottom: 12 }} />
            <div style={{ textAlign: 'right' }}>
              <button className="sum-btn" onClick={addTrack} style={btnO}>Ajouter à la playlist</button>
            </div>
          </div>

          {/* Track list */}
          {tracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#bbb', fontSize: 14 }}>
              <div style={{ fontSize: 36 }}>🎶</div><div style={{ marginTop: 10 }}>Ta playlist est vide.</div>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(255,107,53,0.08)', border: '1px solid #ffe8dc' }}>
              {tracks.map((t, i) => (
                <div key={t.id} className="track-row" style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  borderLeft: `3px solid ${O}`, borderBottom: i < tracks.length - 1 ? '1px solid #ffeee6' : 'none',
                  background: i % 2 === 0 ? '#fff' : '#fffaf8', transition: 'background .2s',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: O, minWidth: 28, fontFamily: 'monospace' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <a href={t.url || '#'} target="_blank" rel="noopener" onClick={e => !t.url && e.preventDefault()}
                    style={{ fontSize: 20, color: O, flexShrink: 0, textDecoration: 'none', transition: 'transform .15s', display: 'inline-block' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                    ▶
                  </a>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    {t.artist && <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{t.artist}</div>}
                    {t.note && <div style={{ fontSize: 12, color: '#FF8E53', fontStyle: 'italic', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{t.note}"</div>}
                  </div>
                  <div style={{ fontSize: 10, color: '#ccc', textAlign: 'right', flexShrink: 0 }}>
                    {new Date(t.createdat).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                  <button className="trk-del" onClick={() => delTrack(t.id)} style={{ opacity: 0, background: 'none', border: 'none', color: '#ef4444', fontSize: 16, cursor: 'pointer', transition: 'opacity .2s', flexShrink: 0, padding: '4px 6px' }}>🗑</button>
                </div>
              ))}
              <div style={{ padding: '10px 18px', fontSize: 12, color: '#aaa', textAlign: 'center', borderTop: '1px solid #ffeee6' }}>
                {tracks.length} son{tracks.length !== 1 ? 's' : ''} · Playlist de l'été 2026
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════
            BLOC 4 — COUNTDOWN
        ════════════════════════════════════════════════════ */}
        <section style={{ paddingTop: 80 }}>
          <SectionTitle emoji="⏳" title="Countdown" sub="La date qui approche..." />

          {done ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 'clamp(24px,5vw,40px)', fontWeight: 900, color: O }}>🌞 C'est le jour J ! Profite de chaque seconde ☀️</div>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px,5vw,48px)', boxShadow: '0 8px 40px rgba(255,107,53,0.12)', border: '1px solid #ffe8dc' }}>

              {/* Blocs chiffres */}
              <div style={{ display: 'flex', gap: 'clamp(8px,2vw,20px)', justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
                {[
                  { val: days,  label: 'JOURS' },
                  { val: hours, label: 'HEURES' },
                  { val: mins,  label: 'MINS' },
                  { val: secs,  label: 'SEC' },
                ].map(({ val, label }) => (
                  <div key={label} style={{
                    background: 'linear-gradient(135deg, #fff8f0, #fff3e6)',
                    border: '2px solid #ffe8dc', borderRadius: 16,
                    padding: 'clamp(16px,3vw,28px) clamp(16px,3vw,32px)',
                    textAlign: 'center', minWidth: 'clamp(72px,15vw,110px)',
                    boxShadow: '0 4px 16px rgba(255,107,53,0.1)',
                  }}>
                    <div style={{ fontSize: 'clamp(36px,8vw,64px)', fontWeight: 900, color: O, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {String(val).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 'clamp(9px,1.5vw,11px)', color: '#aaa', marginTop: 6, letterSpacing: '0.12em', fontWeight: 700 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Label */}
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#888', fontSize: 14, marginBottom: 20 }}>
                avant le <strong style={{ color: O }}>17 Août 2026</strong>
              </p>

              {/* Progress bar */}
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa', marginBottom: 6 }}>
                  <span>1 Juin 2026</span>
                  <span style={{ color: O, fontWeight: 700 }}>{pct.toFixed(1)}%</span>
                  <span>17 Août 2026</span>
                </div>
                <div style={{ height: 10, background: '#f0e8e0', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${O}, #FFD700)`, borderRadius: 100, transition: 'width 1s linear' }} />
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
