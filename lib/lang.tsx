'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'fr'

type T = {
  // Common
  cancel: string; save: string; edit: string; del: string; notes: string
  date: string; name: string; description: string; type: string; title: string; content: string; category: string
  aiGenerating: string; aiFailed: string; saving: string
  // Welcome
  tagline: string; enter: string
  // Feed
  welcomeBack: string; latestActivity: string; nothingYet: string; nothingYetSub: string
  foodPlan: string; workout: string
  // Food
  mealRotation: string; myRecipes: string; weekTab: string
  mealsSubtitle: (n: number) => string
  recipesSubtitle: (n: number) => string
  weekSubtitle: (n: number) => string
  favs: string; selectCancel: string; selectLabel: string
  tapMeals: string
  mealsSelected: (n: number) => string
  ingredientsTotal: (n: number) => string
  viewGroceryList: string
  groceryModal: (n: number) => string
  groceryTip: (n: number) => string
  copyList: string; copied: string
  itemsTicked: (checked: number, total: number) => string
  ingredients: string; howToPrepare: string
  addToFavs: string; savedToFavs: string; removeMeal: string
  addToWeek: string; weekEmpty: string; markDone: string; clearWeek: string; weekGrocery: string
  noRecipes: string; addRecipe: string
  aiGenerator: string; aiPlaceholder: string; generate: string; generating: string
  editRecipe: string; newRecipe: string; ingredientsLine: string; instructions: string
  prepMin: string; cookMin: string; servings: string; saveRecipe: string; deleteRecipe: string
  typeBreakfast: string; typeMain: string; typeSnack: string; typeSmoothie: string; typeNight: string
  // Workout
  workoutSubtitle: string; logBtn: string
  noSessions: (label: string) => string
  deleteSession: string; editSession: string; logSession: string; saveSession: string
  sessionTitle: string; sessionNotes: string; exercises: string; aiSuggest: string
  sets: string; reps: string; exerciseName: string
  pullDay: string; pushDay: string; absLegs: string; cardio: string
  // Valorant
  tipsCount: (n: number) => string
  addBtn: string; noTips: string; newTip: string; editTip: string; saveTip: string
  aiGenerateTip: string; practiceDrill: string; agent: string
  agentOptional: string; practiceDrillOpt: string; deleteConfirm: string
  // Trading
  tradesStrategies: string; tradeLog: string; backtestTab: string
  total: string; closed: string; winRate: string
  noTrades: string; noStrategies: string
  logTrade: string; editTrade: string; newStrategy: string; editStrategy: string
  aiGenerateStrategy: string; instrument: string; direction: string; status: string
  entry: string; exit: string; size: string; rulesOneLine: string
  timeframe: string; winRatePct: string; rulesLabel: string
  deleteTrade: string; deleteStrategy: string; addTrade: string; addStrategy: string
  analysisLabel: string; lessonsLabel: string; ratingLabel: string
}

const en: T = {
  cancel: 'Cancel', save: 'Save', edit: 'Edit', del: 'Del', notes: 'Notes',
  date: 'Date', name: 'Name', description: 'Description', type: 'Type', title: 'Title',
  content: 'Content', category: 'Category',
  aiGenerating: '✨ Generating…', aiFailed: 'AI failed', saving: 'Saving…',
  tagline: 'time to change ur life is now', enter: 'Enter →',
  welcomeBack: 'Welcome back, ZK', latestActivity: 'Latest Activity',
  nothingYet: 'Nothing here yet', nothingYetSub: 'Start adding content in any section above.',
  foodPlan: 'Food Plan', workout: 'Workout',
  mealRotation: '🔄 Meal Rotation', myRecipes: '📖 My Recipes', weekTab: '📅 Week',
  mealsSubtitle: n => `${n} meals · 30 per category`,
  recipesSubtitle: n => `${n} saved recipes`,
  weekSubtitle: n => `${n} meal${n !== 1 ? 's' : ''} planned this week`,
  favs: '❤️ Favs', selectCancel: 'Cancel', selectLabel: 'Select',
  tapMeals: 'Tap meals to select them',
  mealsSelected: n => `${n} meal${n > 1 ? 's' : ''} selected`,
  ingredientsTotal: n => `${n} ingredients total`,
  viewGroceryList: '🛒 View Grocery List',
  groceryModal: n => `🛒 Grocery List · ${n} meals`,
  groceryTip: n => `Tap each item to cross it off as you shop. ${n} ingredients total.`,
  copyList: '📋 Copy list', copied: 'Copied to clipboard!',
  itemsTicked: (c, t) => `${c}/${t} items ticked`,
  ingredients: 'Ingredients', howToPrepare: 'How to prepare',
  addToFavs: '🤍 Add to Favs', savedToFavs: '❤️ Saved to Favs', removeMeal: '🗑 Remove',
  addToWeek: '📅 Save to Week', weekEmpty: 'No meals planned this week. Select meals in Meal Rotation and tap "Save to Week".', markDone: '✓ Done', clearWeek: 'Clear All', weekGrocery: '🛒 Week Grocery List',
  noRecipes: 'No recipes yet. Add one or generate with AI!', addRecipe: '+ Add',
  aiGenerator: '✨ AI Recipe Generator',
  aiPlaceholder: 'List ingredients (e.g. chicken, rice, broccoli)...',
  generate: 'Generate', generating: 'Generating…',
  editRecipe: 'Edit Recipe', newRecipe: 'New Recipe',
  ingredientsLine: 'Ingredients (one per line)', instructions: 'Instructions',
  prepMin: 'Prep (min)', cookMin: 'Cook (min)', servings: 'Servings',
  saveRecipe: 'Save Recipe', deleteRecipe: 'Delete this recipe?',
  typeBreakfast: 'Breakfast', typeMain: 'Main meal', typeSnack: 'Snack',
  typeSmoothie: 'Smoothie', typeNight: 'Night',
  workoutSubtitle: '4 training types', logBtn: '+ Log',
  noSessions: label => `No ${label} sessions yet.`,
  deleteSession: 'Delete session?', editSession: 'Edit Session', logSession: 'Log Session',
  saveSession: 'Save Session', sessionTitle: 'Session Title', sessionNotes: 'Session Notes',
  exercises: 'Exercises', aiSuggest: '✨ AI Suggest Exercises',
  sets: 'Sets', reps: 'Reps', exerciseName: 'Exercise name',
  pullDay: 'Pull Day', pushDay: 'Push Day', absLegs: 'Abs & Legs', cardio: 'Cardio',
  tipsCount: n => `${n} tips & drills`,
  addBtn: '+ Add', noTips: 'No tips yet. Add one or generate with AI!',
  newTip: 'New Tip', editTip: 'Edit Tip', saveTip: 'Save Tip',
  aiGenerateTip: '✨ AI Generate Tip', practiceDrill: '🎯 Practice Drill',
  agent: 'Agent', agentOptional: 'Agent (optional)',
  practiceDrillOpt: 'Practice Drill (optional)', deleteConfirm: 'Delete?',
  tradesStrategies: 'Trades & strategies', tradeLog: '📋 Log', backtestTab: '🔬 Backtest',
  total: 'Total', closed: 'Closed', winRate: 'Win Rate',
  noTrades: 'No trades yet. Start logging!', noStrategies: 'No strategies yet. Add one!',
  logTrade: 'Log Trade', editTrade: 'Edit Trade', newStrategy: 'New Strategy', editStrategy: 'Edit Strategy',
  aiGenerateStrategy: '✨ AI Generate Strategy',
  instrument: 'Instrument', direction: 'Direction', status: 'Status',
  entry: 'Entry', exit: 'Exit', size: 'Size',
  rulesOneLine: 'Rules (one per line)', timeframe: 'Timeframe', winRatePct: 'Win Rate %',
  rulesLabel: '📋 Rules', deleteTrade: 'Delete trade?', deleteStrategy: 'Delete strategy?',
  addTrade: '+ Trade', addStrategy: '+ Strategy',
  analysisLabel: 'Analysis:', lessonsLabel: 'Lessons:', ratingLabel: 'Rating:',
}

const fr: T = {
  cancel: 'Annuler', save: 'Enregistrer', edit: 'Modifier', del: 'Suppr.', notes: 'Notes',
  date: 'Date', name: 'Nom', description: 'Description', type: 'Type', title: 'Titre',
  content: 'Contenu', category: 'Catégorie',
  aiGenerating: '✨ Génération...', aiFailed: "L'IA a échoué", saving: 'Enregistrement...',
  tagline: "le moment de changer ta vie c'est maintenant", enter: 'Entrer →',
  welcomeBack: 'Bon retour, ZK', latestActivity: 'Activité récente',
  nothingYet: 'Rien ici pour l\'instant', nothingYetSub: 'Ajoutez du contenu dans une section ci-dessus.',
  foodPlan: 'Plan alimentaire', workout: 'Entraînement',
  mealRotation: '🔄 Repas', myRecipes: '📖 Mes Recettes', weekTab: '📅 Semaine',
  mealsSubtitle: n => `${n} repas · 30 par catégorie`,
  recipesSubtitle: n => `${n} recettes enregistrées`,
  weekSubtitle: n => `${n} repas planifié${n !== 1 ? 's' : ''} cette semaine`,
  favs: '❤️ Favoris', selectCancel: 'Annuler', selectLabel: 'Sélectionner',
  tapMeals: 'Appuyez pour sélectionner',
  mealsSelected: n => `${n} repas sélectionné${n > 1 ? 's' : ''}`,
  ingredientsTotal: n => `${n} ingrédients au total`,
  viewGroceryList: '🛒 Voir la liste',
  groceryModal: n => `🛒 Liste de courses · ${n} repas`,
  groceryTip: n => `Appuyez pour cocher. ${n} ingrédients au total.`,
  copyList: '📋 Copier', copied: 'Copié !',
  itemsTicked: (c, tt) => `${c}/${tt} cochés`,
  ingredients: 'Ingrédients', howToPrepare: 'Comment préparer',
  addToFavs: '🤍 Ajouter aux favoris', savedToFavs: '❤️ Dans les favoris', removeMeal: '🗑 Supprimer',
  addToWeek: '📅 Ajouter à la semaine', weekEmpty: 'Aucun repas planifié. Sélectionne des repas et appuie sur "Ajouter à la semaine".', markDone: '✓ Fait', clearWeek: 'Tout effacer', weekGrocery: '🛒 Courses de la semaine',
  noRecipes: "Aucune recette. Ajoutez-en une ou générez avec l'IA !", addRecipe: '+ Ajouter',
  aiGenerator: '✨ Générateur IA',
  aiPlaceholder: 'Listez les ingrédients (ex: poulet, riz, brocoli)...',
  generate: 'Générer', generating: 'Génération...',
  editRecipe: 'Modifier la recette', newRecipe: 'Nouvelle recette',
  ingredientsLine: 'Ingrédients (un par ligne)', instructions: 'Instructions',
  prepMin: 'Prép. (min)', cookMin: 'Cuisson (min)', servings: 'Portions',
  saveRecipe: 'Enregistrer', deleteRecipe: 'Supprimer cette recette ?',
  typeBreakfast: 'Petit-déjeuner', typeMain: 'Plat principal', typeSnack: 'Encas',
  typeSmoothie: 'Smoothie', typeNight: 'Soirée',
  workoutSubtitle: "4 types d'entraînement", logBtn: '+ Ajouter',
  noSessions: label => `Aucune séance ${label} pour l'instant.`,
  deleteSession: 'Supprimer la séance ?', editSession: 'Modifier la séance', logSession: 'Enregistrer la séance',
  saveSession: 'Enregistrer', sessionTitle: 'Titre de la séance', sessionNotes: 'Notes de séance',
  exercises: 'Exercices', aiSuggest: '✨ IA - Suggérer des exercices',
  sets: 'Séries', reps: 'Rép.', exerciseName: "Nom de l'exercice",
  pullDay: 'Jour Tirage', pushDay: 'Jour Poussée', absLegs: 'Abdos & Jambes', cardio: 'Cardio',
  tipsCount: n => `${n} conseils & exercices`,
  addBtn: '+ Ajouter', noTips: "Aucun conseil. Ajoutez-en un ou générez avec l'IA !",
  newTip: 'Nouveau conseil', editTip: 'Modifier le conseil', saveTip: 'Enregistrer',
  aiGenerateTip: '✨ IA - Générer un conseil', practiceDrill: '🎯 Exercice pratique',
  agent: 'Agent', agentOptional: 'Agent (optionnel)',
  practiceDrillOpt: 'Exercice pratique (optionnel)', deleteConfirm: 'Supprimer ?',
  tradesStrategies: 'Trades & stratégies', tradeLog: '📋 Journal', backtestTab: '🔬 Backtest',
  total: 'Total', closed: 'Fermés', winRate: 'Taux de réussite',
  noTrades: 'Aucun trade. Commencez !', noStrategies: 'Aucune stratégie. Ajoutez-en une !',
  logTrade: 'Enregistrer le trade', editTrade: 'Modifier le trade',
  newStrategy: 'Nouvelle stratégie', editStrategy: 'Modifier la stratégie',
  aiGenerateStrategy: '✨ IA - Générer une stratégie',
  instrument: 'Instrument', direction: 'Direction', status: 'Statut',
  entry: 'Entrée', exit: 'Sortie', size: 'Taille',
  rulesOneLine: 'Règles (une par ligne)', timeframe: 'Intervalle', winRatePct: 'Taux de réussite %',
  rulesLabel: '📋 Règles', deleteTrade: 'Supprimer le trade ?', deleteStrategy: 'Supprimer la stratégie ?',
  addTrade: '+ Trade', addStrategy: '+ Stratégie',
  analysisLabel: 'Analyse :', lessonsLabel: 'Leçons :', ratingLabel: 'Note :',
}

const translations = { en, fr }

const LangContext = createContext<{ lang: Lang; t: T; toggle: () => void }>({
  lang: 'en', t: en, toggle: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'en' || saved === 'fr') setLang(saved)
  }, [])

  const toggle = () => setLang(l => {
    const next = l === 'en' ? 'fr' : 'en'
    localStorage.setItem('lang', next)
    return next
  })

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
