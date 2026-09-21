export type SortDirection = 'newest' | 'oldest';

export interface FilterState {
  userId: string | null;
  cuisine: string | null;
  includeIngredients: string[];
  excludeIngredients: string[];
  sort: SortDirection;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  userId: null,
  cuisine: null,
  includeIngredients: [],
  excludeIngredients: [],
  sort: 'newest',
};
