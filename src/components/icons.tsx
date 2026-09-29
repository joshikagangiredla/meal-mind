import type { FC } from 'react';

export type NavIcon = FC<{ active: boolean }>;

export function HomeIco({ active }: { active: boolean }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={c}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}
export function SearchIco({ active }: { active: boolean }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
export function PlannerIco({ active }: { active: boolean }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2.5" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
export function SavedIco({ active }: { active: boolean }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function ProfileIco({ active }: { active: boolean }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
export function ClockIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}
export function FlameIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
export function PersonsIco() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}
export function HeartIco({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#4A5D3F' : 'none'} stroke={filled ? '#4A5D3F' : '#9CA3AF'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
export function BackIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
export function PlusIco({ color = '#4A5D3F', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function ChevronLIco() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
export function ChevronRIco() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
export function FilterIco() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
export function CheckIco() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/** Grocery bag with a carrot poking out of the top. */
export function GroceryBagIco({ size = 26, color = '#4A5D3F', bagFill = '#F3E9D8', rimColor, handleColor, leafFill = '#8BA36B', leafStroke }: {
  size?: number;
  /** Outline colour. */
  color?: string;
  bagFill?: string;
  /** Colour of the folded-rim line across the bag (defaults to the outline colour). */
  rimColor?: string;
  /** Handle colour (defaults to the outline colour). */
  handleColor?: string;
  leafFill?: string;
  /** Leaf outline (defaults to the outline colour). */
  leafStroke?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* carrot: thick end + leaves sticking out top-right, tip hidden in the bag */}
      <path d="M13.5 17.5 21.2 7.3c.8-1 2.3-1.1 3.2-.2.9.9.8 2.4-.2 3.2L14.9 18.9z"
        fill="#E07B39" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18.4 11.6l1.2.9M16.6 14l1.1.8" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M23.9 6.6c.2-1.9 1.3-3.3 3-3.8.1 1.8-.9 3.3-2.5 4M24.9 8.2c1.6-.9 3.4-.8 4.6.3-1.2 1-2.9 1.2-4.4.6M23 6.2c-.8-1.6-.6-3.4.5-4.6.9 1.3.9 3 0 4.4"
        fill={leafFill} stroke={leafStroke ?? color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* handles */}
      <path d="M9.6 14V11.4a2.6 2.6 0 0 1 5.2 0V14" stroke={handleColor ?? color} strokeWidth="1.7" strokeLinecap="round" />
      {/* paper bag */}
      <path d="M5.5 14h21l-1.4 13.2a2.2 2.2 0 0 1-2.2 1.9H9.1a2.2 2.2 0 0 1-2.2-1.9L5.5 14z"
        fill={bagFill} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* folded rim */}
      <path d="M5.9 17.3h20.2" stroke={rimColor ?? color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
