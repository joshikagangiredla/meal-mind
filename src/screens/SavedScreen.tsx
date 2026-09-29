import { useState } from 'react';
import { RECIPES } from '../data/recipes';
import StatusBar from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import { GridRecipeCard } from '../components/RecipeCards';

export default function SavedScreen({ savedIds, onToggleSave, onRecipe }: {
  savedIds: Set<string>; onToggleSave: (id: string) => void; onRecipe: (id: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const cats = ['All', 'Breakfast', 'Asian', 'Quick Meals', 'Vegetarian', 'Desserts'];
  const saved = RECIPES.filter(r => savedIds.has(r.id));
  const filtered = activeFilter === 'All' ? saved : saved.filter(r => r.category === activeFilter);

  return (
    <div className="bg-[#FBF8F3] min-h-full">
      <StatusBar />
      <div className="px-6 pt-2 pb-32">
        <PageHeader title="Saved" />

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all ${activeFilter === c ? 'bg-[#4A5D3F] text-white border-[#4A5D3F]' : 'bg-white text-[#6B6B6B] border-[#E5E0D8]'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#F0ECE5] rounded-full flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            </div>
            <p className="text-[15px] font-bold text-[#1E1E1E]">No saved recipes yet</p>
            <p className="text-[13px] text-[#6B6B6B] mt-1">Tap the heart on any recipe to save it</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
