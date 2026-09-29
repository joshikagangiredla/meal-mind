import { useEffect, useState } from 'react';
import type { Category, Recipe } from '../types';
import { CATEGORIES, HERO_HEADLINES } from '../data/constants';
import { recipeMeta } from '../api/recipes';
import Logo from '../components/Logo';
import SourceNote from '../components/SourceNote';
import { CardSkeleton, SmallRecipeCard } from '../components/RecipeCards';

const HERO_COUNT = 3;

export default function HomeScreen({ recipes, loading, error, source, onRetry, onRecipe, onCategory, savedIds, onToggleSave }: {
  recipes: Recipe[];
  loading: boolean;
  error: boolean;
  source: 'spoonacular' | 'mealdb' | null;
  onRetry: () => void;
  onRecipe: (id: string) => void;
  onCategory: (c: Category) => void;
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
}) {
  const [slide, setSlide] = useState(0);
  const heroes = recipes.slice(0, HERO_COUNT);
  const picks = recipes.slice(HERO_COUNT);

  useEffect(() => {
    if (heroes.length < 2) return;
    const t = setInterval(() => setSlide(s => (s + 1) % heroes.length), 5000);
    return () => clearInterval(t);
  }, [heroes.length]);

  const hero = heroes[slide % Math.max(heroes.length, 1)];

  return (
    <div className="min-h-full bg-cream">
      {/* Hero */}
      <div className="relative w-full h-[420px] overflow-hidden bg-[#3A4733]">
        {heroes.map((r, i) => (
          <img
            key={r.id}
            src={r.photo}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        <div className="absolute top-10 left-6">
          <Logo color="white" />
        </div>
        <div className="absolute top-[52px] right-6 max-w-[210px] text-right">
          <p className="text-white text-[23px] font-bold leading-[1.15] drop-shadow-sm whitespace-pre-line">
            {HERO_HEADLINES[slide % HERO_HEADLINES.length]}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          {hero ? (
            <>
              <p className="text-white text-[18px] font-bold leading-tight line-clamp-2">{hero.name}</p>
              {hero.desc && <p className="text-white/75 text-[12px] mt-1 leading-tight line-clamp-2">{hero.desc}</p>}
              <p className="text-white/60 text-[11px] mt-2">{recipeMeta(hero)}</p>
              <button
                onClick={() => onRecipe(hero.id)}
                className="mt-3 bg-olive text-white text-[13px] font-semibold px-6 py-2.5 rounded-full w-full"
              >
                See Recipe
              </button>
              <div className="flex justify-center gap-1.5 mt-3">
                {heroes.map((r, i) => (
                  <button
                    key={r.id}
                    aria-label={`Show ${r.name}`}
                    onClick={() => setSlide(i)}
                    className={`rounded-full transition-all ${i === slide ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          ) : loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-5 w-3/4 rounded bg-white/25" />
              <div className="h-3 w-full rounded bg-white/15" />
              <div className="h-10 w-full rounded-full bg-white/20 mt-3" />
            </div>
          ) : error ? (
            <div className="text-white">
              <p className="text-[16px] font-bold">Couldn't load recipes</p>
              <p className="text-white/75 text-[12px] mt-1">Check your connection and try again.</p>
              <button onClick={onRetry} className="mt-3 bg-olive text-white text-[13px] font-semibold px-6 py-2.5 rounded-full w-full">
                Try again
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-6 pt-5 pb-32">
        <h2 className="text-[16px] font-bold text-ink mb-3">Quick Picks</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {loading && !recipes.length
            ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} variant="small" />)
            : picks.map(r => (
                <SmallRecipeCard
                  key={r.id} recipe={r}
                  onPress={() => onRecipe(r.id)}
                  saved={savedIds.has(r.id)}
                  onToggleSave={() => onToggleSave(r.id)}
                />
              ))}
        </div>

        <h2 className="text-[16px] font-bold text-ink mt-6 mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => onCategory(cat)}
              className="flex-shrink-0 w-[120px] h-[80px] rounded-2xl overflow-hidden relative text-left p-2.5 flex flex-col justify-between"
              style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}
            >
              <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">
                {cat.kind === 'type' ? 'Meal' : 'Cuisine'}
              </span>
              <span className="text-white text-[13px] font-bold leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>

        <SourceNote source={source} />
      </div>
    </div>
  );
}

/** Earthy tones from the Meal Mind palette. */
const TILE_COLORS = ['#4A5D3F', '#8C5A3C', '#6B7F5A', '#A0673F', '#3E4E36', '#7A6A4F'];
