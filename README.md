# Meal Mind

A meal planning app that helps you plan your food in advance, so you don't have to spend time deciding what to cook every day.

Browse recipes, save the ones you like, and drop them into a weekly Breakfast / Lunch / Dinner plan.

**Try it live:** https://meal-mind-virid.vercel.app

## Features

- **Home**: rotating hero of recommended recipes, Quick Picks, and categories
- **Search**: search by name or category, with popular search tags
- **Recipe detail**: ingredients checklist, step-by-step instructions, and "Add to Meal Plan"
- **Meal Planner**: week view with a day strip; add, open, or remove meals per slot
- **Saved**: saved recipes, filterable by category
- **Profile**: stats and settings
- A frosted bottom nav whose highlight slides between tabs

## Recipe data

Recipes load live from the [spoonacular Food API](https://spoonacular.com/food-api) every time the app opens, including cook time, servings and calories.
The API key stays on the server: the app calls `api/recipes.ts`, a Vercel function that adds the key and forwards the request.

If spoonacular is unavailable (for example, the free plan's daily limit is used up), the app automatically switches to [TheMealDB](https://www.themealdb.com), which shows cuisine and category instead of time and calories.

## Tech

React 18, TypeScript, Vite, Tailwind CSS v4, and a Vercel serverless function. Designed in Figma, prototyped in Figma Make.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173). With `npm run dev` there's no serverless function, so recipes come from TheMealDB.

To use spoonacular locally, install the [Vercel CLI](https://vercel.com/docs/cli), put `SPOONACULAR_API_KEY=your_key` in a `.env.local` file, and run `vercel dev`. Never commit your key.

## Project structure

```
api/
  recipes.ts           Vercel function: adds the spoonacular key server-side
src/
  App.tsx              app state and navigation
  api/recipes.ts       loads recipes (spoonacular, then TheMealDB fallback)
  types.ts             shared types
  data/constants.ts    categories, days, popular searches
  components/          nav, cards, header, icons, add-meal sheet
  screens/             one file per screen
```

