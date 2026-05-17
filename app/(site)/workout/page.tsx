'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'
import TrainingProgram from '@/components/workout/TrainingProgram'
import ProgressionTracker from '@/components/workout/ProgressionTracker'

type Exercise = { name: string; sets: number; reps: string; notes: string }
type Session = { id: number; type: string; title: string; date: string; exercises: string; notes: string | null }

const TYPES = ['PULL', 'PUSH', 'ABS_LEGS', 'CARDIO']
const TYPE_COLORS: Record<string, { emoji: string; color: string }> = {
  PULL:     { emoji: '🔙', color: '#1D9E75' },
  PUSH:     { emoji: '🔛', color: '#D4AF37' },
  ABS_LEGS: { emoji: '🦵', color: '#C0C0C0' },
  CARDIO:   { emoji: '🏃', color: '#888888' },
}
const emptyForm = { type: 'PULL', title: '', date: new Date().toISOString().split('T')[0], notes: '' }
const emptyEx: Exercise = { name: '', sets: 3, reps: '8-10', notes: '' }

function WorkoutInner() {
  const searchParams = useSearchParams()
  const initialView = (searchParams.get('view') as 'program' | 'progress' | 'sessions') ?? 'program'
  const [view, setView] = useState<'program' | 'progress' | 'sessions'>(initialView)
  const [activeTab, setActiveTab] = useState('PULL')
  const [sessions, setSessions] = useState<Session[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [exercises, setExercises] = useState<Exercise[]>([{ ...emptyEx }])
  const [editing, setEditing] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { t } = useLang()

  const TYPE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    PULL:     { label: t.pullDay,  emoji: '🔙', color: '#1D9E75' },
    PUSH:     { label: t.pushDay,  emoji: '🔛', color: '#D4AF37' },
    ABS_LEGS: { label: t.absLegs,  emoji: '🦵', color: '#C0C0C0' },
    CARDIO:   { label: t.cardio,   emoji: '🏃', color: '#888888' },
  }

  const load = (type?: string) =>
    fetch(`/api/workout${type ? `?type=${type}` : ''}`).then(r => r.json()).then(setSessions)
  useEffect(() => { load(activeTab) }, [activeTab])

  const openAdd = () => { setForm({ ...emptyForm, type: activeTab }); setExercises([{ ...emptyEx }]); setEditing(null); setModal(true) }
  const openEdit = (s: Session) => {
    setForm({ type: s.type, title: s.title, date: s.date, notes: s.notes || '' })
    setExercises(JSON.parse(s.exercises)); setEditing(s.id); setModal(true)
  }

  const save = async () => {
    setSaving(true)
    await fetch(editing ? `/api/workout/${editing}` : '/api/workout', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, exercises }) })
    await load(activeTab); setModal(false); setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm(t.deleteSession)) return
    await fetch(`/api/workout/${id}`, { method: 'DELETE' }); load(activeTab)
  }

  const generateAI = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'workout', data: { sessionType: form.type } }) })
      const data = await r.json()
      setForm(f => ({ ...f, title: data.title || f.title, notes: data.notes || f.notes }))
      if (data.exercises?.length) setExercises(data.exercises)
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  const addEx = () => setExercises(ex => [...ex, { ...emptyEx }])
  const removeEx = (i: number) => setExercises(ex => ex.filter((_, j) => j !== i))
  const updateEx = (i: number, k: keyof Exercise, v: string | number) =>
    setExercises(ex => ex.map((e, j) => j === i ? { ...e, [k]: v } : e))

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#F0F0F0' }}>💪 Workout</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#888888' }}>{t.workoutSubtitle}</p>
        </div>
        {view === 'sessions' && (
          <button onClick={openAdd} className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium">{t.logBtn}</button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        {([['program', '📋 Program'], ['progress', '📈 Progress'], ['sessions', '🗒️ Sessions']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setView(key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: view === key ? '#D4AF37' : '#1a1a1a', color: view === key ? '#0a0a0a' : '#888888', border: `1px solid ${view === key ? '#D4AF37' : '#2a2a2a'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Program view */}
      {view === 'program' && <TrainingProgram />}

      {/* Progress view */}
      {view === 'progress' && <ProgressionTracker />}

      {/* Sessions view */}
      {view === 'sessions' && <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
        {TYPES.map(tp => {
          const info = TYPE_INFO[tp]
          return (
            <button key={tp} onClick={() => setActiveTab(tp)}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all"
              style={{ backgroundColor: activeTab === tp ? info.color : '#1a1a1a', color: activeTab === tp ? '#0a0a0a' : '#888888', border: `1px solid ${activeTab === tp ? info.color : '#2a2a2a'}` }}>
              {info.emoji} {info.label}
            </button>
          )
        })}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#111111', color: '#555555' }}>
          <p className="text-4xl mb-2">{TYPE_INFO[activeTab]?.emoji}</p>
          <p className="font-medium text-sm">{t.noSessions(TYPE_INFO[activeTab]?.label ?? '')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => {
            const exs: Exercise[] = JSON.parse(s.exercises)
            const info = TYPE_INFO[s.type]
            return (
              <div key={s.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: '#111111', borderColor: '#2a2a2a' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: info?.color }}>{info?.emoji} {info?.label}</span>
                    <h3 className="font-semibold text-base mt-1.5" style={{ color: '#F0F0F0' }}>{s.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{s.date}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(s)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#C0C0C0', backgroundColor: '#1a1a1a' }}>{t.edit}</button>
                    <button onClick={() => del(s.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {exs.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-xl" style={{ backgroundColor: '#1a1a1a' }}>
                      <span className="font-medium text-sm flex-1 truncate" style={{ color: '#E8E8E8' }}>{ex.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>{ex.sets}×{ex.reps}</span>
                    </div>
                  ))}
                </div>
                {s.notes && <p className="text-xs mt-2 italic" style={{ color: '#555555' }}>{s.notes}</p>}
              </div>
            )
          })}
        </div>
      )}

      </>}

      {modal && (
        <Modal title={editing ? t.editSession : t.logSession} onClose={() => setModal(false)} wide>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#C0C0C0' }}>{t.type}</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#111111', color: '#E8E8E8' }}>
                  {TYPES.map(tp => <option key={tp} value={tp}>{TYPE_INFO[tp].label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#C0C0C0' }}>{t.date}</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#111111', color: '#E8E8E8' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#C0C0C0' }}>{t.sessionTitle}</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Heavy Push Day" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#111111', color: '#E8E8E8' }} />
            </div>
            <button onClick={generateAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60" style={{ backgroundColor: '#1a1a1a', color: '#C0C0C0' }}>
              {aiLoading ? t.aiGenerating : t.aiSuggest}
            </button>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: '#C0C0C0' }}>{t.exercises}</label>
                <button onClick={addEx} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>+ {t.save === 'Save' ? 'Add' : 'Ajouter'}</button>
              </div>
              <div className="space-y-2">
                {exercises.map((ex, i) => (
                  <div key={i} className="rounded-xl p-2 space-y-2" style={{ backgroundColor: '#1a1a1a' }}>
                    <div className="flex gap-2">
                      <input value={ex.name} onChange={e => updateEx(i, 'name', e.target.value)} placeholder={t.exerciseName}
                        className="flex-1 px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#0a0a0a', color: '#E8E8E8' }} />
                      <button onClick={() => removeEx(i)} className="px-2 py-1 rounded-lg text-xs" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>×</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={ex.sets} onChange={e => updateEx(i, 'sets', Number(e.target.value))} placeholder={t.sets}
                        className="px-2.5 py-2 rounded-lg border text-sm outline-none text-center" style={{ borderColor: '#2a2a2a', backgroundColor: '#0a0a0a', color: '#E8E8E8' }} />
                      <input value={ex.reps} onChange={e => updateEx(i, 'reps', e.target.value)} placeholder={t.reps}
                        className="px-2.5 py-2 rounded-lg border text-sm outline-none text-center" style={{ borderColor: '#2a2a2a', backgroundColor: '#0a0a0a', color: '#E8E8E8' }} />
                      <input value={ex.notes} onChange={e => updateEx(i, 'notes', e.target.value)} placeholder={t.notes}
                        className="px-2.5 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#0a0a0a', color: '#E8E8E8' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#C0C0C0' }}>{t.sessionNotes}</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#2a2a2a', backgroundColor: '#111111', color: '#E8E8E8' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={save} disabled={saving} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.saveSession}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default function WorkoutPage() {
  return (
    <Suspense>
      <WorkoutInner />
    </Suspense>
  )
}
