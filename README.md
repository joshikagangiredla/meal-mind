# Meal Mind

A meal planning app that helps you plan your food in advance, so you don't have to spend time deciding what to cook every day.

Browse recipes, save the ones you like, and drop them into a weekly Breakfast / Lunch / Dinner plan.

**Live demo:** https://joshikagangiredla.github.io/meal-mind/

## Features

- **Home**: rotating hero of recommended recipes, Quick Picks, and categories
- **Search**: search by name or category, with popular search tags
- **Recipe detail**: ingredients checklist, step-by-step instructions, and "Add to Meal Plan"
- **Meal Planner**: week view with a day strip; add, open, or remove meals per slot
- **Saved**: saved recipes, filterable by category
- **Profile**: stats and settings
- A frosted bottom nav whose highlight slides between tabs

## Tech

React 18, TypeScript, Vite, and Tailwind CSS v4. Designed in Figma, prototyped in Figma Make.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Project structure

```
src/
  App.tsx              app state and navigation
  types.ts             shared types
  data/recipes.ts      recipe and category data
  components/          nav, cards, header, icons, add-meal sheet
  screens/             one file per screen
```

Food photography from [Unsplash](https://unsplash.com).
