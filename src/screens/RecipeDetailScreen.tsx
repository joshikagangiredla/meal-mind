import { useState } from 'react';
import type { Recipe } from '../types';
import StatusBar from '../components/StatusBar';
import { BackIco, CheckIco, ClockIco, FlameIco, PersonsIco } from '../components/icons';

export default function RecipeDetailScreen({ recipe, onBack, saved, onToggleSave, onAddToPlan }: {
  recipe: Recipe; onBack: () => void; saved: boolean;
  onToggleSave: () => void; onAddToPlan: () => void;
}) {
  const [tab, setTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggleCheck(i: number) {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  return (
    <div className="bg-[#FBF8F3] min-h-full">
      {/* Hero photo */}
      <div className="relative w-full h-[300px] bg-gray-300">
        <img src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0">
          <StatusBar dark />
        </div>
        <div className="absolute top-10 left-5">
          <button onClick={onBack} className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BackIco />
          </button>
        </div>
        <button
          onClick={onToggleSave}
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

        {/* Stats */}
        <div className="flex gap-4 mt-4 bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-[#F0ECE5]">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-[#4A5D3F]"><ClockIco /></div>
            <p className="text-[13px] font-bold text-[#1E1E1E] mt-1">{recipe.time}</p>
            <p className="text-[10px] text-[#6B6B6B]">Cook time</p>
          </div>
          <div className="w-px bg-[#F0ECE5]" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-[#4A5D3F]"><PersonsIco /></div>
            <p className="text-[13px] font-bold text-[#1E1E1E] mt-1">{recipe.servings}</p>
            <p className="text-[10px] text-[#6B6B6B]">Servings</p>
          </div>
          <div className="w-px bg-[#F0ECE5]" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-[#4A5D3F]"><FlameIco /></div>
            <p className="text-[13px] font-bold text-[#1E1E1E] mt-1">{recipe.cals.split(' ')[0]}</p>
            <p className="text-[10px] text-[#6B6B6B]">Calories</p>
          </div>
        </div>

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
          <div className="mt-4 space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-3" onClick={() => toggleCheck(i)}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${checked.has(i) ? 'bg-[#4A5D3F] border-[#4A5D3F]' : 'border-[#D1CCC6]'}`}>
                  {checked.has(i) && <CheckIco />}
                </div>
                <span className={`text-[13px] text-[#6B6B6B] font-medium w-14 flex-shrink-0 ${checked.has(i) ? 'line-through opacity-50' : ''}`}>{ing.qty}</span>
                <span className={`text-[13px] text-[#1E1E1E] flex-1 ${checked.has(i) ? 'line-through opacity-50' : ''}`}>{ing.name}</span>
              </div>
            ))}
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
          </div>
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
