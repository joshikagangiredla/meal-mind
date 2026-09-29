import type { GroceryItem } from '../types';
import { CheckIco, GroceryBagIco } from './icons';

/** Bottom sheet showing the saved grocery list, opened from the bag icon in the Planner. */
export default function GroceryListSheet({ items, weekLabel, onToggle, onClearChecked, onClearAll, onClose }: {
  items: GroceryItem[];
  weekLabel: string | null;
  onToggle: (key: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  const done = items.filter(i => i.checked).length;
  // Unchecked first, then checked, each alphabetical.
  const sorted = [...items].sort((a, b) => Number(a.checked) - Number(b.checked) || a.name.localeCompare(b.name));

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/40 animate-[fade_200ms_ease-out]" onClick={onClose} />
      <div className="relative w-full bg-cream rounded-t-[28px] h-[85%] flex flex-col shadow-2xl animate-[sheet_300ms_ease-out]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D9D3C8] rounded-full" />
        </div>

        <div className="px-6 pb-3 flex items-start gap-3">
          <GroceryBagIco size={34} />
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-bold text-ink leading-tight">Grocery List</h2>
            <p className="text-[12px] text-muted mt-0.5">
              {items.length
                ? `${done} of ${items.length} items${weekLabel ? ` · ${weekLabel}` : ''}`
                : 'Nothing here yet'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-full bg-line flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {items.length > 0 && (
          <div className="px-6 pb-2">
            <div className="h-1.5 rounded-full bg-line overflow-hidden">
              <div className="h-full bg-olive transition-all duration-300" style={{ width: `${(done / items.length) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="overflow-y-auto scrollbar-hide px-6 pb-4 flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-14">
              <div className="w-16 h-16 bg-line rounded-full flex items-center justify-center mb-4">
                <GroceryBagIco size={34} />
              </div>
              <p className="text-[15px] font-bold text-ink">Your grocery list is empty</p>
              <p className="text-[13px] text-muted mt-1 max-w-[240px]">
                Plan some meals for the week, then tap <span className="font-semibold text-ink">Generate Grocery List</span>.
              </p>
            </div>
          ) : (
            sorted.map(item => (
              <button
                key={item.key}
                onClick={() => onToggle(item.key)}
                className="w-full flex items-center gap-3 py-3 border-b border-line last:border-0 text-left"
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-olive border-olive' : 'border-[#D1CCC6]'}`}>
                  {item.checked && <CheckIco />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[14px] text-ink ${item.checked ? 'line-through opacity-50' : ''}`}>{item.name}</span>
                  <span className="block text-[11px] text-muted truncate">For {item.recipes.join(', ')}</span>
                </span>
                {item.qty && (
                  <span className={`text-[12px] text-muted whitespace-nowrap flex-shrink-0 ${item.checked ? 'opacity-50' : ''}`}>{item.qty}</span>
                )}
              </button>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 pt-3 pb-8 flex gap-3 border-t border-line">
            <button
              onClick={onClearChecked}
              disabled={done === 0}
              className="flex-1 py-3 rounded-full border-2 border-olive text-olive text-[13px] font-bold disabled:opacity-40"
            >
              Remove checked
            </button>
            <button onClick={onClearAll} className="flex-1 py-3 rounded-full bg-line text-muted text-[13px] font-bold">
              Clear list
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
