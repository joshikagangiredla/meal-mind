import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Category, GroceryItem, MealSlot, NavTab, PlannerData, Recipe, Screen } from './types';
import { loadRecipeDetails, loadRecipes } from './api/recipes';
import { buildGroceryList } from './lib/grocery';
import { clearAll, load, save } from './lib/storage';
import { fromKey, toKey, todayKey, weekDays, weekLabel, weekStart as getWeekStart } from './lib/dates';
import BottomNav from './components/BottomNav';
import StatusBar from './components/StatusBar';
import AddMealSheet from './components/AddMealSheet';
import GroceryListSheet from './components/GroceryListSheet';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import PlannerScreen from './screens/PlannerScreen';
import SavedScreen from './screens/SavedScreen';
import ProfileScreen from './screens/ProfileScreen';

/** What we keep on the device for each saved/planned recipe (all Spoonacular's terms allow). */
type StoredRecipe = Pick<Recipe, 'id' | 'name' | 'photo' | 'source'>;

function restoreRecipes(): Record<string, Recipe> {
  const stored = load<Record<string, StoredRecipe>>('recipes', {});
  const out: Record<string, Recipe> = {};
  for (const r of Object.values(stored)) {
    out[r.id] = {
      ...r, desc: '', time: null, cals: null, servings: null, cuisine: '', category: '',
      tags: [], ingredients: [], steps: [], stub: true,
    };
  }
  return out;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState<Category | null>(null);
  const [searchKey, setSearchKey] = useState(0);

  // ── Remembered on this device ─────────────────────────
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(load<string[]>('saved', [])));
  const [plannerData, setPlannerData] = useState<PlannerData>(() => load<PlannerData>('plan', {}));
  const [grocery, setGrocery] = useState<{ items: GroceryItem[]; week: string | null }>(() => load('grocery', { items: [], week: null }));
  const [userName, setUserName] = useState<string>(() => load('name', ''));

  // Every recipe the app knows about, by id. Restored ones start as stubs.
  const [cache, setCache] = useState<Record<string, Recipe>>(restoreRecipes);
  const remember = useCallback((list: Recipe[]) => {
    setCache(prev => {
      const next = { ...prev };
      for (const r of list) next[r.id] = r;
      return next;
    });
  }, []);

  useEffect(() => save('saved', [...savedIds]), [savedIds]);
  useEffect(() => save('plan', plannerData), [plannerData]);
  useEffect(() => save('grocery', grocery), [grocery]);
  useEffect(() => save('name', userName), [userName]);
  // Keep id/name/photo for recipes that are saved or planned, so they survive a refresh.
  useEffect(() => {
    const needed = new Set<string>(savedIds);
    for (const day of Object.values(plannerData)) for (const id of Object.values(day)) if (id) needed.add(id);
    const stored: Record<string, StoredRecipe> = {};
    for (const id of needed) {
      const r = cache[id];
      if (r) stored[id] = { id: r.id, name: r.name, photo: r.photo, source: r.source };
    }
    save('recipes', stored);
  }, [savedIds, plannerData, cache]);

  // ── Home feed: new recipes every time the app opens ───
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

  // ── Planner week ──────────────────────────────────────
  const [weekOffset, setWeekOffset] = useState(0);
  const [plannerDay, setPlannerDay] = useState(todayKey);
  const weekStart = useMemo(() => getWeekStart(new Date(), weekOffset), [weekOffset]);

  function changeWeek(delta: number) {
    setWeekOffset(w => w + delta);
    // Keep the same weekday selected in the new week.
    const d = fromKey(plannerDay);
    d.setDate(d.getDate() + delta * 7);
    setPlannerDay(toKey(d));
  }

  const [sheet, setSheet] = useState<{ slot: MealSlot | null; highlightId: string | null } | null>(null);
  const [groceryOpen, setGroceryOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // ── Scrolling / pinned status bar ─────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const scrollTop = () => { scrollRef.current?.scrollTo(0, 0); setScrollY(0); };
  // Over the Home/Detail photo the status bar is transparent with white icons;
  // past the photo it turns cream with dark icons.
  const photoHeight = screen === 'home' ? 420 : screen === 'detail' ? 300 : 0;
  const overPhoto = scrollY < photoHeight - 36;

  // ── Recipe detail (fetch full info for restored stubs) ─
  const [detailStatus, setDetailStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  async function fillStubs(ids: string[]) {
    const stubs = ids.filter(id => cache[id]?.stub);
    if (!stubs.length) return ids.map(id => cache[id]).filter(Boolean);
    const loaded = await loadRecipeDetails(stubs);
    remember(loaded);
    const byId = new Map(loaded.map(r => [r.id, r]));
    return ids.map(id => byId.get(id) ?? cache[id]).filter(Boolean);
  }

  function openRecipe(id: string) {
    setSelectedRecipeId(id);
    setScreen('detail');
    scrollTop();
    if (cache[id]?.stub) {
      setDetailStatus('loading');
      fillStubs([id]).then(([r]) => setDetailStatus(r && !r.stub ? 'idle' : 'error'));
    } else {
      setDetailStatus('idle');
    }
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

  function setMeal(day: string, slot: MealSlot, recipeId: string | null) {
    setPlannerData(prev => {
      const dayMeals = { ...(prev[day] || {}) };
      if (recipeId) dayMeals[slot] = recipeId; else delete dayMeals[slot];
      const next = { ...prev, [day]: dayMeals };
      if (!Object.keys(dayMeals).length) delete next[day];
      return next;
    });
  }

  function handleAddToPlan() {
    setActiveTab('planner');
    setScreen('planner');
    setSheet({ slot: null, highlightId: selectedRecipeId });
    scrollTop();
  }

  // ── Grocery list ──────────────────────────────────────
  async function generateGroceries() {
    const ids = weekDays(weekStart).flatMap(d => Object.values(plannerData[toKey(d)] ?? {})).filter(Boolean) as string[];
    if (!ids.length) return;
    setGenerating(true);
    try {
      const recipes = await fillStubs([...new Set(ids)]);
      const items = buildGroceryList(recipes.filter(r => !r.stub), grocery.items);
      setGrocery({ items, week: weekLabel(weekStart) });
    } finally {
      setGenerating(false);
      setGroceryOpen(true);
    }
  }

  function resetAll() {
    clearAll();
    setSavedIds(new Set());
    setPlannerData({});
    setGrocery({ items: [], week: null });
    setUserName('');
    setCache(prev => Object.fromEntries(Object.entries(prev).filter(([, r]) => !r.stub)));
  }

  // ── Derived values ────────────────────────────────────
  const mealsPlanned = Object.values(plannerData).reduce((n, d) => n + Object.keys(d || {}).length, 0);
  const weeksPlanned = new Set(
    Object.entries(plannerData).filter(([, d]) => Object.keys(d).length).map(([day]) => toKey(getWeekStart(fromKey(day)))),
  ).size;
  const groceryLeft = grocery.items.filter(i => !i.checked).length;
  const selectedRecipe = selectedRecipeId ? cache[selectedRecipeId] : null;
  const homeRecipes = homeIds.map(id => cache[id]).filter(Boolean);
  const dayLabel = fromKey(plannerDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Scale the 390×844 phone frame to fit smaller windows.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function calcScale() {
      const s = Math.min(1, (window.innerWidth - 32) / 390, (window.innerHeight - 32) / 844);
      setScale(Math.max(0.3, s));
    }
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  return (
    // The page itself never scrolls: only the app's content scrolls inside the phone frame.
    <div className="h-screen overflow-hidden bg-[#E8E2DA] flex items-center justify-center">
      {/* Box sized to the *scaled* phone, so a shrunk frame doesn't leave phantom scroll space. */}
      <div style={{ width: 390 * scale, height: 844 * scale }}>
      <div style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
                status={detailStatus}
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
                weekStart={weekStart}
                onWeekChange={changeWeek}
                activeDay={plannerDay}
                onDayChange={setPlannerDay}
                onAddMeal={slot => setSheet({ slot, highlightId: null })}
                onRemoveMeal={(day, slot) => setMeal(day, slot, null)}
                onOpen={openRecipe}
                groceryCount={groceryLeft}
                onOpenGroceries={() => setGroceryOpen(true)}
                onGenerateGroceries={generateGroceries}
                generating={generating}
              />
            )}
            {screen === 'saved' && <SavedScreen recipes={cache} savedIds={savedIds} onToggleSave={toggleSave} onRecipe={openRecipe} />}
            {screen === 'profile' && (
              <ProfileScreen
                name={userName}
                onNameChange={setUserName}
                savedCount={savedIds.size}
                mealsPlanned={mealsPlanned}
                weeksPlanned={weeksPlanned}
                onResetAll={resetAll}
              />
            )}
          </div>

          <StatusBar
            dark={overPhoto}
            className={`absolute top-0 left-0 right-0 z-30 transition-[background-color] duration-200 ${overPhoto ? 'bg-transparent' : 'bg-cream/90 backdrop-blur-md'}`}
          />

          {screen !== 'detail' && <BottomNav active={activeTab} onChange={handleTabChange} />}

          {sheet && (
            <AddMealSheet
              dayLabel={dayLabel}
              slot={sheet.slot}
              highlightId={sheet.highlightId}
              recipes={Object.values(cache)}
              onLoaded={remember}
              onClose={() => setSheet(null)}
              onAdd={(recipeId, slot) => setMeal(plannerDay, slot, recipeId)}
            />
          )}

          {groceryOpen && (
            <GroceryListSheet
              items={grocery.items}
              weekLabel={grocery.week}
              onToggle={key => setGrocery(g => ({ ...g, items: g.items.map(i => (i.key === key ? { ...i, checked: !i.checked } : i)) }))}
              onClearChecked={() => setGrocery(g => ({ ...g, items: g.items.filter(i => !i.checked) }))}
              onClearAll={() => setGrocery({ items: [], week: null })}
              onClose={() => setGroceryOpen(false)}
            />
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
