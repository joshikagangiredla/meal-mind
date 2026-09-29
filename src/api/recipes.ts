import type { Category, Ingredient, Recipe } from '../types';

/**
 * Recipe service. Tries Spoonacular first (through our /api/recipes function,
 * which keeps the key private). If that fails for any reason — daily limit
 * reached (402), no key, running locally without the function — it falls back
 * to TheMealDB's free API so the app always shows recipes.
 */

export interface RecipeQuery {
  query?: string;
  category?: Category;
  number?: number;
}

export interface RecipeResult {
  recipes: Recipe[];
  source: 'spoonacular' | 'mealdb';
}

export async function loadRecipes(q: RecipeQuery = {}): Promise<RecipeResult> {
  try {
    return { recipes: await fromSpoonacular(q), source: 'spoonacular' };
  } catch (err) {
    console.info('[Meal Mind] Spoonacular unavailable, using TheMealDB:', (err as Error).message);
    return { recipes: await fromMealDB(q), source: 'mealdb' };
  }
}

// ── Spoonacular ─────────────────────────────────────────

async function fromSpoonacular({ query, category, number = 10 }: RecipeQuery): Promise<Recipe[]> {
  const params = new URLSearchParams({ number: String(number) });
  if (query) params.set('query', query);
  if (category) params.set(category.kind === 'type' ? 'type' : 'cuisine', category.value);

  const res = await fetch(`/api/recipes?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}${res.status === 402 ? ' (daily limit reached)' : ''}`);
  // When running `npm run dev` there is no function, and Vite answers with index.html.
  if (!res.headers.get('content-type')?.includes('application/json')) throw new Error('recipe function not available');

  const data = await res.json();
  if (!Array.isArray(data.results)) throw new Error('unexpected response');
  return data.results.map(normalizeSpoonacular);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeSpoonacular(r: any): Recipe {
  const cuisines: string[] = r.cuisines ?? [];
  const dishTypes: string[] = r.dishTypes ?? [];
  const calories = r.nutrition?.nutrients?.find((n: any) => n.name === 'Calories');

  const rawIngredients: any[] =
    r.extendedIngredients ??
    r.nutrition?.ingredients ??
    [...(r.usedIngredients ?? []), ...(r.missedIngredients ?? [])];

  const steps: string[] = (r.analyzedInstructions ?? [])
    .flatMap((block: any) => block.steps ?? [])
    .map((s: any) => String(s.step).trim())
    .filter(Boolean);

  return {
    id: `sp-${r.id}`,
    name: r.title,
    desc: firstSentences(stripHtml(r.summary ?? ''), 160),
    photo: r.image ?? '',
    time: r.readyInMinutes ? `${r.readyInMinutes} min` : null,
    cals: calories ? `${Math.round(calories.amount)} kcal` : null,
    servings: r.servings ?? null,
    cuisine: cuisines[0] ?? '',
    category: dishTypes[0] ?? '',
    tags: [...dishTypes, ...cuisines].map(t => t.toLowerCase()),
    ingredients: dedupeIngredients(rawIngredients.map(toIngredient)),
    steps,
    source: 'spoonacular',
    sourceUrl: r.sourceUrl,
  };
}

function toIngredient(i: any): Ingredient {
  const rawUnit = String(i.unit ?? '').trim();
  // Spoonacular uses "serving(s)" for garnishes like avocado; that isn't a real measurement.
  const isServing = /^servings?$/i.test(rawUnit);
  const amount = typeof i.amount === 'number' && !isServing ? formatAmount(i.amount) : '';
  const unit = isServing ? '' : shortUnit(rawUnit, i.amount);
  return { qty: [amount, unit].filter(Boolean).join(' '), name: capitalize(String(i.name ?? i.original ?? '').trim()) };
}

const UNIT_ALIASES: Record<string, string> = {
  tablespoon: 'tbsp', tablespoons: 'tbsp', tbsp: 'tbsp', tbsps: 'tbsp', tbs: 'tbsp', t: 'tbsp',
  teaspoon: 'tsp', teaspoons: 'tsp', tsp: 'tsp', tsps: 'tsp',
  ounce: 'oz', ounces: 'oz', oz: 'oz',
  pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb',
  gram: 'g', grams: 'g', g: 'g', kilogram: 'kg', kilograms: 'kg', kg: 'kg',
  milliliter: 'ml', milliliters: 'ml', ml: 'ml', liter: 'l', liters: 'l', l: 'l',
  cup: 'cup', cups: 'cup', c: 'cup',
  quart: 'qt', quarts: 'qt', pint: 'pt', pints: 'pt',
  'fluid ounce': 'fl oz', 'fluid ounces': 'fl oz', 'fl. oz': 'fl oz',
};

/** "Tablespoons" → "tbsp", "cups" → "cups"/"cup"; leaves words like "cloves" or "large" alone. */
function shortUnit(unit: string, amount: unknown) {
  if (!unit) return '';
  const short = UNIT_ALIASES[unit.toLowerCase()];
  if (!short) return unit.toLowerCase();
  return short === 'cup' && typeof amount === 'number' && amount > 1 ? 'cups' : short;
}

// ── TheMealDB (fallback) ────────────────────────────────

const MEALDB = 'https://www.themealdb.com/api/json/v1/1';

async function fromMealDB({ query, category, number = 10 }: RecipeQuery): Promise<Recipe[]> {
  let meals: any[] = [];

  if (query) {
    meals = (await getJson(`${MEALDB}/search.php?s=${encodeURIComponent(query)}`)).meals ?? [];
  } else if (category?.mealdb) {
    const { c, a } = category.mealdb;
    const url = c ? `${MEALDB}/filter.php?c=${encodeURIComponent(c)}` : `${MEALDB}/filter.php?a=${encodeURIComponent(a!)}`;
    // filter.php only returns id/name/photo, so look up full details for a random handful.
    const list: any[] = (await getJson(url)).meals ?? [];
    const picks = shuffle(list).slice(0, number);
    meals = (await Promise.all(picks.map(m => lookupMealDB(m.idMeal)))).filter(Boolean);
  } else if (category) {
    meals = (await getJson(`${MEALDB}/search.php?s=${encodeURIComponent(category.value)}`)).meals ?? [];
  } else {
    // random.php returns one meal per call.
    const results = await Promise.all(Array.from({ length: number + 2 }, () => getJson(`${MEALDB}/random.php`).catch(() => null)));
    meals = results.flatMap(r => r?.meals ?? []);
  }

  const seen = new Set<string>();
  return meals
    .filter(m => !seen.has(m.idMeal) && seen.add(m.idMeal))
    .slice(0, number)
    .map(normalizeMealDB);
}

async function lookupMealDB(id: string) {
  const data = await getJson(`${MEALDB}/lookup.php?i=${id}`).catch(() => null);
  return data?.meals?.[0] ?? null;
}

function normalizeMealDB(m: any): Recipe {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = m[`strIngredient${i}`]?.trim();
    if (name) ingredients.push({ qty: m[`strMeasure${i}`]?.trim() ?? '', name });
  }
  const steps = String(m.strInstructions ?? '')
    .split(/\r?\n+/)
    .map(s => s.replace(/^\s*(step\s*)?\d+[.):]?\s*/i, '').trim())
    .filter(s => s.length > 2);

  return {
    id: `mdb-${m.idMeal}`,
    name: m.strMeal,
    desc: firstSentences(steps.join(' '), 140),
    photo: m.strMealThumb ?? '',
    time: null,
    cals: null,
    servings: null,
    cuisine: m.strArea && m.strArea !== 'Unknown' ? m.strArea : '',
    category: m.strCategory ?? '',
    tags: [m.strCategory, m.strArea].filter(Boolean).map((t: string) => t.toLowerCase()),
    ingredients,
    steps,
    source: 'mealdb',
    sourceUrl: m.strSource || undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Helpers ─────────────────────────────────────────────

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function stripHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}

function firstSentences(text: string, max: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = cut.lastIndexOf('. ');
  return end > 40 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

function formatAmount(n: number) {
  if (Number.isInteger(n)) return String(n);
  const fractions: [number, string][] = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾']];
  const whole = Math.floor(n);
  const frac = fractions.find(([v]) => Math.abs(n - whole - v) < 0.04);
  if (frac) return `${whole || ''}${frac[1]}`;
  return String(Math.round(n * 100) / 100);
}

function dedupeIngredients(list: Ingredient[]) {
  const seen = new Set<string>();
  return list.filter(i => i.name && !seen.has(i.name.toLowerCase()) && seen.add(i.name.toLowerCase()));
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** "30 min · 520 kcal", or "Italian · Pasta" when time/calories aren't available. */
export function recipeMeta(r: Recipe) {
  const parts = r.time || r.cals ? [r.time, r.cals] : [r.cuisine, capitalize(r.category)];
  return parts.filter(Boolean).join(' · ');
}

export function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
