import { useEffect, useState } from 'react';
import { RECIPES, CATEGORIES, HERO_SLIDES, getRecipe } from '../data/recipes';
import StatusBar from '../components/StatusBar';
import Logo from '../components/Logo';
import { SmallRecipeCard } from '../components/RecipeCards';
import { ClockIco, FlameIco } from '../components/icons';

export default function HomeScreen({ onRecipe, onCategory, savedIds, onToggleSave }: {
  onRecipe: (id: string) => void;
  onCategory: (name: string) => void;
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
}) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const heroRecipe = getRecipe(HERO_SLIDES[slide].id);

  return (
    <div className="min-h-full bg-cream">
      {/* Hero */}
      <div className="relative w-full h-[420px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => {
          const r = getRecipe(s.id);
          return (
            <img
              key={s.id}
              src={r.photo}
              alt={r.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0 }}
            />
          );
        })}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0">
          <StatusBar dark />
        </div>
        {/* Logo */}
        <div className="absolute top-10 left-6">
          <Logo color="white" />
        </div>
        {/* Headline */}
        <div className="absolute top-9 right-6 max-w-[160px] text-right">
          <p className="text-white text-[18px] font-bold leading-tight whitespace-pre-line">
            {HERO_SLIDES[slide].headline}
          </p>
        </div>
        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          <p className="text-white text-[18px] font-bold leading-tight">{heroRecipe.name}</p>
          <p className="text-white/75 text-[12px] mt-1 leading-tight line-clamp-2">{heroRecipe.desc}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-white/60 text-[11px] flex items-center gap-1"><ClockIco />{heroRecipe.time}</span>
            <span className="text-white/60 text-[11px] flex items-center gap-1"><FlameIco />{heroRecipe.cals}</span>
          </div>
          <button
            onClick={() => onRecipe(heroRecipe.id)}
            className="mt-3 bg-[#4A5D3F] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full w-full"
          >
            See Recipe
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`rounded-full transition-all ${i === slide ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="px-6 pt-5 pb-32">
        {/* Quick picks */}
        <h2 className="text-[16px] font-bold text-[#1E1E1E] mb-3">Quick Picks</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {RECIPES.slice(0, 5).map(r => (
            <SmallRecipeCard
              key={r.id} recipe={r}
              onPress={() => onRecipe(r.id)}
              saved={savedIds.has(r.id)}
              onToggleSave={() => onToggleSave(r.id)}
            />
          ))}
        </div>

        {/* Categories */}
        <h2 className="text-[16px] font-bold text-[#1E1E1E] mt-6 mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => onCategory(cat.name)}
              className="flex-shrink-0 w-[120px] h-[80px] rounded-2xl overflow-hidden relative bg-gray-300 text-left"
            >
              <img loading="lazy" src={cat.photo} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-end p-2.5">
                <p className="text-white text-[12px] font-bold leading-tight">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
