'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Tip = { id: number; title: string; content: string; category: string; agent: string | null; drill: string | null }
const CATS = ['ALL', 'MECHANICS', 'STRATEGY', 'MINDSET', 'AGENT']
const CAT_COLOR: Record<string, string> = { MECHANICS: '#c0303e', STRATEGY: '#2d6a4f', MINDSET: '#8b5e3c', AGENT: '#b8860b' }
const empty = { title: '', content: '', category: 'MECHANICS', agent: '', drill: '' }

export default function ValorantPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [filter, setFilter] = useState('ALL')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { t } = useLang()

  const load = (cat?: string) =>
    fetch(`/api/valorant${cat && cat !== 'ALL' ? `?category=${cat}` : ''}`).then(r => r.json()).then(setTips)
  useEffect(() => { load(filter) }, [filter])

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (tip: Tip) => {
    setForm({ title: tip.title, content: tip.content, category: tip.category, agent: tip.agent || '', drill: tip.drill || '' })
    setEditing(tip.id); setModal(true)
  }
  const save = async () => {
    setSaving(true)
    await fetch(editing ? `/api/valorant/${editing}` : '/api/valorant', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await load(filter); setModal(false); setSaving(false)
  }
  const del = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return
    await fetch(`/api/valorant/${id}`, { method: 'DELETE' }); load(filter)
  }
  const generateAI = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'valorant_tip', data: { category: form.category, agent: form.agent } }) })
      const data = await r.json()
      setForm(f => ({ ...f, title: data.title || f.title, content: data.content || f.content, drill: data.drill || f.drill }))
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a1a' }}>🎮 Valorant</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#8b5e3c' }}>{t.tipsCount(tips.length)}</p>
        </div>
        <button onClick={openAdd} className="btn-glass btn-glass-red px-4 py-2.5 rounded-xl text-sm font-medium">{t.addBtn}</button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            style={{ backgroundColor: filter === c ? (CAT_COLOR[c] || '#1a3a1a') : '#f0e8d8', color: filter === c ? '#fff' : '#6b4226' }}>
            {c === 'ALL' ? (t.cancel === 'Cancel' ? 'ALL' : 'TOUS') : c}
          </button>
        ))}
      </div>
      {tips.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
          <p className="text-4xl mb-2">🎯</p>
          <p className="font-medium text-sm">{t.noTips}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tips.map(tip => (
            <div key={tip.id} className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
              <div className="p-4 flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(expanded === tip.id ? null : tip.id)}>
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-xs font-bold px-2 py-1 rounded-full text-white shrink-0 mt-0.5" style={{ backgroundColor: CAT_COLOR[tip.category] || '#1a3a1a' }}>{tip.category}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm" style={{ color: '#1a3a1a' }}>{tip.title}</h3>
                    {tip.agent && <p className="text-xs mt-0.5" style={{ color: '#a07850' }}>{t.agent}: {tip.agent}</p>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 items-center">
                  <button onClick={e => { e.stopPropagation(); openEdit(tip) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}>{t.edit}</button>
                  <button onClick={e => { e.stopPropagation(); del(tip.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                  <span className="text-xs px-1" style={{ color: '#a07850' }}>{expanded === tip.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === tip.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: '#f0e8d8' }}>
                  <p className="text-sm mt-3 whitespace-pre-wrap" style={{ color: '#6b4226' }}>{tip.content}</p>
                  {tip.drill && (
                    <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#f9f5ef' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#2d6a4f' }}>{t.practiceDrill}</p>
                      <p className="text-sm" style={{ color: '#6b4226' }}>{tip.drill}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={editing ? t.editTip : t.newTip} onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.category}</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }}>
                  {['MECHANICS', 'STRATEGY', 'MINDSET', 'AGENT'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.agentOptional}</label>
                <input value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))} placeholder="Jett, Sage…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
            </div>
            <button onClick={generateAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60" style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>
              {aiLoading ? t.aiGenerating : t.aiGenerateTip}
            </button>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.title}</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.content}</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.practiceDrillOpt}</label>
              <textarea value={form.drill} onChange={e => setForm(f => ({ ...f, drill: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={save} disabled={saving} className="btn-glass btn-glass-red flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.saveTip}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
