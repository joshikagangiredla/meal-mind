/**
 * Vercel serverless function: forwards recipe requests to Spoonacular so the
 * API key stays on the server (Spoonacular's terms require keeping it private).
 *
 * Set SPOONACULAR_API_KEY in Vercel → Project → Settings → Environment Variables.
 *
 *   GET /api/recipes?number=10                     random recipes
 *   GET /api/recipes?query=pasta&number=10         search
 *   GET /api/recipes?type=breakfast                meal type
 *   GET /api/recipes?cuisine=Korean                cuisine
 *   GET /api/recipes?ids=716429,715538            full details for specific recipes
 *
 * Responses are passed through unchanged (status included), so the app can
 * detect 402 "daily limit reached" and fall back to TheMealDB.
 */
const BASE = 'https://api.spoonacular.com/recipes/complexSearch';

export async function GET(request: Request): Promise<Response> {
  // Trim in case the key was pasted with spaces, a line break, or quotes.
  const key = process.env.SPOONACULAR_API_KEY?.trim().replace(/^["']|["']$/g, '');
  if (!key) return json({ error: 'SPOONACULAR_API_KEY is not set' }, 500);

  const params = new URL(request.url).searchParams;

  // Full details for specific recipes (used for saved/planned recipes after a refresh).
  const ids = params.get('ids');
  if (ids) {
    const clean = ids.split(',').map(s => s.trim()).filter(s => /^\d+$/.test(s)).slice(0, 20);
    if (!clean.length) return json({ error: 'No valid ids' }, 400);
    const q = new URLSearchParams({ apiKey: key, ids: clean.join(','), includeNutrition: 'true' });
    return forward(`https://api.spoonacular.com/recipes/informationBulk?${q}`, key);
  }
  const number = Math.min(Math.max(Number(params.get('number')) || 10, 1), 20);

  const upstream = new URLSearchParams({
    apiKey: key,
    number: String(number),
    addRecipeInformation: 'true',
    addRecipeInstructions: 'true',
    addRecipeNutrition: 'true',
    fillIngredients: 'true',
  });
  const query = params.get('query')?.trim();
  const type = params.get('type')?.trim();
  const cuisine = params.get('cuisine')?.trim();
  if (query) upstream.set('query', query.slice(0, 100));
  if (type) upstream.set('type', type.slice(0, 40));
  if (cuisine) upstream.set('cuisine', cuisine.slice(0, 40));
  // No search term → different recipes on every open.
  if (!query) upstream.set('sort', 'random');

  return forward(`${BASE}?${upstream}`, key);
}

async function forward(url: string, key: string) {
  try {
    const res = await fetch(url, { headers: { 'x-api-key': key } });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  } catch {
    return json({ error: 'Could not reach Spoonacular' }, 502);
  }
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
