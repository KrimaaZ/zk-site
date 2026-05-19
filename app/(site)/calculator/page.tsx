'use client'

import { useEffect, useRef, useState } from 'react'
import { NUTRITION_DATA, type NutritionItem } from '@/lib/nutrition-data'

// ─── Colors ───────────────────────────────────────────────────────────────────
const GOLD  = '#D4AF37'
const GREEN = '#1D9E75'
const BLUE  = '#4A9EE0'
const RED   = '#E05252'

// ─── Types ────────────────────────────────────────────────────────────────────
type MealItem = { item: NutritionItem; grams: number }
type Result   = { totalCalories: number; totalProteins: number; totalCarbs: number; totalFats: number; summary: string }

// ─── Helper ───────────────────────────────────────────────────────────────────
function calcItem(item: NutritionItem, grams: number) {
  const r = grams / item.per
  return {
    cal:  Math.round(item.calories * r),
    prot: Math.round(item.proteins * r * 10) / 10,
    carb: Math.round(item.carbs    * r * 10) / 10,
    fat:  Math.round(item.fats     * r * 10) / 10,
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MacroCard({ value, unit, label, color, sub }: { value: number | string; unit: string; label: string; color: string; sub?: string }) {
  return (
    <div style={{
      flex: 1, background: '#111', borderRadius: 14,
      border: `1px solid ${color}30`, padding: 'clamp(14px,3vw,22px) clamp(12px,2vw,20px)',
      textAlign: 'center', minWidth: 0,
    }}>
      <div style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, color, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: 'clamp(12px,2vw,16px)', fontWeight: 600, color: `${color}99`, marginLeft: 3 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 10, color: '#333', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  // Search
  const [search,      setSearch]      = useState('')
  const [suggestions, setSuggestions] = useState<NutritionItem[]>([])
  const [showDrop,    setShowDrop]    = useState(false)
  const [selected,    setSelected]    = useState<NutritionItem | null>(null)
  const [qty,         setQty]         = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  // Meal
  const [mealItems, setMealItems] = useState<MealItem[]>([])

  // Calculation
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<Result | null>(null)
  const [error,   setError]   = useState('')

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Search filter ───────────────────────────────────────────────────────────
  const handleSearch = (v: string) => {
    setSearch(v)
    setSelected(null)
    if (v.trim().length === 0) { setSuggestions([]); setShowDrop(false); return }
    const filtered = NUTRITION_DATA.filter(n => n.name.toLowerCase().includes(v.toLowerCase()))
    setSuggestions(filtered)
    setShowDrop(filtered.length > 0)
  }

  const selectItem = (item: NutritionItem) => {
    setSelected(item)
    setSearch(item.name)
    setQty(String(item.per)) // default to reference amount (100 or 30)
    setShowDrop(false)
    setSuggestions([])
  }

  // ── Add ingredient ──────────────────────────────────────────────────────────
  const addIngredient = () => {
    if (!selected) return
    const g = parseFloat(qty)
    if (!g || g <= 0) return
    setMealItems(p => [...p, { item: selected, grams: g }])
    setSearch(''); setSelected(null); setQty(''); setResult(null)
  }

  // ── Remove ingredient ───────────────────────────────────────────────────────
  const removeItem = (idx: number) => {
    setMealItems(p => p.filter((_, i) => i !== idx))
    setResult(null)
  }

  // ── Calculate ───────────────────────────────────────────────────────────────
  const calculate = async () => {
    if (mealItems.length === 0) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: mealItems.map(m => ({ name: m.item.name, grams: m.grams })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Erreur lors du calcul.')
    } finally {
      setLoading(false)
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = () => {
    setMealItems([]); setResult(null); setError('')
    setSearch(''); setSelected(null); setQty('')
  }

  // ── Live running totals (shown while building meal) ─────────────────────────
  const liveTotals = mealItems.reduce((acc, m) => {
    const c = calcItem(m.item, m.grams)
    return { cal: acc.cal + c.cal, prot: acc.prot + c.prot, carb: acc.carb + c.carb, fat: acc.fat + c.fat }
  }, { cal: 0, prot: 0, carb: 0, fat: 0 })

  // ── Input style ─────────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#fff',
    borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none',
    width: '100%', boxSizing: 'border-box', transition: 'border-color .2s',
  }

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,32px) 100px' }}>

      <style>{`
        .calc-inp:focus { border-color: ${GOLD} !important; }
        .calc-inp::placeholder { color: #3a3a3a; }
        .calc-sug:hover { background: rgba(212,175,55,0.08) !important; color: #fff !important; }
        .meal-row:hover .meal-del { opacity: 1 !important; }
        @keyframes calcFadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
        .calc-fade { animation: calcFadeUp .35s ease forwards; }
        @keyframes calcPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        .calc-pulse { animation: calcPulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          Nutrition
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: '#F0F0F0', margin: '0 0 8px' }}>
          🧮 Calculateur de macros
        </h1>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
          Ajoute tes ingrédients, calcule tes macros via Claude AI
        </p>
      </div>

      {/* ── SEARCH SECTION ─────────────────────────────────── */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 16, padding: 'clamp(18px,4vw,28px)', marginBottom: 16 }}>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          Ajouter un ingrédient
        </div>

        {/* Search + Qty row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

          {/* Autocomplete */}
          <div ref={searchRef} style={{ flex: 2, minWidth: 200, position: 'relative' }}>
            <input
              className="calc-inp"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowDrop(true) }}
              placeholder="Rechercher un ingrédient…"
              style={inp}
              autoComplete="off"
            />

            {/* Dropdown */}
            {showDrop && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 10,
                marginTop: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}>
                {suggestions.slice(0, 7).map(item => (
                  <div key={item.name}
                    className="calc-sug"
                    onMouseDown={() => selectItem(item)}
                    style={{
                      padding: '11px 16px', cursor: 'pointer', fontSize: 14,
                      color: '#C0C0C0', borderBottom: '1px solid #1a1a1a',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all .15s',
                    }}>
                    <span>{item.name}</span>
                    <span style={{ fontSize: 11, color: '#444' }}>
                      {item.calories} kcal/{item.per}g
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div style={{ flex: 1, minWidth: 100, position: 'relative' }}>
            <input
              className="calc-inp"
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIngredient()}
              placeholder="Qté (g)"
              min={1}
              style={inp}
            />
            {selected?.per === 30 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, fontSize: 10, color: '#555', marginTop: 3, whiteSpace: 'nowrap' }}>
                1 scoop = 30g
              </div>
            )}
          </div>

          {/* Add button */}
          <button onClick={addIngredient} disabled={!selected || !qty}
            style={{
              background: selected && qty ? GOLD : '#1a1a1a',
              color: selected && qty ? '#000' : '#333',
              border: 'none', borderRadius: 10, padding: '12px 22px',
              fontSize: 14, fontWeight: 800, cursor: selected && qty ? 'pointer' : 'not-allowed',
              transition: 'all .2s', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
            + Ajouter
          </button>
        </div>

        {/* Selected item preview */}
        {selected && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, fontSize: 12, color: '#888', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>{selected.name}</span>
            <span>🔥 {selected.calories} kcal</span>
            <span style={{ color: GREEN }}>P: {selected.proteins}g</span>
            <span style={{ color: BLUE }}>G: {selected.carbs}g</span>
            <span style={{ color: RED }}>L: {selected.fats}g</span>
            <span style={{ color: '#555' }}>pour {selected.per}g</span>
          </div>
        )}
      </div>

      {/* ── MEAL BUILDER ───────────────────────────────────── */}
      {mealItems.length > 0 && (
        <div className="calc-fade" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 16, padding: 'clamp(18px,4vw,28px)', marginBottom: 16 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Repas en cours · {mealItems.length} ingrédient{mealItems.length > 1 ? 's' : ''}
            </div>
            <button onClick={reset} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', fontWeight: 600, letterSpacing: '0.04em' }}>
              Tout effacer
            </button>
          </div>

          {/* Ingredient rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
            {mealItems.map((m, i) => {
              const c = calcItem(m.item, m.grams)
              return (
                <div key={i} className="meal-row" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8, background: '#111',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {/* Name + qty */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#D0D0D0' }}>{m.item.name}</span>
                    <span style={{ fontSize: 12, color: '#444', marginLeft: 8 }}>{m.grams}g</span>
                  </div>
                  {/* Macros preview */}
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                    <span style={{ color: GOLD }}>{c.cal} kcal</span>
                    <span style={{ color: GREEN }}>P {c.prot}</span>
                    <span style={{ color: BLUE }}>G {c.carb}</span>
                    <span style={{ color: RED }}>L {c.fat}</span>
                  </div>
                  {/* Delete */}
                  <button className="meal-del" onClick={() => removeItem(i)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 14, cursor: 'pointer', opacity: 0, transition: 'opacity .18s', padding: '2px 4px', borderRadius: 4, lineHeight: 1, flexShrink: 0 }}>
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {/* Live running totals */}
          <div style={{ display: 'flex', gap: 8, padding: '12px 14px', background: '#0a0a0a', borderRadius: 8, border: '1px solid rgba(212,175,55,0.1)', flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: '#444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4 }}>Estimé :</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: GOLD }}>{liveTotals.cal} kcal</span>
            <span style={{ color: '#222' }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>P {liveTotals.prot}g</span>
            <span style={{ color: '#222' }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>G {liveTotals.carb}g</span>
            <span style={{ color: '#222' }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>L {liveTotals.fat}g</span>
          </div>

          {/* Calculate button */}
          <button onClick={calculate} disabled={loading}
            style={{
              width: '100%', background: loading ? '#111' : GOLD,
              color: loading ? '#555' : '#000', border: `1px solid ${loading ? '#2a2a2a' : GOLD}`,
              borderRadius: 10, padding: '14px 24px', fontSize: 15, fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em',
              transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            {loading ? (
              <>
                <span className="calc-pulse">🤖</span>
                <span style={{ color: '#666' }}>Claude analyse le repas…</span>
              </>
            ) : (
              '⚡ Calculer avec Claude AI'
            )}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS ────────────────────────────────────────── */}
      {result && (
        <div className="calc-fade" style={{ background: '#0d0d0d', border: `1px solid rgba(212,175,55,0.2)`, borderRadius: 16, padding: 'clamp(20px,4vw,32px)' }}>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>
            📊 Résultats
          </div>

          {/* Macro cards */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <MacroCard value={result.totalCalories} unit="kcal" label="Calories" color={GOLD} />
            <MacroCard value={result.totalProteins} unit="g"    label="Protéines" color={GREEN} />
            <MacroCard value={result.totalCarbs}    unit="g"    label="Glucides"  color={BLUE} />
            <MacroCard value={result.totalFats}     unit="g"    label="Lipides"   color={RED} />
          </div>

          {/* Macro bar */}
          {(() => {
            const total = result.totalProteins * 4 + result.totalCarbs * 4 + result.totalFats * 9
            const pPct = total > 0 ? (result.totalProteins * 4 / total) * 100 : 0
            const cPct = total > 0 ? (result.totalCarbs    * 4 / total) * 100 : 0
            const fPct = total > 0 ? (result.totalFats     * 9 / total) * 100 : 0
            return (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', height: 8, borderRadius: 100, overflow: 'hidden', gap: 1 }}>
                  <div style={{ width: `${pPct}%`, background: GREEN, transition: 'width .5s', borderRadius: '100px 0 0 100px' }} />
                  <div style={{ width: `${cPct}%`, background: BLUE,  transition: 'width .5s' }} />
                  <div style={{ width: `${fPct}%`, background: RED,   transition: 'width .5s', borderRadius: '0 100px 100px 0' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11 }}>
                  <span style={{ color: GREEN }}>{Math.round(pPct)}% Protéines</span>
                  <span style={{ color: BLUE }}>{Math.round(cPct)}% Glucides</span>
                  <span style={{ color: RED }}>{Math.round(fPct)}% Lipides</span>
                </div>
              </div>
            )
          })()}

          {/* Claude summary */}
          {result.summary && (
            <div style={{ padding: '14px 18px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                🤖 Analyse Claude
              </div>
              <p style={{ fontSize: 13, color: '#999', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>
                {result.summary}
              </p>
            </div>
          )}

          {/* New meal button */}
          <button onClick={reset}
            style={{
              marginTop: 20, width: '100%', background: 'transparent',
              border: '1px solid #2a2a2a', color: '#666', borderRadius: 10, padding: '12px 24px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#444'; el.style.color = '#C0C0C0' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#2a2a2a'; el.style.color = '#666' }}>
            ↺ Nouveau repas
          </button>
        </div>
      )}

      {/* ── EMPTY STATE ────────────────────────────────────── */}
      {mealItems.length === 0 && !result && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#2a2a2a' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽</div>
          <div style={{ fontSize: 14, color: '#333' }}>Commence par ajouter un ingrédient</div>
          <div style={{ fontSize: 12, color: '#222', marginTop: 6 }}>{NUTRITION_DATA.length} ingrédients disponibles</div>
        </div>
      )}

    </div>
  )
}
