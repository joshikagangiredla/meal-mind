/** Small credit line; required by Spoonacular's terms and fair to TheMealDB. */
export default function SourceNote({ source }: { source: 'spoonacular' | 'mealdb' | null }) {
  if (!source) return null;
  return (
    <p className="text-[11px] text-muted mt-6 text-center">
      {source === 'spoonacular' ? (
        <>Recipes powered by <a className="underline" href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">spoonacular</a></>
      ) : (
        <>Recipes from <a className="underline" href="https://www.themealdb.com" target="_blank" rel="noreferrer">TheMealDB</a></>
      )}
    </p>
  );
}
