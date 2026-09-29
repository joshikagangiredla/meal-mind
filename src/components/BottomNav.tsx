import { useLayoutEffect, useRef, useState } from 'react';
import type { NavTab } from '../types';
import { HomeIco, SearchIco, PlannerIco, SavedIco, ProfileIco, type NavIcon } from './icons';

const TABS: { id: NavTab; label: string; Ico: NavIcon }[] = [
  { id: 'home', label: 'Home', Ico: HomeIco },
  { id: 'search', label: 'Search', Ico: SearchIco },
  { id: 'planner', label: 'Planner', Ico: PlannerIco },
  { id: 'saved', label: 'Saved', Ico: SavedIco },
  { id: 'profile', label: 'Profile', Ico: ProfileIco },
];

/**
 * Frosted nav bar. A single highlight pill is measured against the active
 * tab and slides to it, the same motion as the Figma Smart Animate prototype.
 */
export default function BottomNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const refs = useRef<Partial<Record<NavTab, HTMLButtonElement | null>>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[active];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // Re-measure after the label finishes expanding.
    const t = setTimeout(measure, 320);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <nav className="absolute bottom-5 left-0 right-0 z-30 flex justify-center px-6">
      <div
        className="relative flex items-center gap-1 px-2 py-2 rounded-[28px]"
        style={{
          background: 'rgba(40, 54, 35, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(30,40,25,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <span
          aria-hidden
          className="absolute top-2 bottom-2 rounded-[18px] transition-all duration-300 ease-in-out"
          style={{
            left: pill.left,
            width: pill.width,
            background: 'rgba(251,248,243,0.15)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        />
        {TABS.map(({ id, label, Ico }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              ref={el => { refs.current[id] = el; }}
              onClick={() => onChange(id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center py-2 transition-all duration-300 ease-in-out ${isActive ? 'px-4' : 'px-3'}`}
            >
              <Ico active={isActive} />
              <span
                className={`overflow-hidden whitespace-nowrap text-[11px] font-semibold text-white transition-all duration-300 ease-in-out ${isActive ? 'max-w-[60px] ml-1.5 opacity-100' : 'max-w-0 ml-0 opacity-0'}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
