import { useState } from 'react';
import type { MealSlot, Recipe } from '../types';
import { DAYS } from '../data/constants';
import { loadRecipes, recipeMeta } from '../api/recipes';
import { PlusIco } from './icons';

/**
 * Bottom sheet for adding a recipe to a day/slot. Lists recipes already loaded
 * in the app (with the one you came from pinned first); searching loads more.
 */
export default function AddMealSheet({ day, slot, recipes, highlightId, onLoaded, onClose, onAdd }: {
  day: number; slot: MealSlot | null; recipes: Recipe[]; highlightId?: string | null;
  onLoaded: (recipes: Recipe[]) => void;
  onClose: () => void; onAdd: (recipeId: string, slot: MealSlot) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<MealSlot>(slot || 'Breakfast');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const slots: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner'];

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await loadRecipes({ query: q, number: 10 });
      setResults(res.recipes);
      onLoaded(res.recipes);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const list = (results ?? recipes)
    .slice()
    .sort((a, b) => (a.id === highlightId ? -1 : b.id === highlightId ? 1 : 0));

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/40 animate-[fade_200ms_ease-out]" onClick={onClose} />
      <div className="relative w-full bg-cream rounded-t-[28px] max-h-[78%] flex flex-col shadow-2xl animate-[sheet_300ms_ease-out]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D9D3C8] rounded-full" />
        </div>
        <div className="px-6 pb-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[18px] font-bold text-ink">Add to {DAYS[day]}</h2>
            <button onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-full bg-line flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            {slots.map(s => (
              <button
                key={s}
                onClick={() => setActiveSlot(s)}
                className={`flex-1 py-2 rounded-full text-[12px] font-semibold transition-all ${activeSlot === s ? 'bg-olive text-white' : 'bg-line text-muted'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={search} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-line mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ACACAC" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              enterKeyHint="search"
              className="flex-1 min-w-0 text-[13px] placeholder-[#ACACAC] bg-transparent outline-none text-ink"
              placeholder="Search recipes, then press Enter…"
              value={input}
              onChange={e => { setInput(e.target.value); if (!e.target.value) setResults(null); }}
            />
          </form>
        </div>
        <div className="overflow-y-auto scrollbar-hide px-6 pb-8 flex-1">
          <p className="text-[11px] font-semibold text-muted mb-3 uppercase tracking-wide">
            {loading ? 'Searching…' : results ? `${results.length} results` : 'Suggested'}
          </p>
          {!loading && list.length === 0 && <p className="text-[13px] text-muted">No recipes found. Try another search.</p>}
          {!loading && list.map(r => (
            <div key={r.id} className={`flex items-center gap-3 mb-3 bg-white rounded-2xl p-3 border ${r.id === highlightId ? 'border-olive' : 'border-line'}`}>
              {r.photo
                ? <img loading="lazy" src={r.photo} alt={r.name} className="w-12 h-12 rounded-xl object-cover bg-gray-200 flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-[#E5E0D8] flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ink truncate">{r.name}</p>
                <p className="text-[11px] text-muted truncate">{recipeMeta(r)}</p>
              </div>
              <button
                onClick={() => { onAdd(r.id, activeSlot); onClose(); }}
                aria-label={`Add ${r.name} to ${activeSlot}`}
                className="flex-shrink-0 w-8 h-8 bg-olive rounded-full flex items-center justify-center"
              >
                <PlusIco color="white" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
