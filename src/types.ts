export type NavTab = 'home' | 'search' | 'planner' | 'saved' | 'profile';
export type Screen = NavTab | 'detail';
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';
export type PlannerData = Partial<Record<number, Partial<Record<MealSlot, string>>>>;

export interface Ingredient { qty: string; name: string; }
export interface Recipe {
  id: string; name: string; desc: string; time: string; cals: string;
  servings: number; photo: string; category: string;
  ingredients: Ingredient[]; steps: string[];
}
