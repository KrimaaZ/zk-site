'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Colors ──────────────────────────────────────────────────────────────── */
const C = {
  notes:     { color: '#A78BFA', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)' },
  videos:    { color: '#60A5FA', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
  exercises: { color: '#34D399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  audios:    { color: '#F472B6', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.25)' },
}

type Tab = 'notes' | 'videos' | 'exercises' | 'audios'

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'notes',     label: 'Notes',     emoji: '📝' },
  { key: 'videos',    label: 'Vidéos',    emoji: '🎬' },
  { key: 'exercises', label: 'Exercices', emoji: '✍️' },
  { key: 'audios',    label: 'Audios',    emoji: '🎙️' },
]

/* ── Shared helpers ──────────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtDur(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function ytThumb(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null
}

/* ── Section: Notes ──────────────────────────────────────────────────────── */
type Note = { id: string; title: string; content: string; createdAt: string }

function NotesSection() {
  const [notes,    setNotes]   = useState<Note[]>([])
  const [title,    setTitle]   = useState('')
  const [content,  setContent] = useState('')
  const [saving,   setSaving]  = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const c = C.notes

  useEffect(() => {
    fetch('/api/italiano/notes').then(r => r.json()).then(d => Array.isArray(d) && setNotes(d))
  }, [])

  const add = async () => {
    if (!content.trim() || saving) return
    setSaving(true)
    const res = await fetch('/api/italiano/notes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    })
    if (res.ok) { const n = await res.json(); setNotes(p => [n, ...p]); setTitle(''); setContent('') }
    setSaving(false)
  }

  const del = async (id: string) => {
    await fetch(`/api/italiano/notes/${id}`, { method: 'DELETE' })
    setNotes(p => p.filter(n => n.id !== id))
  }

  return (
    <div>
      {/* Add form */}
      <div style={{ background: '#0d0d1a', border: `1px solid ${c.border}`, borderRadius: 16, padding: '16px', marginBottom: 16 }}>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Titre (ex: Leçon 1 — Salutations)…"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Écris ta note de cours ici…"
          rows={4}
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' as const }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <button onClick={add} disabled={!content.trim() || saving}
          style={{ marginTop: 8, width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: !content.trim() || saving ? '#1e1e2e' : c.color, color: !content.trim() || saving ? '#475569' : '#fff', fontWeight: 700, fontSize: 13, cursor: !content.trim() || saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '…' : '+ Sauvegarder la note'}
        </button>
      </div>

      {/* List */}
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155', fontSize: 13 }}>
          📝 Aucune note pour l'instant — ajoutes-en une !
        </div>
      ) : notes.map(n => (
        <div key={n.id} style={{ background: '#0d0d1a', border: `1px solid ${n.id === expanded ? c.color : '#1e1e2e'}`, borderRadius: 14, marginBottom: 8, overflow: 'hidden', transition: 'border-color .2s' }}>
          <div onClick={() => setExpanded(expanded === n.id ? null : n.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}>
            <span style={{ fontSize: 16 }}>📝</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{n.title || 'Note sans titre'}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{fmtDate(n.createdAt)}</div>
            </div>
            <span style={{ fontSize: 11, color: c.color }}>{expanded === n.id ? '▲' : '▼'}</span>
          </div>
          {expanded === n.id && (
            <div style={{ padding: '0 14px 14px' }}>
              <div style={{ borderTop: `1px solid #1e1e2e`, paddingTop: 12, fontSize: 13, color: '#CBD5E1', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const }}>
                {n.content}
              </div>
              <button onClick={() => del(n.id)}
                style={{ marginTop: 10, padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#F87171', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                🗑 Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Section: Videos ─────────────────────────────────────────────────────── */
type Video = { id: string; url: string; title: string; note: string; createdAt: string }

function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [url,    setUrl]    = useState('')
  const [title,  setTitle]  = useState('')
  const [note,   setNote]   = useState('')
  const [saving, setSaving] = useState(false)
  const c = C.videos

  useEffect(() => {
    fetch('/api/italiano/videos').then(r => r.json()).then(d => Array.isArray(d) && setVideos(d))
  }, [])

  const add = async () => {
    if (!url.trim() || saving) return
    setSaving(true)
    const res = await fetch('/api/italiano/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim(), title: title.trim(), note: note.trim() }),
    })
    if (res.ok) { const v = await res.json(); setVideos(p => [v, ...p]); setUrl(''); setTitle(''); setNote('') }
    setSaving(false)
  }

  const del = async (id: string) => {
    await fetch(`/api/italiano/videos/${id}`, { method: 'DELETE' })
    setVideos(p => p.filter(v => v.id !== id))
  }

  return (
    <div>
      {/* Add form */}
      <div style={{ background: '#0d0d1a', border: `1px solid ${c.border}`, borderRadius: 16, padding: '16px', marginBottom: 16 }}>
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="Lien de la vidéo (YouTube, etc.)…"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la vidéo…"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <input value={note} onChange={e => setNote(e.target.value)}
          placeholder="Note (optionnel)…"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <button onClick={add} disabled={!url.trim() || saving}
          style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: !url.trim() || saving ? '#1e1e2e' : c.color, color: !url.trim() || saving ? '#475569' : '#fff', fontWeight: 700, fontSize: 13, cursor: !url.trim() || saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '…' : '+ Ajouter la vidéo'}
        </button>
      </div>

      {/* List */}
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155', fontSize: 13 }}>
          🎬 Aucune vidéo pour l'instant — ajoutes-en une !
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {videos.map(v => {
            const thumb = ytThumb(v.url)
            return (
              <div key={v.id} style={{ background: '#0d0d1a', border: `1px solid #1e1e2e`, borderRadius: 14, overflow: 'hidden' }}>
                {/* Thumbnail */}
                <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', aspectRatio: '16/9', background: '#12121f', overflow: 'hidden' }}>
                  {thumb
                    ? <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎬</div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                    <span style={{ fontSize: 36 }}>▶</span>
                  </div>
                </a>
                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginBottom: 2 }}>{v.title || 'Vidéo sans titre'}</div>
                  {v.note && <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{v.note}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#334155' }}>{fmtDate(v.createdAt)}</span>
                    <button onClick={() => del(v.id)}
                      style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)', color: '#F87171', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Section: Exercises ──────────────────────────────────────────────────── */
type Exercise = { id: string; question: string; answer: string; done: boolean; createdAt: string }

function ExercisesSection() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [question,  setQuestion]  = useState('')
  const [answer,    setAnswer]    = useState('')
  const [saving,    setSaving]    = useState(false)
  const [revealed,  setRevealed]  = useState<Set<string>>(new Set())
  const c = C.exercises

  useEffect(() => {
    fetch('/api/italiano/exercises').then(r => r.json()).then(d => Array.isArray(d) && setExercises(d))
  }, [])

  const add = async () => {
    if (!question.trim() || saving) return
    setSaving(true)
    const res = await fetch('/api/italiano/exercises', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim(), answer: answer.trim() }),
    })
    if (res.ok) { const ex = await res.json(); setExercises(p => [ex, ...p]); setQuestion(''); setAnswer('') }
    setSaving(false)
  }

  const toggleDone = async (ex: Exercise) => {
    const done = !ex.done
    setExercises(p => p.map(e => e.id === ex.id ? { ...e, done } : e))
    await fetch(`/api/italiano/exercises/${ex.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    })
  }

  const del = async (id: string) => {
    await fetch(`/api/italiano/exercises/${id}`, { method: 'DELETE' })
    setExercises(p => p.filter(e => e.id !== id))
  }

  const toggleReveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const done   = exercises.filter(e => e.done).length
  const total  = exercises.length

  return (
    <div>
      {/* Progress */}
      {total > 0 && (
        <div style={{ marginBottom: 14, background: '#0d0d1a', borderRadius: 12, padding: '10px 14px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: '#1e1e2e', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(done / total) * 100}%`, background: c.color, borderRadius: 99, transition: 'width .3s' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: c.color, flexShrink: 0 }}>{done}/{total} maîtrisés</span>
        </div>
      )}

      {/* Add form */}
      <div style={{ background: '#0d0d1a', border: `1px solid ${c.border}`, borderRadius: 16, padding: '16px', marginBottom: 16 }}>
        <input value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="Question / phrase italienne… (ex: Come stai ?)"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <input value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="Réponse / traduction… (ex: Comment tu vas ?)"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />
        <button onClick={add} disabled={!question.trim() || saving}
          style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: !question.trim() || saving ? '#1e1e2e' : c.color, color: !question.trim() || saving ? '#475569' : '#fff', fontWeight: 700, fontSize: 13, cursor: !question.trim() || saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '…' : '+ Ajouter l\'exercice'}
        </button>
      </div>

      {/* List */}
      {exercises.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155', fontSize: 13 }}>
          ✍️ Aucun exercice pour l'instant — ajoutes-en un !
        </div>
      ) : exercises.map(ex => {
        const shown = revealed.has(ex.id)
        return (
          <div key={ex.id} style={{
            background: ex.done ? 'rgba(16,185,129,0.05)' : '#0d0d1a',
            border: `1px solid ${ex.done ? 'rgba(16,185,129,0.25)' : '#1e1e2e'}`,
            borderRadius: 14, marginBottom: 8, padding: '12px 14px',
            transition: 'all .2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {/* Done checkbox */}
              <div onClick={() => toggleDone(ex)}
                style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1, cursor: 'pointer', border: `2px solid ${ex.done ? c.color : '#2a2a40'}`, background: ex.done ? c.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                {ex.done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ex.done ? '#475569' : '#E2E8F0', textDecoration: ex.done ? 'line-through' : 'none' }}>
                  🇮🇹 {ex.question}
                </div>
                {ex.answer && (
                  <div style={{ marginTop: 4 }}>
                    {shown ? (
                      <div style={{ fontSize: 12, color: c.color, fontStyle: 'italic' }}>→ {ex.answer}</div>
                    ) : (
                      <button onClick={() => toggleReveal(ex.id)}
                        style={{ fontSize: 11, color: '#475569', background: '#12121f', border: '1px solid #1e1e2e', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontWeight: 600 }}>
                        Voir la réponse
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => del(ex.id)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)', color: '#F87171', fontSize: 10, cursor: 'pointer', flexShrink: 0 }}>
                🗑
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Section: Audios ─────────────────────────────────────────────────────── */
type AudioItem = { id: string; label: string; duration: number; createdAt: string }

function AudiosSection() {
  const [audios,    setAudios]    = useState<AudioItem[]>([])
  const [recording, setRecording] = useState(false)
  const [recSecs,   setRecSecs]   = useState(0)
  const [label,     setLabel]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [playing,   setPlaying]   = useState<string | null>(null)
  const [audioData, setAudioData] = useState<Record<string, string>>({})
  const c = C.audios

  const mediaRef   = useRef<MediaRecorder | null>(null)
  const chunksRef  = useRef<Blob[]>([])
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('/api/italiano/audios').then(r => r.json()).then(d => Array.isArray(d) && setAudios(d))
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      const rec = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      rec.ondataavailable = e => chunksRef.current.push(e.data)
      rec.onstop = () => stream.getTracks().forEach(t => t.stop())
      rec.start()
      mediaRef.current = rec
      setRecording(true)
      setRecSecs(0)
      timerRef.current = setInterval(() => setRecSecs(s => s + 1), 1000)
    } catch { alert('Microphone non autorisé. Vérifie les permissions du navigateur.') }
  }

  const stopRec = () => {
    if (!mediaRef.current) return
    mediaRef.current.stop()
    if (timerRef.current) clearInterval(timerRef.current)

    mediaRef.current.onstop = async () => {
      const mimeType = mediaRef.current?.mimeType || 'audio/webm'
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const duration = recSecs

      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        setSaving(true)
        const res = await fetch('/api/italiano/audios', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64, label: label.trim() || `Audio ${new Date().toLocaleDateString('fr-FR')}`, duration }),
        })
        if (res.ok) {
          const item = await res.json()
          setAudios(p => [item, ...p])
          setAudioData(prev => ({ ...prev, [item.id]: base64 }))
          setLabel('')
        }
        setSaving(false)
      }
      reader.readAsDataURL(blob)
    }
    setRecording(false)
    setRecSecs(0)
  }

  const loadAndPlay = async (id: string) => {
    if (playing === id) {
      audioElRef.current?.pause()
      setPlaying(null)
      return
    }
    let src = audioData[id]
    if (!src) {
      const res = await fetch(`/api/italiano/audios/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const json = await res.json()
      src = json.data
      setAudioData(prev => ({ ...prev, [id]: src }))
    }
    if (audioElRef.current) { audioElRef.current.pause() }
    const audio = new Audio(src)
    audioElRef.current = audio
    audio.play()
    setPlaying(id)
    audio.onended = () => setPlaying(null)
  }

  const del = async (id: string) => {
    if (playing === id) { audioElRef.current?.pause(); setPlaying(null) }
    await fetch(`/api/italiano/audios/${id}`, { method: 'DELETE' })
    setAudios(p => p.filter(a => a.id !== id))
  }

  return (
    <div>
      {/* Recorder */}
      <div style={{ background: '#0d0d1a', border: `1px solid ${c.border}`, borderRadius: 16, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="Nom de l'enregistrement (ex: Dialogue #3)…"
          style={{ width: '100%', background: '#07070f', border: `1px solid #1e1e2e`, borderRadius: 10, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', marginBottom: 16, boxSizing: 'border-box' as const, fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = c.color}
          onBlur={e  => e.currentTarget.style.borderColor = '#1e1e2e'}
        />

        {recording ? (
          <div>
            {/* Waveform animation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, height: 40, marginBottom: 12 }}>
              <style>{`@keyframes wave{0%,100%{height:6px}50%{height:32px}}`}</style>
              {[0,1,2,3,4,5,6,7].map(i => (
                <div key={i} style={{ width: 4, background: c.color, borderRadius: 99, animation: `wave .8s ease-in-out ${i * 0.1}s infinite` }} />
              ))}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 12, fontVariantNumeric: 'tabular-nums' }}>
              {fmtDur(recSecs)}
            </div>
            <button onClick={stopRec}
              style={{ padding: '12px 32px', borderRadius: 14, border: 'none', background: '#EF4444', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              ⏹ Arrêter
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎙️</div>
            <button onClick={startRec} disabled={saving}
              style={{ padding: '12px 32px', borderRadius: 14, border: 'none', background: saving ? '#1e1e2e' : c.color, color: '#fff', fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : `0 4px 20px ${c.color}40` }}>
              {saving ? 'Sauvegarde…' : '● Enregistrer'}
            </button>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>Parle en italien — ta progression sera sauvegardée</div>
          </div>
        )}
      </div>

      {/* List */}
      {audios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155', fontSize: 13 }}>
          🎙️ Aucun enregistrement pour l'instant — commence à parler !
        </div>
      ) : audios.map((a, i) => (
        <div key={a.id} style={{ background: '#0d0d1a', border: `1px solid ${playing === a.id ? c.color : '#1e1e2e'}`, borderRadius: 14, marginBottom: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color .2s' }}>
          {/* Play button */}
          <button onClick={() => loadAndPlay(a.id)}
            style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${c.color}`, background: playing === a.id ? c.color : 'transparent', color: playing === a.id ? '#fff' : c.color, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
            {playing === a.id ? '⏸' : '▶'}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{a.label}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
              {fmtDate(a.createdAt)} · {fmtDur(a.duration)}
              {' '}
              <span style={{ background: `${c.color}18`, color: c.color, borderRadius: 99, padding: '1px 7px', fontWeight: 700, fontSize: 10 }}>
                #{audios.length - i}
              </span>
            </div>
          </div>
          <button onClick={() => del(a.id)}
            style={{ padding: '5px 9px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)', color: '#F87171', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
            🗑
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function ItalianoPage() {
  const [tab, setTab] = useState<Tab>('notes')
  const current = C[tab]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg,#009246,#CE2B37)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#475569' }}>
            Apprentissage
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#E2E8F0', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          🇮🇹 Italiano
        </h1>
        <p style={{ fontSize: 13, color: '#475569', marginTop: 5 }}>
          Notes · Vidéos · Exercices · Enregistrements — tout sauvegardé.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {TABS.map(t => {
          const active = tab === t.key
          const tc = C[t.key]
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '10px 4px', borderRadius: 14,
                border: `1px solid ${active ? tc.color : '#1e1e2e'}`,
                background: active ? tc.bg : '#0d0d1a',
                color: active ? tc.color : '#475569',
                cursor: 'pointer', transition: 'all .2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
              <span style={{ fontSize: 20 }}>{t.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>
        {tab === 'notes'     && <NotesSection />}
        {tab === 'videos'    && <VideosSection />}
        {tab === 'exercises' && <ExercisesSection />}
        {tab === 'audios'    && <AudiosSection />}
      </div>
    </div>
  )
}
