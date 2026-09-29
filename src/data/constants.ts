import type { Category } from '../types';

/** Meal types and cuisines both supported by Spoonacular's search filters. */
export const CATEGORIES: Category[] = [
  { label: 'Breakfast', kind: 'type', value: 'breakfast', mealdb: { c: 'Breakfast' } },
  { label: 'Main Course', kind: 'type', value: 'main course', mealdb: { c: 'Chicken' } },
  { label: 'Salad', kind: 'type', value: 'salad' },
  { label: 'Dessert', kind: 'type', value: 'dessert', mealdb: { c: 'Dessert' } },
  { label: 'Korean', kind: 'cuisine', value: 'Korean' },
  { label: 'Japanese', kind: 'cuisine', value: 'Japanese', mealdb: { a: 'Japanese' } },
  { label: 'Italian', kind: 'cuisine', value: 'Italian', mealdb: { a: 'Italian' } },
  { label: 'Indian', kind: 'cuisine', value: 'Indian', mealdb: { a: 'Indian' } },
  { label: 'Thai', kind: 'cuisine', value: 'Thai', mealdb: { a: 'Thai' } },
];

export const HERO_HEADLINES = ["Recipes we\nthink you'd like", 'Trending\nthis week', 'Something\nnew to try'];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DATES = [28, 29, 30, 1, 2, 3, 4];
export const POPULAR_TAGS = ['Pasta', 'Chicken', 'Soup', 'Tacos', 'Salmon', 'Curry'];
