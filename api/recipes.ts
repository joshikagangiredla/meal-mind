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

  try {
    const res = await fetch(`${BASE}?${upstream}`, { headers: { 'x-api-key': key } } /* key sent both ways; Spoonacular accepts either */);
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
