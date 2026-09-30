export type SortDirection = 'newest' | 'oldest' | 'rating';

export interface FilterState {
  userId: string | null;
  cuisine: string | null;
  includeIngredients: string[];
  excludeIngredients: string[];
  /** Minimum average rating; unrated recipes are hidden while set. */
  minRating: number | null;
  /** Only the current user's favorites; ignored while logged out. */
  favoritesOnly: boolean;
  sort: SortDirection;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  userId: null,
  cuisine: null,
  includeIngredients: [],
  excludeIngredients: [],
  minRating: null,
  favoritesOnly: false,
  sort: 'newest',
};
