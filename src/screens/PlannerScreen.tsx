import { useState } from 'react';
import type { MealSlot, PlannerData, Recipe } from '../types';
import { DAYS, DATES } from '../data/constants';
import { recipeMeta } from '../api/recipes';
import { StatusBarSpacer } from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import { ChevronLIco, ChevronRIco, ClockIco, PlusIco } from '../components/icons';

const SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner'];
const WEEK_LABELS: Record<number, string> = { [-1]: 'Sep 21 – Sep 27', 0: 'Sep 28 – Oct 4', 1: 'Oct 5 – Oct 11' };

export default function PlannerScreen({ plannerData, recipes, activeDay, onDayChange, onAddMeal, onRemoveMeal, onOpen }: {
  plannerData: PlannerData;
  recipes: Record<string, Recipe>;
  activeDay: number;
  onDayChange: (day: number) => void;
  onAddMeal: (day: number, slot: MealSlot) => void;
  onRemoveMeal: (day: number, slot: MealSlot) => void;
  onOpen: (id: string) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const dayMeals = plannerData[activeDay] || {};
  const weekLabel = WEEK_LABELS[weekOffset] ?? `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`;

  return (
    <div className="bg-cream min-h-full">
      <StatusBarSpacer />
      <div className="px-6 pt-2 pb-32">
        <PageHeader title="My Meal Plan" />

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4 bg-white rounded-2xl px-4 py-3 border border-[#F0ECE5]">
          <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 flex items-center justify-center">
            <ChevronLIco />
          </button>
          <p className="text-[13px] font-semibold text-[#1E1E1E]">{weekLabel}</p>
          <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 flex items-center justify-center">
            <ChevronRIco />
          </button>
        </div>

        {/* Day strip */}
        <div className="flex gap-1.5 mb-6">
          {DAYS.map((day, i) => {
            const isActive = activeDay === i;
            const isToday = i === 1;
            return (
              <button
                key={day}
                onClick={() => onDayChange(i)}
                className={`flex-1 min-w-0 flex flex-col items-center py-2.5 rounded-2xl transition-all ${isActive ? 'bg-[#4A5D3F]' : 'bg-white border border-[#F0ECE5]'}`}
              >
                <span className={`text-[10px] font-medium ${isActive ? 'text-white/70' : 'text-[#6B6B6B]'}`}>{day}</span>
                <span className={`text-[15px] font-bold mt-0.5 ${isActive ? 'text-white' : 'text-[#1E1E1E]'}`}>{DATES[i]}</span>
                {isToday && !isActive && <div className="w-1 h-1 rounded-full bg-[#4A5D3F] mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Meal slots */}
        {SLOTS.map(slot => {
          const recipeId = dayMeals[slot];
          const recipe = recipeId ? recipes[recipeId] : null;
          return (
            <div key={slot} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[14px] font-bold text-[#1E1E1E]">{slot}</p>
                <div className="flex-1 h-px bg-[#EDEBE5]" />
              </div>
              {recipe ? (
                <div className="bg-white rounded-2xl p-3 flex gap-3 items-center border border-[#F0ECE5] shadow-sm cursor-pointer" onClick={() => onOpen(recipe.id)}>
                  <img loading="lazy" src={recipe.photo} alt={recipe.name} className="w-16 h-16 rounded-xl object-cover bg-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1E1E1E] leading-tight">{recipe.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-[#6B6B6B]">
                      {recipe.time && <ClockIco />}<span className="text-[11px] truncate">{recipe.time ?? recipeMeta(recipe)}</span>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onRemoveMeal(activeDay, slot); }}
                    aria-label={`Remove ${recipe.name} from ${slot}`}
                    className="w-7 h-7 rounded-full border border-[#E5E0D8] flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddMeal(activeDay, slot)}
                  className="w-full border-2 border-dashed border-[#D9D3C8] rounded-2xl py-4 flex items-center justify-center gap-2 text-[#6B6B6B]"
                >
                  <PlusIco color="#6B6B6B" size={16} />
                  <span className="text-[13px] font-medium">Add meal</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Grocery list button */}
        <button className="mt-3 w-full border-2 border-[#4A5D3F] text-[#4A5D3F] text-[14px] font-bold py-3.5 rounded-full">
          Generate Grocery List
        </button>
      </div>
    </div>
  );
}
