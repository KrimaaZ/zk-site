'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Recipe = {
  id: number; title: string; description: string; ingredients: string
  instructions: string; prepTime: number; cookTime: number; servings: number; category: string
}

type Meal = {
  id: number; type: string; name: string; protein: string; kcal: string
  time: string; ingredients: string; prep: string; tip: string
}

const MEALS: Meal[] = [
  // ── BREAKFAST (15) ──────────────────────────────────────────────────────────
  { id:1,  type:'breakfast', name:'Classic scrambled eggs on toast',       protein:'25g', kcal:'450 kcal', time:'8 min',  ingredients:'3 eggs + 2 slices whole grain toast + butter + salt + pepper + chives',                                    prep:'Whisk eggs. Melt butter on low heat, add eggs, stir gently until just set. Toast bread, pile eggs on top.',              tip:'Low heat is the secret — high heat makes them rubbery' },
  { id:2,  type:'breakfast', name:'Overnight oats with banana',            protein:'14g', kcal:'410 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana + 1 tbsp honey + pinch cinnamon',                                         prep:'Mix oats and milk in a jar the night before. In the morning, top with sliced banana and honey.',                        tip:'Prep 3 jars Sunday night for a full week of ready breakfasts' },
  { id:3,  type:'breakfast', name:'Greek yogurt parfait',                  protein:'22g', kcal:'380 kcal', time:'3 min',  ingredients:'250g plain Greek yogurt + 40g granola + 1 banana + 1 tbsp honey + handful berries',                        prep:'Layer yogurt, granola, and fruit in a bowl or glass. Drizzle honey.',                                                   tip:'Use full-fat yogurt for better satiety and more protein' },
  { id:4,  type:'breakfast', name:'Banana peanut butter porridge',         protein:'18g', kcal:'480 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 1 banana + 1 tbsp peanut butter + pinch cinnamon',                                 prep:'Cook oats in milk 3–4 min. Stir in peanut butter, top with sliced banana.',                                             tip:'Add a boiled egg on the side to push protein over 25g' },
  { id:5,  type:'breakfast', name:'3-egg veggie omelette',                 protein:'24g', kcal:'380 kcal', time:'10 min', ingredients:'3 eggs + 1 bell pepper (diced) + onion + handful spinach + olive oil + salt + herbs',                      prep:'Sauté veggies 2 min. Pour beaten eggs over, cook on medium until set, fold in half.',                                   tip:'Add feta or cottage cheese inside for extra protein and creaminess' },
  { id:6,  type:'breakfast', name:'Avocado toast with poached eggs',       protein:'22g', kcal:'490 kcal', time:'10 min', ingredients:'2 eggs + 1 avocado + 2 slices sourdough + lemon juice + chili flakes + salt',                             prep:'Toast bread. Mash avocado with lemon and salt. Poach eggs 3 min. Assemble.',                                            tip:'Swirl the water before dropping the egg for a neater poach' },
  { id:7,  type:'breakfast', name:'Banana protein pancakes',               protein:'20g', kcal:'460 kcal', time:'12 min', ingredients:'2 bananas + 3 eggs + 40g oats + pinch baking powder + pinch cinnamon',                                    prep:'Blend all ingredients. Cook small pancakes on medium heat 2 min per side.',                                             tip:'Only 3 ingredients if you skip baking powder — naturally gluten-free' },
  { id:8,  type:'breakfast', name:'Cottage cheese & fruit bowl',           protein:'24g', kcal:'320 kcal', time:'2 min',  ingredients:'250g cottage cheese + 1 banana + handful strawberries + 1 tbsp honey + pumpkin seeds',                    prep:'Spoon cottage cheese into a bowl, top with fruit, drizzle honey, sprinkle seeds.',                                      tip:'One of the highest-protein breakfasts per calorie on this list' },
  { id:9,  type:'breakfast', name:'Peanut butter honey toast',             protein:'14g', kcal:'420 kcal', time:'3 min',  ingredients:'2 slices whole grain bread + 2 tbsp peanut butter + 1 tbsp honey + 1 banana (sliced)',                    prep:'Toast bread, spread peanut butter, drizzle honey, top with banana slices.',                                             tip:'Add a glass of milk to bring total protein to 22g' },
  { id:10, type:'breakfast', name:'French toast with banana',              protein:'18g', kcal:'500 kcal', time:'8 min',  ingredients:'2 thick bread slices + 2 eggs + 100ml milk + 1 banana + cinnamon + butter',                               prep:'Whisk eggs and milk. Dip bread, fry in butter 2 min per side. Top with banana.',                                        tip:'Day-old bread absorbs the egg better without falling apart' },
  { id:11, type:'breakfast', name:'Yogurt granola crunch bowl',            protein:'20g', kcal:'450 kcal', time:'3 min',  ingredients:'200g plain yogurt + 50g granola + 5 dates (chopped) + 1 tbsp peanut butter + drizzle honey',              prep:'Layer yogurt and granola in a bowl, add dates and peanut butter, finish with honey.',                                   tip:'Dates + granola give a fast energy spike — ideal before morning training' },
  { id:12, type:'breakfast', name:'Egg & cheese breakfast wrap',           protein:'28g', kcal:'520 kcal', time:'8 min',  ingredients:'3 eggs + 1 flour tortilla + 30g grated cheese + handful spinach + salt + olive oil',                      prep:'Scramble eggs. Lay tortilla flat, add eggs, cheese, spinach. Roll tight.',                                              tip:'Wrap in foil and take it to go — stays warm 20 min' },
  { id:13, type:'breakfast', name:'Chia pudding with mango',               protein:'12g', kcal:'340 kcal', time:'5 min',  ingredients:'40g chia seeds + 300ml coconut milk + 1 mango (diced) + 1 tsp honey + pinch vanilla',                     prep:'Mix chia seeds and milk. Refrigerate overnight. Top with mango and honey in the morning.',                              tip:'The pudding keeps 4 days in the fridge — batch prep Sunday' },
  { id:14, type:'breakfast', name:'Sardine toast with lemon',              protein:'30g', kcal:'420 kcal', time:'5 min',  ingredients:'1 tin sardines + 2 slices sourdough + 1 tbsp olive oil + lemon + parsley + black pepper',                  prep:'Toast bread, flake sardines on top, drizzle oil and lemon, season well.',                                               tip:'Highest-protein breakfast in the rotation — great on training days' },
  { id:15, type:'breakfast', name:'Oatmeal & boiled egg combo',            protein:'22g', kcal:'470 kcal', time:'10 min', ingredients:'60g oats + 300ml milk + 2 boiled eggs + 1 banana + 1 tsp honey',                                          prep:'Cook oats in milk. Boil eggs 7 min, peel, serve alongside oatmeal with banana.',                                        tip:'The egg on the side doubles the protein versus plain oatmeal' },

  // ── MAIN MEAL (15) ──────────────────────────────────────────────────────────
  { id:16, type:'main', name:'Tuna & potato power bowl',           protein:'38g', kcal:'620 kcal', time:'10 min', ingredients:'2 boiled potatoes + 1 tin tuna + cherry tomatoes + olive oil + lemon',                                       prep:'Boil potatoes ahead. Drain tuna, mix everything, drizzle olive oil.',                                                    tip:'Add a hard-boiled egg for +6g protein' },
  { id:17, type:'main', name:'Egg & potato hash',                  protein:'32g', kcal:'580 kcal', time:'12 min', ingredients:'3 eggs + 2 potatoes (diced) + onion + olive oil + paprika + salt',                                           prep:'Pan-fry diced potatoes 8 min. Add eggs, scramble in. Season.',                                                           tip:'Add sardines for extra protein' },
  { id:18, type:'main', name:'Sardine & rice bowl',                protein:'40g', kcal:'650 kcal', time:'10 min', ingredients:'2 tins sardines + 200g cooked rice + tomatoes + lemon + olive oil + parsley',                               prep:'Cook rice. Flake sardines on top, add chopped tomatoes, dress with oil and lemon.',                                      tip:'Highest omega-3 in the rotation — great for joints during cardio' },
  { id:19, type:'main', name:'3-egg omelette with potatoes',       protein:'28g', kcal:'540 kcal', time:'12 min', ingredients:'3 eggs + 1 large potato (boiled & sliced) + cheese + olive oil + herbs',                                    prep:'Pan-fry potato slices 5 min. Pour beaten eggs over, add cheese, fold.',                                                  tip:'Add a tin of tuna inside for +25g protein' },
  { id:20, type:'main', name:'Tuna pasta with olive oil',          protein:'45g', kcal:'700 kcal', time:'12 min', ingredients:'200g pasta + 2 tins tuna + olive oil + garlic + cherry tomatoes + black pepper',                            prep:'Cook pasta. Toss with tuna, olive oil, garlic, tomatoes.',                                                               tip:'Highest protein single meal in the rotation' },
  { id:21, type:'main', name:'Egg fried rice with tuna',           protein:'42g', kcal:'680 kcal', time:'10 min', ingredients:'200g cooked rice + 2 eggs + 1 tin tuna + soy sauce + sesame oil + frozen peas',                            prep:'Fry rice in oil 2 min. Push to side, scramble eggs. Mix with tuna, peas, soy sauce.',                                   tip:'Use leftover cold rice — it fries better than fresh' },
  { id:22, type:'main', name:'Shakshuka (eggs in tomato)',         protein:'26g', kcal:'480 kcal', time:'15 min', ingredients:'4 eggs + 400g crushed tomatoes + 1 onion + garlic + cumin + paprika + olive oil',                          prep:'Fry onion and garlic. Add tomatoes and spices, simmer 5 min. Crack eggs in, cover until whites set.',                   tip:'Serve with bread to soak up the sauce — adds ~8g carbs' },
  { id:23, type:'main', name:'Lentil & egg power bowl',            protein:'34g', kcal:'590 kcal', time:'20 min', ingredients:'200g cooked lentils + 2 boiled eggs + spinach + olive oil + lemon + cumin + salt',                         prep:'Warm lentils in pan with oil and cumin. Plate with spinach, halved eggs, lemon dressing.',                               tip:'Lentils are the cheapest complete-protein source on this list' },
  { id:24, type:'main', name:'Chickpea & rice bowl',               protein:'28g', kcal:'620 kcal', time:'12 min', ingredients:'200g cooked rice + 1 tin chickpeas + tomatoes + garlic + olive oil + paprika + lemon',                    prep:'Sauté garlic and paprika 1 min. Add drained chickpeas and tomatoes, cook 5 min. Serve over rice.',                      tip:'Add an egg on top for +6g protein and extra richness' },
  { id:25, type:'main', name:'Tuna & avocado rice bowl',           protein:'42g', kcal:'660 kcal', time:'8 min',  ingredients:'200g cooked rice + 1 tin tuna + ½ avocado + cucumber + soy sauce + sesame seeds',                         prep:'Arrange rice in bowl. Top with tuna, sliced avocado, cucumber. Drizzle soy sauce.',                                     tip:'Avocado fat helps absorb the omega-3 from tuna' },
  { id:26, type:'main', name:'Potato & egg tortilla española',     protein:'30g', kcal:'550 kcal', time:'20 min', ingredients:'4 eggs + 2 potatoes (thinly sliced) + onion + olive oil + salt',                                          prep:'Cook potatoes and onion in oil 10 min. Add beaten eggs, cook low and slow 8 min, flip.',                                 tip:'Make a large one and eat it cold — keeps 2 days in the fridge' },
  { id:27, type:'main', name:'Bean & potato stew',                 protein:'24g', kcal:'560 kcal', time:'20 min', ingredients:'1 tin white beans + 2 potatoes + 1 tin tomatoes + garlic + olive oil + rosemary + salt',                  prep:'Fry garlic. Add diced potatoes, tomatoes, beans and rosemary. Simmer 15 min.',                                          tip:'Top with a poached egg to add 6g protein per serving' },
  { id:28, type:'main', name:'Sardine & lentil soup',              protein:'38g', kcal:'560 kcal', time:'20 min', ingredients:'2 tins sardines + 150g red lentils + 1 onion + garlic + tomatoes + cumin + olive oil',                    prep:'Fry onion and garlic. Add lentils, tomatoes, 600ml water, cumin. Simmer 15 min. Stir in sardines.',                     tip:'Red lentils dissolve into the broth — no need to pre-soak' },
  { id:29, type:'main', name:'Pasta with eggs & parmesan',         protein:'30g', kcal:'640 kcal', time:'12 min', ingredients:'200g pasta + 3 eggs + 40g parmesan + garlic + olive oil + black pepper + parsley',                        prep:'Cook pasta. Toss hot pasta with beaten eggs and parmesan off heat. Add garlic oil.',                                     tip:'Work fast — the residual pasta heat cooks the eggs without scrambling' },
  { id:30, type:'main', name:'Tuna stuffed sweet potato',          protein:'36g', kcal:'580 kcal', time:'15 min', ingredients:'1 large sweet potato + 2 tins tuna + Greek yogurt + lemon + chives + salt',                              prep:'Microwave sweet potato 8 min. Split open, mix tuna with yogurt and lemon, fill potato.',                                 tip:'Microwaving the potato instead of baking saves 50 min' },

  // ── SNACK (15) ──────────────────────────────────────────────────────────────
  { id:31, type:'snack', name:'Banana peanut butter stack',        protein:'12g', kcal:'380 kcal', time:'2 min',  ingredients:'1 large banana + 2 tbsp peanut butter + 3 rice cakes',                                                       prep:'Slice banana, spread peanut butter on rice cakes, top with banana.',                                                     tip:'Best 30–45 min before a workout' },
  { id:32, type:'snack', name:'Tuna & egg sandwich',               protein:'35g', kcal:'450 kcal', time:'5 min',  ingredients:'1 tin tuna + 1 hard-boiled egg + mustard + whole grain bread (2 slices)',                                    prep:'Mix tuna, sliced egg, mustard. Fill bread.',                                                                             tip:'Great pre-workout if eaten 1–2 hrs before' },
  { id:33, type:'snack', name:'Greek yogurt & date mix',           protein:'14g', kcal:'350 kcal', time:'2 min',  ingredients:'200g plain yogurt + 4–5 dates + 1 tbsp peanut butter',                                                      prep:'Chop dates, mix into yogurt, add peanut butter on top.',                                                                 tip:'Dates give fast carbs — perfect pre-workout snack' },
  { id:34, type:'snack', name:'Hard-boiled eggs & banana',         protein:'18g', kcal:'300 kcal', time:'10 min', ingredients:'3 hard-boiled eggs + 1 banana',                                                                             prep:'Boil eggs (batch-cook 6 at once). Peel and eat with banana.',                                                            tip:'Batch cook eggs on Sunday for the whole week' },
  { id:35, type:'snack', name:'Oat & yogurt protein pot',          protein:'20g', kcal:'390 kcal', time:'5 min',  ingredients:'200g plain yogurt + 40g oats + 1 tbsp honey + 1 banana + cinnamon',                                        prep:'Mix everything in a bowl. No cooking needed.',                                                                           tip:'Prep the night before for a ready-to-go morning snack' },
  { id:36, type:'snack', name:'Cottage cheese & cucumber',         protein:'18g', kcal:'180 kcal', time:'2 min',  ingredients:'200g cottage cheese + 1 cucumber + salt + pepper + paprika',                                              prep:'Slice cucumber, season cottage cheese with salt and paprika, dip or top.',                                               tip:'Lowest calorie high-protein snack on the list — great for cuts' },
  { id:37, type:'snack', name:'Mixed nuts & dates',                protein:'8g',  kcal:'310 kcal', time:'1 min',  ingredients:'30g mixed nuts (almonds, cashews, walnuts) + 3–4 Medjool dates',                                          prep:'Grab and eat. No prep needed.',                                                                                          tip:'Store a portion bag in your bag for emergency snacks on the go' },
  { id:38, type:'snack', name:'Boiled egg & whole grain crackers', protein:'14g', kcal:'240 kcal', time:'10 min', ingredients:'2 boiled eggs + 5 whole grain crackers + mustard or hummus',                                              prep:'Boil eggs 8 min, peel. Serve with crackers and dip.',                                                                    tip:'Keep peeled eggs in water in the fridge — stays fresh 5 days' },
  { id:39, type:'snack', name:'Yogurt with flaxseeds',             protein:'16g', kcal:'280 kcal', time:'2 min',  ingredients:'200g plain yogurt + 1 tbsp flaxseeds + 1 tbsp honey + 1 banana',                                         prep:'Mix yogurt with honey, slice banana on top, sprinkle flaxseeds.',                                                        tip:'Flaxseeds add omega-3 and fiber — good for digestive health' },
  { id:40, type:'snack', name:'Apple with almond butter',          protein:'6g',  kcal:'260 kcal', time:'1 min',  ingredients:'1 large apple + 2 tbsp almond butter',                                                                    prep:'Core and slice apple, dip in almond butter.',                                                                            tip:'The fiber from the apple slows sugar absorption — no energy crash' },
  { id:41, type:'snack', name:'Rice cake with cottage cheese',     protein:'14g', kcal:'220 kcal', time:'2 min',  ingredients:'3 rice cakes + 150g cottage cheese + chives + pepper',                                                   prep:'Spread cottage cheese on rice cakes, season with chives and pepper.',                                                    tip:'Only 220 kcal and 14g protein — best snack for calorie-controlled days' },
  { id:42, type:'snack', name:'Banana & walnuts',                  protein:'6g',  kcal:'300 kcal', time:'1 min',  ingredients:'1 banana + 30g walnuts',                                                                                 prep:'Peel banana, eat with walnuts.',                                                                                         tip:'Walnuts have the highest omega-3 content of all tree nuts' },
  { id:43, type:'snack', name:'Hummus & veggie sticks',            protein:'8g',  kcal:'200 kcal', time:'5 min',  ingredients:'4 tbsp hummus + 1 carrot + 1 cucumber + 1 bell pepper',                                                 prep:'Cut vegetables into sticks, serve with hummus for dipping.',                                                             tip:'Make a big batch of veggie sticks Sunday and keep in the fridge' },
  { id:44, type:'snack', name:'Dates with tahini',                 protein:'5g',  kcal:'290 kcal', time:'1 min',  ingredients:'5 Medjool dates + 1 tbsp tahini',                                                                        prep:'Pit dates, stuff or dip with tahini.',                                                                                   tip:'Tahini adds calcium and healthy fat — better combo than just dates alone' },
  { id:45, type:'snack', name:'Peanut butter crispbread',          protein:'10g', kcal:'320 kcal', time:'2 min',  ingredients:'3 rye crispbreads + 2 tbsp peanut butter + 1 banana + pinch cinnamon',                                  prep:'Spread peanut butter on crispbreads, top with banana slices and cinnamon.',                                              tip:'Rye crispbreads have more fiber than regular bread — keeps you fuller longer' },

  // ── SMOOTHIE (15) ───────────────────────────────────────────────────────────
  { id:46, type:'smoothie', name:'Banana oat muscle shake',         protein:'22g', kcal:'480 kcal', time:'3 min', ingredients:'2 bananas + 50g oats + 400ml whole milk + 1 tbsp peanut butter + pinch cinnamon',                          prep:'Blend everything 30 seconds. Drink immediately.',                                                                        tip:'Post-workout ideal. Add a raw egg for +6g protein' },
  { id:47, type:'smoothie', name:'Yogurt berry power blend',        protein:'20g', kcal:'400 kcal', time:'3 min', ingredients:'250g plain yogurt + 100g frozen berries + 1 banana + 30g oats + 200ml milk',                              prep:'Blend all 30 seconds. Thick texture — add water if needed.',                                                             tip:'Rich in antioxidants — great for cardio recovery' },
  { id:48, type:'smoothie', name:'Peanut butter banana mass shake', protein:'25g', kcal:'560 kcal', time:'3 min', ingredients:'2 bananas + 2 tbsp peanut butter + 400ml whole milk + 40g oats + 1 tsp honey',                           prep:'Blend until smooth. Use frozen bananas for a thicker texture.',                                                          tip:'Calorie-dense — best on high-training days' },
  { id:49, type:'smoothie', name:'Carrot orange ginger boost',      protein:'6g',  kcal:'220 kcal', time:'3 min', ingredients:'2 oranges (juiced) + 1 carrot + 1cm fresh ginger + 1 banana + water',                                    prep:'Blend all. Strain if you prefer juice texture.',                                                                         tip:'Cardio recovery drink — rich in vitamin C and electrolytes' },
  { id:50, type:'smoothie', name:'Spinach banana green power',      protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'2 large handfuls spinach + 2 bananas + 300ml water or coconut water + 1 tsp honey',                      prep:'Blend spinach and liquid first until smooth. Add bananas, blend again.',                                                 tip:'Blend spinach with liquid first to avoid leafy lumps' },
  { id:51, type:'smoothie', name:'Mango yogurt tropical blend',     protein:'18g', kcal:'380 kcal', time:'3 min', ingredients:'200g frozen mango + 200g plain yogurt + 200ml milk + 1 tsp honey + pinch turmeric',                      prep:'Blend everything until creamy. Serve cold.',                                                                             tip:'Turmeric is anti-inflammatory — especially good for joint recovery' },
  { id:52, type:'smoothie', name:'Chocolate banana shake',          protein:'20g', kcal:'490 kcal', time:'3 min', ingredients:'2 bananas + 1 tbsp cocoa powder + 400ml whole milk + 40g oats + 1 tbsp peanut butter',                  prep:'Blend all ingredients 30 seconds.',                                                                                      tip:'Tastes like dessert but works as a post-workout meal' },
  { id:53, type:'smoothie', name:'Apple ginger detox',              protein:'4g',  kcal:'160 kcal', time:'3 min', ingredients:'2 apples + 1cm ginger + ½ lemon (juiced) + 1 carrot + 200ml cold water',                               prep:'Juice or blend all. Strain for a cleaner liquid.',                                                                       tip:'Best first thing in the morning on an empty stomach' },
  { id:54, type:'smoothie', name:'Avocado milk smoothie',           protein:'10g', kcal:'420 kcal', time:'3 min', ingredients:'1 ripe avocado + 400ml whole milk + 1 banana + 1 tbsp honey + pinch vanilla',                           prep:'Blend until completely smooth.',                                                                                         tip:'Very calorie-dense and filling — best for caloric surplus days' },
  { id:55, type:'smoothie', name:'Strawberry oat shake',            protein:'16g', kcal:'360 kcal', time:'3 min', ingredients:'150g frozen strawberries + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey',                    prep:'Blend all ingredients. Add more milk if too thick.',                                                                     tip:'Frozen strawberries give a thicker texture than fresh' },
  { id:56, type:'smoothie', name:'Coconut banana smoothie',         protein:'8g',  kcal:'380 kcal', time:'3 min', ingredients:'2 bananas + 400ml coconut milk + 30g oats + 1 tbsp honey',                                             prep:'Blend until smooth. Chill before serving.',                                                                              tip:'MCT fats in coconut milk are rapidly used for energy — good pre-cardio' },
  { id:57, type:'smoothie', name:'Beetroot orange boost',           protein:'6g',  kcal:'210 kcal', time:'4 min', ingredients:'1 small beetroot (cooked) + 2 oranges (juiced) + 1 carrot + 1 banana + 200ml water',                   prep:'Blend beetroot and water first. Add remaining ingredients, blend 30 sec.',                                               tip:'Beetroot nitrates improve endurance — drink 2 hrs before cardio' },
  { id:58, type:'smoothie', name:'Almond date shake',               protein:'12g', kcal:'440 kcal', time:'3 min', ingredients:'5 Medjool dates (pitted) + 400ml almond milk + 2 tbsp almond butter + 1 banana + pinch cinnamon',       prep:'Soak dates in warm water 5 min. Blend everything until smooth.',                                                         tip:'Natural sweetness from dates — no sugar needed at all' },
  { id:59, type:'smoothie', name:'Watermelon mint cooler',          protein:'4g',  kcal:'150 kcal', time:'3 min', ingredients:'400g watermelon chunks + handful fresh mint + juice of 1 lime + 200ml cold water + ice',                prep:'Blend everything. Strain seeds if needed. Serve immediately over ice.',                                                   tip:'Best summer recovery drink — high in electrolytes and hydration' },
  { id:60, type:'smoothie', name:'Golden turmeric milk',            protein:'8g',  kcal:'240 kcal', time:'4 min', ingredients:'400ml whole milk + 1 tsp turmeric + ½ tsp cinnamon + 1 tsp honey + pinch black pepper + 1 banana',     prep:'Blend all cold, or warm gently on the stove. Froth and serve.',                                                          tip:'Black pepper dramatically increases turmeric absorption — do not skip it' },

  // ── BREAKFAST cont. (16–30) ─────────────────────────────────────────────────
  { id:76,  type:'breakfast', name:'Smoked salmon & cream cheese bagel',  protein:'32g', kcal:'520 kcal', time:'5 min',  ingredients:'1 bagel + 60g cream cheese + 80g smoked salmon + capers + lemon + dill',                                    prep:'Toast bagel, spread cream cheese, layer salmon, top with capers and lemon.',                                             tip:'Add sliced cucumber for crunch and extra micronutrients' },
  { id:77,  type:'breakfast', name:'Baked egg & spinach cups',            protein:'22g', kcal:'280 kcal', time:'15 min', ingredients:'4 eggs + 2 large handfuls spinach + 30g feta + olive oil + salt + pepper',                                  prep:'Oil a muffin tin, wilt spinach in each cup, crack one egg per cup, crumble feta. Bake 180°C 12 min.',                  tip:'Make 6 at once and reheat in the microwave all week' },
  { id:78,  type:'breakfast', name:'Smoothie bowl with granola',          protein:'16g', kcal:'430 kcal', time:'5 min',  ingredients:'2 frozen bananas + 150g frozen berries + 100g Greek yogurt + 50g granola + 1 tbsp honey + seeds',           prep:'Blend frozen bananas, berries, and yogurt thick. Pour into a bowl, top with granola, seeds, honey.',                   tip:'The key is using frozen fruit — fresh fruit makes it too liquid to eat with a spoon' },
  { id:79,  type:'breakfast', name:'Breakfast shakshuka',                 protein:'24g', kcal:'400 kcal', time:'15 min', ingredients:'3 eggs + 400g crushed tomatoes + onion + garlic + cumin + paprika + olive oil + bread',                      prep:'Fry onion and garlic. Add tomatoes and spices, simmer 5 min. Crack in eggs, cover until set. Serve with bread.',       tip:'Left over shakshuka reheats perfectly for day 2' },
  { id:80,  type:'breakfast', name:'Cottage cheese banana pancakes',      protein:'24g', kcal:'420 kcal', time:'12 min', ingredients:'200g cottage cheese + 2 eggs + 1 banana + 40g oats + pinch cinnamon + honey',                               prep:'Blend all ingredients. Cook small pancakes on medium heat 2 min per side. Drizzle honey.',                             tip:'Blending the oats first makes the batter smoother' },
  { id:81,  type:'breakfast', name:'Oatmeal with poached egg on top',     protein:'20g', kcal:'450 kcal', time:'12 min', ingredients:'60g oats + 300ml milk + 1 egg + salt + pepper + chives + drizzle olive oil',                                prep:'Cook oats in milk. Poach egg 3 min. Place egg on oatmeal, season with salt, pepper, chives.',                          tip:'Savory oatmeal is underrated — the egg yolk acts as a sauce' },
  { id:82,  type:'breakfast', name:'Pita with hummus & fried egg',        protein:'18g', kcal:'440 kcal', time:'8 min',  ingredients:'1 pita bread + 3 tbsp hummus + 2 eggs + olive oil + za\'atar or paprika',                                  prep:'Fry eggs in olive oil sunny side up. Spread hummus on warm pita, top with eggs and spices.',                           tip:'Warm the pita directly on the flame for 30 sec for a smoky flavour' },
  { id:83,  type:'breakfast', name:'Ricotta toast with honey & walnuts',  protein:'16g', kcal:'480 kcal', time:'5 min',  ingredients:'2 thick toast slices + 100g ricotta + 1 tbsp honey + 30g walnuts + pinch cinnamon',                         prep:'Toast bread, spread ricotta generously, drizzle honey, crush walnuts on top, dust cinnamon.',                          tip:'Ricotta has more protein per calorie than cream cheese' },
  { id:84,  type:'breakfast', name:'Boiled eggs & avocado plate',         protein:'16g', kcal:'380 kcal', time:'10 min', ingredients:'2 eggs + 1 avocado + lemon juice + chili flakes + salt + 1 slice toast',                                   prep:'Boil eggs 7 min. Halve avocado, season with lemon, salt, chili. Serve with toast.',                                   tip:'Batch boil 6 eggs and keep in the fridge for a 2-min breakfast all week' },
  { id:85,  type:'breakfast', name:'Egg & veggie breakfast burrito',      protein:'26g', kcal:'550 kcal', time:'10 min', ingredients:'3 eggs + 1 flour tortilla + 1 tin beans (drained) + cheese + salsa + spinach + olive oil',                  prep:'Scramble eggs with beans. Place on tortilla with cheese, spinach, salsa. Wrap tight, toast in pan 1 min.',             tip:'Prep 3 burritos at once and freeze — microwave 2 min from frozen' },
  { id:86,  type:'breakfast', name:'Muesli with milk & dried fruit',      protein:'14g', kcal:'420 kcal', time:'3 min',  ingredients:'60g muesli + 250ml cold milk + 5 dried apricots + 1 tbsp honey + 1 banana',                                 prep:'Pour cold milk over muesli, slice in banana, add chopped apricots and honey. Eat immediately or soak overnight.',      tip:'Soaking overnight makes it creamier and easier to digest' },
  { id:87,  type:'breakfast', name:'Egg & tomato pan scramble',           protein:'22g', kcal:'360 kcal', time:'8 min',  ingredients:'4 eggs + 2 tomatoes (diced) + onion + olive oil + salt + cumin + fresh coriander',                         prep:'Fry onion 2 min. Add tomatoes and cumin, cook 3 min. Scramble eggs in.',                                              tip:'A North African-style eggs with tomatoes — naturally high protein and very cheap' },
  { id:88,  type:'breakfast', name:'No-bake peanut butter oat balls',     protein:'10g', kcal:'390 kcal', time:'10 min', ingredients:'100g oats + 3 tbsp peanut butter + 2 tbsp honey + 2 tbsp dark chocolate chips + pinch salt',                prep:'Mix all together. Roll into 8–10 balls. Refrigerate 20 min before eating.',                                            tip:'Store in the fridge 5 days — grab 2–3 balls as a fast breakfast on the go' },
  { id:89,  type:'breakfast', name:'Banana bread overnight oats',         protein:'14g', kcal:'440 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana (mashed) + 1 tbsp peanut butter + 1 tsp honey + pinch cinnamon',          prep:'Mash banana into oats and milk. Add peanut butter, honey, cinnamon. Refrigerate overnight.',                          tip:'Mashing the banana in makes it sweet without added sugar' },
  { id:90,  type:'breakfast', name:'Full egg & veggie power bowl',        protein:'28g', kcal:'420 kcal', time:'12 min', ingredients:'3 eggs + handful cherry tomatoes + ½ avocado + spinach + olive oil + lemon + salt',                         prep:'Pan-fry eggs to preference. Assemble bowl with spinach, tomatoes, avocado. Drizzle oil and lemon.',                   tip:'Eat this before training — protein from eggs + healthy fat from avocado = sustained energy' },

  // ── MAIN MEAL cont. (16–30) ─────────────────────────────────────────────────
  { id:91,  type:'main', name:'Tuna & white bean salad',             protein:'40g', kcal:'580 kcal', time:'5 min',  ingredients:'2 tins tuna + 1 tin white beans (drained) + red onion + olive oil + lemon + parsley + salt',                 prep:'Drain tuna and beans. Toss with sliced onion, olive oil, lemon juice, and parsley.',                                   tip:'Zero cooking needed — one of the fastest high-protein meals on the list' },
  { id:92,  type:'main', name:'Egg & vegetable stir fry with rice',  protein:'24g', kcal:'480 kcal', time:'12 min', ingredients:'3 eggs + 200g rice + 1 bell pepper + carrot + onion + soy sauce + sesame oil + garlic',                    prep:'Cook rice. Stir fry veggies 4 min. Scramble eggs in. Add rice and soy sauce, toss.',                                   tip:'Use pre-cooked microwave rice bags to cut time to 5 min' },
  { id:93,  type:'main', name:'Red lentil dal with rice',            protein:'28g', kcal:'620 kcal', time:'20 min', ingredients:'200g red lentils + 200g rice + 1 tin tomatoes + onion + garlic + cumin + turmeric + coconut milk',          prep:'Fry onion and spices 2 min. Add lentils, tomatoes, coconut milk, 400ml water. Simmer 15 min. Serve over rice.',        tip:'Make a big batch — dal gets better the next day as flavors develop' },
  { id:94,  type:'main', name:'Sardine & tomato pasta',              protein:'38g', kcal:'660 kcal', time:'12 min', ingredients:'200g pasta + 2 tins sardines + 400g crushed tomatoes + garlic + olive oil + chili + basil',                 prep:'Cook pasta. Fry garlic and chili 1 min, add tomatoes, simmer 5 min. Flake in sardines. Toss with pasta.',              tip:'Sardines break down into the sauce — skeptics won\'t even know they\'re in there' },
  { id:95,  type:'main', name:'Potato & chickpea curry',             protein:'20g', kcal:'570 kcal', time:'20 min', ingredients:'2 potatoes (diced) + 1 tin chickpeas + 1 tin tomatoes + onion + garlic + garam masala + turmeric + ginger', prep:'Fry onion, garlic, ginger 2 min. Add spices, tomatoes, potatoes. Simmer 12 min. Add chickpeas, cook 3 more min.',      tip:'Add a spoonful of yogurt on top to cool the heat and add extra protein' },
  { id:96,  type:'main', name:'Tuna stuffed bell peppers',           protein:'36g', kcal:'520 kcal', time:'15 min', ingredients:'2 bell peppers + 2 tins tuna + 100g cooked rice + corn + tomato + olive oil + herbs',                       prep:'Halve peppers, hollow out. Mix tuna, rice, corn, tomato. Fill peppers. Bake 200°C 12 min.',                            tip:'Eat cold the next day — works great as meal prep' },
  { id:97,  type:'main', name:'Black bean & egg power bowl',         protein:'30g', kcal:'590 kcal', time:'10 min', ingredients:'1 tin black beans + 2 eggs + 200g rice + salsa + avocado + lime + cumin + olive oil',                      prep:'Warm beans with cumin. Fry eggs. Assemble bowl with rice, beans, eggs, avocado, salsa.',                               tip:'Black beans are one of the most fiber-dense legumes — great for gut health' },
  { id:98,  type:'main', name:'Korean-style rice & egg bowl',        protein:'28g', kcal:'600 kcal', time:'12 min', ingredients:'200g cooked rice + 2 eggs + carrot + spinach + cucumber + soy sauce + sesame oil + sesame seeds',          prep:'Blanch spinach 1 min. Fry eggs. Arrange rice in bowl with all toppings. Drizzle soy and sesame oil.',                  tip:'The trick is having each topping separated — looks impressive, tastes great' },
  { id:99,  type:'main', name:'Tuna & corn quesadilla',              protein:'34g', kcal:'580 kcal', time:'10 min', ingredients:'2 flour tortillas + 1 tin tuna + 50g cheese + corn + tomato + jalapeño + olive oil',                       prep:'Fill one tortilla with tuna, cheese, corn. Top with second tortilla. Pan-fry 2 min per side.',                         tip:'Press down with a spatula while cooking to get a crispy, sealed quesadilla' },
  { id:100, type:'main', name:'Chickpea patties with yogurt sauce',  protein:'22g', kcal:'500 kcal', time:'15 min', ingredients:'1 tin chickpeas + 1 egg + garlic + cumin + parsley + breadcrumbs + olive oil + 100g yogurt + lemon',       prep:'Mash chickpeas, mix in egg, garlic, cumin, parsley, breadcrumbs. Form patties. Pan-fry 3 min per side. Serve with yogurt.',  tip:'Chill the patty mix 10 min before frying so they hold their shape' },
  { id:101, type:'main', name:'Egg & potato soup',                   protein:'20g', kcal:'420 kcal', time:'20 min', ingredients:'3 eggs + 3 potatoes (cubed) + 1 onion + garlic + 1L stock + olive oil + parsley + salt',                  prep:'Fry onion and garlic 2 min. Add potatoes and stock. Simmer 12 min. Crack eggs in, poach in soup 4 min.',               tip:'Season generously — potatoes need more salt than you think' },
  { id:102, type:'main', name:'Pasta aglio e olio with tuna',        protein:'40g', kcal:'680 kcal', time:'12 min', ingredients:'200g pasta + 2 tins tuna + 4 garlic cloves + olive oil + chili flakes + parsley + black pepper',          prep:'Cook pasta. Fry sliced garlic in oil until golden. Toss pasta with oil, tuna, chili, parsley.',                        tip:'Reserve a cup of pasta water — add it to loosen the sauce' },
  { id:103, type:'main', name:'Chickpea & spinach stew',             protein:'24g', kcal:'540 kcal', time:'20 min', ingredients:'2 tins chickpeas + 200g spinach + 1 tin tomatoes + onion + garlic + smoked paprika + olive oil + lemon',  prep:'Fry onion and garlic 2 min. Add paprika, tomatoes, chickpeas. Simmer 12 min. Stir in spinach until wilted.',           tip:'Squeeze lemon at the end — acid brightens the whole dish' },
  { id:104, type:'main', name:'Egg & bean taco bowl',                protein:'30g', kcal:'600 kcal', time:'12 min', ingredients:'3 eggs + 1 tin kidney beans + 200g rice + tomato + avocado + sour cream + cumin + chili powder',         prep:'Scramble eggs with cumin and chili. Warm beans. Assemble bowl with rice, beans, eggs, tomato, avocado.',               tip:'Build it like a deconstructed taco — you get all the flavors without the mess' },
  { id:105, type:'main', name:'Sardine & avocado open sandwich',     protein:'34g', kcal:'560 kcal', time:'8 min',  ingredients:'2 slices sourdough + 2 tins sardines + 1 avocado + lemon + capers + chili flakes + olive oil',            prep:'Toast bread. Mash avocado with lemon on each slice. Flake sardines on top. Add capers and chili.',                    tip:'Best served open-face so you taste every layer' },

  // ── SNACK cont. (16–30) ─────────────────────────────────────────────────────
  { id:106, type:'snack', name:'Edamame with sea salt',              protein:'12g', kcal:'180 kcal', time:'5 min',  ingredients:'200g frozen edamame + sea salt + optional: chili flakes or sesame oil',                                    prep:'Microwave edamame 3 min or boil 5 min. Drain, sprinkle salt and seasoning.',                                          tip:'Buy frozen in bulk — one of the cheapest high-protein plant snacks available' },
  { id:107, type:'snack', name:'Celery & peanut butter boats',       protein:'7g',  kcal:'200 kcal', time:'2 min',  ingredients:'4 celery sticks + 2 tbsp peanut butter + optional: raisins on top',                                      prep:'Fill celery grooves with peanut butter. Add raisins for the classic "ants on a log" version.',                        tip:'Celery is 95% water — keeps you hydrated as you snack' },
  { id:108, type:'snack', name:'Cheese & whole grain crackers',      protein:'14g', kcal:'280 kcal', time:'2 min',  ingredients:'40g aged cheddar or gouda + 6 whole grain crackers + optional: pickles or grapes',                        prep:'Slice cheese, arrange on crackers with pickles or fruit on the side.',                                                 tip:'Aged cheese has more protein per gram than fresh cheese' },
  { id:109, type:'snack', name:'Date & nut energy balls',            protein:'8g',  kcal:'310 kcal', time:'10 min', ingredients:'8 Medjool dates (pitted) + 60g mixed nuts + 1 tbsp cocoa + 1 tbsp peanut butter + pinch salt',           prep:'Blend dates and nuts. Add cocoa and PB. Roll into 8–10 balls. Refrigerate.',                                          tip:'Freeze half the batch — they taste like chocolate truffles straight from the freezer' },
  { id:110, type:'snack', name:'Cucumber & hummus bites',            protein:'6g',  kcal:'160 kcal', time:'5 min',  ingredients:'1 large cucumber + 4 tbsp hummus + paprika + olive oil',                                                 prep:'Slice cucumber into thick rounds. Top each with a dollop of hummus and a dusting of paprika.',                        tip:'The lowest-calorie snack on the list — great for evening hunger without guilt' },
  { id:111, type:'snack', name:'Popcorn with nutritional yeast',     protein:'6g',  kcal:'190 kcal', time:'5 min',  ingredients:'30g popping corn + 1 tbsp olive oil + 2 tbsp nutritional yeast + salt',                                  prep:'Pop corn in a lidded pan with oil. Toss with nutritional yeast and salt.',                                             tip:'Nutritional yeast adds a cheesy flavor plus B vitamins — unique in plant foods' },
  { id:112, type:'snack', name:'Banana & dark chocolate',            protein:'4g',  kcal:'280 kcal', time:'1 min',  ingredients:'1 banana + 3 squares dark chocolate (70%+)',                                                             prep:'Eat together. No prep at all.',                                                                                       tip:'The natural sweetness of banana balances the bitterness of dark chocolate perfectly' },
  { id:113, type:'snack', name:'Sunflower seeds & raisins',          protein:'8g',  kcal:'270 kcal', time:'1 min',  ingredients:'30g sunflower seeds + 30g raisins',                                                                      prep:'Mix and eat.',                                                                                                        tip:'Sunflower seeds are rich in vitamin E and magnesium — great for workout recovery' },
  { id:114, type:'snack', name:'Pistachios & dried apricots',        protein:'8g',  kcal:'300 kcal', time:'1 min',  ingredients:'30g pistachios + 6 dried apricots',                                                                      prep:'Grab and eat.',                                                                                                       tip:'Pistachios are the most protein-dense nut by volume — you get more per handful' },
  { id:115, type:'snack', name:'Avocado & salt rice cake',           protein:'4g',  kcal:'240 kcal', time:'3 min',  ingredients:'3 rice cakes + ½ avocado + lemon juice + sea salt + chili flakes',                                      prep:'Mash avocado with lemon. Spread on rice cakes. Season with salt and chili.',                                          tip:'Best eaten immediately — avocado oxidizes fast once mashed' },
  { id:116, type:'snack', name:'Mini baked egg cups',                protein:'18g', kcal:'200 kcal', time:'15 min', ingredients:'4 eggs + salt + pepper + dried herbs + optional: diced ham or cheese',                                  prep:'Crack eggs into oiled muffin tin. Season. Bake 180°C 12 min until just set.',                                         tip:'Batch bake 6 every Sunday — grab and eat cold, no reheating needed' },
  { id:117, type:'snack', name:'Yogurt with hemp seeds',             protein:'18g', kcal:'260 kcal', time:'2 min',  ingredients:'200g plain yogurt + 2 tbsp hemp seeds + 1 tsp honey',                                                   prep:'Mix hemp seeds into yogurt, drizzle honey.',                                                                          tip:'Hemp seeds have the perfect omega-3 to omega-6 ratio of all seeds' },
  { id:118, type:'snack', name:'Pear & almond butter',               protein:'5g',  kcal:'250 kcal', time:'2 min',  ingredients:'1 ripe pear + 2 tbsp almond butter',                                                                    prep:'Slice pear, dip in almond butter.',                                                                                   tip:'Pears are gentler on digestion than apples — better for sensitive stomachs' },
  { id:119, type:'snack', name:'Crispy roasted chickpeas',           protein:'10g', kcal:'220 kcal', time:'30 min', ingredients:'1 tin chickpeas (drained) + 1 tbsp olive oil + paprika + cumin + salt + garlic powder',                 prep:'Pat chickpeas dry. Toss with oil and spices. Roast 200°C 25 min until crunchy.',                                     tip:'They must be completely dry before roasting or they\'ll go soft instead of crispy' },
  { id:120, type:'snack', name:'Banana oat energy bites',            protein:'8g',  kcal:'320 kcal', time:'10 min', ingredients:'2 bananas + 100g oats + 2 tbsp peanut butter + 1 tbsp honey + dark chocolate chips',                   prep:'Mash bananas, mix in oats, PB, honey, chips. Roll into balls. Refrigerate 15 min.',                                  tip:'No oven needed — the oats and banana bind together naturally' },

  // ── SMOOTHIE cont. (16–30) ──────────────────────────────────────────────────
  { id:121, type:'smoothie', name:'Pineapple coconut recovery shake',  protein:'6g',  kcal:'290 kcal', time:'3 min', ingredients:'200g frozen pineapple + 300ml coconut milk + 1 banana + 1cm fresh ginger + pinch turmeric',               prep:'Blend all until smooth.',                                                                                             tip:'Pineapple bromelain reduces post-workout muscle soreness — science-backed' },
  { id:122, type:'smoothie', name:'Blueberry almond milk shake',       protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'150g frozen blueberries + 300ml almond milk + 40g oats + 1 tbsp almond butter + 1 tsp honey',             prep:'Blend everything until smooth. Add more almond milk if too thick.',                                                   tip:'Blueberries have the highest antioxidant content of any common fruit' },
  { id:123, type:'smoothie', name:'Kale apple detox blend',            protein:'4g',  kcal:'160 kcal', time:'3 min', ingredients:'2 large kale leaves + 2 apples + ½ lemon (juiced) + 1cm ginger + 300ml cold water + ice',               prep:'Blend kale with water first until smooth. Add remaining ingredients and blend again.',                                tip:'Blend greens with liquid first to fully break them down before adding other ingredients' },
  { id:124, type:'smoothie', name:'Peach oat smoothie',                protein:'14g', kcal:'350 kcal', time:'3 min', ingredients:'200g frozen peaches + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp vanilla + 1 tsp honey',          prep:'Blend all until creamy.',                                                                                             tip:'Frozen peaches give a sorbet-like texture — better than fresh for smoothies' },
  { id:125, type:'smoothie', name:'Espresso banana energy shake',      protein:'16g', kcal:'420 kcal', time:'3 min', ingredients:'2 bananas + 1 shot espresso (cooled) + 300ml milk + 40g oats + 1 tbsp peanut butter',                    prep:'Cool espresso shot. Blend everything together.',                                                                     tip:'Caffeine + complex carbs from oats = the best pre-morning-workout combo' },
  { id:126, type:'smoothie', name:'Fig & honey smoothie',              protein:'10g', kcal:'380 kcal', time:'3 min', ingredients:'4 fresh or dried figs + 200g Greek yogurt + 200ml milk + 1 tbsp honey + pinch cinnamon',                 prep:'If using dried figs, soak 10 min in warm water. Blend all ingredients.',                                              tip:'Figs are rich in calcium and iron — rare nutrients in most smoothies' },
  { id:127, type:'smoothie', name:'Papaya ginger tropical blend',      protein:'5g',  kcal:'200 kcal', time:'3 min', ingredients:'300g papaya (cubed) + 1 banana + 1cm fresh ginger + juice of 1 lime + 200ml coconut water',              prep:'Blend all until smooth.',                                                                                             tip:'Papaya enzymes aid protein digestion — ideal as a post-meal smoothie' },
  { id:128, type:'smoothie', name:'Cherry banana anti-inflammatory',   protein:'8g',  kcal:'300 kcal', time:'3 min', ingredients:'150g frozen cherries + 1 banana + 200ml milk + 1 tbsp cocoa powder + ½ tsp cinnamon',                   prep:'Blend all ingredients until smooth.',                                                                                 tip:'Tart cherry is one of the most studied foods for reducing exercise-induced inflammation' },
  { id:129, type:'smoothie', name:'Cucumber mint detox blend',         protein:'3g',  kcal:'90 kcal',  time:'3 min', ingredients:'1 cucumber + handful mint + juice of 1 lemon + 1cm ginger + 400ml cold water + ice',                    prep:'Blend all, strain for a cleaner drink, or leave chunky.',                                                             tip:'Extremely hydrating — perfect first thing in the morning before breakfast' },
  { id:130, type:'smoothie', name:'Tahini date power shake',           protein:'14g', kcal:'450 kcal', time:'3 min', ingredients:'5 Medjool dates + 2 tbsp tahini + 400ml milk + 1 banana + pinch cardamom + pinch cinnamon',              prep:'Soak dates 5 min. Blend everything until completely smooth.',                                                        tip:'Tahini is 25% protein — gives this shake a richer, nuttier taste than PB' },
  { id:131, type:'smoothie', name:'Blackberry yogurt blend',           protein:'16g', kcal:'340 kcal', time:'3 min', ingredients:'150g frozen blackberries + 200g plain yogurt + 200ml milk + 1 banana + 1 tsp honey',                     prep:'Blend all until smooth.',                                                                                             tip:'Blackberries have 3× more vitamin C than oranges by weight' },
  { id:132, type:'smoothie', name:'Orange carrot immunity boost',      protein:'5g',  kcal:'190 kcal', time:'3 min', ingredients:'3 oranges (juiced) + 2 carrots + 1 banana + 1cm turmeric + 200ml water',                               prep:'Juice or blend all ingredients. Strain for juice, leave chunky for smoothie.',                                        tip:'Vitamin C from oranges helps absorb iron from carrots — smart combo' },
  { id:133, type:'smoothie', name:'Lemon ginger zing shot',            protein:'3g',  kcal:'100 kcal', time:'3 min', ingredients:'2 lemons (juiced) + 2cm fresh ginger + 1 tsp honey + 1 tsp apple cider vinegar + 200ml water',          prep:'Blend or shake all together. Drink immediately.',                                                                    tip:'Drink this before your main breakfast — kick-starts digestion and metabolism' },
  { id:134, type:'smoothie', name:'Pumpkin spice protein shake',       protein:'12g', kcal:'380 kcal', time:'4 min', ingredients:'3 tbsp pumpkin puree + 300ml milk + 1 banana + 40g oats + 1 tsp pumpkin spice + 1 tsp honey',           prep:'Blend all until smooth and creamy.',                                                                                  tip:'Pumpkin is high in beta-carotene and potassium — great for endurance recovery' },
  { id:135, type:'smoothie', name:'Melon lime cooler',                 protein:'3g',  kcal:'130 kcal', time:'3 min', ingredients:'400g melon (honeydew or cantaloupe) + juice of 1 lime + handful mint + 200ml cold water + ice',         prep:'Blend everything. Serve immediately over ice.',                                                                      tip:'One of the most hydrating smoothies — great before or after cardio in heat' },

  // ── NIGHT FOOD (15) ─────────────────────────────────────────────────────────
  { id:61, type:'night', name:'Yogurt & banana night bowl',         protein:'18g', kcal:'320 kcal', time:'2 min', ingredients:'250g plain full-fat yogurt + 1 banana + 1 tsp honey + crushed walnuts',                                   prep:'Slice banana into yogurt, drizzle honey, add nuts.',                                                                     tip:'Casein-rich — digests slowly overnight for muscle repair' },
  { id:62, type:'night', name:'Oat & peanut butter night bowl',     protein:'16g', kcal:'420 kcal', time:'5 min', ingredients:'60g oats + 300ml warm milk + 1 tbsp peanut butter + 1 banana (sliced)',                                  prep:'Cook oats in milk 2 min. Stir in peanut butter, top with banana.',                                                       tip:'Slow-digesting carbs fuel overnight muscle protein synthesis' },
  { id:63, type:'night', name:'Apple & peanut butter night snack',  protein:'8g',  kcal:'280 kcal', time:'1 min', ingredients:'1 large apple + 2 tbsp peanut butter',                                                                   prep:'Slice apple, dip in peanut butter.',                                                                                     tip:'The fat in PB slows digestion — no hunger at night' },
  { id:64, type:'night', name:'Banana dark chocolate square',       protein:'5g',  kcal:'250 kcal', time:'1 min', ingredients:'1 banana + 2 squares dark chocolate (70%+)',                                                             prep:'Eat together. That is it.',                                                                                              tip:'Dark chocolate magnesium helps muscle recovery and sleep quality' },
  { id:65, type:'night', name:'Yogurt & fruit salad bowl',          protein:'15g', kcal:'290 kcal', time:'4 min', ingredients:'200g plain yogurt + 1 banana + 1 orange + 5 dates + drizzle honey',                                     prep:'Chop fruit, mix into yogurt, drizzle honey.',                                                                            tip:'Ends the day with protein, natural sugar, and micronutrients' },
  { id:66, type:'night', name:'Cottage cheese & honey',             protein:'20g', kcal:'220 kcal', time:'1 min', ingredients:'250g cottage cheese + 1 tbsp honey + pinch cinnamon',                                                   prep:'Spoon cottage cheese into a bowl, drizzle honey, dust with cinnamon.',                                                   tip:'Cottage cheese is pure casein — the best slow-release protein source for night' },
  { id:67, type:'night', name:'Warm milk & honey',                  protein:'8g',  kcal:'180 kcal', time:'3 min', ingredients:'300ml whole milk + 1 tbsp honey + pinch nutmeg',                                                        prep:'Heat milk until steaming. Stir in honey and nutmeg. Drink slowly.',                                                      tip:'Warm milk raises tryptophan levels — genuinely helps with falling asleep' },
  { id:68, type:'night', name:'Rice pudding with cinnamon',         protein:'10g', kcal:'350 kcal', time:'10 min',ingredients:'60g short-grain rice + 400ml milk + 1 tbsp sugar + 1 tsp cinnamon + pinch vanilla',                     prep:'Simmer rice in milk on low heat 10 min, stirring often. Add sugar and cinnamon.',                                        tip:'Make a large batch and refrigerate — lasts 3 days and tastes better cold' },
  { id:69, type:'night', name:'Egg white & avocado bowl',           protein:'18g', kcal:'260 kcal', time:'5 min', ingredients:'4 egg whites + ½ avocado + cherry tomatoes + lemon + salt + herbs',                                    prep:'Scramble egg whites in non-stick pan. Plate with sliced avocado and tomatoes.',                                          tip:'Egg whites at night = pure protein with almost zero fat or carbs' },
  { id:70, type:'night', name:'Mixed nuts & raisins',               protein:'8g',  kcal:'280 kcal', time:'1 min', ingredients:'30g mixed nuts + 20g raisins',                                                                          prep:'Mix in a small bowl or eat straight from a bag.',                                                                        tip:'Raisins provide natural melatonin — can improve sleep quality' },
  { id:71, type:'night', name:'Banana honey toast',                 protein:'6g',  kcal:'310 kcal', time:'2 min', ingredients:'2 slices whole grain bread + 1 banana + 1 tbsp honey',                                                  prep:'Toast bread, slice banana on top, drizzle honey.',                                                                       tip:'Carbs + banana tryptophan = natural sleep aid combination' },
  { id:72, type:'night', name:'Greek yogurt with walnuts',          protein:'18g', kcal:'300 kcal', time:'2 min', ingredients:'200g Greek yogurt + 30g walnuts + 1 tsp honey',                                                         prep:'Spoon yogurt into a bowl, top with walnuts and a honey drizzle.',                                                        tip:'Walnuts contain melatonin — one of the few foods that does' },
  { id:73, type:'night', name:'Peanut butter crispbread',           protein:'10g', kcal:'290 kcal', time:'2 min', ingredients:'3 rye crispbreads + 2 tbsp peanut butter',                                                              prep:'Spread peanut butter on crispbreads.',                                                                                   tip:'Slow carbs from rye + fat from PB = stable blood sugar overnight' },
  { id:74, type:'night', name:'Cheese & apple plate',               protein:'14g', kcal:'300 kcal', time:'3 min', ingredients:'60g aged cheese (cheddar or gouda) + 1 apple + 5 walnuts',                                             prep:'Slice cheese and apple, arrange on a plate with walnuts.',                                                               tip:'Cheese tryptophan + apple fiber = one of the best natural sleep combos' },
  { id:75, type:'night', name:'Warm oat milk & cinnamon',           protein:'6g',  kcal:'160 kcal', time:'5 min', ingredients:'300ml oat milk + ½ tsp cinnamon + 1 tsp honey + pinch cardamom',                                       prep:'Warm oat milk gently. Stir in cinnamon, honey, cardamom. Serve hot.',                                                    tip:'Lowest-calorie night option — perfect if your daily calories are already met' },

  // ── NIGHT FOOD cont. (16–30) ────────────────────────────────────────────────
  { id:136, type:'night', name:'Warm chamomile & honey',              protein:'2g',  kcal:'80 kcal',  time:'3 min', ingredients:'1 chamomile tea bag + 300ml hot water + 1 tbsp honey + 1 slice lemon',                                    prep:'Brew tea 4 min. Add honey and lemon. Sip slowly 30 min before bed.',                                                   tip:'Chamomile apigenin binds sleep receptors — one of the most researched sleep aids' },
  { id:137, type:'night', name:'Almond butter & banana toast',        protein:'10g', kcal:'320 kcal', time:'3 min', ingredients:'2 slices whole grain bread + 2 tbsp almond butter + ½ banana (sliced)',                                  prep:'Toast bread, spread almond butter, top with banana.',                                                                  tip:'Almond butter has more magnesium than peanut butter — better for sleep quality' },
  { id:138, type:'night', name:'Cottage cheese & chives bowl',        protein:'20g', kcal:'160 kcal', time:'2 min', ingredients:'250g cottage cheese + 1 tbsp fresh chives + pinch salt + pepper + drizzle olive oil',                   prep:'Season cottage cheese with chives, salt, pepper. Drizzle a tiny amount of olive oil.',                                 tip:'Pure casein protein with almost no carbs — the ideal night protein if cutting calories' },
  { id:139, type:'night', name:'Tuna & cucumber bites',               protein:'22g', kcal:'180 kcal', time:'5 min', ingredients:'1 tin tuna + 1 cucumber + 1 tbsp Greek yogurt + lemon + dill + salt',                                  prep:'Mix tuna with yogurt, lemon, dill. Slice cucumber into thick rounds. Spoon tuna mix on each.',                         tip:'Refrigerate tuna mix ahead of time — even better the next evening' },
  { id:140, type:'night', name:'Banana cinnamon warm mash',           protein:'4g',  kcal:'200 kcal', time:'3 min', ingredients:'1 banana + pinch cinnamon + 1 tsp honey + 1 tbsp crushed walnuts',                                     prep:'Mash banana with a fork. Warm 20 sec in microwave. Top with cinnamon, honey, walnuts.',                                tip:'Warm banana triggers more tryptophan release than cold banana' },
  { id:141, type:'night', name:'Kefir with honey',                    protein:'8g',  kcal:'170 kcal', time:'1 min', ingredients:'250ml plain kefir + 1 tsp honey',                                                                      prep:'Pour kefir into a glass. Stir in honey. Drink slowly.',                                                                tip:'Kefir is richer in probiotics than yogurt — supports gut repair during overnight fast' },
  { id:142, type:'night', name:'Dark chocolate & almonds',            protein:'6g',  kcal:'270 kcal', time:'1 min', ingredients:'20g dark chocolate (70%+) + 20g almonds',                                                              prep:'No prep. Eat slowly.',                                                                                                 tip:'Eat mindfully — this portion is satisfying if eaten slowly, not if rushed' },
  { id:143, type:'night', name:'Tahini & honey crispbread',           protein:'8g',  kcal:'260 kcal', time:'2 min', ingredients:'3 rye crispbreads + 1 tbsp tahini + 1 tsp honey + pinch sesame seeds',                                  prep:'Spread tahini on crispbreads, drizzle honey, sprinkle sesame seeds.',                                                  tip:'Tahini is rich in tryptophan — the amino acid your body converts to serotonin and melatonin' },
  { id:144, type:'night', name:'Light tomato soup',                   protein:'6g',  kcal:'180 kcal', time:'8 min', ingredients:'400g crushed tomatoes + 1 garlic clove + 1 tbsp olive oil + basil + salt + pepper',                    prep:'Heat garlic in oil 1 min. Add tomatoes, season, simmer 5 min. Blend smooth.',                                          tip:'A warm liquid before bed promotes relaxation — much lighter than a solid snack' },
  { id:145, type:'night', name:'Ricotta & berry toast',               protein:'12g', kcal:'310 kcal', time:'4 min', ingredients:'2 slices whole grain toast + 80g ricotta + 100g mixed berries + 1 tsp honey',                          prep:'Toast bread, spread ricotta, top with berries and honey drizzle.',                                                     tip:'Ricotta has a naturally mild sweetness — barely needs honey at all' },
  { id:146, type:'night', name:'Melon & mint plate',                  protein:'3g',  kcal:'100 kcal', time:'3 min', ingredients:'½ melon (cantaloupe or honeydew) + handful fresh mint + juice of ½ lime',                             prep:'Slice melon, arrange on a plate with mint and a squeeze of lime.',                                                     tip:'One of the most hydrating night snacks — great if you sweat a lot during training' },
  { id:147, type:'night', name:'Steamed broccoli with parmesan',      protein:'10g', kcal:'160 kcal', time:'8 min', ingredients:'200g broccoli florets + 20g grated parmesan + olive oil + garlic + salt',                             prep:'Steam broccoli 5 min. Drizzle olive oil, rub with garlic, top with parmesan.',                                         tip:'Broccoli has more protein per calorie than most vegetables — often overlooked' },
  { id:148, type:'night', name:'Egg white & spinach scramble',        protein:'20g', kcal:'180 kcal', time:'5 min', ingredients:'5 egg whites + 2 handfuls spinach + olive oil + salt + pepper + pinch nutmeg',                        prep:'Sauté spinach 1 min. Add egg whites, scramble gently on low heat. Season.',                                            tip:'Pure protein, almost zero fat — the lightest high-protein night option on this list' },
  { id:149, type:'night', name:'Warm lemon & honey water',            protein:'0g',  kcal:'40 kcal',  time:'2 min', ingredients:'300ml warm water + juice of ½ lemon + 1 tbsp honey',                                                  prep:'Mix in a mug. Drink warm before bed.',                                                                                 tip:'The lightest possible night option — great if dinner was already high in calories' },
  { id:150, type:'night', name:'Oat & cinnamon cookies (x2)',         protein:'6g',  kcal:'290 kcal', time:'15 min',ingredients:'100g oats + 1 banana + 1 tbsp peanut butter + 1 tsp cinnamon + pinch salt + chocolate chips',         prep:'Mash banana, mix all together. Form 8 small cookies on baking sheet. Bake 180°C 12 min.',                              tip:'Make a full batch and freeze — grab 2 per night all week' },

  // ── BREAKFAST extra 20 (151–170) ────────────────────────────────────────────
  { id:151, type:'breakfast', name:'Smashed avocado & 2 eggs on toast',   protein:'18g', kcal:'460 kcal', time:'8 min',  ingredients:'2 eggs + 1 avocado + 2 slices sourdough + lemon + chili flakes + salt',                              prep:'Toast bread. Mash avocado with lemon. Fry eggs to preference. Pile on toast.',                                         tip:'Add red chili flakes — capsaicin boosts metabolism first thing in the morning' },
  { id:152, type:'breakfast', name:'Bircher muesli',                       protein:'14g', kcal:'390 kcal', time:'5 min',  ingredients:'60g oats + 150ml apple juice + 150ml yogurt + 1 apple (grated) + 30g raisins + 20g walnuts',        prep:'Mix oats, apple juice and yogurt. Refrigerate overnight. Stir in grated apple and toppings in the morning.',           tip:'Swiss original recipe — more complex carbs than regular overnight oats' },
  { id:153, type:'breakfast', name:'Egg white omelette with herbs',        protein:'22g', kcal:'280 kcal', time:'8 min',  ingredients:'5 egg whites + fresh herbs (chives, parsley) + salt + pepper + olive oil + 30g feta',               prep:'Whisk egg whites with salt. Cook in olive oil on medium until set. Add feta and herbs, fold.',                          tip:'Egg whites have zero cholesterol — ideal if you eat eggs every single day' },
  { id:154, type:'breakfast', name:'High-protein oat pancakes',            protein:'20g', kcal:'470 kcal', time:'12 min', ingredients:'80g oats (blended to flour) + 2 eggs + 200ml milk + 1 tsp baking powder + pinch salt + honey',       prep:'Blend oats. Mix all ingredients into batter. Cook small pancakes 2 min per side.',                                     tip:'Blending oats into flour gives a fluffier texture than whole oats' },
  { id:155, type:'breakfast', name:'Soft boiled egg & toast soldiers',     protein:'14g', kcal:'340 kcal', time:'8 min',  ingredients:'2 eggs + 2 slices whole grain bread + butter + pinch salt',                                         prep:'Boil eggs exactly 6 min for runny yolk. Toast and butter bread. Cut into strips for dipping.',                         tip:'6 minutes is the sweet spot — set white, liquid gold yolk' },
  { id:156, type:'breakfast', name:'Egg & mushroom savory toast',          protein:'22g', kcal:'380 kcal', time:'10 min', ingredients:'2 eggs + 200g mushrooms + 2 slices toast + garlic + olive oil + thyme + salt',                     prep:'Sauté mushrooms and garlic in oil 5 min. Scramble eggs in. Pile on toast.',                                            tip:'Mushrooms add umami depth — makes a plain egg toast feel like a restaurant meal' },
  { id:157, type:'breakfast', name:'Banana cocoa overnight oats',          protein:'14g', kcal:'430 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 1 banana + 1 tbsp cocoa powder + 1 tbsp honey + pinch cinnamon',           prep:'Mix all in a jar. Stir well so cocoa dissolves. Refrigerate overnight.',                                               tip:'Tastes like chocolate pudding — the easiest way to eat oats if you dislike the plain taste' },
  { id:158, type:'breakfast', name:'Egg & melted cheese sandwich',         protein:'26g', kcal:'490 kcal', time:'8 min',  ingredients:'3 eggs + 2 thick bread slices + 40g cheddar + butter + salt + pepper',                             prep:'Scramble eggs. Toast bread, melt cheese on one slice. Fill with eggs.',                                                tip:'Use day-old bread — it toasts crispier and holds more filling' },
  { id:159, type:'breakfast', name:'Apple & cinnamon porridge',            protein:'10g', kcal:'380 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 1 apple (grated) + 1 tsp cinnamon + 1 tbsp brown sugar + 20g walnuts',    prep:'Cook oats and milk 4 min. Stir in grated apple, cinnamon, sugar. Top with walnuts.',                                  tip:'Grating the apple into hot oats makes it melt in — much better than chunks on top' },
  { id:160, type:'breakfast', name:'Walnut & date oatmeal',                protein:'12g', kcal:'420 kcal', time:'7 min',  ingredients:'60g oats + 300ml milk + 4 dates (chopped) + 25g walnuts + 1 tsp honey + pinch vanilla',            prep:'Cook oats in milk. Stir in dates. Top with walnuts and honey.',                                                        tip:'Dates dissolve into warm oats, adding natural sweetness without any added sugar' },
  { id:161, type:'breakfast', name:'Turmeric & black pepper scrambled eggs',protein:'22g',kcal:'370 kcal', time:'8 min',  ingredients:'3 eggs + ½ tsp turmeric + pinch black pepper + olive oil + salt + 2 slices toast',                  prep:'Whisk eggs with turmeric and pepper. Scramble slowly in olive oil. Serve on toast.',                                   tip:'Black pepper makes turmeric 20x more bioavailable — never use one without the other' },
  { id:162, type:'breakfast', name:'Poached egg on white bean toast',      protein:'22g', kcal:'460 kcal', time:'10 min', ingredients:'2 eggs + 2 slices toast + ½ tin white beans + garlic + olive oil + paprika + lemon',               prep:'Warm beans with garlic and paprika. Mash slightly on toast. Poach eggs 3 min, place on top.',                          tip:'White beans add 8g extra protein and serious fiber to a classic eggs on toast' },
  { id:163, type:'breakfast', name:'Egg & halloumi skillet',               protein:'26g', kcal:'520 kcal', time:'12 min', ingredients:'2 eggs + 80g halloumi (sliced) + cherry tomatoes + olive oil + oregano + black pepper',             prep:'Pan-fry halloumi 2 min per side. Push to edge of pan. Crack eggs in. Cook until set.',                                 tip:'Halloumi does not melt — it holds its shape and gets golden and squeaky' },
  { id:164, type:'breakfast', name:'Tuna & boiled egg open sandwich',      protein:'30g', kcal:'440 kcal', time:'5 min',  ingredients:'1 tin tuna + 2 boiled eggs + mustard + mayo (1 tsp) + 2 slices whole grain bread + lettuce',        prep:'Mash tuna with mustard and mayo. Slice eggs. Build open sandwich.',                                                    tip:'Highest protein breakfast sandwich on the list at 30g per serving' },
  { id:165, type:'breakfast', name:'Egg & sweet potato hash',              protein:'24g', kcal:'470 kcal', time:'15 min', ingredients:'3 eggs + 1 sweet potato (cubed) + onion + bell pepper + olive oil + paprika + salt',               prep:'Microwave sweet potato 4 min. Pan-fry with onion and pepper 5 min. Crack in eggs, cook until set.',                    tip:'Sweet potato gives slow-releasing carbs — perfect for long training sessions' },
  { id:166, type:'breakfast', name:'Berry & chia seed overnight oats',     protein:'12g', kcal:'410 kcal', time:'5 min',  ingredients:'60g oats + 250ml milk + 100g mixed berries + 2 tbsp chia seeds + 1 tbsp honey',                    prep:'Mix oats, milk and chia in a jar. Add berries, drizzle honey. Refrigerate overnight.',                                tip:'Chia seeds expand overnight and turn the oats into a thick, pudding-like texture' },
  { id:167, type:'breakfast', name:'Egg & feta scramble',                  protein:'24g', kcal:'390 kcal', time:'8 min',  ingredients:'3 eggs + 50g feta + handful cherry tomatoes + olive oil + oregano + black pepper',                  prep:'Scramble eggs with tomatoes in olive oil. Crumble feta in at the end. Season.',                                        tip:'Add feta at the end off heat — it warms without fully melting and stays creamy' },
  { id:168, type:'breakfast', name:'Sardine & tomato toast',               protein:'28g', kcal:'420 kcal', time:'5 min',  ingredients:'1 tin sardines + 2 slices sourdough + 2 ripe tomatoes + olive oil + basil + salt',                  prep:'Toast bread. Rub with tomato halves. Top with sardines, drizzle oil, add basil.',                                      tip:'Rubbing raw tomato on bread is the Spanish pan con tomate technique — better than slicing' },
  { id:169, type:'breakfast', name:'Warm rice congee with egg',            protein:'14g', kcal:'360 kcal', time:'15 min', ingredients:'80g white rice + 600ml water or stock + 2 eggs + ginger + soy sauce + sesame oil + spring onion',  prep:'Simmer rice in stock 12 min until thick. Crack eggs in, stir. Season with soy, sesame, ginger.',                      tip:'Asian comfort food — extremely easy to digest, great after a rough night\'s sleep' },
  { id:170, type:'breakfast', name:'Full egg & veggie power bowl',         protein:'28g', kcal:'420 kcal', time:'12 min', ingredients:'3 eggs + cherry tomatoes + ½ avocado + spinach + 2 slices toast + olive oil + salt',               prep:'Pan-fry eggs. Assemble bowl with wilted spinach, tomatoes, avocado. Serve with toast.',                                tip:'Everything in one bowl — 28g protein without touching any supplements' },

  // ── MAIN extra 20 (171–190) ─────────────────────────────────────────────────
  { id:171, type:'main', name:'Tuna & white bean salad',              protein:'40g', kcal:'580 kcal', time:'5 min',  ingredients:'2 tins tuna + 1 tin white beans + red onion + olive oil + lemon + parsley + salt',                       prep:'Drain tuna and beans. Toss with sliced onion, olive oil, lemon and parsley.',                                          tip:'Zero cooking needed — one of the fastest 40g protein meals you can make' },
  { id:172, type:'main', name:'Red lentil dal with rice',             protein:'28g', kcal:'620 kcal', time:'20 min', ingredients:'200g red lentils + 200g rice + 1 tin tomatoes + onion + garlic + cumin + turmeric + coconut milk',      prep:'Fry onion and spices. Add lentils, tomatoes, coconut milk, 400ml water. Simmer 15 min. Serve over rice.',              tip:'Red lentils dissolve into the sauce — no soaking needed, ready in under 20 min' },
  { id:173, type:'main', name:'Sardine & tomato pasta',               protein:'38g', kcal:'660 kcal', time:'12 min', ingredients:'200g pasta + 2 tins sardines + 400g crushed tomatoes + garlic + chili + olive oil + basil',             prep:'Cook pasta. Fry garlic and chili 1 min. Add tomatoes, simmer 5 min. Flake in sardines. Toss with pasta.',              tip:'Sardines break down into the sauce completely — skeptics love this dish' },
  { id:174, type:'main', name:'Tuna stuffed bell peppers',            protein:'36g', kcal:'520 kcal', time:'15 min', ingredients:'2 bell peppers + 2 tins tuna + 100g cooked rice + corn + tomato + olive oil + herbs',                  prep:'Halve peppers. Mix tuna, rice, corn, tomato. Fill peppers. Bake 200°C 12 min.',                                        tip:'Works cold as meal prep — great lunch straight from the fridge the next day' },
  { id:175, type:'main', name:'Black bean & egg power bowl',          protein:'30g', kcal:'590 kcal', time:'10 min', ingredients:'1 tin black beans + 2 eggs + 200g rice + salsa + avocado + lime + cumin + oil',                        prep:'Warm beans with cumin. Fry eggs. Assemble bowl with rice, beans, eggs, avocado, salsa.',                               tip:'Black beans have the highest fiber of all legumes — best for long-term fullness' },
  { id:176, type:'main', name:'Tuna & corn quesadilla',               protein:'34g', kcal:'580 kcal', time:'10 min', ingredients:'2 flour tortillas + 1 tin tuna + 50g cheese + corn + tomato + jalapeño + oil',                        prep:'Fill one tortilla with tuna, cheese, corn. Top with second tortilla. Pan-fry 2 min per side.',                         tip:'Press down firmly while cooking to seal the edges and get even crispiness' },
  { id:177, type:'main', name:'Chickpea patties with yogurt sauce',   protein:'22g', kcal:'500 kcal', time:'15 min', ingredients:'1 tin chickpeas + 1 egg + garlic + cumin + parsley + breadcrumbs + oil + 100g yogurt + lemon',         prep:'Mash chickpeas, mix in egg, garlic, cumin, parsley, breadcrumbs. Form patties. Pan-fry 3 min per side. Serve with yogurt.',  tip:'Chill the mix 10 min before frying so the patties hold their shape' },
  { id:178, type:'main', name:'Pasta aglio e olio with tuna',         protein:'40g', kcal:'680 kcal', time:'12 min', ingredients:'200g pasta + 2 tins tuna + 4 garlic cloves + olive oil + chili flakes + parsley + pepper',            prep:'Cook pasta. Fry sliced garlic in oil until golden. Toss pasta, tuna, chili and parsley together.',                     tip:'Reserve a cup of pasta water before draining — add a splash to loosen the sauce' },
  { id:179, type:'main', name:'Chickpea & spinach stew',              protein:'24g', kcal:'540 kcal', time:'20 min', ingredients:'2 tins chickpeas + 200g spinach + 1 tin tomatoes + onion + garlic + smoked paprika + olive oil + lemon', prep:'Fry onion and garlic. Add paprika, tomatoes, chickpeas. Simmer 12 min. Stir in spinach until wilted.',                 tip:'A squeeze of lemon at the end lifts the whole dish — do not skip it' },
  { id:180, type:'main', name:'Egg & bean taco bowl',                 protein:'30g', kcal:'600 kcal', time:'12 min', ingredients:'3 eggs + 1 tin kidney beans + 200g rice + tomato + avocado + sour cream + cumin + chili powder',       prep:'Scramble eggs with cumin and chili. Warm beans. Assemble bowl with rice, beans, eggs, tomato, avocado.',               tip:'Deconstructed taco in a bowl — all the flavors, none of the shell mess' },
  { id:181, type:'main', name:'Sardine & avocado open sandwich',      protein:'34g', kcal:'560 kcal', time:'8 min',  ingredients:'2 slices sourdough + 2 tins sardines + 1 avocado + lemon + capers + chili + olive oil',               prep:'Toast bread. Mash avocado with lemon. Top with sardines, capers and chili.',                                            tip:'Best served open-face so you taste every layer — the capers are the key' },
  { id:182, type:'main', name:'Tuna niçoise bowl',                    protein:'38g', kcal:'540 kcal', time:'10 min', ingredients:'2 tins tuna + 2 boiled eggs + green beans + cherry tomatoes + olives + olive oil + lemon + mustard',   prep:'Blanch beans 3 min. Arrange all components in a bowl. Whisk oil, lemon and mustard for dressing.',                     tip:'Classic French salad — elegant but incredibly simple to put together' },
  { id:183, type:'main', name:'Egg drop soup with noodles',           protein:'18g', kcal:'380 kcal', time:'10 min', ingredients:'3 eggs + 100g noodles + 1L chicken or vegetable stock + soy sauce + sesame oil + spring onion + ginger', prep:'Bring stock to boil with ginger. Add noodles, cook 3 min. Slowly drizzle beaten eggs while stirring. Season.',         tip:'Pour the egg in a very thin stream while stirring — that creates the silky ribbons' },
  { id:184, type:'main', name:'Loaded baked potato with tuna',        protein:'36g', kcal:'600 kcal', time:'15 min', ingredients:'1 large potato + 2 tins tuna + 2 tbsp Greek yogurt + chives + lemon + salt + pepper',                 prep:'Microwave potato 8 min until soft. Split open. Mix tuna with yogurt and lemon. Fill potato.',                          tip:'Microwave instead of oven baking saves 45 minutes with identical results' },
  { id:185, type:'main', name:'Tuna melt panini',                     protein:'36g', kcal:'580 kcal', time:'8 min',  ingredients:'1 baguette or ciabatta + 2 tins tuna + 40g cheese + tomato + mustard + olive oil',                    prep:'Mix tuna with mustard. Fill bread with tuna, cheese, tomato. Press and toast in a pan until golden.',                  tip:'A heavy pan pressed on top works as a panini press if you do not have one' },
  { id:186, type:'main', name:'Sardine puttanesca pasta',             protein:'36g', kcal:'640 kcal', time:'15 min', ingredients:'200g pasta + 2 tins sardines + olives + capers + crushed tomatoes + garlic + chili + olive oil',       prep:'Fry garlic and chili. Add tomatoes, olives, capers. Simmer 8 min. Flake in sardines. Toss with pasta.',                tip:'Puttanesca sauce is bold and briny — the sardines are completely at home in it' },
  { id:187, type:'main', name:'Lentil & sweet potato soup',           protein:'22g', kcal:'480 kcal', time:'20 min', ingredients:'200g red lentils + 1 sweet potato (cubed) + 1 tin tomatoes + onion + cumin + coriander + olive oil',   prep:'Fry onion and spices. Add sweet potato, lentils, tomatoes, 600ml water. Simmer 15 min. Blend half.',                  tip:'Blend only half the soup — it gives a thick base while keeping some chunky texture' },
  { id:188, type:'main', name:'Bean burrito bowl',                    protein:'26g', kcal:'580 kcal', time:'10 min', ingredients:'200g rice + 1 tin mixed beans + corn + salsa + avocado + lime + cumin + coriander',                   prep:'Warm beans with cumin. Cook rice. Assemble bowl with all toppings. Squeeze lime over everything.',                     tip:'Add a fried egg on top to push protein to 32g' },
  { id:189, type:'main', name:'Tuna & quinoa power bowl',             protein:'40g', kcal:'580 kcal', time:'10 min', ingredients:'180g cooked quinoa + 2 tins tuna + cucumber + cherry tomatoes + lemon + olive oil + parsley',         prep:'Cook quinoa 15 min. Mix tuna with lemon and oil. Assemble bowl with all ingredients.',                                 tip:'Quinoa is a complete protein — combined with tuna this is one of the most protein-dense meals' },
  { id:190, type:'main', name:'Egg & vegetable stir fry rice',        protein:'24g', kcal:'480 kcal', time:'12 min', ingredients:'3 eggs + 200g cooked rice + bell pepper + carrot + onion + soy sauce + sesame oil + garlic',          prep:'Stir fry veggies 4 min. Push to side, scramble eggs. Add cold rice and soy sauce. Toss everything.',                  tip:'Cold leftover rice is essential — fresh warm rice turns mushy when fried' },

  // ── SNACK extra 20 (191–210) ────────────────────────────────────────────────
  { id:191, type:'snack', name:'Edamame with sea salt',               protein:'12g', kcal:'180 kcal', time:'5 min',  ingredients:'200g frozen edamame + sea salt + optional chili flakes',                                               prep:'Microwave edamame 3 min or boil 5 min. Drain and sprinkle with salt.',                                                 tip:'One of the cheapest high-protein plant snacks — buy frozen in bulk' },
  { id:192, type:'snack', name:'Celery & peanut butter boats',        protein:'7g',  kcal:'200 kcal', time:'2 min',  ingredients:'4 celery sticks + 2 tbsp peanut butter + optional raisins',                                           prep:'Fill celery grooves with peanut butter. Add raisins on top for extra sweetness.',                                      tip:'Celery is 95% water — you stay hydrated while snacking' },
  { id:193, type:'snack', name:'Aged cheese & grain crackers',        protein:'14g', kcal:'280 kcal', time:'2 min',  ingredients:'40g aged cheddar or gouda + 6 whole grain crackers + optional pickles or grapes',                    prep:'Slice cheese, arrange on crackers with your choice of accompaniment.',                                                 tip:'Aged cheese has more protein per gram than young or fresh cheese varieties' },
  { id:194, type:'snack', name:'Date & nut energy balls',             protein:'8g',  kcal:'310 kcal', time:'10 min', ingredients:'8 Medjool dates + 60g mixed nuts + 1 tbsp cocoa + 1 tbsp peanut butter + pinch salt',                prep:'Blend dates and nuts. Add cocoa and PB. Roll into balls. Refrigerate 20 min.',                                         tip:'Freeze half the batch — they taste like chocolate truffles straight from the freezer' },
  { id:195, type:'snack', name:'Cucumber & hummus bites',             protein:'6g',  kcal:'160 kcal', time:'5 min',  ingredients:'1 large cucumber + 4 tbsp hummus + paprika + olive oil',                                             prep:'Slice cucumber into thick rounds. Top each with hummus and a dusting of paprika.',                                     tip:'Lowest calorie snack on the rotation — great for evenings when calories are tight' },
  { id:196, type:'snack', name:'Popcorn with nutritional yeast',      protein:'6g',  kcal:'190 kcal', time:'5 min',  ingredients:'30g popping corn + 1 tbsp olive oil + 2 tbsp nutritional yeast + salt',                             prep:'Pop corn in a lidded pan with oil. Toss with nutritional yeast and salt.',                                             tip:'Nutritional yeast gives a cheesy flavor plus B vitamins rare in plant foods' },
  { id:197, type:'snack', name:'Sunflower seeds & raisins',           protein:'8g',  kcal:'270 kcal', time:'1 min',  ingredients:'30g sunflower seeds + 30g raisins',                                                                  prep:'Mix and eat.',                                                                                                        tip:'Sunflower seeds are rich in vitamin E and magnesium — great for workout recovery' },
  { id:198, type:'snack', name:'Pistachios & dried apricots',         protein:'8g',  kcal:'300 kcal', time:'1 min',  ingredients:'30g pistachios + 6 dried apricots',                                                                  prep:'Grab and eat. No prep needed.',                                                                                       tip:'Pistachios are the most protein-dense nut by volume — best value per handful' },
  { id:199, type:'snack', name:'Avocado & salt rice cake',            protein:'4g',  kcal:'240 kcal', time:'3 min',  ingredients:'3 rice cakes + ½ avocado + lemon juice + sea salt + chili flakes',                                  prep:'Mash avocado with lemon. Spread on rice cakes. Season with salt and chili.',                                          tip:'Eat immediately — avocado oxidizes fast once mashed' },
  { id:200, type:'snack', name:'Mini baked egg cups',                 protein:'18g', kcal:'200 kcal', time:'15 min', ingredients:'4 eggs + salt + pepper + dried herbs + optional cheese or diced vegetables',                        prep:'Oil a muffin tin. Crack one egg per cup, season. Bake 180°C 12 min until just set.',                                  tip:'Batch bake 6 every Sunday — eat cold, no reheating needed all week' },
  { id:201, type:'snack', name:'Yogurt with hemp seeds',              protein:'18g', kcal:'260 kcal', time:'2 min',  ingredients:'200g plain yogurt + 2 tbsp hemp seeds + 1 tsp honey',                                               prep:'Mix hemp seeds into yogurt, drizzle honey.',                                                                          tip:'Hemp seeds have the ideal omega-3 to omega-6 ratio of any seed' },
  { id:202, type:'snack', name:'Pear & almond butter',                protein:'5g',  kcal:'250 kcal', time:'2 min',  ingredients:'1 ripe pear + 2 tbsp almond butter',                                                                prep:'Slice pear, dip in almond butter.',                                                                                   tip:'Pears are gentler on digestion than apples — good for sensitive stomachs' },
  { id:203, type:'snack', name:'Crispy roasted chickpeas',            protein:'10g', kcal:'220 kcal', time:'30 min', ingredients:'1 tin chickpeas + 1 tbsp olive oil + paprika + cumin + salt + garlic powder',                       prep:'Pat chickpeas completely dry. Toss with oil and spices. Roast 200°C 25 min until crunchy.',                            tip:'They must be bone-dry before roasting — any moisture makes them go soft' },
  { id:204, type:'snack', name:'Banana oat energy bites',             protein:'8g',  kcal:'320 kcal', time:'10 min', ingredients:'2 bananas + 100g oats + 2 tbsp peanut butter + 1 tbsp honey + dark chocolate chips',               prep:'Mash bananas, mix in oats, PB, honey, chips. Roll into balls. Refrigerate 15 min.',                                   tip:'No oven needed — bananas and oats bind together naturally when chilled' },
  { id:205, type:'snack', name:'Mozzarella & tomato skewers',         protein:'10g', kcal:'180 kcal', time:'4 min',  ingredients:'100g fresh mozzarella + 10 cherry tomatoes + basil leaves + olive oil + salt + balsamic',           prep:'Thread mozzarella, tomato and basil alternately on small skewers. Drizzle oil and balsamic.',                          tip:'Mini caprese on a stick — easiest impressive snack you can serve to anyone' },
  { id:206, type:'snack', name:'Tuna on crackers',                    protein:'22g', kcal:'220 kcal', time:'3 min',  ingredients:'1 tin tuna + 6 whole grain crackers + 1 tsp mustard + lemon + pepper',                              prep:'Mix tuna with mustard and lemon. Spoon onto crackers.',                                                                tip:'22g protein for under 220 calories — one of the best protein-to-calorie ratios' },
  { id:207, type:'snack', name:'Banana & tahini drizzle',             protein:'8g',  kcal:'290 kcal', time:'2 min',  ingredients:'1 banana + 1 tbsp tahini + pinch sesame seeds',                                                    prep:'Slice banana, drizzle tahini over, sprinkle sesame seeds.',                                                            tip:'Tahini adds calcium and tryptophan — better sleep aid than plain peanut butter' },
  { id:208, type:'snack', name:'Smoked salmon roll-ups',              protein:'18g', kcal:'160 kcal', time:'3 min',  ingredients:'80g smoked salmon + 2 tbsp cream cheese + cucumber strips + lemon + dill',                         prep:'Spread cream cheese on salmon slices. Place cucumber strip at edge. Roll tight.',                                      tip:'Highest protein-to-calorie ratio snack on the list at 18g for only 160 kcal' },
  { id:209, type:'snack', name:'Cottage cheese & pineapple',          protein:'18g', kcal:'220 kcal', time:'2 min',  ingredients:'200g cottage cheese + 100g pineapple chunks + 1 tsp honey',                                        prep:'Spoon cottage cheese into bowl. Top with pineapple and honey.',                                                        tip:'Pineapple bromelain helps digest the protein from cottage cheese — clever combo' },
  { id:210, type:'snack', name:'Boiled egg & sriracha',               protein:'12g', kcal:'200 kcal', time:'10 min', ingredients:'2 boiled eggs + sriracha sauce + pinch salt + optional sesame seeds',                              prep:'Boil eggs 8 min. Halve them. Add a few drops of sriracha on each yolk.',                                               tip:'Spice increases metabolism temporarily — good pre-workout snack variation' },

  // ── SMOOTHIE extra 20 (211–230) ─────────────────────────────────────────────
  { id:211, type:'smoothie', name:'Pineapple coconut recovery shake',  protein:'6g',  kcal:'290 kcal', time:'3 min', ingredients:'200g frozen pineapple + 300ml coconut milk + 1 banana + 1cm ginger + pinch turmeric',                prep:'Blend all until smooth.',                                                                                             tip:'Pineapple bromelain is proven to reduce post-workout muscle soreness' },
  { id:212, type:'smoothie', name:'Blueberry almond milk shake',       protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'150g frozen blueberries + 300ml almond milk + 40g oats + 1 tbsp almond butter + 1 tsp honey',       prep:'Blend everything until smooth.',                                                                                     tip:'Blueberries have the highest antioxidant count of any common fruit' },
  { id:213, type:'smoothie', name:'Kale apple detox blend',            protein:'4g',  kcal:'160 kcal', time:'3 min', ingredients:'2 kale leaves + 2 apples + ½ lemon (juiced) + 1cm ginger + 300ml cold water + ice',               prep:'Blend kale with water first. Add remaining ingredients and blend again.',                                              tip:'Always blend leafy greens with liquid first to fully break them down' },
  { id:214, type:'smoothie', name:'Peach & oat smoothie',              protein:'14g', kcal:'350 kcal', time:'3 min', ingredients:'200g frozen peaches + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey + pinch vanilla',    prep:'Blend all until creamy.',                                                                                             tip:'Frozen peaches give a sorbet-like texture far better than fresh for smoothies' },
  { id:215, type:'smoothie', name:'Espresso banana energy shake',      protein:'16g', kcal:'420 kcal', time:'3 min', ingredients:'2 bananas + 1 shot espresso (cooled) + 300ml milk + 40g oats + 1 tbsp peanut butter',              prep:'Cool espresso first then blend everything together.',                                                                 tip:'Caffeine plus complex oat carbs is the best pre-morning-workout combination' },
  { id:216, type:'smoothie', name:'Fig & honey smoothie',              protein:'10g', kcal:'380 kcal', time:'3 min', ingredients:'4 figs (fresh or dried soaked) + 200g Greek yogurt + 200ml milk + 1 tbsp honey + pinch cinnamon',  prep:'Blend all until smooth.',                                                                                             tip:'Figs are rich in calcium and iron — rare nutrients in most smoothies' },
  { id:217, type:'smoothie', name:'Papaya ginger tropical blend',      protein:'5g',  kcal:'200 kcal', time:'3 min', ingredients:'300g papaya + 1 banana + 1cm ginger + juice of 1 lime + 200ml coconut water',                     prep:'Blend all until smooth.',                                                                                             tip:'Papaya enzymes help digest protein — great post-meal or post-workout' },
  { id:218, type:'smoothie', name:'Cherry banana anti-inflammatory',   protein:'8g',  kcal:'300 kcal', time:'3 min', ingredients:'150g frozen tart cherries + 1 banana + 200ml milk + 1 tbsp cocoa + ½ tsp cinnamon',               prep:'Blend all until smooth.',                                                                                             tip:'Tart cherry is one of the most studied foods for reducing exercise inflammation' },
  { id:219, type:'smoothie', name:'Tahini date power shake',           protein:'14g', kcal:'450 kcal', time:'3 min', ingredients:'5 Medjool dates + 2 tbsp tahini + 400ml milk + 1 banana + pinch cardamom + cinnamon',              prep:'Soak dates 5 min in warm water then blend everything until smooth.',                                                  tip:'Tahini is 25% protein — richer and nuttier than peanut butter in shakes' },
  { id:220, type:'smoothie', name:'Blackberry yogurt blend',           protein:'16g', kcal:'340 kcal', time:'3 min', ingredients:'150g frozen blackberries + 200g plain yogurt + 200ml milk + 1 banana + 1 tsp honey',               prep:'Blend all until smooth.',                                                                                             tip:'Blackberries have 3x more vitamin C than oranges by weight' },
  { id:221, type:'smoothie', name:'Orange carrot immunity boost',      protein:'5g',  kcal:'190 kcal', time:'3 min', ingredients:'3 oranges (juiced) + 2 carrots + 1 banana + 1cm turmeric + 200ml water',                         prep:'Juice or blend all. Strain for a cleaner drink.',                                                                    tip:'Vitamin C from oranges boosts iron absorption from carrots — smart pairing' },
  { id:222, type:'smoothie', name:'Lemon ginger zing shot',            protein:'3g',  kcal:'100 kcal', time:'3 min', ingredients:'2 lemons (juiced) + 2cm ginger + 1 tsp honey + 1 tsp apple cider vinegar + 200ml water',          prep:'Blend or shake all together. Drink immediately.',                                                                    tip:'Drink this before breakfast on an empty stomach to kick-start digestion' },
  { id:223, type:'smoothie', name:'Pumpkin spice protein shake',       protein:'12g', kcal:'380 kcal', time:'4 min', ingredients:'3 tbsp pumpkin puree + 300ml milk + 1 banana + 40g oats + 1 tsp pumpkin spice + 1 tsp honey',     prep:'Blend all until smooth and creamy.',                                                                                  tip:'Pumpkin is high in beta-carotene and potassium — great for endurance recovery' },
  { id:224, type:'smoothie', name:'Melon lime cooler',                 protein:'3g',  kcal:'130 kcal', time:'3 min', ingredients:'400g melon + juice of 1 lime + handful mint + 200ml cold water + ice',                           prep:'Blend everything. Serve immediately over ice.',                                                                      tip:'One of the most hydrating smoothies — perfect before or after cardio in heat' },
  { id:225, type:'smoothie', name:'Matcha banana latte shake',         protein:'8g',  kcal:'280 kcal', time:'3 min', ingredients:'1 tsp matcha powder + 2 bananas + 300ml milk + 1 tbsp honey + pinch vanilla',                     prep:'Dissolve matcha in a splash of hot water first. Add remaining ingredients, blend cold.',                               tip:'Matcha provides sustained caffeine without the espresso jitter spike' },
  { id:226, type:'smoothie', name:'Raspberry & oat shake',             protein:'14g', kcal:'340 kcal', time:'3 min', ingredients:'150g frozen raspberries + 200g plain yogurt + 40g oats + 200ml milk + 1 tsp honey',               prep:'Blend all until smooth.',                                                                                             tip:'Raspberries have the highest fiber content of any common berry' },
  { id:227, type:'smoothie', name:'Avocado & cocoa smoothie',          protein:'10g', kcal:'400 kcal', time:'3 min', ingredients:'1 ripe avocado + 1 tbsp cocoa powder + 400ml milk + 1 banana + 1 tsp honey',                     prep:'Blend all until completely smooth and creamy.',                                                                      tip:'Avocado fat carries the cocoa flavor beautifully — richer than any chocolate milk' },
  { id:228, type:'smoothie', name:'Chocolate peanut mass shake',       protein:'26g', kcal:'580 kcal', time:'3 min', ingredients:'2 bananas + 3 tbsp peanut butter + 1 tbsp cocoa + 400ml whole milk + 50g oats + 1 tsp honey',    prep:'Blend all until smooth. Drink immediately.',                                                                         tip:'Best calorie-surplus shake — 580 kcal and 26g protein with zero supplements' },
  { id:229, type:'smoothie', name:'Banana & spirulina power blend',    protein:'14g', kcal:'330 kcal', time:'3 min', ingredients:'2 bananas + 1 tsp spirulina + 300ml milk + 40g oats + 1 tbsp honey',                            prep:'Blend all. Spirulina turns it vivid green — normal and harmless.',                                                    tip:'Spirulina has the highest protein density of any plant food by weight' },
  { id:230, type:'smoothie', name:'Strawberry & chia smoothie',        protein:'10g', kcal:'280 kcal', time:'3 min', ingredients:'150g frozen strawberries + 200g plain yogurt + 2 tbsp chia seeds + 200ml milk + 1 tsp honey',    prep:'Blend all. Let stand 2 min so chia starts to thicken slightly.',                                                     tip:'Chia adds omega-3 and fiber — turns an ordinary smoothie into a functional meal' },

  // ── NIGHT extra 20 (231–250) ────────────────────────────────────────────────
  { id:231, type:'night', name:'Warm chamomile & honey tea',           protein:'2g',  kcal:'80 kcal',  time:'3 min', ingredients:'1 chamomile tea bag + 300ml hot water + 1 tbsp honey + 1 slice lemon',                             prep:'Brew tea 4 min. Stir in honey and lemon. Sip slowly before bed.',                                                    tip:'Chamomile apigenin binds the same receptors as mild sedatives — genuinely effective' },
  { id:232, type:'night', name:'Almond butter & banana toast',         protein:'10g', kcal:'320 kcal', time:'3 min', ingredients:'2 slices whole grain bread + 2 tbsp almond butter + ½ banana (sliced)',                          prep:'Toast bread, spread almond butter, top with banana slices.',                                                          tip:'Almond butter has more magnesium than PB — magnesium is critical for sleep quality' },
  { id:233, type:'night', name:'Cottage cheese & chives bowl',         protein:'20g', kcal:'160 kcal', time:'2 min', ingredients:'250g cottage cheese + 1 tbsp chives + pinch salt + pepper + drizzle olive oil',                  prep:'Season cottage cheese with chives, salt, pepper and a tiny drizzle of oil.',                                         tip:'Pure casein with almost no carbs — ideal night protein when cutting calories' },
  { id:234, type:'night', name:'Tuna & cucumber bites',                protein:'22g', kcal:'180 kcal', time:'5 min', ingredients:'1 tin tuna + 1 cucumber + 1 tbsp Greek yogurt + lemon + dill + salt',                           prep:'Mix tuna with yogurt, lemon and dill. Slice cucumber into rounds. Spoon mix onto each.',                              tip:'Prep the tuna mix the night before — even better after sitting in the fridge' },
  { id:235, type:'night', name:'Warm banana cinnamon mash',            protein:'4g',  kcal:'200 kcal', time:'3 min', ingredients:'1 banana + pinch cinnamon + 1 tsp honey + 1 tbsp crushed walnuts',                              prep:'Mash banana with a fork. Warm 20 sec in microwave. Top with cinnamon, honey and walnuts.',                           tip:'Warm banana releases more tryptophan than cold — genuinely helps sleep' },
  { id:236, type:'night', name:'Kefir & honey glass',                  protein:'8g',  kcal:'170 kcal', time:'1 min', ingredients:'250ml plain kefir + 1 tsp honey',                                                               prep:'Pour kefir into a glass. Stir in honey. Drink slowly.',                                                              tip:'Kefir has more probiotic strains than yogurt — best for overnight gut repair' },
  { id:237, type:'night', name:'Dark chocolate & almonds',             protein:'6g',  kcal:'270 kcal', time:'1 min', ingredients:'20g dark chocolate (70%+) + 20g almonds',                                                       prep:'No prep. Eat slowly and mindfully.',                                                                                 tip:'Eating slowly makes this portion genuinely satisfying — do not rush it' },
  { id:238, type:'night', name:'Tahini & honey crispbread',            protein:'8g',  kcal:'260 kcal', time:'2 min', ingredients:'3 rye crispbreads + 1 tbsp tahini + 1 tsp honey + pinch sesame seeds',                         prep:'Spread tahini on crispbreads, drizzle honey, sprinkle sesame seeds.',                                                tip:'Tahini tryptophan converts to serotonin and then melatonin — genuine sleep food' },
  { id:239, type:'night', name:'Light blended tomato soup',            protein:'6g',  kcal:'180 kcal', time:'8 min', ingredients:'400g crushed tomatoes + 1 garlic clove + 1 tbsp olive oil + basil + salt + pepper',             prep:'Heat garlic in oil 1 min. Add tomatoes, season, simmer 5 min. Blend smooth.',                                        tip:'Warm liquids before bed promote physical and mental relaxation' },
  { id:240, type:'night', name:'Ricotta & berry toast',                protein:'12g', kcal:'310 kcal', time:'4 min', ingredients:'2 slices whole grain toast + 80g ricotta + 100g mixed berries + 1 tsp honey',                  prep:'Toast bread, spread ricotta, top with berries and a honey drizzle.',                                                 tip:'Ricotta casein digests slowly overnight — better than cream cheese for muscle repair' },
  { id:241, type:'night', name:'Melon & mint plate',                   protein:'3g',  kcal:'100 kcal', time:'3 min', ingredients:'½ melon (cantaloupe or honeydew) + handful fresh mint + juice of ½ lime',                      prep:'Slice melon, arrange on plate with mint and lime squeeze.',                                                          tip:'One of the most hydrating night snacks — great after heavy cardio training days' },
  { id:242, type:'night', name:'Steamed broccoli with parmesan',       protein:'10g', kcal:'160 kcal', time:'8 min', ingredients:'200g broccoli florets + 20g grated parmesan + olive oil + garlic + salt',                      prep:'Steam broccoli 5 min. Drizzle oil, rub with garlic, top with parmesan.',                                             tip:'Broccoli has more protein per calorie than almost any vegetable' },
  { id:243, type:'night', name:'Egg white & spinach scramble',         protein:'20g', kcal:'180 kcal', time:'5 min', ingredients:'5 egg whites + 2 handfuls spinach + olive oil + salt + pepper + pinch nutmeg',                  prep:'Sauté spinach 1 min. Add egg whites, scramble gently on low heat until just set.',                                   tip:'Zero fat, almost zero carbs, 20g protein — the purest night protein option' },
  { id:244, type:'night', name:'Warm lemon honey water',               protein:'0g',  kcal:'40 kcal',  time:'2 min', ingredients:'300ml warm water + juice of ½ lemon + 1 tbsp honey',                                           prep:'Mix in a mug. Drink warm before bed.',                                                                               tip:'Perfect when dinner was heavy and you need something that feels like a snack' },
  { id:245, type:'night', name:'Oat milk cinnamon latte',              protein:'6g',  kcal:'160 kcal', time:'5 min', ingredients:'300ml oat milk + ½ tsp cinnamon + 1 tsp honey + pinch cardamom + pinch nutmeg',                prep:'Warm oat milk gently. Stir in all spices and honey. Froth if you like.',                                             tip:'Blend of spices all support sleep — cinnamon, cardamom and nutmeg together' },
  { id:246, type:'night', name:'Warm ginger lemon shot',               protein:'0g',  kcal:'30 kcal',  time:'3 min', ingredients:'300ml warm water + 2cm ginger (grated) + juice of 1 lemon + 1 tsp honey',                     prep:'Steep grated ginger in warm water 3 min. Add lemon and honey. Strain and drink.',                                    tip:'Anti-inflammatory before sleep — especially good on heavy training days' },
  { id:247, type:'night', name:'Greek yogurt & pistachio bowl',        protein:'18g', kcal:'310 kcal', time:'2 min', ingredients:'200g Greek yogurt + 25g pistachios + 1 tsp honey + pinch cinnamon',                            prep:'Spoon yogurt into a bowl, top with crushed pistachios, honey and cinnamon.',                                         tip:'Pistachios contain melatonin — one of very few foods that directly supplies it' },
  { id:248, type:'night', name:'Egg salad on rye crackers',            protein:'16g', kcal:'240 kcal', time:'5 min', ingredients:'2 boiled eggs + 1 tsp mayo + 1 tsp mustard + chives + 4 rye crackers + salt + pepper',         prep:'Mash boiled eggs with mayo, mustard, chives. Season. Spoon onto crackers.',                                          tip:'Batch make egg salad on Sunday — keeps 3 days refrigerated in a sealed jar' },
  { id:249, type:'night', name:'Warm peanut butter milk',              protein:'12g', kcal:'280 kcal', time:'4 min', ingredients:'300ml whole milk + 1 tbsp peanut butter + 1 tsp honey + pinch cinnamon',                      prep:'Warm milk until steaming. Blend in peanut butter, honey and cinnamon.',                                              tip:'PB fat slows milk protein absorption — slow sustained release through the night' },
  { id:250, type:'night', name:'Cherry & walnut bowl',                 protein:'6g',  kcal:'250 kcal', time:'2 min', ingredients:'150g fresh or frozen cherries + 25g walnuts + 1 tsp honey',                                   prep:'Thaw cherries if frozen. Serve in a bowl with walnuts and honey.',                                                   tip:'Cherries are one of few natural food sources of melatonin — backed by sleep research' },
]


const MEAL_FILTERS = ['ALL', 'breakfast', 'main', 'snack', 'smoothie', 'night']
const RECIPE_CATS = ['ALL', 'breakfast', 'lunch', 'dinner', 'snack']
const catColor: Record<string, string> = { breakfast: '#d97706', lunch: '#2d6a4f', dinner: '#6b4226', snack: '#40916c' }
const empty = { title: '', description: '', ingredients: '', instructions: '', prepTime: '', cookTime: '', servings: '', category: 'lunch' }

export default function FoodPage() {
  const { t } = useLang()
  const TYPE_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
    breakfast: { label: t.typeBreakfast, emoji: '☀️', color: '#d97706', bg: '#fef3c7' },
    main:      { label: t.typeMain,      emoji: '🍽️', color: '#2d6a4f', bg: '#d8f3dc' },
    snack:     { label: t.typeSnack,     emoji: '🍎', color: '#6b4226', bg: '#f0e8d8' },
    smoothie:  { label: t.typeSmoothie,  emoji: '🥤', color: '#40916c', bg: '#d8f3dc' },
    night:     { label: t.typeNight,     emoji: '🌙', color: '#1a3a1a', bg: '#e8dcc8' },
  }

  const [tab, setTab] = useState<'rotation' | 'recipes' | 'week'>('rotation')

  const [mealFilter, setMealFilter] = useState('ALL')
  const [mealDetail, setMealDetail] = useState<Meal | null>(null)
  const [selecting, setSelecting] = useState(false)
  const [selectedMeals, setSelectedMeals] = useState<Set<number>>(new Set())
  const [groceryModal, setGroceryModal] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [hiddenMeals, setHiddenMeals] = useState<Set<number>>(new Set())
  const [favoriteMeals, setFavoriteMeals] = useState<Set<number>>(new Set())
  const [weekPlan, setWeekPlan] = useState<Set<number>>(new Set())
  const [weekGroceryModal, setWeekGroceryModal] = useState(false)
  const [weekChecked, setWeekChecked] = useState<Set<number>>(new Set())

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeFilter, setRecipeFilter] = useState('ALL')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [detail, setDetail] = useState<Recipe | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiIngredients, setAiIngredients] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/food').then(r => r.json()).then(setRecipes)
  useEffect(() => {
    load()
    try {
      setHiddenMeals(new Set(JSON.parse(localStorage.getItem('hiddenMeals') || '[]')))
      setFavoriteMeals(new Set(JSON.parse(localStorage.getItem('favoriteMeals') || '[]')))
      setWeekPlan(new Set(JSON.parse(localStorage.getItem('weekPlan') || '[]')))
    } catch {}
  }, [])

  const visibleMeals = useMemo(() => MEALS.filter(m => !hiddenMeals.has(m.id)), [hiddenMeals])

  const filteredMeals = useMemo(() => {
    if (mealFilter === 'favs') return visibleMeals.filter(m => favoriteMeals.has(m.id))
    if (mealFilter === 'ALL') return visibleMeals
    return visibleMeals.filter(m => m.type === mealFilter)
  }, [mealFilter, visibleMeals, favoriteMeals])
  const filteredRecipes = recipeFilter === 'ALL' ? recipes : recipes.filter(r => r.category === recipeFilter)

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (r: Recipe) => {
    setForm({ title: r.title, description: r.description, ingredients: JSON.parse(r.ingredients).join('\n'), instructions: r.instructions, prepTime: String(r.prepTime), cookTime: String(r.cookTime), servings: String(r.servings), category: r.category })
    setEditing(r.id); setModal(true)
  }
  const save = async () => {
    setSaving(true)
    const payload = { ...form, ingredients: form.ingredients.split('\n').filter(Boolean) }
    await fetch(editing ? `/api/food/${editing}` : '/api/food', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await load(); setModal(false); setSaving(false)
  }
  const del = async (id: number) => {
    if (!confirm(t.deleteRecipe)) return
    await fetch(`/api/food/${id}`, { method: 'DELETE' }); await load()
    if (detail?.id === id) setDetail(null)
  }
  const generateAI = async () => {
    if (!aiIngredients.trim()) return
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'recipe', data: { ingredients: aiIngredients } }) })
      const data = await r.json()
      setForm({ title: data.title || '', description: data.description || '', ingredients: (data.ingredients || []).join('\n'), instructions: data.instructions || '', prepTime: String(data.prepTime || ''), cookTime: String(data.cookTime || ''), servings: String(data.servings || ''), category: data.category || 'lunch' })
      setEditing(null); setModal(true)
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  const deleteMeal = (id: number) => {
    const next = new Set(hiddenMeals); next.add(id)
    setHiddenMeals(next); localStorage.setItem('hiddenMeals', JSON.stringify([...next]))
    setMealDetail(null)
  }

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(favoriteMeals)
    if (next.has(id)) next.delete(id); else next.add(id)
    setFavoriteMeals(next); localStorage.setItem('favoriteMeals', JSON.stringify([...next]))
  }

  const mealCountByType = (type: string) => visibleMeals.filter(m => m.type === type).length

  const toggleMealSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedMeals(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const groceryItems = useMemo(() => {
    const raw: string[] = []
    MEALS.filter(m => selectedMeals.has(m.id)).forEach(m => {
      m.ingredients.split(' + ').forEach(i => raw.push(i.trim()))
    })
    return raw.sort((a, b) => a.localeCompare(b))
  }, [selectedMeals])

  const openGrocery = () => { setCheckedItems(new Set()); setGroceryModal(true) }
  const toggleCheck = (i: number) => setCheckedItems(prev => {
    const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next
  })
  const exitSelect = () => { setSelecting(false); setSelectedMeals(new Set()) }

  const saveToWeek = () => {
    const next = new Set([...weekPlan, ...selectedMeals])
    setWeekPlan(next)
    localStorage.setItem('weekPlan', JSON.stringify([...next]))
    exitSelect()
  }
  const removeFromWeek = (id: number) => {
    const next = new Set(weekPlan); next.delete(id)
    setWeekPlan(next)
    localStorage.setItem('weekPlan', JSON.stringify([...next]))
  }
  const clearWeekPlan = () => {
    setWeekPlan(new Set())
    localStorage.removeItem('weekPlan')
  }

  const weekMeals = useMemo(() => MEALS.filter(m => weekPlan.has(m.id)), [weekPlan])
  const weekGroceryItems = useMemo(() => {
    const raw: string[] = []
    weekMeals.forEach(m => m.ingredients.split(' + ').forEach(i => raw.push(i.trim())))
    return raw.sort((a, b) => a.localeCompare(b))
  }, [weekMeals])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a1a' }}>🥗 {t.foodPlan}</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#8b5e3c' }}>
            {tab === 'rotation' ? t.mealsSubtitle(MEALS.length) : tab === 'week' ? t.weekSubtitle(weekPlan.size) : t.recipesSubtitle(recipes.length)}
          </p>
        </div>
        {tab === 'recipes' && (
          <button onClick={openAdd} className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium">{t.addRecipe}</button>
        )}
      </div>

      {/* Main tabs */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'rotation', label: t.mealRotation }, { key: 'week', label: t.weekTab }, { key: 'recipes', label: t.myRecipes }].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key as 'rotation' | 'recipes' | 'week')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all relative"
            style={{ backgroundColor: tab === tb.key ? '#2d6a4f' : '#f0e8d8', color: tab === tb.key ? '#fff' : '#6b4226' }}>
            {tb.label}
            {tb.key === 'week' && weekPlan.size > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                style={{ backgroundColor: '#c0303e', fontSize: '9px' }}>{weekPlan.size}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── MEAL ROTATION ── */}
      {tab === 'rotation' && (
        <>
          {/* Category filter + select button */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
              {MEAL_FILTERS.map(f => {
                const meta = TYPE_META[f]
                const active = mealFilter === f
                const count = f === 'ALL' ? visibleMeals.length : mealCountByType(f)
                return (
                  <button key={f} onClick={() => setMealFilter(f)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                    style={{ backgroundColor: active ? (meta?.color ?? '#1a3a1a') : '#f0e8d8', color: active ? '#fff' : '#6b4226' }}>
                    {meta ? `${meta.emoji} ${meta.label}` : 'ALL'}
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                )
              })}
              {/* Favorites filter */}
              <button onClick={() => setMealFilter(mealFilter === 'favs' ? 'ALL' : 'favs')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{ backgroundColor: mealFilter === 'favs' ? '#c0303e' : '#fde8ec', color: mealFilter === 'favs' ? '#fff' : '#c0303e' }}>
                ❤️ Favs
                <span className="text-xs opacity-75">({favoriteMeals.size})</span>
              </button>
            </div>
            <button
              onClick={() => selecting ? exitSelect() : setSelecting(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
              style={selecting
                ? { backgroundColor: '#2d6a4f', color: '#fff', borderColor: '#2d6a4f' }
                : { backgroundColor: '#fff', color: '#2d6a4f', borderColor: '#2d6a4f' }}>
              🛒 {selecting ? t.selectCancel : t.selectLabel}
            </button>
          </div>

          {/* Meal cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMeals.map(m => {
              const meta = TYPE_META[m.type]
              const isSelected = selectedMeals.has(m.id)
              return (
                <div key={m.id}
                  className="rounded-2xl border-2 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 relative"
                  style={{
                    backgroundColor: isSelected ? '#f0faf2' : '#fff',
                    borderColor: isSelected ? '#2d6a4f' : '#e8dcc8',
                    boxShadow: isSelected ? '0 0 0 1px #2d6a4f' : undefined,
                  }}
                  onClick={e => selecting ? toggleMealSelect(m.id, e) : setMealDetail(m)}>
                  {/* Fav button (always visible) / Checkbox (select mode) */}
                  <div className="absolute top-3 right-3">
                    {selecting ? (
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ backgroundColor: isSelected ? '#2d6a4f' : '#fff', borderColor: isSelected ? '#2d6a4f' : '#c4a882' }}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    ) : (
                      <button onClick={e => toggleFav(m.id, e)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                        style={{ backgroundColor: favoriteMeals.has(m.id) ? '#fde8ec' : '#f0e8d8' }}>
                        <span style={{ fontSize: 14 }}>{favoriteMeals.has(m.id) ? '❤️' : '🤍'}</span>
                      </button>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: meta.bg, color: meta.color }}>
                    {meta.emoji} {meta.label}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base leading-snug mb-3 pr-6" style={{ color: '#1a3a1a' }}>
                    {m.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#e8f4fd', color: '#1a56db' }}>
                      💪 {m.protein}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
                      🔥 {m.kcal}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                      ⏱ {m.time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── MY RECIPES ── */}
      {tab === 'recipes' && (
        <>
          <div className="rounded-2xl p-4 mb-4 border-2" style={{ backgroundColor: '#f9f5ef', borderColor: '#d4c5a9' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6b4226' }}>{t.aiGenerator}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={aiIngredients} onChange={e => setAiIngredients(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ borderColor: '#d4c5a9', backgroundColor: '#fff' }} />
              <button onClick={generateAI} disabled={aiLoading}
                className="btn-glass btn-glass-brown px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
                {aiLoading ? t.generating : t.generate}
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
            {RECIPE_CATS.map(c => (
              <button key={c} onClick={() => setRecipeFilter(c)}
                className="px-3 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all"
                style={{ backgroundColor: recipeFilter === c ? '#2d6a4f' : '#f0e8d8', color: recipeFilter === c ? '#fff' : '#6b4226' }}>
                {c}
              </button>
            ))}
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              <p className="text-4xl mb-2">🍽️</p>
              <p className="font-medium text-sm">{t.noRecipes}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRecipes.map(r => (
                <div key={r.id} className="rounded-2xl border-2 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }} onClick={() => setDetail(r)}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white capitalize" style={{ backgroundColor: catColor[r.category] || '#2d6a4f' }}>{r.category}</span>
                    <div className="flex gap-1">
                      <button onClick={e => { e.stopPropagation(); openEdit(r) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}>{t.edit}</button>
                      <button onClick={e => { e.stopPropagation(); del(r.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-base leading-snug mb-1" style={{ color: '#1a3a1a' }}>{r.title}</h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: '#8b5e3c' }}>{r.description}</p>
                  <div className="flex gap-3 text-xs" style={{ color: '#a07850' }}>
                    <span>⏱ {r.prepTime}m</span><span>🔥 {r.cookTime}m</span><span>👤 {r.servings}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── WEEK PLAN ── */}
      {tab === 'week' && (
        <>
          {weekMeals.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
              <p className="text-4xl mb-3">📅</p>
              <p className="font-medium text-sm px-4">{t.weekEmpty}</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => { setWeekChecked(new Set()); setWeekGroceryModal(true) }}
                  className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium">
                  {t.weekGrocery}
                </button>
                <button
                  onClick={clearWeekPlan}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>
                  {t.clearWeek}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {weekMeals.map(m => {
                  const meta = TYPE_META[m.type]
                  return (
                    <div key={m.id} className="rounded-2xl border-2 p-4 shadow-sm relative"
                      style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        {meta.emoji} {meta.label}
                      </span>
                      <h3 className="font-semibold text-sm leading-snug mb-3 pr-2" style={{ color: '#1a3a1a' }}>{m.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#e8f4fd', color: '#1a56db' }}>💪 {m.protein}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>🔥 {m.kcal}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>⏱ {m.time}</span>
                      </div>
                      <button
                        onClick={() => removeFromWeek(m.id)}
                        className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
                        {t.markDone}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Sticky grocery bar (selection mode) */}
      {selecting && (
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 px-4 py-3 border-t shadow-2xl"
          style={{ backgroundColor: '#1a3a1a', borderColor: '#2d6a4f' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="shrink-0">
              <p className="text-sm font-semibold" style={{ color: '#74c69d' }}>
                {selectedMeals.size === 0 ? t.tapMeals : t.mealsSelected(selectedMeals.size)}
              </p>
              {selectedMeals.size > 0 && (
                <p className="text-xs" style={{ color: '#52b788' }}>{t.ingredientsTotal(groceryItems.length)}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={openGrocery}
                disabled={selectedMeals.size === 0}
                className="px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 border"
                style={{ borderColor: '#40916c', color: '#74c69d', backgroundColor: 'transparent' }}>
                {t.viewGroceryList}
              </button>
              <button
                onClick={saveToWeek}
                disabled={selectedMeals.size === 0}
                className="btn-glass btn-glass-green px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40">
                {t.addToWeek}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grocery List Modal */}
      {groceryModal && (
        <Modal title={t.groceryModal(selectedMeals.size)} onClose={() => setGroceryModal(false)} wide>
          <p className="text-xs mb-4" style={{ color: '#a07850' }}>
            {t.groceryTip(groceryItems.length)}
          </p>
          <div className="space-y-1.5">
            {groceryItems.map((item, i) => {
              const checked = checkedItems.has(i)
              return (
                <button key={i} onClick={() => toggleCheck(i)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{ backgroundColor: checked ? '#f0e8d8' : '#f9f5ef' }}>
                  <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                    style={{ backgroundColor: checked ? '#2d6a4f' : '#fff', borderColor: checked ? '#2d6a4f' : '#c4a882' }}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm flex-1" style={{ color: checked ? '#a07850' : '#1a3a1a', textDecoration: checked ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#e8dcc8' }}>
            <p className="text-xs" style={{ color: '#a07850' }}>
              {t.itemsTicked(checkedItems.size, groceryItems.length)}
            </p>
            <button
              onClick={() => {
                const text = groceryItems.map((item, i) => `${checkedItems.has(i) ? '✓' : '○'} ${item}`).join('\n')
                navigator.clipboard.writeText(text).then(() => alert(t.copied))
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
              {t.copyList}
            </button>
          </div>
        </Modal>
      )}

      {/* Meal Detail Modal */}
      {mealDetail && (
        <Modal title={mealDetail.name} onClose={() => setMealDetail(null)} wide>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: TYPE_META[mealDetail.type].bg, color: TYPE_META[mealDetail.type].color }}>
              {TYPE_META[mealDetail.type].emoji} {TYPE_META[mealDetail.type].label}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#e8f4fd', color: '#1a56db' }}>💪 {mealDetail.protein}</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>🔥 {mealDetail.kcal}</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>⏱ {mealDetail.time}</span>
          </div>
          <h4 className="font-semibold text-sm mb-2" style={{ color: '#1a3a1a' }}>{t.ingredients}</h4>
          <div className="rounded-xl p-3 mb-4 text-sm" style={{ backgroundColor: '#f9f5ef', color: '#6b4226' }}>
            {mealDetail.ingredients}
          </div>
          <h4 className="font-semibold text-sm mb-2" style={{ color: '#1a3a1a' }}>{t.howToPrepare}</h4>
          <p className="text-sm mb-4" style={{ color: '#6b4226' }}>{mealDetail.prep}</p>
          <div className="rounded-xl p-3 flex gap-2 mb-5" style={{ backgroundColor: '#d8f3dc' }}>
            <span className="text-base">💡</span>
            <p className="text-sm font-medium" style={{ color: '#2d6a4f' }}>{mealDetail.tip}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={e => toggleFav(mealDetail.id, e)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: favoriteMeals.has(mealDetail.id) ? '#fde8ec' : '#f0e8d8', color: favoriteMeals.has(mealDetail.id) ? '#c0303e' : '#6b4226' }}>
              {favoriteMeals.has(mealDetail.id) ? t.savedToFavs : t.addToFavs}
            </button>
            <button onClick={() => deleteMeal(mealDetail.id)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>
              {t.removeMeal}
            </button>
          </div>
        </Modal>
      )}

      {/* Recipe Detail Modal */}
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)} wide>
          <p className="text-sm mb-3" style={{ color: '#8b5e3c' }}>{detail.description}</p>
          <div className="flex gap-4 text-sm mb-4" style={{ color: '#a07850' }}>
            <span>⏱ {detail.prepTime}m</span><span>🔥 {detail.cookTime}m</span><span>👤 {detail.servings} srv</span>
          </div>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: '#1a3a1a' }}>{t.ingredients}</h4>
          <ul className="space-y-1 mb-4">
            {JSON.parse(detail.ingredients).map((ing: string, i: number) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: '#6b4226' }}><span style={{ color: '#52b788' }}>•</span>{ing}</li>
            ))}
          </ul>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: '#1a3a1a' }}>{t.instructions}</h4>
          <p className="text-sm whitespace-pre-wrap" style={{ color: '#6b4226' }}>{detail.instructions}</p>
        </Modal>
      )}

      {/* Add / Edit Recipe Modal */}
      {modal && (
        <Modal title={editing ? t.editRecipe : t.newRecipe} onClose={() => setModal(false)} wide>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#6b4226' }}>{t.title}</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#6b4226' }}>{t.description}</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#6b4226' }}>{t.ingredientsLine}</label>
              <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#6b4226' }}>{t.instructions}</label>
              <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[{ label: t.prepMin, key: 'prepTime' }, { label: t.cookMin, key: 'cookTime' }, { label: t.servings, key: 'servings' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{label}</label>
                  <input type="number" value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{t.category}</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={save} disabled={saving} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.saveRecipe}
            </button>
          </div>
        </Modal>
      )}

      {/* Week Grocery Modal */}
      {weekGroceryModal && (
        <Modal title={t.weekGrocery} onClose={() => setWeekGroceryModal(false)} wide>
          <p className="text-xs mb-4" style={{ color: '#a07850' }}>
            {t.groceryTip(weekGroceryItems.length)}
          </p>
          <div className="space-y-1.5">
            {weekGroceryItems.map((item, i) => {
              const checked = weekChecked.has(i)
              return (
                <button key={i} onClick={() => setWeekChecked(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{ backgroundColor: checked ? '#f0e8d8' : '#f9f5ef' }}>
                  <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: checked ? '#2d6a4f' : '#fff', borderColor: checked ? '#2d6a4f' : '#c4a882' }}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm flex-1" style={{ color: checked ? '#a07850' : '#1a3a1a', textDecoration: checked ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#e8dcc8' }}>
            <p className="text-xs" style={{ color: '#a07850' }}>{t.itemsTicked(weekChecked.size, weekGroceryItems.length)}</p>
            <button
              onClick={() => {
                const text = weekGroceryItems.map((item, i) => `${weekChecked.has(i) ? '✓' : '○'} ${item}`).join('\n')
                navigator.clipboard.writeText(text).then(() => alert(t.copied))
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
              {t.copyList}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
