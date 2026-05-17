'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Song = { id: string; title: string; lyrics: string; createdat: string; updatedat: string }
type Instrumental = { id: string; name: string; url: string; createdat: string }
type Cover = { id: string; label: string; data: string; createdat: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
function lineCount(s: string) { return s ? s.split('\n').length : 0 }
function wordCount(s: string) { return s ? s.trim().split(/\s+/).filter(Boolean).length : 0 }

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MusicPage() {
  // Songs
  const [songs, setSongs] = useState<Song[]>([])
  const [activeSong, setActiveSong] = useState<Song | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editLyrics, setEditLyrics] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Instrumentals
  const [instrumentals, setInstrumentals] = useState<Instrumental[]>([])
  const [beatName, setBeatName] = useState('')
  const [beatUrl, setBeatUrl] = useState('')

  // Covers
  const [covers, setCovers] = useState<Cover[]>([])
  const [lightbox, setLightbox] = useState<Cover | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Load all data ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/music/songs').then(r => r.json()).then(d => Array.isArray(d) && setSongs(d))
    fetch('/api/music/instrumentals').then(r => r.json()).then(d => Array.isArray(d) && setInstrumentals(d))
    fetch('/api/music/covers').then(r => r.json()).then(d => Array.isArray(d) && setCovers(d))
  }, [])

  // ── Song editor autosave ──────────────────────────────────────────────────

  const triggerSave = useCallback((id: string, title: string, lyrics: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/music/songs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lyrics }),
      })
      setSongs(prev => prev.map(s => s.id === id ? { ...s, title, lyrics } : s))
      setSavedMsg(true)
      if (savedTimer.current) clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSavedMsg(false), 2000)
    }, 500)
  }, [])

  const onTitleChange = (v: string) => {
    setEditTitle(v)
    if (activeSong) triggerSave(activeSong.id, v, editLyrics)
  }
  const onLyricsChange = (v: string) => {
    setEditLyrics(v)
    if (activeSong) triggerSave(activeSong.id, editTitle, v)
  }

  const openSong = (s: Song) => { setActiveSong(s); setEditTitle(s.title); setEditLyrics(s.lyrics) }

  const newSong = async () => {
    const res = await fetch('/api/music/songs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Sans titre', lyrics: '' }),
    })
    const s: Song = await res.json()
    setSongs(prev => [s, ...prev])
    openSong(s)
  }

  const deleteSong = async (id: string) => {
    if (!confirm('Supprimer cette chanson ?')) return
    await fetch(`/api/music/songs/${id}`, { method: 'DELETE' })
    setSongs(prev => prev.filter(s => s.id !== id))
    setActiveSong(null)
  }

  // ── Instrumentals ─────────────────────────────────────────────────────────

  const addInstrumental = async () => {
    if (!beatName.trim() || !beatUrl.trim()) return
    const res = await fetch('/api/music/instrumentals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: beatName.trim(), url: beatUrl.trim() }),
    })
    const item: Instrumental = await res.json()
    setInstrumentals(prev => [item, ...prev])
    setBeatName(''); setBeatUrl('')
  }

  const deleteInstrumental = async (id: string) => {
    await fetch(`/api/music/instrumentals/${id}`, { method: 'DELETE' })
    setInstrumentals(prev => prev.filter(i => i.id !== id))
  }

  // ── Covers ────────────────────────────────────────────────────────────────

  const uploadImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = e.target?.result as string
      const res = await fetch('/api/music/covers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: file.name.replace(/\.[^/.]+$/, ''), data }),
      })
      const cover: Cover = await res.json()
      setCovers(prev => [cover, ...prev])
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).forEach(uploadImage)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(uploadImage)
    e.target.value = ''
  }

  const updateCoverLabel = useCallback((id: string, label: string) => {
    setCovers(prev => prev.map(c => c.id === id ? { ...c, label } : c))
    fetch(`/api/music/covers/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    })
  }, [])

  const deleteCover = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    await fetch(`/api/music/covers/${id}`, { method: 'DELETE' })
    setCovers(prev => prev.filter(c => c.id !== id))
    if (lightbox?.id === id) setLightbox(null)
  }

  // ── Shared input style ────────────────────────────────────────────────────

  const inp: React.CSSProperties = {
    backgroundColor: '#111', border: '1px solid #333', color: '#fff',
    borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none',
    width: '100%', boxSizing: 'border-box',
  }

  const btn = (color = '#1D9E75'): React.CSSProperties => ({
    backgroundColor: color, color: color === '#1D9E75' ? '#fff' : '#ef4444',
    border: color === '#1D9E75' ? 'none' : '1px solid #ef444440',
    borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', transition: 'opacity .2s',
  })

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: 'clamp(20px,4vw,48px) clamp(16px,4vw,48px) 100px', color: '#fff' }}>

      <style>{`
        .music-input:focus { border-color: #1D9E75 !important; }
        .music-textarea { resize: vertical; scrollbar-width: thin; scrollbar-color: #1D9E75 #111; }
        .music-textarea:focus { border-color: #1D9E75 !important; outline: none; }
        .beat-row:hover { background: rgba(29,158,117,0.06) !important; }
        .beat-row:hover .beat-del { opacity: 1 !important; }
        .cover-card:hover .cover-overlay { opacity: 1 !important; }
        .del-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: #ef4444 !important; }
        @keyframes fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .fadein { animation: fadein .25s ease forwards; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Page header ─────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 3, height: 20, background: '#1D9E75', borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              Workspace
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, margin: 0, color: '#fff' }}>
            🎵 Music Studio
          </h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 6 }}>Tout est sauvegardé automatiquement dans la base de données.</p>
        </div>

        {/* ════════════════════════════════════════════════════
            BLOC 1 — MES CHANSONS
        ════════════════════════════════════════════════════ */}
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 18, overflow: 'hidden' }}>

          {/* Header */}
          <div style={{
            padding: '18px 24px', borderBottom: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(29,158,117,0.06) 0%, transparent 60%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎵</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#1D9E75' }}>Mes Chansons</div>
                <div style={{ fontSize: 11, color: '#555' }}>{songs.length} chanson{songs.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            {!activeSong && (
              <button onClick={newSong} style={btn()}>+ Nouvelle chanson</button>
            )}
          </div>

          <div style={{ padding: '20px 24px' }}>

            {/* ── SONG EDITOR ── */}
            {activeSong ? (
              <div className="fadein">
                {/* Top bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <button onClick={() => setActiveSong(null)}
                    style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', color: '#1D9E75', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    ← Retour
                  </button>
                  <span style={{
                    fontSize: 12, color: savedMsg ? '#1D9E75' : 'transparent',
                    fontWeight: 600, transition: 'color .3s',
                  }}>
                    Sauvegardé ✓
                  </span>
                </div>

                {/* Title input */}
                <input
                  className="music-input"
                  value={editTitle}
                  onChange={e => onTitleChange(e.target.value)}
                  placeholder="Titre de la chanson..."
                  style={{ ...inp, fontSize: 22, fontWeight: 800, marginBottom: 14, border: '1px solid #222', padding: '12px 16px' }}
                />

                {/* Lyrics textarea */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="music-textarea"
                    value={editLyrics}
                    onChange={e => onLyricsChange(e.target.value)}
                    placeholder="Écris tes paroles ici..."
                    style={{
                      ...inp,
                      fontFamily: 'monospace', fontSize: 14, lineHeight: 1.8,
                      minHeight: 320, borderLeft: '3px solid #1D9E75',
                      borderTop: '1px solid #222', borderRight: '1px solid #222', borderBottom: '1px solid #222',
                      borderRadius: '0 8px 8px 8px', padding: '16px',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 11, color: '#1D9E75', opacity: 0.7, pointerEvents: 'none' }}>
                    {wordCount(editLyrics)} mots · {lineCount(editLyrics)} lignes
                  </div>
                </div>

                {/* Delete */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="del-btn" onClick={() => deleteSong(activeSong.id)}
                    style={{ background: 'transparent', border: '1px solid #33000033', color: '#ef4444', borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer', transition: 'all .2s' }}>
                    🗑 Supprimer cette chanson
                  </button>
                </div>
              </div>

            ) : (
              /* ── SONG LIST ── */
              songs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#555' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🎼</div>
                  <div style={{ fontSize: 14 }}>Aucune chanson pour l'instant.</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Clique sur "+ Nouvelle chanson" pour commencer.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {songs.map(s => (
                    <div key={s.id} onClick={() => openSong(s)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', background: '#111', border: '1px solid #1a1a1a',
                        borderRadius: 10, cursor: 'pointer', transition: 'all .2s',
                        borderLeft: '3px solid #1D9E75',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1D9E75'; (e.currentTarget as HTMLElement).style.background = 'rgba(29,158,117,0.05)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLElement).style.background = '#111' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#F0F0F0' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
                          {fmtDate(s.updatedat)} · {lineCount(s.lyrics)} ligne{lineCount(s.lyrics) !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <span style={{ color: '#1D9E75', fontSize: 18 }}>→</span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            BLOC 2 — MES INSTRUMENTALS
        ════════════════════════════════════════════════════ */}
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 18, overflow: 'hidden' }}>

          <div style={{
            padding: '18px 24px', borderBottom: '1px solid #1a1a1a',
            background: 'linear-gradient(135deg, rgba(29,158,117,0.06) 0%, transparent 60%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎹</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#1D9E75' }}>Mes Instrumentals</div>
                <div style={{ fontSize: 11, color: '#555' }}>{instrumentals.length} beat{instrumentals.length !== 1 ? 's' : ''} sauvegardé{instrumentals.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Add form */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input className="music-input" value={beatName} onChange={e => setBeatName(e.target.value)}
                placeholder="Nom du beat..." style={{ ...inp, flex: '1 1 140px' }} />
              <input className="music-input" value={beatUrl} onChange={e => setBeatUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInstrumental()}
                placeholder="Colle ton lien YouTube, SoundCloud, Drive..." style={{ ...inp, flex: '3 1 240px' }} />
              <button onClick={addInstrumental} style={{ ...btn(), flexShrink: 0 }}>Ajouter +</button>
            </div>

            {/* List */}
            {instrumentals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#555', fontSize: 13 }}>
                🎶 Aucun beat ajouté pour l'instant.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {instrumentals.map(item => (
                  <div key={item.id} className="beat-row"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, borderLeft: '2px solid #1D9E75', transition: 'background .2s' }}>
                    <span style={{ color: '#1D9E75', fontSize: 18, flexShrink: 0 }}>▶</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#F0F0F0', marginBottom: 2 }}>{item.name}</div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#1D9E75', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        onClick={e => e.stopPropagation()}>
                        {item.url}
                      </a>
                      <div style={{ fontSize: 10, color: '#444', marginTop: 3 }}>{fmtDate(item.createdat)}</div>
                    </div>
                    <button className="beat-del" onClick={() => deleteInstrumental(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#555', fontSize: 18, cursor: 'pointer', opacity: 0, transition: 'all .2s', padding: '4px 8px', borderRadius: 6, flexShrink: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555' }}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            BLOC 3 — COVERS & IMAGES
        ════════════════════════════════════════════════════ */}
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 18, overflow: 'hidden' }}>

          <div style={{
            padding: '18px 24px', borderBottom: '1px solid #1a1a1a',
            background: 'linear-gradient(135deg, rgba(29,158,117,0.06) 0%, transparent 60%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🖼</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#1D9E75' }}>Mes Covers & Images</div>
                <div style={{ fontSize: 11, color: '#555' }}>{covers.length} image{covers.length !== 1 ? 's' : ''} stockée{covers.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#1D9E75' : '#2a2a2a'}`,
                borderRadius: 12, padding: '32px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', transition: 'all .2s',
                background: dragOver ? 'rgba(29,158,117,0.06)' : '#111',
              }}
            >
              <span style={{ fontSize: 32, opacity: 0.7 }}>⬆️</span>
              <span style={{ fontSize: 13, color: dragOver ? '#1D9E75' : '#555', fontWeight: 600 }}>
                Glisse tes images ici ou clique pour uploader
              </span>
              <span style={{ fontSize: 11, color: '#333' }}>JPG, PNG, WebP...</span>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileInput} style={{ display: 'none' }} />
            </div>

            {/* Gallery grid */}
            {covers.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {covers.map(cover => (
                  <div key={cover.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="cover-card"
                      style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#111', cursor: 'pointer' }}>
                      <img src={cover.data} alt={cover.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div className="cover-overlay"
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0, transition: 'opacity .2s' }}>
                        <button onClick={() => setLightbox(cover)}
                          style={{ background: 'rgba(29,158,117,0.8)', border: 'none', color: '#fff', borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          👁
                        </button>
                        <button onClick={() => deleteCover(cover.id)}
                          style={{ background: 'rgba(239,68,68,0.8)', border: 'none', color: '#fff', borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          🗑
                        </button>
                      </div>
                    </div>
                    <input
                      className="music-input"
                      value={cover.label}
                      onChange={e => updateCoverLabel(cover.id, e.target.value)}
                      placeholder="Nom de la cover..."
                      style={{ ...inp, fontSize: 12, padding: '6px 10px', color: '#aaa' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {covers.length === 0 && (
              <div style={{ textAlign: 'center', color: '#444', fontSize: 12 }}>Aucune image stockée.</div>
            )}
          </div>
        </div>

      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────── */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, width: 40, height: 40, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
          <img
            src={lightbox.data} alt={lightbox.label}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 0 60px rgba(29,158,117,0.2)' }}
          />
          {lightbox.label && (
            <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: '#1D9E75', fontWeight: 700, fontSize: 14, background: 'rgba(0,0,0,0.8)', padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(29,158,117,0.3)' }}>
              {lightbox.label}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
