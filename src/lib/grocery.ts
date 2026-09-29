import type { GroceryItem, Recipe } from '../types';

/**
 * Combine the ingredients of several recipes into one grocery list.
 * Same ingredient + same unit → amounts are added ("1 cup" + "½ cup" = "1½ cups").
 * Different units stay on one line, joined with "+". Ticks from the previous
 * list are kept for items that are still on it.
 */
export function buildGroceryList(recipes: Recipe[], previous: GroceryItem[] = []): GroceryItem[] {
  const wasChecked = new Map(previous.map(i => [i.name.toLowerCase(), i.checked]));
  const byName = new Map<string, { name: string; parts: Map<string, { amount: number | null; text: string }[]>; recipes: Set<string> }>();

  for (const r of recipes) {
    for (const ing of r.ingredients) {
      const name = ing.name.trim();
      if (!name) continue;
      const nameKey = name.toLowerCase();
      if (!byName.has(nameKey)) byName.set(nameKey, { name, parts: new Map(), recipes: new Set() });
      const entry = byName.get(nameKey)!;
      entry.recipes.add(r.name);
      const unitKey = (ing.unit ?? '').toLowerCase();
      const list = entry.parts.get(unitKey) ?? [];
      list.push({ amount: typeof ing.amount === 'number' ? ing.amount : null, text: ing.qty });
      entry.parts.set(unitKey, list);
    }
  }

  const items: GroceryItem[] = [];
  for (const [nameKey, entry] of byName) {
    const qtyParts: string[] = [];
    for (const [unit, parts] of entry.parts) {
      if (parts.every(p => p.amount !== null)) {
        const total = parts.reduce((sum, p) => sum + (p.amount as number), 0);
        qtyParts.push([formatAmount(total), pluralUnit(unit, total)].filter(Boolean).join(' '));
      } else {
        // Free-text measures (e.g. TheMealDB's "to taste"): list them as written.
        qtyParts.push(...[...new Set(parts.map(p => p.text).filter(Boolean))]);
      }
    }
    items.push({
      key: nameKey,
      name: entry.name,
      qty: qtyParts.join(' + '),
      checked: wasChecked.get(nameKey) ?? false,
      recipes: [...entry.recipes],
    });
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function pluralUnit(unit: string, total: number) {
  if (unit === 'cup' && total > 1) return 'cups';
  if (unit === 'cups' && total <= 1) return 'cup';
  return unit;
}

export function formatAmount(n: number) {
  if (Number.isInteger(n)) return String(n);
  const fractions: [number, string][] = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾']];
  const whole = Math.floor(n);
  const frac = fractions.find(([v]) => Math.abs(n - whole - v) < 0.04);
  if (frac) return `${whole || ''}${frac[1]}`;
  return String(Math.round(n * 100) / 100);
}
