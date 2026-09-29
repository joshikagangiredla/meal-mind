import { useState } from 'react';
import { StatusBarSpacer } from '../components/StatusBar';
import PageHeader from '../components/PageHeader';

export default function ProfileScreen({ name, onNameChange, savedCount, mealsPlanned, weeksPlanned, onResetAll }: {
  name: string;
  onNameChange: (name: string) => void;
  savedCount: number;
  mealsPlanned: number;
  weeksPlanned: number;
  onResetAll: () => void;
}) {
  const [editing, setEditing] = useState(!name);
  const [draft, setDraft] = useState(name);
  const [confirmReset, setConfirmReset] = useState(false);

  function saveName() {
    onNameChange(draft.trim());
    setEditing(false);
  }

  const initial = name.trim()[0]?.toUpperCase();

  return (
    <div className="bg-cream min-h-full">
      <StatusBarSpacer />
      <div className="px-6 pt-3 pb-32">
        <PageHeader title="Profile" />

        {/* Who's cooking */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-olive flex items-center justify-center text-white text-[24px] font-bold shadow-md flex-shrink-0">
            {initial ?? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            )}
          </div>
          {editing ? (
            <form className="flex-1 min-w-0 flex gap-2" onSubmit={e => { e.preventDefault(); saveName(); }}>
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                maxLength={30}
                placeholder="Your name"
                className="flex-1 min-w-0 bg-white border border-line rounded-xl px-3 py-2 text-[15px] text-ink outline-none focus:border-olive"
              />
              <button type="submit" className="px-4 rounded-xl bg-olive text-white text-[13px] font-semibold">Save</button>
            </form>
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-bold text-ink truncate">{name ? `Hi, ${name}` : 'Hi there'}</p>
              <button onClick={() => { setDraft(name); setEditing(true); }} className="text-[13px] text-olive font-semibold">
                Edit name
              </button>
            </div>
          )}
        </div>

        {/* Stats, all counted from what's saved on this device */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Recipes Saved', value: savedCount },
            { label: 'Meals Planned', value: mealsPlanned },
            { label: 'Weeks Planned', value: weeksPlanned },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-white rounded-2xl px-3 py-3.5 text-center border border-line shadow-sm">
              <p className="text-[20px] font-bold text-olive">{stat.value}</p>
              <p className="text-[10px] text-muted mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <p className="text-[13px] font-semibold text-muted mt-8 mb-3 uppercase tracking-wide">About</p>
        <div className="bg-white rounded-2xl border border-line shadow-sm px-4 py-3.5 text-[13px] text-ink leading-relaxed">
          Meal Mind helps you plan your meals in advance so you don't have to decide what to cook every day.
          <span className="block text-[12px] text-muted mt-2">
            Your saved recipes, meal plan and grocery list are stored on this device only. Recipes powered by{' '}
            <a className="underline" href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">spoonacular</a> and{' '}
            <a className="underline" href="https://www.themealdb.com" target="_blank" rel="noreferrer">TheMealDB</a>.
          </span>
        </div>

        <button
          onClick={() => {
            if (confirmReset) { onResetAll(); setConfirmReset(false); } else setConfirmReset(true);
          }}
          onBlur={() => setConfirmReset(false)}
          className={`mt-5 w-full border text-[14px] font-semibold py-3.5 rounded-full transition-colors ${confirmReset ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500'}`}
        >
          {confirmReset ? 'Tap again to erase everything' : 'Reset all data'}
        </button>
      </div>
    </div>
  );
}
