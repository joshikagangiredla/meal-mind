import { useState } from 'react';
import type { MealSlot } from '../types';
import { RECIPES, DAYS } from '../data/recipes';
import { PlusIco } from './icons';

/**
 * Bottom sheet for adding a recipe to a day/slot. When opened from a recipe's
 * "Add to Meal Plan" button, that recipe is pinned to the top of the list.
 */
export default function AddMealSheet({ day, slot, highlightId, onClose, onAdd }: {
  day: number; slot: MealSlot | null; highlightId?: string | null;
  onClose: () => void; onAdd: (recipeId: string, slot: MealSlot) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<MealSlot>(slot || 'Breakfast');
  const [query, setQuery] = useState('');
  const slots: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner'];

  const filtered = RECIPES
    .filter(r => !query || r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (a.id === highlightId ? -1 : b.id === highlightId ? 1 : 0));

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/40 animate-[fade_200ms_ease-out]" onClick={onClose} />
      <div className="relative w-full bg-cream rounded-t-[28px] max-h-[78%] flex flex-col shadow-2xl animate-[sheet_300ms_ease-out]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D9D3C8] rounded-full" />
        </div>
        <div className="px-6 pb-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[18px] font-bold text-[#1E1E1E]">Add to {DAYS[day]}</h2>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F0ECE5] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Slot chips */}
          <div className="flex gap-2 mb-4">
            {slots.map(s => (
              <button
                key={s}
                onClick={() => setActiveSlot(s)}
                className={`flex-1 py-2 rounded-full text-[12px] font-semibold transition-all ${activeSlot === s ? 'bg-[#4A5D3F] text-white' : 'bg-[#F0ECE5] text-[#6B6B6B]'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-[#F0ECE5] mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ACACAC" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="flex-1 text-[13px] placeholder-[#ACACAC] bg-transparent outline-none text-[#1E1E1E]"
              placeholder="Search recipes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Recipe list */}
        <div className="overflow-y-auto scrollbar-hide px-6 pb-8 flex-1">
          <p className="text-[11px] font-semibold text-[#6B6B6B] mb-3 uppercase tracking-wide">Suggested</p>
          {filtered.map(r => (
            <div key={r.id} className={`flex items-center gap-3 mb-3 bg-white rounded-2xl p-3 border ${r.id === highlightId ? 'border-olive' : 'border-[#F0ECE5]'}`}>
              <img loading="lazy" src={r.photo} alt={r.name} className="w-12 h-12 rounded-xl object-cover bg-gray-200 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1E1E1E] truncate">{r.name}</p>
                <p className="text-[11px] text-[#6B6B6B]">{r.time} · {r.cals}</p>
              </div>
              <button
                onClick={() => { onAdd(r.id, activeSlot); onClose(); }}
                className="flex-shrink-0 w-8 h-8 bg-[#4A5D3F] rounded-full flex items-center justify-center"
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
