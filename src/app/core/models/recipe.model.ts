export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  iconKey: string | null;
  cuisine: string;
  directions: string;
  ingredients: Ingredient[];
  userId: string;
  userName: string;
  createdAt: string;
  /** Scores keyed by user id — one rating per user per recipe. */
  ratings: Record<string, number>;
}

export type RecipeInput = Omit<Recipe, 'id' | 'userId' | 'userName' | 'createdAt' | 'ratings'>;
