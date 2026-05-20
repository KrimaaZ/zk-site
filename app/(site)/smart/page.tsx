'use client'

import { useState } from 'react'

const BLUE   = '#3B82F6'
const GREEN  = '#1D9E75'
const ORANGE = '#F59E0B'
const PURPLE = '#8B5CF6'
const RED    = '#E05252'
const GOLD   = '#D4AF37'

interface SmartResult {
  objectif_smart:    string
  specifique:        string
  mesurable:         string
  atteignable:       string
  relevant:          string
  temporel:          string
  plan_action:       string[]
  indicateurs:       string[]
  conseil_motivation: string
}

const SMART_CARDS = [
  { key: 'specifique',  letter: 'S', label: 'Spécifique',  color: BLUE   },
  { key: 'mesurable',   letter: 'M', label: 'Mesurable',   color: GREEN  },
  { key: 'atteignable', letter: 'A', label: 'Atteignable', color: ORANGE },
  { key: 'relevant',    letter: 'R', label: 'Relevant',    color: PURPLE },
  { key: 'temporel',    letter: 'T', label: 'Temporel',    color: RED    },
] as const

const DOMAINES = ['Carrière', 'Sport', 'Finance', 'Santé', 'Personnel', 'Relation']
const DELAIS   = ['1 mois', '3 mois', '6 mois', '1 an']
const NIVEAUX  = ['Débutant', 'Intermédiaire', 'Avancé']

function SelectField({
  label, value, onChange, options, color,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; color: string }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#777' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          display: 'block', width: '100%', marginTop: 6,
          background: '#111', border: `1px solid #2a2a2a`,
          borderRadius: 10, padding: '10px 12px',
          color: value ? '#F0F0F0' : '#555',
          fontSize: 14, outline: 'none', cursor: 'pointer',
          appearance: 'none' as const,
        }}
      >
        <option value="" style={{ color: '#555' }}>Choisir…</option>
        {options.map(o => (
          <option key={o} value={o} style={{ color: '#F0F0F0', background: '#111' }}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%',
      border: `2px solid rgba(212,175,55,0.25)`,
      borderTopColor: GOLD,
      animation: 'smartSpin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  )
}

export default function SmartPage() {
  const [objectif,  setObjectif]  = useState('')
  const [domaine,   setDomaine]   = useState('')
  const [delai,     setDelai]     = useState('')
  const [niveau,    setNiveau]    = useState('')
  const [obstacles, setObstacles] = useState('')

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [result,  setResult]  = useState<SmartResult | null>(null)
  const [copied,  setCopied]  = useState(false)

  const generate = async () => {
    if (!objectif.trim()) { setError('Décris ton objectif pour commencer.'); return }
    if (!domaine)  { setError('Choisis un domaine.'); return }
    if (!delai)    { setError('Choisis un délai.'); return }
    if (!niveau)   { setError('Choisis ton niveau actuel.'); return }

    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectif, domaine, delai, niveau, obstacles }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || `Erreur ${res.status}`)
      }
      const data: SmartResult = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la génération.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setObjectif(''); setDomaine(''); setDelai(''); setNiveau(''); setObstacles('')
    setResult(null); setError('')
  }

  const copyToClipboard = () => {
    if (!result) return
    const text = [
      `🎯 OBJECTIF SMART`,
      ``,
      result.objectif_smart,
      ``,
      `S — Spécifique`,
      result.specifique,
      ``,
      `M — Mesurable`,
      result.mesurable,
      ``,
      `A — Atteignable`,
      result.atteignable,
      ``,
      `R — Relevant`,
      result.relevant,
      ``,
      `T — Temporel`,
      result.temporel,
      ``,
      `📋 Plan d'action`,
      ...result.plan_action.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `📊 Indicateurs`,
      ...result.indicateurs.map(s => `• ${s}`),
      ``,
      `💡 Conseil`,
      result.conseil_motivation,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <style>{`
        @keyframes smartSpin { to { transform: rotate(360deg); } }
        @keyframes smartFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F0F0F0', margin: 0 }}>🎯 Générateur SMART</h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          Transforme un objectif vague en un plan SMART précis et motivant via Claude AI.
        </p>
      </div>

      {/* Form */}
      <div style={{
        background: '#111', border: '0.5px solid #2a2a2a', borderRadius: 16,
        padding: '20px 18px', marginBottom: 20,
      }}>
        {/* Objectif */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#777' }}>
            Objectif général *
          </label>
          <textarea
            value={objectif}
            onChange={e => setObjectif(e.target.value)}
            placeholder="Ex: Je veux apprendre à parler anglais couramment…"
            rows={2}
            style={{
              display: 'block', width: '100%', marginTop: 6,
              background: '#0a0a0a', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '10px 12px',
              color: '#F0F0F0', fontSize: 14,
              outline: 'none', resize: 'vertical' as const,
              fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' as const,
            }}
          />
        </div>

        {/* Row: Domaine + Délai */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <SelectField label="Domaine *" value={domaine} onChange={setDomaine} options={DOMAINES} color={GOLD} />
          <SelectField label="Délai *"   value={delai}   onChange={setDelai}   options={DELAIS}   color={GOLD} />
        </div>

        {/* Niveau */}
        <div style={{ marginBottom: 14 }}>
          <SelectField label="Niveau actuel *" value={niveau} onChange={setNiveau} options={NIVEAUX} color={GOLD} />
        </div>

        {/* Obstacles */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#777' }}>
            Obstacles possibles <span style={{ color: '#444', fontWeight: 400, textTransform: 'none' as const }}>— optionnel</span>
          </label>
          <input
            type="text"
            value={obstacles}
            onChange={e => setObstacles(e.target.value)}
            placeholder="Ex: manque de temps, motivation fluctuante…"
            style={{
              display: 'block', width: '100%', marginTop: 6,
              background: '#0a0a0a', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '10px 12px',
              color: '#F0F0F0', fontSize: 14,
              outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: RED, marginBottom: 14, fontWeight: 500 }}>⚠ {error}</p>
        )}

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%', padding: '12px 0',
            background: loading ? 'rgba(212,175,55,0.15)' : GOLD,
            color: loading ? GOLD : '#0a0a0a',
            border: loading ? `1px solid ${GOLD}` : 'none',
            borderRadius: 12, fontWeight: 800, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all .2s',
          }}
        >
          {loading ? <><Spinner /> Génération en cours…</> : '✨ Générer mon objectif SMART'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: 'smartFadeIn .4s ease' }}>

          {/* Objectif SMART reformulé */}
          <div style={{
            background: 'rgba(212,175,55,0.06)', border: `1px solid rgba(212,175,55,0.3)`,
            borderRadius: 14, padding: '16px 18px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 8 }}>
              🎯 Objectif SMART
            </div>
            <p style={{ color: '#F0F0F0', fontSize: 15, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
              {result.objectif_smart}
            </p>
          </div>

          {/* S M A R T cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {SMART_CARDS.map(({ key, letter, label, color }) => (
              <div key={key} style={{
                background: '#111', border: `0.5px solid #2a2a2a`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: color + '18', border: `1px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 900, color,
                }}>
                  {letter}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color, marginBottom: 4 }}>
                    {label}
                  </div>
                  <p style={{ color: '#C0C0C0', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    {result[key as keyof SmartResult] as string}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan d'action */}
          <div style={{
            background: '#111', border: '0.5px solid #2a2a2a', borderRadius: 14,
            padding: '16px 18px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: 12 }}>
              📋 Plan d'action
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.plan_action.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: GOLD + '18', border: `1px solid ${GOLD}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: GOLD,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ color: '#C0C0C0', fontSize: 13, lineHeight: 1.55, margin: 0, paddingTop: 3 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs */}
          <div style={{
            background: '#111', border: '0.5px solid #2a2a2a', borderRadius: 14,
            padding: '16px 18px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: 10 }}>
              📊 Indicateurs de succès
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.indicateurs.map((ind, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: GREEN, fontSize: 14, paddingTop: 1 }}>✓</span>
                  <p style={{ color: '#C0C0C0', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{ind}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conseil motivation */}
          <div style={{
            background: '#0a0a0a', borderLeft: `3px solid ${GREEN}`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 18,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: GREEN, marginBottom: 6 }}>
              💡 Conseil Coach
            </div>
            <p style={{ color: '#AAAAAA', fontSize: 13, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              {result.conseil_motivation}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={copyToClipboard}
              style={{
                flex: 1, padding: '11px 0',
                background: copied ? 'rgba(29,158,117,0.15)' : 'rgba(212,175,55,0.1)',
                color: copied ? GREEN : GOLD,
                border: `1px solid ${copied ? GREEN : GOLD}40`,
                borderRadius: 12, fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {copied ? '✓ Copié !' : '📋 Copier le résultat'}
            </button>
            <button
              onClick={reset}
              style={{
                flex: 1, padding: '11px 0',
                background: 'rgba(224,82,82,0.08)',
                color: RED, border: `1px solid rgba(224,82,82,0.2)`,
                borderRadius: 12, fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              🔄 Nouvel objectif
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
