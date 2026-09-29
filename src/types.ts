export type NavTab = 'home' | 'search' | 'planner' | 'saved' | 'profile';
export type Screen = NavTab | 'detail';
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';
export type PlannerData = Partial<Record<number, Partial<Record<MealSlot, string>>>>;

export interface Ingredient { qty: string; name: string; }

/** One recipe, normalized from either Spoonacular or TheMealDB. */
export interface Recipe {
  id: string;
  name: string;
  desc: string;
  photo: string;
  /** Spoonacular only; null when the source doesn't provide it. */
  time: string | null;
  cals: string | null;
  servings: number | null;
  /** e.g. "Korean", "Italian" (empty if unknown). */
  cuisine: string;
  /** e.g. "main course", "Dessert" (empty if unknown). */
  category: string;
  /** All dish types + cuisines, lower-cased, for filtering. */
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  source: 'spoonacular' | 'mealdb';
  sourceUrl?: string;
}

/** A Home/Search category: either a meal type or a cuisine. */
export interface Category {
  label: string;
  kind: 'type' | 'cuisine';
  /** Value sent to Spoonacular. */
  value: string;
  /** TheMealDB equivalent for the fallback (category `c` or area `a`), if one exists. */
  mealdb?: { c?: string; a?: string };
}
