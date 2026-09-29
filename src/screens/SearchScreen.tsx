import { useEffect, useState } from 'react';
import type { Category, Recipe } from '../types';
import { CATEGORIES, POPULAR_TAGS } from '../data/constants';
import { loadRecipes } from '../api/recipes';
import { StatusBarSpacer } from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { CardSkeleton, GridRecipeCard } from '../components/RecipeCards';

export default function SearchScreen({ initialCategory = null, onLoaded, onRecipe, savedIds, onToggleSave }: {
  initialCategory?: Category | null;
  onLoaded: (recipes: Recipe[]) => void;
  onRecipe: (id: string) => void; savedIds: Set<string>; onToggleSave: (id: string) => void;
}) {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [results, setResults] = useState<Recipe[]>([]);
  const [source, setSource] = useState<'spoonacular' | 'mealdb' | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const active = Boolean(query || category);

  useEffect(() => {
    if (!active) { setResults([]); setStatus('idle'); return; }
    let cancelled = false;
    setStatus('loading');
    loadRecipes({ query: query || undefined, category: category ?? undefined, number: 12 })
      .then(res => {
        if (cancelled) return;
        setResults(res.recipes);
        setSource(res.source);
        setStatus('done');
        onLoaded(res.recipes);
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
    // onLoaded is stable enough; re-run only when the search changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  function submit(text: string) {
    setInput(text);
    setCategory(null);
    setQuery(text.trim());
  }

  function pickCategory(c: Category) {
    const next = category?.label === c.label ? null : c;
    setCategory(next);
    setQuery('');
    setInput('');
  }

  return (
    <div className="bg-cream min-h-full">
      <StatusBarSpacer />
      <div className="px-6 pt-2 pb-32">
        <PageHeader title="Search" />

        <form className="flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); submit(input); }}>
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-line">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              enterKeyHint="search"
              className="flex-1 min-w-0 text-[14px] text-ink placeholder-[#ACACAC] bg-transparent outline-none"
              placeholder="Search recipes, ingredients…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <button type="submit" className="px-4 h-12 bg-olive text-white text-[13px] font-semibold rounded-2xl">
            Go
          </button>
        </form>

        {/* Meal types + cuisines */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 mb-5">
          {CATEGORIES.map(c => {
            const on = category?.label === c.label;
            return (
              <button
                key={c.label}
                onClick={() => pickCategory(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all ${on ? 'bg-olive text-white border-olive' : 'bg-white text-muted border-[#E5E0D8]'}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {!active && (
          <>
            <p className="text-[13px] font-semibold text-muted mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => submit(tag)}
                  className="px-3 py-1.5 bg-white rounded-full text-[12px] text-ink border border-[#E5E0D8] font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-muted">Search for a dish or pick a category to load recipes.</p>
          </>
        )}

        {active && (
          <>
            <p className="text-[13px] font-semibold text-muted mb-3">
              {status === 'loading' ? 'Loading…' : status === 'error' ? '' : `${results.length} results for “${query || category?.label}”`}
            </p>
            {status === 'error' && <p className="text-[13px] text-muted">Couldn't load recipes. Check your connection and try again.</p>}
            {status === 'done' && results.length === 0 && <p className="text-[13px] text-muted">No recipes found. Try another search.</p>}
            <div className="grid grid-cols-2 gap-4">
              {status === 'loading'
                ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} variant="grid" />)
                : results.map(r => (
                    <GridRecipeCard
                      key={r.id} recipe={r}
                      onPress={() => onRecipe(r.id)}
                      saved={savedIds.has(r.id)}
                      onToggleSave={() => onToggleSave(r.id)}
                    />
                  ))}
            </div>
            {status === 'done' && <SourceNote source={source} />}
          </>
        )}
      </div>
    </div>
  );
}
