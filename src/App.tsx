import { useEffect, useRef, useState } from 'react';
import type { MealSlot, NavTab, PlannerData, Screen } from './types';
import { getRecipe } from './data/recipes';
import BottomNav from './components/BottomNav';
import AddMealSheet from './components/AddMealSheet';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import PlannerScreen from './screens/PlannerScreen';
import SavedScreen from './screens/SavedScreen';
import ProfileScreen from './screens/ProfileScreen';

const TODAY = 1; // Tuesday in the demo week

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['1', '3', '5', '7']));
  const [plannerData, setPlannerData] = useState<PlannerData>({
    1: { Breakfast: '2', Lunch: '4' },
    2: { Dinner: '1' },
    4: { Lunch: '5', Dinner: '3' },
  });
  const [plannerDay, setPlannerDay] = useState(TODAY);
  const [sheet, setSheet] = useState<{ slot: MealSlot | null; highlightId: string | null } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTop = () => scrollRef.current?.scrollTo(0, 0);

  function openRecipe(id: string) {
    setSelectedRecipeId(id);
    setScreen('detail');
    scrollTop();
  }

  function goBack() {
    setScreen(activeTab);
    scrollTop();
  }

  function handleTabChange(tab: NavTab) {
    if (tab === 'search' && activeTab !== 'search') setSearchQuery('');
    setActiveTab(tab);
    setScreen(tab);
    scrollTop();
  }

  function openCategory(name: string) {
    setSearchQuery(name);
    setActiveTab('search');
    setScreen('search');
    scrollTop();
  }

  function toggleSave(id: string) {
    setSavedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function setMeal(day: number, slot: MealSlot, recipeId: string | null) {
    setPlannerData(prev => {
      const dayMeals = { ...(prev[day] || {}) };
      if (recipeId) dayMeals[slot] = recipeId; else delete dayMeals[slot];
      return { ...prev, [day]: dayMeals };
    });
  }

  function handleAddToPlan() {
    setActiveTab('planner');
    setScreen('planner');
    setSheet({ slot: null, highlightId: selectedRecipeId });
    scrollTop();
  }

  const mealsPlanned = Object.values(plannerData).reduce((n, d) => n + Object.keys(d || {}).length, 0);
  const selectedRecipe = selectedRecipeId ? getRecipe(selectedRecipeId) : null;

  // Scale the 390×844 phone frame to fit smaller windows.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function calcScale() {
      const s = Math.min(1, (window.innerWidth - 32) / 390, (window.innerHeight - 32) / 844);
      setScale(Math.max(0.4, s));
    }
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  return (
    <div className="min-h-screen bg-[#E8E2DA] flex items-center justify-center">
      <div style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <div className="relative w-[390px] h-[844px] bg-cream overflow-hidden shadow-2xl rounded-[50px]">
          <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide">
            {screen === 'home' && (
              <HomeScreen onRecipe={openRecipe} onCategory={openCategory} savedIds={savedIds} onToggleSave={toggleSave} />
            )}
            {screen === 'search' && (
              <SearchScreen key={searchQuery} initialQuery={searchQuery} onRecipe={openRecipe} savedIds={savedIds} onToggleSave={toggleSave} />
            )}
            {screen === 'detail' && selectedRecipe && (
              <RecipeDetailScreen
                recipe={selectedRecipe}
                onBack={goBack}
                saved={savedIds.has(selectedRecipe.id)}
                onToggleSave={() => toggleSave(selectedRecipe.id)}
                onAddToPlan={handleAddToPlan}
              />
            )}
            {screen === 'planner' && (
              <PlannerScreen
                plannerData={plannerData}
                activeDay={plannerDay}
                onDayChange={setPlannerDay}
                onAddMeal={(_, slot) => setSheet({ slot, highlightId: null })}
                onRemoveMeal={(day, slot) => setMeal(day, slot, null)}
                onOpen={openRecipe}
              />
            )}
            {screen === 'saved' && <SavedScreen savedIds={savedIds} onToggleSave={toggleSave} onRecipe={openRecipe} />}
            {screen === 'profile' && <ProfileScreen savedCount={savedIds.size} mealsPlanned={mealsPlanned} />}
          </div>

          {screen !== 'detail' && <BottomNav active={activeTab} onChange={handleTabChange} />}

          {sheet && (
            <AddMealSheet
              day={plannerDay}
              slot={sheet.slot}
              highlightId={sheet.highlightId}
              onClose={() => setSheet(null)}
              onAdd={(recipeId, slot) => setMeal(plannerDay, slot, recipeId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
