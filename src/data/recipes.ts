import type { Recipe } from '../types';

const img = (id: string, w = 400, h = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const RECIPES: Recipe[] = [
  {
    id: '1', name: 'Bulgogi (Korean BBQ Beef)',
    desc: 'Tender thinly-sliced ribeye in a soy-sesame glaze, flash-grilled over rice.',
    time: '30 min', cals: '520 kcal', servings: 2, category: 'Asian',
    photo: img('photo-1646299501330-c46c84c0c936', 800, 600),
    ingredients: [
      { qty: '500g', name: 'Ribeye beef, thinly sliced' },
      { qty: '3 tbsp', name: 'Soy sauce' },
      { qty: '2 tbsp', name: 'Sesame oil' },
      { qty: '1 tbsp', name: 'Brown sugar' },
      { qty: '4 cloves', name: 'Garlic, minced' },
      { qty: '1 tsp', name: 'Fresh ginger, grated' },
      { qty: '2', name: 'Green onions, sliced' },
      { qty: '1 tbsp', name: 'Sesame seeds' },
      { qty: '2 cups', name: 'Cooked white rice' },
    ],
    steps: [
      'Combine soy sauce, sesame oil, brown sugar, garlic and ginger in a bowl.',
      'Add sliced beef, toss to coat, and marinate for at least 30 minutes.',
      'Heat a cast iron skillet or grill pan over high heat until smoking.',
      'Cook beef in batches for 2–3 minutes per side until caramelised.',
      'Garnish with green onions and sesame seeds. Serve over steamed rice.',
    ],
  },
  {
    id: '2', name: 'French Toast',
    desc: 'Golden brioche in vanilla-cinnamon custard, pan-fried to perfection.',
    time: '20 min', cals: '380 kcal', servings: 2, category: 'Breakfast',
    photo: img('photo-1484723091739-30a097e8f929', 800, 600),
    ingredients: [
      { qty: '4 slices', name: 'Thick brioche bread' },
      { qty: '3', name: 'Large eggs' },
      { qty: '80ml', name: 'Whole milk' },
      { qty: '1 tsp', name: 'Vanilla extract' },
      { qty: '1 tsp', name: 'Ground cinnamon' },
      { qty: '2 tbsp', name: 'Unsalted butter' },
      { qty: 'To taste', name: 'Maple syrup and fresh berries' },
    ],
    steps: [
      'Whisk eggs, milk, vanilla and cinnamon in a shallow bowl.',
      'Dip each brioche slice for 15 seconds per side.',
      'Melt butter in a non-stick skillet over medium heat.',
      'Cook bread for 2–3 minutes per side until deep golden brown.',
      'Serve warm with maple syrup, powdered sugar and fresh berries.',
    ],
  },
  {
    id: '3', name: 'Kimchi Jjigae',
    desc: 'Deeply savory Korean stew with fermented kimchi, silken tofu and pork belly.',
    time: '40 min', cals: '440 kcal', servings: 3, category: 'Asian',
    photo: img('photo-1760228865341-675704c22a5b', 800, 600),
    ingredients: [
      { qty: '2 cups', name: 'Well-fermented kimchi, chopped' },
      { qty: '200g', name: 'Pork belly, thinly sliced' },
      { qty: '300g', name: 'Silken tofu' },
      { qty: '2 cups', name: 'Anchovy or chicken stock' },
      { qty: '1 tbsp', name: 'Gochugaru (Korean chili flakes)' },
      { qty: '1 tbsp', name: 'Soy sauce' },
      { qty: '2', name: 'Green onions, to garnish' },
    ],
    steps: [
      'Sauté pork belly in a heavy pot until lightly browned and fat renders.',
      'Add kimchi and cook for 5 minutes until fragrant.',
      'Pour in stock, bring to a rolling boil.',
      'Add gochugaru and soy sauce, reduce heat and simmer 20 minutes.',
      'Gently add tofu in large chunks, simmer 5 more minutes. Top with green onions.',
    ],
  },
  {
    id: '4', name: 'Chicken Stir Fry',
    desc: 'Crispy chicken and seasonal vegetables in a savory ginger-garlic sauce.',
    time: '25 min', cals: '390 kcal', servings: 2, category: 'Quick Meals',
    photo: img('photo-1601226809816-b8c32440158a', 800, 600),
    ingredients: [
      { qty: '400g', name: 'Chicken breast, thinly sliced' },
      { qty: '1', name: 'Red bell pepper, sliced' },
      { qty: '1 cup', name: 'Broccoli florets' },
      { qty: '2 tbsp', name: 'Oyster sauce' },
      { qty: '1 tbsp', name: 'Soy sauce' },
      { qty: '3 cloves', name: 'Garlic, minced' },
      { qty: '1 tsp', name: 'Fresh ginger, grated' },
      { qty: '2 tbsp', name: 'Vegetable oil' },
    ],
    steps: [
      'Toss chicken with soy sauce and a pinch of cornstarch; marinate 10 minutes.',
      'Heat a wok over high heat until smoking, then add oil.',
      'Stir-fry chicken until golden and cooked through, about 4 minutes. Set aside.',
      'Add vegetables and stir-fry for 3 minutes until tender-crisp.',
      'Return chicken, add oyster sauce, garlic and ginger. Toss and serve over rice.',
    ],
  },
  {
    id: '5', name: 'Pasta Carbonara',
    desc: 'Classic Roman pasta with guanciale, egg yolks, Pecorino and black pepper.',
    time: '20 min', cals: '610 kcal', servings: 2, category: 'Quick Meals',
    photo: img('photo-1546549032-9571cd6b27df', 800, 600),
    ingredients: [
      { qty: '200g', name: 'Spaghetti or rigatoni' },
      { qty: '100g', name: 'Guanciale or pancetta, diced' },
      { qty: '3', name: 'Egg yolks' },
      { qty: '50g', name: 'Pecorino Romano, finely grated' },
      { qty: '1 tsp', name: 'Black pepper, coarsely ground' },
      { qty: 'As needed', name: 'Reserved pasta water' },
    ],
    steps: [
      'Cook pasta until al dente. Reserve 1 cup pasta water before draining.',
      'Fry guanciale in a wide pan until rendered and crispy.',
      'Whisk egg yolks with Pecorino and plenty of black pepper.',
      'Remove pan from heat; add drained pasta and toss with guanciale fat.',
      'Add egg mixture, splash in pasta water and toss vigorously until silky.',
    ],
  },
  {
    id: '6', name: 'Avocado Toast',
    desc: 'Smashed avocado on sourdough with a poached egg and chili flakes.',
    time: '15 min', cals: '310 kcal', servings: 1, category: 'Breakfast',
    photo: img('photo-1525351484163-7529414344d8', 800, 600),
    ingredients: [
      { qty: '2 slices', name: 'Sourdough bread, thick-cut' },
      { qty: '1 large', name: 'Ripe Hass avocado' },
      { qty: '2', name: 'Eggs, poached' },
      { qty: '1 tbsp', name: 'Fresh lemon juice' },
      { qty: 'Pinch', name: 'Red chili flakes' },
      { qty: 'To taste', name: 'Flaky sea salt and black pepper' },
    ],
    steps: [
      'Toast sourdough slices until golden and crisp throughout.',
      'Halve the avocado, remove the pit, and scoop into a bowl.',
      'Mash avocado with lemon juice, salt and pepper until chunky-smooth.',
      'Poach eggs in barely simmering salted water for 3 minutes.',
      'Spread avocado on toast, top with eggs, chili flakes and a pinch of sea salt.',
    ],
  },
  {
    id: '7', name: 'Veggie Buddha Bowl',
    desc: 'Roasted chickpeas, quinoa and fresh greens with creamy tahini dressing.',
    time: '35 min', cals: '420 kcal', servings: 2, category: 'Vegetarian',
    photo: img('photo-1568158879083-c42860933ed7', 800, 600),
    ingredients: [
      { qty: '1 cup', name: 'Quinoa, rinsed' },
      { qty: '400g', name: 'Chickpeas, drained and dried' },
      { qty: '2 cups', name: 'Baby spinach and mixed greens' },
      { qty: '1', name: 'Ripe avocado, sliced' },
      { qty: '1', name: 'Lebanese cucumber, diced' },
      { qty: '3 tbsp', name: 'Tahini' },
      { qty: '2 tbsp', name: 'Lemon juice' },
    ],
    steps: [
      'Cook quinoa in 2 cups water with a pinch of salt, 15 minutes.',
      'Toss chickpeas with olive oil, paprika and cumin; roast at 200°C 20 minutes.',
      'Whisk tahini, lemon juice, garlic and 3 tbsp water until smooth.',
      'Arrange quinoa, greens, chickpeas, avocado and cucumber in bowls.',
      'Drizzle tahini dressing generously over everything and serve.',
    ],
  },
  {
    id: '8', name: 'Chocolate Lava Cake',
    desc: 'Warm dark chocolate cake with a molten center and vanilla ice cream.',
    time: '25 min', cals: '480 kcal', servings: 2, category: 'Desserts',
    photo: img('photo-1517427294546-5aa121f68e8a', 800, 600),
    ingredients: [
      { qty: '100g', name: 'Dark chocolate (70%), chopped' },
      { qty: '100g', name: 'Unsalted butter, cubed' },
      { qty: '2', name: 'Whole eggs, room temperature' },
      { qty: '2', name: 'Extra egg yolks' },
      { qty: '60g', name: 'Caster sugar' },
      { qty: '30g', name: 'All-purpose flour' },
      { qty: '2 scoops', name: 'Vanilla bean ice cream, to serve' },
    ],
    steps: [
      'Preheat oven to 200°C. Butter and flour two 180ml ramekins.',
      'Melt chocolate and butter in a heatproof bowl over simmering water.',
      'Whisk eggs, yolks and sugar until pale and doubled in volume.',
      'Fold chocolate mixture into eggs, then gently fold in flour.',
      'Fill ramekins and bake 10–12 minutes. Edges should be set but centres liquid.',
    ],
  },
];

export const CATEGORIES = [
  { name: 'Breakfast', photo: img('photo-1484723091739-30a097e8f929', 300, 200) },
  { name: 'Quick Meals', photo: img('photo-1601226809816-b8c32440158a', 300, 200) },
  { name: 'Vegetarian', photo: img('photo-1568158879083-c42860933ed7', 300, 200) },
  { name: 'Asian', photo: img('photo-1646299501330-c46c84c0c936', 300, 200) },
  { name: 'Desserts', photo: img('photo-1517427294546-5aa121f68e8a', 300, 200) },
];

export const HERO_SLIDES = [
  { id: '1', headline: "Recipes we\nthink you'd like" },
  { id: '3', headline: 'Trending\nthis week' },
  { id: '5', headline: 'Quick\nweeknight dinners' },
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DATES = [28, 29, 30, 1, 2, 3, 4];
export const POPULAR_TAGS = ['Pasta recipes', 'High protein', 'Under 30 min', 'Meal prep', 'Vegetarian', 'Korean food'];

export const getRecipe = (id: string) => RECIPES.find(r => r.id === id)!;
