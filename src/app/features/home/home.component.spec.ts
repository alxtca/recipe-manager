import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { RecipeService } from '../../core/services/recipe.service';
import { AuthService } from '../../core/services/auth.service';
import { Recipe } from '../../core/models/recipe.model';
import { DEFAULT_FILTER_STATE } from './filter-state.model';

function makeRecipe(overrides: Partial<Recipe> & { id: string }): Recipe {
  return {
    name: 'Recipe',
    iconKey: null,
    cuisine: 'Italian',
    directions: 'Do it.',
    ingredients: [{ name: 'Salt', quantity: 1, unit: 'g' }],
    userId: 'u1',
    userName: 'Alice',
    createdAt: '2026-01-01T00:00:00.000Z',
    ratings: {},
    favoritedBy: [],
    ...overrides,
  };
}

describe('HomeComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HomeComponent], providers: [provideRouter([])] });
  });

  function setRecipes(recipes: Recipe[]): HomeComponent {
    const fixture = TestBed.createComponent(HomeComponent);
    const recipeService = TestBed.inject(RecipeService);
    recipeService.recipes.set(recipes);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('[home-1, home-3] does not show pagination for 21 or fewer recipes', () => {
    const recipes = Array.from({ length: 21 }, (_, i) => makeRecipe({ id: `r${i}` }));
    const component = setRecipes(recipes);

    expect(component.showPagination()).toBeFalse();
    expect(component.pagedRecipes().length).toBe(21);
  });

  it('[home-3] shows pagination and pages results for more than 21 recipes', () => {
    const recipes = Array.from({ length: 25 }, (_, i) => makeRecipe({ id: `r${i}` }));
    const component = setRecipes(recipes);

    expect(component.showPagination()).toBeTrue();
    expect(component.pagedRecipes().length).toBe(21);

    component.onPageChange({ pageIndex: 1, pageSize: 21, length: 25 });
    expect(component.pagedRecipes().length).toBe(4);
  });

  it('[home-4] filters by user', () => {
    const recipes = [
      makeRecipe({ id: 'r1', userId: 'u1', userName: 'Alice' }),
      makeRecipe({ id: 'r2', userId: 'u2', userName: 'Bob' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, userId: 'u2' });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('[home-5] filters by cuisine', () => {
    const recipes = [
      makeRecipe({ id: 'r1', cuisine: 'Italian' }),
      makeRecipe({ id: 'r2', cuisine: 'Thai' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, cuisine: 'Thai' });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('[home-6] filters by included ingredients (must contain all)', () => {
    const recipes = [
      makeRecipe({ id: 'r1', ingredients: [{ name: 'Egg', quantity: 1, unit: 'pcs' }] }),
      makeRecipe({
        id: 'r2',
        ingredients: [
          { name: 'Egg', quantity: 1, unit: 'pcs' },
          { name: 'Flour', quantity: 1, unit: 'g' },
        ],
      }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, includeIngredients: ['Egg', 'Flour'] });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('[home-7] excludes recipes containing any excluded ingredient', () => {
    const recipes = [
      makeRecipe({ id: 'r1', ingredients: [{ name: 'Peanuts', quantity: 1, unit: 'g' }] }),
      makeRecipe({ id: 'r2', ingredients: [{ name: 'Rice', quantity: 1, unit: 'g' }] }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, excludeIngredients: ['Peanuts'] });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('[home-9] sorts by creation date, newest first by default', () => {
    const recipes = [
      makeRecipe({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeRecipe({ id: 'new', createdAt: '2026-06-01T00:00:00.000Z' }),
    ];
    const component = setRecipes(recipes);

    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['new', 'old']);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, sort: 'oldest' });
    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['old', 'new']);
  });

  it('[recipe-rating-10] filters by minimum average rating and hides unrated recipes', () => {
    const recipes = [
      makeRecipe({ id: 'high', ratings: { u1: 8, u2: 7 } }),
      makeRecipe({ id: 'exact', ratings: { u1: 7 } }),
      makeRecipe({ id: 'low', ratings: { u1: 6, u2: 7 } }),
      makeRecipe({ id: 'unrated' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, minRating: 7 });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['high', 'exact']);
  });

  it('[recipe-rating-11] combines the rating filter with other filters', () => {
    const recipes = [
      makeRecipe({ id: 'thai-high', cuisine: 'Thai', ratings: { u1: 9 } }),
      makeRecipe({ id: 'thai-low', cuisine: 'Thai', ratings: { u1: 3 } }),
      makeRecipe({ id: 'italian-high', cuisine: 'Italian', ratings: { u1: 9 } }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, cuisine: 'Thai', minRating: 5 });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['thai-high']);
  });

  it('[recipe-rating-12] sorts by rating, highest first, unrated last, ties newest first', () => {
    const recipes = [
      makeRecipe({ id: 'unrated', createdAt: '2026-09-01T00:00:00.000Z' }),
      makeRecipe({ id: 'mid-old', ratings: { u1: 6 }, createdAt: '2026-01-01T00:00:00.000Z' }),
      makeRecipe({ id: 'top', ratings: { u1: 10, u2: 8 }, createdAt: '2026-02-01T00:00:00.000Z' }),
      makeRecipe({ id: 'mid-new', ratings: { u1: 6 }, createdAt: '2026-03-01T00:00:00.000Z' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, sort: 'rating' });

    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['top', 'mid-new', 'mid-old', 'unrated']);
  });

  it('[recipe-rating-13] keeps date added (newest first) as the default sort when recipes are rated', () => {
    const recipes = [
      makeRecipe({ id: 'old-top', ratings: { u1: 10 }, createdAt: '2026-01-01T00:00:00.000Z' }),
      makeRecipe({ id: 'new-low', ratings: { u1: 1 }, createdAt: '2026-06-01T00:00:00.000Z' }),
    ];
    const component = setRecipes(recipes);

    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['new-low', 'old-top']);
  });

  it('[recipe-rating-5, recipe-rating-6] saves a rating given on a card for the logged-in user', () => {
    const component = setRecipes([makeRecipe({ id: 'r1', ratings: { u2: 4 } })]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });
    const recipeService = TestBed.inject(RecipeService);

    component.onRate('r1', 8);
    expect(recipeService.getById('r1')?.ratings).toEqual({ u2: 4, u1: 8 });

    component.onRate('r1', 5);
    expect(recipeService.getById('r1')?.ratings).toEqual({ u2: 4, u1: 5 });
  });

  it('[recipe-rating-4] ignores rating attempts from anonymous users', () => {
    const component = setRecipes([makeRecipe({ id: 'r1' })]);

    component.onRate('r1', 8);

    expect(TestBed.inject(RecipeService).getById('r1')?.ratings).toEqual({});
  });

  it('[recipe-favorites-8] filters to the logged-in user\'s favorites', () => {
    const component = setRecipes([
      makeRecipe({ id: 'mine', favoritedBy: ['u1'] }),
      makeRecipe({ id: 'others', favoritedBy: ['u2'] }),
      makeRecipe({ id: 'none' }),
    ]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, favoritesOnly: true });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['mine']);
  });

  it('[recipe-favorites-9] combines the favorites filter with other filters', () => {
    const component = setRecipes([
      makeRecipe({ id: 'fav-thai', cuisine: 'Thai', favoritedBy: ['u1'] }),
      makeRecipe({ id: 'fav-italian', cuisine: 'Italian', favoritedBy: ['u1'] }),
      makeRecipe({ id: 'thai', cuisine: 'Thai' }),
    ]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, favoritesOnly: true, cuisine: 'Thai' });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['fav-thai']);
  });

  it('[recipe-favorites-10] shows the empty-state message when the user has no favorites', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });
    fixture.componentInstance.onFilterChange({ ...DEFAULT_FILTER_STATE, favoritesOnly: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No recipes match the selected filters.');
  });

  it('[recipe-favorites-1] hides the favorites checkbox and ignores favorite toggles when logged out', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-checkbox')).toBeNull();

    fixture.componentInstance.onToggleFavorite('r1');
    expect(TestBed.inject(RecipeService).getById('r1')?.favoritedBy).toEqual([]);
  });

  it('[recipe-favorites-1, recipe-favorites-8] shows the favorites checkbox to logged-in users', () => {
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-checkbox')?.textContent).toContain('Favorites');
  });

  it('[recipe-favorites-2, recipe-favorites-3] toggles a favorite from a card for the logged-in user', () => {
    const component = setRecipes([makeRecipe({ id: 'r1' })]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });
    const recipeService = TestBed.inject(RecipeService);

    component.onToggleFavorite('r1');
    expect(recipeService.getById('r1')?.favoritedBy).toEqual(['u1']);

    component.onToggleFavorite('r1');
    expect(recipeService.getById('r1')?.favoritedBy).toEqual([]);
  });
});
