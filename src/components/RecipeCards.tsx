import type { Recipe } from '../types';
import { recipeMeta } from '../api/recipes';
import { ClockIco, HeartIco } from './icons';

interface CardProps { recipe: Recipe; onPress: () => void; saved: boolean; onToggleSave: () => void; }

function Photo({ recipe, className }: { recipe: Recipe; className: string }) {
  return recipe.photo
    ? <img loading="lazy" src={recipe.photo} alt={recipe.name} className={className} />
    : <div className={`${className} bg-[#E5E0D8]`} />;
}

function SaveButton({ saved, onToggleSave, name }: { saved: boolean; onToggleSave: () => void; name: string }) {
  return (
    <button
      aria-label={saved ? `Unsave ${name}` : `Save ${name}`}
      className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center"
      onClick={e => { e.stopPropagation(); onToggleSave(); }}
    >
      <HeartIco filled={saved} />
    </button>
  );
}

export function SmallRecipeCard({ recipe, onPress, saved, onToggleSave }: CardProps) {
  return (
    <div className="flex-shrink-0 w-[130px] cursor-pointer" onClick={onPress}>
      <div className="relative w-full h-[130px] rounded-2xl overflow-hidden bg-gray-200">
        <Photo recipe={recipe} className="w-full h-full object-cover" />
        <SaveButton saved={saved} onToggleSave={onToggleSave} name={recipe.name} />
      </div>
      <p className="mt-2 text-[13px] font-semibold text-ink leading-tight line-clamp-2">{recipe.name}</p>
      <p className="text-[11px] text-muted mt-0.5 truncate">{recipeMeta(recipe)}</p>
    </div>
  );
}

export function GridRecipeCard({ recipe, onPress, saved, onToggleSave }: CardProps) {
  return (
    <div className="cursor-pointer min-w-0" onClick={onPress}>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-200">
        <Photo recipe={recipe} className="w-full h-full object-cover" />
        <SaveButton saved={saved} onToggleSave={onToggleSave} name={recipe.name} />
      </div>
      <p className="mt-2 text-[13px] font-semibold text-ink leading-tight line-clamp-2">{recipe.name}</p>
      <div className="flex items-center gap-1 mt-0.5 text-muted">
        {recipe.time && <ClockIco />}
        <span className="text-[11px] truncate">{recipe.time ?? recipeMeta(recipe)}</span>
      </div>
    </div>
  );
}

/** Grey placeholder cards shown while recipes load. */
export function CardSkeleton({ variant }: { variant: 'small' | 'grid' }) {
  return (
    <div className={`${variant === 'small' ? 'flex-shrink-0 w-[130px]' : ''} animate-pulse`}>
      <div className={`${variant === 'small' ? 'h-[130px]' : 'aspect-square'} w-full rounded-2xl bg-[#ECE7DF]`} />
      <div className="mt-2 h-3 w-4/5 rounded bg-[#ECE7DF]" />
      <div className="mt-1.5 h-2.5 w-1/2 rounded bg-[#ECE7DF]" />
    </div>
  );
}
