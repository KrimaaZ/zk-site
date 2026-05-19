// ─────────────────────────────────────────────────────────────────────────────
// NUTRITION DATA — ajoute tes ingrédients ici
// Tous les macros sont par `per` grammes (100g par défaut, 30g pour le Whey)
// ─────────────────────────────────────────────────────────────────────────────

export type NutritionItem = {
  name:     string
  calories: number  // kcal
  proteins: number  // g
  carbs:    number  // g
  fats:     number  // g
  per:      number  // référence en grammes (100 ou 30 pour Whey)
}

export const NUTRITION_DATA: NutritionItem[] = [
  { name: "Oeuf entier",              calories: 155, proteins: 13,   carbs: 1.1, fats: 11,   per: 100 },
  { name: "Blanc d'oeuf",             calories: 52,  proteins: 11,   carbs: 0.7, fats: 0.2,  per: 100 },
  { name: "Lait demi-écrémé",         calories: 46,  proteins: 3.2,  carbs: 4.8, fats: 1.6,  per: 100 },
  { name: "Flocons d'avoine",         calories: 370, proteins: 13,   carbs: 58,  fats: 7,    per: 100 },
  { name: "Blanc de poulet",          calories: 110, proteins: 23,   carbs: 0,   fats: 1.5,  per: 100 },
  { name: "Pomme de terre",           calories: 77,  proteins: 2,    carbs: 17,  fats: 0.1,  per: 100 },
  { name: "Ketchup",                  calories: 100, proteins: 1.3,  carbs: 24,  fats: 0.1,  per: 100 },
  { name: "Whey Protéine (1 scoop)",  calories: 120, proteins: 24,   carbs: 3,   fats: 1.5,  per: 30  },
  { name: "Banane",                   calories: 89,  proteins: 1.1,  carbs: 23,  fats: 0.3,  per: 100 },
  { name: "Peanut Butter",            calories: 598, proteins: 22,   carbs: 20,  fats: 51,   per: 100 },
  { name: "Pomme",                    calories: 52,  proteins: 0.3,  carbs: 14,  fats: 0.2,  per: 100 },
  { name: "Pâtes cuites",             calories: 131, proteins: 5,    carbs: 25,  fats: 1.1,  per: 100 },
  { name: "Riz cuit",                 calories: 130, proteins: 2.7,  carbs: 28,  fats: 0.3,  per: 100 },
  { name: "Viande hachée 25% MG",     calories: 263, proteins: 17,   carbs: 0,   fats: 21,   per: 100 },
  { name: "Coca Zero",                calories: 1,   proteins: 0,    carbs: 0.1, fats: 0,    per: 100 },
  { name: "Rice Cake",                calories: 387, proteins: 8,    carbs: 81,  fats: 3,    per: 100 },
  { name: "Confiture -30% sucre",     calories: 185, proteins: 0.4,  carbs: 45,  fats: 0.1,  per: 100 },
  { name: "Toast complet",            calories: 247, proteins: 9,    carbs: 41,  fats: 4,    per: 100 },
  { name: "Miel",                     calories: 304, proteins: 0.3,  carbs: 82,  fats: 0,    per: 100 },
  { name: "Amlou",                    calories: 550, proteins: 12,   carbs: 18,  fats: 48,   per: 100 },
  { name: "Sucre",                    calories: 400, proteins: 0,    carbs: 100, fats: 0,    per: 100 },
  { name: "Blanc d'oeuf (1 unité)",   calories: 17,  proteins: 3.6,  carbs: 0.2, fats: 0.1,  per: 33  },
  { name: "Melon",                    calories: 34,  proteins: 0.8,  carbs: 8,   fats: 0.2,  per: 100 },
  { name: "Thon en boîte (eau)",      calories: 116, proteins: 26,   carbs: 0,   fats: 1,    per: 100 },
  { name: "Concombre",                calories: 16,  proteins: 0.7,  carbs: 3.6, fats: 0.1,  per: 100 },
  { name: "Fraises",                  calories: 32,  proteins: 0.7,  carbs: 7.7, fats: 0.3,  per: 100 },
  { name: "Kiwi",                     calories: 61,  proteins: 1.1,  carbs: 15,  fats: 0.5,  per: 100 },
]
