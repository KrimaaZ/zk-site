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

const MEALS: Meal[] = [
  {
    emoji: '☀️', label: 'Repas 1', time: '7h00', color: G, colorLight: '#e6f7f1',
    kcal: 530, prot: 50, gluc: 62, lip: 18,
    title: 'Porridge whey + oeufs brouillés',
    subtitle: 'Prêt en 10 min · La whey passe ici — seule dose de la journée',
    ingredients: [
      { name: "Flocons d'avoine", note: 'peser à sec obligatoirement', weight: '80g' },
      { name: 'Whey protéine', note: '1 seule dose/jour', weight: '30g' },
      { name: 'Confiture sans sucre', note: 'topping sur porridge tiède', weight: '30g' },
      { name: 'Oeufs entiers', note: 'calibre moyen 55-60g chacun', weight: '3 oeufs' },
      { name: 'Eau pour flocons', note: '', weight: '200ml' },
    ],
    steps: [
      { text: "Pèse 80g flocons à sec. Verse dans casserole avec 200ml eau froide. Feu moyen en remuant 3-4 min jusqu'à texture épaisse.", time: '4 min' },
      { text: "Retire du feu. Laisse refroidir 2 min. Ajoute 30g whey et mélange énergiquement. Ne jamais ajouter la whey sur feu — amertume et dénaturation garanties.", time: '2 min' },
      { text: "Pèse 30g confiture sans sucre et dépose en topping. Ne pas mélanger — garde le goût sur chaque cuillère.", time: '30 sec' },
      { text: "Casse 3 oeufs dans poêle anti-adhésive SANS huile feu doux. Brouille lentement à la spatule. Arrête cuisson quand encore légèrement baveux. Sale légèrement.", time: '3 min' },
    ],
    tip: "La whey est ici au repas 1 — c'est stratégique. Le matin tu sors du jeûne nocturne, tes muscles sont en mode catabolisme. La whey à digestion rapide + les oeufs stoppent ça immédiatement.",
  },
  {
    emoji: '💪', label: 'Repas 2', time: '12h30', color: BLUE, colorLight: '#eff6ff',
    kcal: 590, prot: 60, gluc: 55, lip: 8,
    title: 'Double blanc de poulet + pommes de terre + ketchup',
    subtitle: 'Repas principal · Maximum protéines animales complètes',
    ingredients: [
      { name: 'Blanc de poulet cru', note: 'peser cru · perd 25% à cuisson · donne ~190g cuit', weight: '250g' },
      { name: 'Pommes de terre crues épluchées', note: 'peser après épluchage', weight: '300g' },
      { name: 'Ketchup', note: 'sur les pommes de terre chaudes', weight: '30g' },
      { name: 'Oeufs entiers', note: 'en omelette ou durs à côté', weight: '2 oeufs' },
      { name: 'Sel · cumin · paprika', note: '', weight: 'à goût' },
    ],
    steps: [
      { text: "Épluche et pèse 300g pommes de terre. Coupe en morceaux égaux 3-4cm. Plonge dans eau froide salée, porte à ébullition, cuis 20 min. Alternative four: 200°C 25 min sur papier cuisson sans huile.", time: '20-25 min' },
      { text: "Pèse 250g blanc de poulet cru. Assaisonne sel + paprika + cumin. Poêle anti-adhésive sans huile feu moyen — 7 min par face. Coupe le plus épais: zéro rosé à l'intérieur.", time: '14 min' },
      { text: "Dans la même poêle après le poulet, casse 2 oeufs. Omelette simple feu doux ou oeufs au plat sans huile supplémentaire.", time: '3 min' },
      { text: "Dresse: pommes de terre + poulet tranché + omelette. Pèse 30g ketchup sur les pommes de terre. Mange tout ensemble.", time: '2 min' },
    ],
    tip: "Meal prep — Cuis 750g de blanc de poulet le dimanche soir pour 3 jours. Frigo en boîte hermétique. Réchauffe 2 min micro-ondes avec un fond d'eau pour éviter que ça sèche. Économise 15 min par repas.",
  },
  {
    emoji: '⚡', label: 'Repas 3', time: '16h00', color: AMBER, colorLight: '#fffbeb',
    kcal: 490, prot: 42, gluc: 43, lip: 13,
    title: 'Bowl flocons PB confiture (pré) + poulet post-workout',
    subtitle: 'Glucides avant séance · Protéines solides après · Pas de whey ici',
    ingredients: [
      { name: "Flocons d'avoine", note: 'peser à sec', weight: '50g', section: 'Partie A — Pré-workout (1h avant)' },
      { name: 'Peanut butter naturel', note: '1 cuillère à soupe pesée', weight: '20g' },
      { name: 'Confiture sans sucre', note: 'topping après mélange PB', weight: '20g' },
      { name: 'Eau', note: '', weight: '150ml' },
      { name: 'Blanc de poulet cru', note: 'préparé à l\'avance · réchauffé micro-ondes', weight: '150g', section: 'Partie B — Post-workout (dans les 30 min)' },
      { name: 'Oeufs durs', note: 'préparés à l\'avance dans le sac gym', weight: '2 oeufs' },
    ],
    steps: [
      { text: "PRÉ: pèse 50g flocons à sec dans bol. Ajoute 150ml eau. Micro-ondes 2 min puissance max. Laisse 30 sec.", time: '2 min' },
      { text: "Pèse 20g PB directement dans bol chaud. Mélange — la chaleur le rend crémeux. Pèse 20g confiture en topping. Mange 1h avant ta séance.", time: '1 min' },
      { text: "POST: emmène dans ton sac gym 150g de blanc de poulet cuit la veille en boîte + 2 oeufs durs déjà écalés dans un sachet. Mange dans les 30 min après ta dernière série.", time: 'Zéro prépa sur place' },
    ],
    tip: "Sans whey post-workout — le poulet + oeufs remplacent efficacement. Mange dans les 30 min, mastique bien. L'essentiel c'est d'avoir des acides aminés dans le sang rapidement.",
  },
  {
    emoji: '🌙', label: 'Repas 4', time: '20h00', color: PURPLE, colorLight: '#f5f3ff',
    kcal: 400, prot: 30, gluc: 30, lip: 12,
    title: 'Blanc de poulet + oeufs durs + pain + PB confiture',
    subtitle: 'Dernier repas · Protéines lentes pour nuit anabolique',
    ingredients: [
      { name: 'Blanc de poulet cru', note: 'grillé ou bouilli · peser cru', weight: '120g' },
      { name: 'Oeufs entiers durs', note: 'cuits 9 min eau bouillante', weight: '2 oeufs' },
      { name: 'Pain complet ou khobz', note: 'peser à la balance · khobz dense', weight: '60g' },
      { name: 'Peanut butter naturel', note: 'sur le pain · tartiner finement', weight: '15g' },
      { name: 'Confiture sans sucre', note: 'par dessus le PB sur le pain', weight: '20g' },
    ],
    steps: [
      { text: "Oeufs durs: plonge 2 oeufs dans eau bouillante salée. Exactement 9 min. Eau froide immédiatement 2 min pour stopper cuisson. Écale. Coupe en 2.", time: '9 min' },
      { text: "Pèse 120g blanc de poulet cru. Poêle sans huile 6 min/face. OU si batch préparé: réchauffe micro-ondes 90 sec avec 2 cuillères d'eau dans le fond. Sale + cumin.", time: '5-12 min' },
      { text: "Pèse 60g pain. Pèse 15g PB et tartine sur le pain. Pèse 20g confiture sans sucre et étale par dessus. Ton dessert de fin de journée.", time: '1 min' },
      { text: "Mange dans cet ordre: poulet + oeufs d'abord, pain PB confiture en dernier. Les protéines digérées en premier créent un meilleur environnement hormonal pour la nuit.", time: '' },
    ],
    tip: "Nuit anabolique — Le jaune d'oeuf contient de la leucine et des acides gras qui favorisent la synthèse protéique pendant le sommeil. Mange les 2 oeufs entiers — ne jette pas le jaune le soir. Le PB apporte des lipides lents qui maintiennent les acides aminés en circulation pendant 6-8h.",
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
    <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: '#f0f0f0' }}>
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: '#111' }}>{item.name}</p>
        {item.note && <p className="text-xs mt-0.5" style={{ color: '#888' }}>{item.note}</p>}
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
        style={{ backgroundColor: '#f3f4f6', color: '#555' }}>
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
        <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{step.text}</p>
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
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#e5e7eb', borderWidth: '0.5px' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: meal.colorLight, borderBottom: `2px solid ${meal.color}` }}>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
            style={{ backgroundColor: meal.color }}>
            {meal.emoji} {meal.label} · {meal.time}
          </span>
          <h2 className="text-base font-bold" style={{ color: '#111' }}>{meal.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>{meal.subtitle}</p>
        </div>
      </div>

      {/* Macro pills */}
      <div className="px-4 py-3 flex flex-wrap gap-2" style={{ borderBottom: '0.5px solid #f0f0f0' }}>
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
          style={{ backgroundColor: '#f9fafb', borderLeft: `3px solid ${G}` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: G }}>
            Coach tip
          </p>
          <p className="text-xs italic leading-relaxed" style={{ color: '#444' }}>{meal.tip}</p>
        </div>
      </div>

      {/* Total bar */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: '#f9fafb', borderTop: '0.5px solid #e5e7eb' }}>
        <span className="text-xs font-medium" style={{ color: '#888' }}>Total repas</span>
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
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#111' }}>🥩 Diet</h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#666' }}>
          Plan alimentaire journalier · 2010 kcal
        </p>
      </div>

      {/* Macro summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Calories', value: '2010', unit: 'kcal', color: G },
          { label: 'Protéines', value: '182', unit: 'g', color: '#1a6b4a' },
          { label: 'Glucides', value: '170', unit: 'g', color: BLUE },
          { label: 'Lipides', value: '48', unit: 'g', color: AMBER },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center border"
            style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: '0.5px' }}>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}<span className="text-base">{m.unit}</span>
            </p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: '#888' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: 'none' }}>
        {MEALS.map((m, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all border"
            style={{
              backgroundColor: active === i ? m.color : '#fff',
              color: active === i ? '#fff' : '#555',
              borderColor: active === i ? m.color : '#e5e7eb',
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
