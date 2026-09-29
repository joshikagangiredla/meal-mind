import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, MealSlot, NavTab, PlannerData, Recipe, Screen } from './types';
import { loadRecipes } from './api/recipes';
import BottomNav from './components/BottomNav';
import StatusBar from './components/StatusBar';
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
  const [searchCategory, setSearchCategory] = useState<Category | null>(null);
  const [searchKey, setSearchKey] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [plannerData, setPlannerData] = useState<PlannerData>({});

  // Every recipe the app has loaded, by id, so Saved/Planner/Detail can find them.
  const [cache, setCache] = useState<Record<string, Recipe>>({});
  const remember = useCallback((list: Recipe[]) => {
    setCache(prev => {
      const next = { ...prev };
      for (const r of list) next[r.id] = r;
      return next;
    });
  }, []);

  // Home feed: new recipes every time the app opens.
  const [homeIds, setHomeIds] = useState<string[]>([]);
  const [homeSource, setHomeSource] = useState<'spoonacular' | 'mealdb' | null>(null);
  const [homeStatus, setHomeStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const loadHome = useCallback(() => {
    setHomeStatus('loading');
    loadRecipes({ number: 10 })
      .then(res => {
        remember(res.recipes);
        setHomeIds(res.recipes.map(r => r.id));
        setHomeSource(res.source);
        setHomeStatus('done');
      })
      .catch(() => setHomeStatus('error'));
  }, [remember]);
  useEffect(loadHome, [loadHome]);
  const [plannerDay, setPlannerDay] = useState(TODAY);
  const [sheet, setSheet] = useState<{ slot: MealSlot | null; highlightId: string | null } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTop = () => { scrollRef.current?.scrollTo(0, 0); setScrollY(0); };

  // The status bar is pinned to the top. Over the Home/Detail photo it's
  // transparent with white icons; past the photo it turns cream with dark icons.
  const [scrollY, setScrollY] = useState(0);
  const photoHeight = screen === 'home' ? 420 : screen === 'detail' ? 300 : 0;
  const overPhoto = scrollY < photoHeight - 36;

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
    if (tab === 'search' && activeTab !== 'search') { setSearchCategory(null); setSearchKey(k => k + 1); }
    setActiveTab(tab);
    setScreen(tab);
    scrollTop();
  }

  function openCategory(c: Category) {
    setSearchCategory(c);
    setSearchKey(k => k + 1);
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
  const selectedRecipe = selectedRecipeId ? cache[selectedRecipeId] : null;
  const homeRecipes = homeIds.map(id => cache[id]).filter(Boolean);

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
          <div ref={scrollRef} onScroll={e => setScrollY(e.currentTarget.scrollTop)} className="h-full overflow-y-auto scrollbar-hide">
            {screen === 'home' && (
              <HomeScreen
                recipes={homeRecipes}
                loading={homeStatus === 'loading'}
                error={homeStatus === 'error'}
                source={homeSource}
                onRetry={loadHome}
                onRecipe={openRecipe}
                onCategory={openCategory}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
            )}
            {screen === 'search' && (
              <SearchScreen key={searchKey} initialCategory={searchCategory} onLoaded={remember} onRecipe={openRecipe} savedIds={savedIds} onToggleSave={toggleSave} />
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
                recipes={cache}
                activeDay={plannerDay}
                onDayChange={setPlannerDay}
                onAddMeal={(_, slot) => setSheet({ slot, highlightId: null })}
                onRemoveMeal={(day, slot) => setMeal(day, slot, null)}
                onOpen={openRecipe}
              />
            )}
            {screen === 'saved' && <SavedScreen recipes={cache} savedIds={savedIds} onToggleSave={toggleSave} onRecipe={openRecipe} />}
            {screen === 'profile' && <ProfileScreen savedCount={savedIds.size} mealsPlanned={mealsPlanned} />}
          </div>

          <StatusBar
            dark={overPhoto}
            className={`absolute top-0 left-0 right-0 z-30 transition-[background-color] duration-200 ${overPhoto ? 'bg-transparent' : 'bg-cream/90 backdrop-blur-md'}`}
          />

          {screen !== 'detail' && <BottomNav active={activeTab} onChange={handleTabChange} />}

          {sheet && (
            <AddMealSheet
              day={plannerDay}
              slot={sheet.slot}
              highlightId={sheet.highlightId}
              recipes={Object.values(cache)}
              onLoaded={remember}
              onClose={() => setSheet(null)}
              onAdd={(recipeId, slot) => setMeal(plannerDay, slot, recipeId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
