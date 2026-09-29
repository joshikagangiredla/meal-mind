import { useState } from 'react';
import { RECIPES, POPULAR_TAGS } from '../data/recipes';
import StatusBar from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import { GridRecipeCard } from '../components/RecipeCards';
import { FilterIco } from '../components/icons';

export default function SearchScreen({ initialQuery = '', onRecipe, savedIds, onToggleSave }: {
  initialQuery?: string;
  onRecipe: (id: string) => void; savedIds: Set<string>; onToggleSave: (id: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('');
  const filters = ['Cuisine', 'Diet', 'Cook Time', 'Ingredients'];

  const filtered = RECIPES.filter(r => {
    const q = query.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#FBF8F3] min-h-full">
      <StatusBar />
      <div className="px-6 pt-2 pb-32">
        <PageHeader title="Search" />

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#F0ECE5]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="flex-1 text-[14px] text-[#1E1E1E] placeholder-[#ACACAC] bg-transparent outline-none"
              placeholder="Search recipes, ingredients…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#F0ECE5]">
            <FilterIco />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(activeFilter === f ? '' : f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all ${activeFilter === f
                ? 'bg-[#4A5D3F] text-white border-[#4A5D3F]'
                : 'bg-white text-[#6B6B6B] border-[#E5E0D8]'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {!query && (
          <>
            <p className="text-[13px] font-semibold text-[#6B6B6B] mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-white rounded-full text-[12px] text-[#1E1E1E] border border-[#E5E0D8] font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}

        <p className="text-[13px] font-semibold text-[#6B6B6B] mb-3">
          {query ? `${filtered.length} results` : 'All recipes'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(r => (
            <GridRecipeCard
              key={r.id} recipe={r}
              onPress={() => onRecipe(r.id)}
              saved={savedIds.has(r.id)}
              onToggleSave={() => onToggleSave(r.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
