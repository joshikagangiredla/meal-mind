import { Fragment, useState, type ReactNode } from 'react';
import { capitalize } from '../api/recipes';
import type { Recipe } from '../types';
import StatusBar from '../components/StatusBar';
import { BackIco, CheckIco, ClockIco, FlameIco, PersonsIco } from '../components/icons';

export default function RecipeDetailScreen({ recipe, onBack, saved, onToggleSave, onAddToPlan }: {
  recipe: Recipe; onBack: () => void; saved: boolean;
  onToggleSave: () => void; onAddToPlan: () => void;
}) {
  const [tab, setTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const stats: { icon: ReactNode; value: string; label: string }[] =
    recipe.source === 'spoonacular'
      ? [
          recipe.time && { icon: <ClockIco />, value: recipe.time, label: 'Cook time' },
          recipe.servings && { icon: <PersonsIco />, value: String(recipe.servings), label: 'Servings' },
          recipe.cals && { icon: <FlameIco />, value: recipe.cals.split(' ')[0], label: 'Calories' },
        ].filter(Boolean) as { icon: ReactNode; value: string; label: string }[]
      : [
          recipe.cuisine && { icon: <GlobeIco />, value: recipe.cuisine, label: 'Cuisine' },
          recipe.category && { icon: <TagIco />, value: capitalize(recipe.category), label: 'Category' },
          { icon: <ListIco />, value: String(recipe.ingredients.length), label: 'Ingredients' },
        ].filter(Boolean) as { icon: ReactNode; value: string; label: string }[];

  function toggleCheck(i: number) {
    setChecked(prev => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  }

  return (
    <div className="bg-[#FBF8F3] min-h-full">
      {/* Hero photo */}
      <div className="relative w-full h-[300px] bg-gray-300">
        {recipe.photo && <img src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0">
          <StatusBar dark />
        </div>
        <div className="absolute top-10 left-5">
          <button onClick={onBack} aria-label="Back" className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BackIco />
          </button>
        </div>
        <button
          onClick={onToggleSave}
          aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
          className="absolute top-10 right-5 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'white' : 'none'} stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pt-5 pb-4">
        <h1 className="text-[22px] font-bold text-[#1E1E1E] leading-tight">{recipe.name}</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-1.5 leading-relaxed">{recipe.desc}</p>

        {/* Stats: Spoonacular gives time/servings/calories; TheMealDB gives cuisine/category. */}
        {stats.length > 0 && (
          <div className="flex gap-4 mt-4 bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-line">
            {stats.map((st, i) => (
              <Fragment key={st.label}>
                {i > 0 && <div className="w-px bg-line" />}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-olive">{st.icon}</div>
                  <p className="text-[13px] font-bold text-ink mt-1 truncate max-w-full">{st.value}</p>
                  <p className="text-[10px] text-muted">{st.label}</p>
                </div>
              </Fragment>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 mt-5 bg-[#F0ECE5] rounded-full p-1">
          {(['ingredients', 'instructions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-[13px] font-semibold capitalize transition-all ${tab === t ? 'bg-white text-[#1E1E1E] shadow-sm' : 'text-[#6B6B6B]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'ingredients' ? (
          <div className="mt-3">
            {recipe.ingredients.map((ing, i) => {
              const done = checked.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="w-full flex items-center gap-3 py-2.5 border-b border-line last:border-0 text-left"
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-olive border-olive' : 'border-[#D1CCC6]'}`}>
                    {done && <CheckIco />}
                  </span>
                  <span className={`flex-1 min-w-0 text-[13px] text-ink leading-snug ${done ? 'line-through opacity-50' : ''}`}>{ing.name}</span>
                  {ing.qty && (
                    <span className={`flex-shrink-0 max-w-[45%] text-right text-[12px] font-medium text-muted whitespace-nowrap truncate ${done ? 'opacity-50' : ''}`}>
                      {ing.qty}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#4A5D3F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[11px] font-bold">{i + 1}</span>
                </div>
                <p className="text-[13px] text-[#1E1E1E] leading-relaxed flex-1 pt-1">{step}</p>
              </div>
            ))}
            {recipe.steps.length === 0 && (
              <p className="text-[13px] text-muted">
                No step-by-step instructions for this one.
                {recipe.sourceUrl && <> See the <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="underline text-olive">original recipe</a>.</>}
              </p>
            )}
          </div>
        )}
        {recipe.sourceUrl && recipe.steps.length > 0 && (
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="block mt-6 text-[12px] text-muted underline">
            View original recipe
          </a>
        )}
      </div>

      {/* Sticky add button (pinned to the phone frame, not the scroll area) */}
      <div className="sticky bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-cream via-cream/90 to-transparent">
        <button
          onClick={onAddToPlan}
          className="w-full bg-olive text-white text-[15px] font-bold py-4 rounded-full shadow-lg active:scale-[0.98] transition-transform"
        >
          Add to Meal Plan
        </button>
      </div>
    </div>
  );
}

function GlobeIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}
function TagIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" /><circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
function ListIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
