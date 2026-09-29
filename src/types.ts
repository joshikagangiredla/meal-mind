export type NavTab = 'home' | 'search' | 'planner' | 'saved' | 'profile';
export type Screen = NavTab | 'detail';
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';
/** Meals by calendar date ("2026-09-29") → slot → recipe id. */
export type PlannerData = Record<string, Partial<Record<MealSlot, string>>>;

export interface Ingredient {
  qty: string;
  name: string;
  /** Numeric amount + unit when known, used to add up the grocery list. */
  amount?: number;
  unit?: string;
}

export interface GroceryItem {
  /** Lower-cased ingredient name + unit, so the same item merges across recipes. */
  key: string;
  name: string;
  qty: string;
  checked: boolean;
  /** Names of the planned recipes that need this item. */
  recipes: string[];
}

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
  /**
   * True when only id/name/photo are known (restored after a refresh).
   * Spoonacular's terms only allow storing those three, so the rest is
   * fetched again when the recipe is opened.
   */
  stub?: boolean;
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
