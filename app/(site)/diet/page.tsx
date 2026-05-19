'use client'

import { useState } from 'react'

const G = '#1D9E75'
const BLUE = '#3B82F6'
const AMBER = '#F59E0B'
const PURPLE = '#8B5CF6'

interface Ingredient { name: string; note: string; weight: string; section?: string }
interface Step { text: string; time?: string }
interface Meal {
  emoji: string; label: string; time: string; color: string; colorLight: string
  kcal: number; prot: number; gluc: number; lip: number
  title: string; subtitle: string
  ingredients: Ingredient[]
  steps: Step[]
  tip: string
}

const CHICKEN_RICE: Meal = {
  emoji: '🍗', label: '', time: '', color: BLUE, colorLight: 'rgba(59,130,246,0.08)',
  kcal: 400, prot: 50, gluc: 42, lip: 3,
  title: 'Blanc de poulet + riz',
  subtitle: '200g poulet cru · 50g riz cru · Repas principal ×3/jour',
  ingredients: [
    { name: 'Blanc de poulet', note: 'peser cru — perd ~25% à la cuisson', weight: '200g' },
    { name: 'Riz', note: 'peser cru — donne ~150g cuit', weight: '50g' },
    { name: 'Sel · cumin · paprika', note: 'assaisonnement', weight: 'à goût' },
  ],
  steps: [
    { text: "Pèse 50g riz cru. Lave sous eau froide. Cuis dans eau bouillante salée 15-18 min.", time: '18 min' },
    { text: "Pèse 200g blanc de poulet cru. Assaisonne sel + cumin + paprika. Poêle anti-adhésive sans huile feu moyen, 7 min par face. Coupe le plus épais — zéro rosé.", time: '14 min' },
    { text: "Dresse: riz + poulet tranché. Mange immédiatement ou stocke en boîte hermétique.", time: '1 min' },
  ],
  tip: "Meal prep — Cuis 600g de blanc de poulet + 150g riz cru le dimanche. Divise en 3 portions égales en boîte hermétique. Réchauffe 2 min micro-ondes avec un fond d'eau. Économise 20 min par repas.",
}

const MEALS: Meal[] = [
  {
    emoji: '☀️', label: 'Repas 1', time: '7h00', color: G, colorLight: 'rgba(29,158,117,0.08)',
    kcal: 600, prot: 37, gluc: 78, lip: 11,
    title: 'Porridge whey · PB · banane · miel',
    subtitle: 'Prêt en 5 min · High-protein bowl · 1 seul scoop de whey/jour',
    ingredients: [
      { name: "Flocons d'avoine", note: 'peser à sec', weight: '50g' },
      { name: 'Whey Protéine (1 scoop)', note: 'ajouter hors du feu, jamais en cuisson', weight: '30g' },
      { name: 'Lait demi-écrémé', note: 'base du porridge à la place de l\'eau', weight: '100ml' },
      { name: 'Miel', note: 'topping', weight: '10g' },
      { name: 'Peanut Butter', note: 'topping', weight: '10g' },
      { name: 'Banane', note: '1 banane moyenne ~120g, tranchée en rondelles', weight: '~120g' },
      { name: 'Confiture', note: 'topping final', weight: '10g' },
    ],
    steps: [
      { text: "Pèse 50g flocons à sec. Verse dans bol avec 100ml lait. Micro-ondes 2 min puissance max. Remue à mi-cuisson.", time: '2 min' },
      { text: "Laisse tiédir 1-2 min. Ajoute 1 scoop de whey et mélange énergiquement. Ne jamais ajouter la whey sur feu — amertume et dénaturation garanties.", time: '1 min' },
      { text: "Tranche la banane en rondelles et dispose sur le dessus.", time: '30 sec' },
      { text: "Dépose en toppings : 10g PB, 10g miel, 10g confiture. Ne pas mélanger — goût distinct à chaque cuillère.", time: '30 sec' },
    ],
    tip: "La whey au réveil stoppe le catabolisme nocturne immédiatement — digestion rapide en 30 min vs 3h pour le poulet. La banane + avoine + lait apportent glucides complexes et simples pour alimenter ta journée complète.",
  },
  {
    ...CHICKEN_RICE,
    label: 'Repas 2', time: '12h00',
    colorLight: 'rgba(59,130,246,0.08)',
  },
  {
    ...CHICKEN_RICE,
    label: 'Repas 3', time: '15h30',
    color: AMBER, colorLight: 'rgba(245,158,11,0.08)',
    emoji: '⚡',
  },
  {
    ...CHICKEN_RICE,
    label: 'Repas 4', time: '19h00',
    color: PURPLE, colorLight: 'rgba(139,92,246,0.08)',
    emoji: '🌙',
  },
]

function MacroPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: color + '18', color }}>
      {value} {label}
    </span>
  )
}

function IngredientRow({ item, color }: { item: Ingredient; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: '#1a1a1a' }}>
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: '#F0F0F0' }}>{item.name}</p>
        {item.note && <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{item.note}</p>}
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
        style={{ backgroundColor: '#1a1a1a', color: '#C0C0C0' }}>
        {item.weight}
      </span>
    </div>
  )
}

function StepRow({ step, index, color }: { step: Step; index: number; color: string }) {
  return (
    <div className="flex gap-3 py-2">
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
        style={{ backgroundColor: color }}>
        {index + 1}
      </span>
      <div className="flex-1">
        <p className="text-sm leading-relaxed" style={{ color: '#C0C0C0' }}>{step.text}</p>
        {step.time && (
          <p className="text-xs font-medium mt-1" style={{ color: color }}>⏱ {step.time}</p>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mt-4 mb-1 pb-1">
      <span className="w-0.5 h-4 rounded shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: color }}>
        {text}
      </span>
    </div>
  )
}

function MealCard({ meal }: { meal: Meal }) {
  let lastSection = ''

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2a2a', borderWidth: '0.5px' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: meal.colorLight, borderBottom: `2px solid ${meal.color}` }}>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
            style={{ backgroundColor: meal.color }}>
            {meal.emoji} {meal.label} · {meal.time}
          </span>
          <h2 className="text-base font-bold" style={{ color: '#F0F0F0' }}>{meal.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{meal.subtitle}</p>
        </div>
      </div>

      {/* Macro pills */}
      <div className="px-4 py-3 flex flex-wrap gap-2" style={{ borderBottom: '0.5px solid #1a1a1a' }}>
        <MacroPill label="kcal" value={`${meal.kcal}`} color={meal.color} />
        <MacroPill label="prot" value={`${meal.prot}g`} color={G} />
        <MacroPill label="gluc" value={`${meal.gluc}g`} color={BLUE} />
        <MacroPill label="lip" value={`${meal.lip}g`} color={AMBER} />
      </div>

      <div className="px-4 pt-3 pb-2">
        {/* Ingredients */}
        <SectionLabel text="Ingrédients" color={meal.color} />
        {meal.ingredients.map((ing, i) => {
          const showSection = ing.section && ing.section !== lastSection
          if (ing.section) lastSection = ing.section
          return (
            <div key={i}>
              {showSection && (
                <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-1" style={{ color: meal.color }}>
                  {ing.section}
                </p>
              )}
              <IngredientRow item={ing} color={meal.color} />
            </div>
          )
        })}

        {/* Steps */}
        <SectionLabel text="Préparation" color={meal.color} />
        {meal.steps.map((step, i) => (
          <StepRow key={i} step={step} index={i} color={meal.color} />
        ))}

        {/* Coach tip */}
        <div className="mt-4 mb-3 p-3 rounded-lg"
          style={{ backgroundColor: '#0a0a0a', borderLeft: `3px solid ${G}` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: G }}>
            Coach tip
          </p>
          <p className="text-xs italic leading-relaxed" style={{ color: '#AAAAAA' }}>{meal.tip}</p>
        </div>
      </div>

      {/* Total bar */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: '#0a0a0a', borderTop: '0.5px solid #1a1a1a' }}>
        <span className="text-xs font-medium" style={{ color: '#555555' }}>Total repas</span>
        <span className="text-sm font-bold" style={{ color: meal.color }}>
          {meal.kcal} kcal · {meal.prot}g prot
        </span>
      </div>
    </div>
  )
}

export default function DietPage() {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#F0F0F0' }}>🥩 Diet</h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#555555' }}>
          Plan alimentaire journalier · 1800 kcal · 4 repas
        </p>
      </div>

      {/* Macro summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Calories', value: '1800', unit: 'kcal', color: G },
          { label: 'Protéines', value: '187', unit: 'g', color: '#1a6b4a' },
          { label: 'Glucides', value: '204', unit: 'g', color: BLUE },
          { label: 'Lipides', value: '20', unit: 'g', color: AMBER },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center border"
            style={{ backgroundColor: '#111111', borderColor: '#2a2a2a', borderWidth: '0.5px' }}>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}<span className="text-base">{m.unit}</span>
            </p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: '#555555' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: 'none' }}>
        {MEALS.map((m, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all border"
            style={{
              backgroundColor: active === i ? m.color : '#111111',
              color: active === i ? '#0a0a0a' : '#888888',
              borderColor: active === i ? m.color : '#2a2a2a',
              borderWidth: '0.5px',
            }}>
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Active meal card */}
      <MealCard meal={MEALS[active]} />
    </div>
  )
}
