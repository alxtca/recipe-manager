import { Recipe } from '../models/recipe.model';

/** Average of all ratings given for the recipe, or null when it has none. */
export function averageRating(recipe: Recipe): number | null {
  const scores = Object.values(recipe.ratings);
  if (!scores.length) {
    return null;
  }
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function ratingCount(recipe: Recipe): number {
  return Object.keys(recipe.ratings).length;
}
