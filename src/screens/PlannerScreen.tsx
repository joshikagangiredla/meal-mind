import type { MealSlot, PlannerData, Recipe } from '../types';
import { recipeMeta } from '../api/recipes';
import { toKey, todayKey, weekDays, weekLabel, weekdayShort } from '../lib/dates';
import { StatusBarSpacer } from '../components/StatusBar';
import PageHeader from '../components/PageHeader';
import { ChevronLIco, ChevronRIco, ClockIco, GroceryBagIco, PlusIco } from '../components/icons';

const SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner'];

export default function PlannerScreen({
  plannerData, recipes, weekStart, onWeekChange, activeDay, onDayChange,
  onAddMeal, onRemoveMeal, onOpen, groceryCount, onOpenGroceries, onGenerateGroceries, generating,
}: {
  plannerData: PlannerData;
  recipes: Record<string, Recipe>;
  weekStart: Date;
  onWeekChange: (delta: number) => void;
  /** Selected date, "YYYY-MM-DD". */
  activeDay: string;
  onDayChange: (day: string) => void;
  onAddMeal: (slot: MealSlot) => void;
  onRemoveMeal: (day: string, slot: MealSlot) => void;
  onOpen: (id: string) => void;
  /** Items still to buy, shown as a badge on the bag. */
  groceryCount: number;
  onOpenGroceries: () => void;
  onGenerateGroceries: () => void;
  generating: boolean;
}) {
  const days = weekDays(weekStart);
  const today = todayKey();
  const dayMeals = plannerData[activeDay] || {};
  const weekHasMeals = days.some(d => Object.keys(plannerData[toKey(d)] ?? {}).length > 0);

  return (
    <div className="bg-cream min-h-full">
      <StatusBarSpacer />
      <div className="px-6 pt-2 pb-32">
        <PageHeader
          title="My Meal Plan"
          action={
            <button
              onClick={onOpenGroceries}
              aria-label={`Grocery list${groceryCount ? `, ${groceryCount} items to buy` : ''}`}
              className="relative w-11 h-11 -mr-1 rounded-2xl bg-olive shadow-sm flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            >
              <GroceryBagIco size={28} color="#FBF8F3" bagFill="#F3E9D8" rimColor="#4A5D3F" />
              {groceryCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#E07B39] text-white text-[10px] font-bold flex items-center justify-center border-2 border-cream">
                  {groceryCount > 99 ? '99+' : groceryCount}
                </span>
              )}
            </button>
          }
        />

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4 bg-white rounded-2xl px-4 py-3 border border-line">
          <button onClick={() => onWeekChange(-1)} aria-label="Previous week" className="w-8 h-8 flex items-center justify-center">
            <ChevronLIco />
          </button>
          <p className="text-[13px] font-semibold text-ink">{weekLabel(weekStart)}</p>
          <button onClick={() => onWeekChange(1)} aria-label="Next week" className="w-8 h-8 flex items-center justify-center">
            <ChevronRIco />
          </button>
        </div>

        {/* Day strip */}
        <div className="flex gap-1.5 mb-6">
          {days.map(d => {
            const key = toKey(d);
            const isActive = activeDay === key;
            const isToday = key === today;
            const hasMeals = Object.keys(plannerData[key] ?? {}).length > 0;
            return (
              <button
                key={key}
                onClick={() => onDayChange(key)}
                aria-label={d.toDateString()}
                className={`flex-1 min-w-0 flex flex-col items-center py-2.5 rounded-2xl transition-all ${isActive ? 'bg-olive' : isToday ? 'bg-white border-2 border-olive' : 'bg-white border border-line'}`}
              >
                <span className={`text-[10px] font-medium ${isActive ? 'text-white/70' : 'text-muted'}`}>{isToday ? 'Today' : weekdayShort(d)}</span>
                <span className={`text-[15px] font-bold mt-0.5 ${isActive ? 'text-white' : 'text-ink'}`}>{d.getDate()}</span>
                <span className={`w-1 h-1 rounded-full mt-1 ${hasMeals ? (isActive ? 'bg-white' : 'bg-olive') : 'bg-transparent'}`} />
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
                <p className="text-[14px] font-bold text-ink">{slot}</p>
                <div className="flex-1 h-px bg-[#EDEBE5]" />
              </div>
              {recipe ? (
                <div className="bg-white rounded-2xl p-3 flex gap-3 items-center border border-line shadow-sm cursor-pointer" onClick={() => onOpen(recipe.id)}>
                  {recipe.photo
                    ? <img loading="lazy" src={recipe.photo} alt={recipe.name} className="w-16 h-16 rounded-xl object-cover bg-gray-200" />
                    : <div className="w-16 h-16 rounded-xl bg-[#E5E0D8]" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-ink leading-tight line-clamp-2">{recipe.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-muted">
                      {recipe.time && <ClockIco />}
                      <span className="text-[11px] truncate">{recipe.stub ? 'Tap to view recipe' : recipe.time ?? recipeMeta(recipe)}</span>
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
                  onClick={() => onAddMeal(slot)}
                  className="w-full border-2 border-dashed border-[#D9D3C8] rounded-2xl py-4 flex items-center justify-center gap-2 text-muted"
                >
                  <PlusIco color="#6B6B6B" size={16} />
                  <span className="text-[13px] font-medium">Add meal</span>
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onGenerateGroceries}
          disabled={!weekHasMeals || generating}
          className="mt-3 w-full border-2 border-olive text-olive text-[14px] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {generating ? 'Building your list…' : 'Generate Grocery List'}
        </button>
        {!weekHasMeals && (
          <p className="text-[11px] text-muted text-center mt-2">Add meals to this week to build a grocery list.</p>
        )}
      </div>
    </div>
  );
}
