import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { RecipeService } from '../../core/services/recipe.service';
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

  it('does not show pagination for 21 or fewer recipes', () => {
    const recipes = Array.from({ length: 21 }, (_, i) => makeRecipe({ id: `r${i}` }));
    const component = setRecipes(recipes);

    expect(component.showPagination()).toBeFalse();
    expect(component.pagedRecipes().length).toBe(21);
  });

  it('shows pagination and pages results for more than 21 recipes', () => {
    const recipes = Array.from({ length: 25 }, (_, i) => makeRecipe({ id: `r${i}` }));
    const component = setRecipes(recipes);

    expect(component.showPagination()).toBeTrue();
    expect(component.pagedRecipes().length).toBe(21);

    component.onPageChange({ pageIndex: 1, pageSize: 21, length: 25 });
    expect(component.pagedRecipes().length).toBe(4);
  });

  it('filters by user', () => {
    const recipes = [
      makeRecipe({ id: 'r1', userId: 'u1', userName: 'Alice' }),
      makeRecipe({ id: 'r2', userId: 'u2', userName: 'Bob' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, userId: 'u2' });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('filters by cuisine', () => {
    const recipes = [
      makeRecipe({ id: 'r1', cuisine: 'Italian' }),
      makeRecipe({ id: 'r2', cuisine: 'Thai' }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, cuisine: 'Thai' });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('filters by included ingredients (must contain all)', () => {
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

  it('excludes recipes containing any excluded ingredient', () => {
    const recipes = [
      makeRecipe({ id: 'r1', ingredients: [{ name: 'Peanuts', quantity: 1, unit: 'g' }] }),
      makeRecipe({ id: 'r2', ingredients: [{ name: 'Rice', quantity: 1, unit: 'g' }] }),
    ];
    const component = setRecipes(recipes);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, excludeIngredients: ['Peanuts'] });

    expect(component.filteredRecipes().map((r) => r.id)).toEqual(['r2']);
  });

  it('sorts by creation date, newest first by default', () => {
    const recipes = [
      makeRecipe({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeRecipe({ id: 'new', createdAt: '2026-06-01T00:00:00.000Z' }),
    ];
    const component = setRecipes(recipes);

    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['new', 'old']);

    component.onFilterChange({ ...DEFAULT_FILTER_STATE, sort: 'oldest' });
    expect(component.sortedRecipes().map((r) => r.id)).toEqual(['old', 'new']);
  });
});
