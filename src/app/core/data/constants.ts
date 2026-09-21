import { Recipe } from '../models/recipe.model';
import { User } from '../models/user.model';

export const CUISINES: string[] = [
  'Italian',
  'Mexican',
  'Indian',
  'Chinese',
  'American',
  'French',
  'Japanese',
  'Mediterranean',
  'Thai',
  'Other',
];

export const UNITS: string[] = ['g', 'kg', 'ml', 'l', 'cups', 'tbsp', 'tsp', 'pcs'];

export const RECIPE_ICONS: string[] = [
  'lunch_dining',
  'ramen_dining',
  'local_pizza',
  'bakery_dining',
  'icecream',
  'egg_alt',
  'rice_bowl',
  'soup_kitchen',
  'kebab_dining',
  'set_meal',
  'cake',
  'coffee',
];

export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'u3', name: 'Chen' },
  { id: 'u4', name: 'Diego' },
  { id: 'u5', name: 'Emma' },
];

function userName(userId: string): string {
  return DEMO_USERS.find((u) => u.id === userId)?.name ?? 'Unknown';
}

const seed: Omit<Recipe, 'userName'>[] = [
  {
    id: 'r1',
    name: 'Margherita Pizza',
    iconKey: 'local_pizza',
    cuisine: 'Italian',
    directions:
      'Stretch the dough into a round. Spread tomato sauce, top with mozzarella and basil, then bake at 250°C for 8-10 minutes.',
    ingredients: [
      { name: 'Pizza dough', quantity: 1, unit: 'pcs' },
      { name: 'Tomato sauce', quantity: 200, unit: 'ml' },
      { name: 'Mozzarella', quantity: 150, unit: 'g' },
      { name: 'Basil', quantity: 10, unit: 'g' },
    ],
    userId: 'u1',
    createdAt: '2026-09-09T09:00:00.000Z',
  },
  {
    id: 'r2',
    name: 'Chicken Tikka Masala',
    iconKey: 'set_meal',
    cuisine: 'Indian',
    directions:
      'Marinate chicken in yogurt and spices. Sear, then simmer in tomato sauce with garam masala until tender.',
    ingredients: [
      { name: 'Chicken', quantity: 500, unit: 'g' },
      { name: 'Yogurt', quantity: 200, unit: 'ml' },
      { name: 'Tomato', quantity: 300, unit: 'g' },
      { name: 'Garam masala', quantity: 2, unit: 'tbsp' },
    ],
    userId: 'u2',
    createdAt: '2026-09-10T09:00:00.000Z',
  },
  {
    id: 'r3',
    name: 'Beef Tacos',
    iconKey: 'kebab_dining',
    cuisine: 'Mexican',
    directions: 'Brown the beef with spices, warm the taco shells, then assemble with lettuce and cheese.',
    ingredients: [
      { name: 'Beef', quantity: 400, unit: 'g' },
      { name: 'Taco shells', quantity: 8, unit: 'pcs' },
      { name: 'Lettuce', quantity: 100, unit: 'g' },
      { name: 'Cheese', quantity: 100, unit: 'g' },
    ],
    userId: 'u3',
    createdAt: '2026-09-11T09:00:00.000Z',
  },
  {
    id: 'r4',
    name: 'Kung Pao Chicken',
    iconKey: 'rice_bowl',
    cuisine: 'Chinese',
    directions: 'Stir-fry chicken with peanuts and chili, finish with soy sauce, and serve over rice.',
    ingredients: [
      { name: 'Chicken', quantity: 400, unit: 'g' },
      { name: 'Peanuts', quantity: 50, unit: 'g' },
      { name: 'Soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'Chili', quantity: 2, unit: 'pcs' },
    ],
    userId: 'u4',
    createdAt: '2026-09-12T09:00:00.000Z',
  },
  {
    id: 'r5',
    name: 'Classic Cheeseburger',
    iconKey: 'lunch_dining',
    cuisine: 'American',
    directions: 'Grill the patty, melt cheese on top, and assemble in a bun with lettuce.',
    ingredients: [
      { name: 'Beef patty', quantity: 1, unit: 'pcs' },
      { name: 'Cheese', quantity: 1, unit: 'pcs' },
      { name: 'Bun', quantity: 1, unit: 'pcs' },
      { name: 'Lettuce', quantity: 20, unit: 'g' },
    ],
    userId: 'u5',
    createdAt: '2026-09-13T09:00:00.000Z',
  },
  {
    id: 'r6',
    name: 'Ratatouille',
    iconKey: null,
    cuisine: 'French',
    directions: 'Slice vegetables thinly, layer with tomato, and bake slowly until tender.',
    ingredients: [
      { name: 'Eggplant', quantity: 1, unit: 'pcs' },
      { name: 'Zucchini', quantity: 1, unit: 'pcs' },
      { name: 'Tomato', quantity: 300, unit: 'g' },
      { name: 'Bell pepper', quantity: 1, unit: 'pcs' },
    ],
    userId: 'u1',
    createdAt: '2026-09-14T09:00:00.000Z',
  },
  {
    id: 'r7',
    name: 'Chicken Ramen',
    iconKey: 'ramen_dining',
    cuisine: 'Japanese',
    directions: 'Simmer chicken broth, cook noodles, then top with soft-boiled egg and scallion.',
    ingredients: [
      { name: 'Noodles', quantity: 200, unit: 'g' },
      { name: 'Chicken broth', quantity: 500, unit: 'ml' },
      { name: 'Egg', quantity: 2, unit: 'pcs' },
      { name: 'Scallion', quantity: 20, unit: 'g' },
    ],
    userId: 'u2',
    createdAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'r8',
    name: 'Greek Salad',
    iconKey: null,
    cuisine: 'Mediterranean',
    directions: 'Chop vegetables, combine with feta and olives, and dress with olive oil.',
    ingredients: [
      { name: 'Cucumber', quantity: 1, unit: 'pcs' },
      { name: 'Feta', quantity: 100, unit: 'g' },
      { name: 'Olives', quantity: 50, unit: 'g' },
      { name: 'Tomato', quantity: 200, unit: 'g' },
    ],
    userId: 'u3',
    createdAt: '2026-09-16T09:00:00.000Z',
  },
  {
    id: 'r9',
    name: 'Pad Thai',
    iconKey: 'rice_bowl',
    cuisine: 'Thai',
    directions: 'Soak rice noodles, stir-fry with shrimp and egg, and finish with crushed peanuts.',
    ingredients: [
      { name: 'Rice noodles', quantity: 200, unit: 'g' },
      { name: 'Shrimp', quantity: 150, unit: 'g' },
      { name: 'Peanuts', quantity: 30, unit: 'g' },
      { name: 'Egg', quantity: 1, unit: 'pcs' },
    ],
    userId: 'u4',
    createdAt: '2026-09-17T09:00:00.000Z',
  },
  {
    id: 'r10',
    name: 'Chocolate Cake',
    iconKey: 'cake',
    cuisine: 'Other',
    directions: 'Mix dry and wet ingredients, pour into a pan, and bake at 180°C for 35 minutes.',
    ingredients: [
      { name: 'Flour', quantity: 300, unit: 'g' },
      { name: 'Sugar', quantity: 200, unit: 'g' },
      { name: 'Cocoa powder', quantity: 50, unit: 'g' },
      { name: 'Egg', quantity: 3, unit: 'pcs' },
    ],
    userId: 'u5',
    createdAt: '2026-09-18T09:00:00.000Z',
  },
];

export const SEED_RECIPES: Recipe[] = seed.map((r) => ({ ...r, userName: userName(r.userId) }));
