import type { Recipe } from '../types';
import { ClockIco, HeartIco } from './icons';

interface CardProps { recipe: Recipe; onPress: () => void; saved: boolean; onToggleSave: () => void; }

export function SmallRecipeCard({ recipe, onPress, saved, onToggleSave }: CardProps) {
  return (
    <div className="flex-shrink-0 w-[130px] cursor-pointer" onClick={onPress}>
      <div className="relative w-full h-[130px] rounded-2xl overflow-hidden bg-gray-200">
        <img loading="lazy" src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
        <button
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center"
          onClick={e => { e.stopPropagation(); onToggleSave(); }}
        >
          <HeartIco filled={saved} />
        </button>
      </div>
      <p className="mt-2 text-[13px] font-semibold text-[#1E1E1E] leading-tight">{recipe.name}</p>
      <p className="text-[11px] text-[#6B6B6B] mt-0.5">{recipe.time}</p>
    </div>
  );
}

export function GridRecipeCard({ recipe, onPress, saved, onToggleSave }: CardProps) {
  return (
    <div className="cursor-pointer" onClick={onPress}>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-200">
        <img loading="lazy" src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
        <button
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center"
          onClick={e => { e.stopPropagation(); onToggleSave(); }}
        >
          <HeartIco filled={saved} />
        </button>
      </div>
      <p className="mt-2 text-[13px] font-semibold text-[#1E1E1E] leading-tight">{recipe.name}</p>
      <div className="flex items-center gap-1 mt-0.5 text-[#6B6B6B]">
        <ClockIco /><span className="text-[11px]">{recipe.time}</span>
      </div>
    </div>
  );
}
