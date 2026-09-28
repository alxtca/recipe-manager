import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RecipeDetailComponent } from './recipe-detail.component';
import { AuthService } from '../../core/services/auth.service';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';

function makeRecipe(overrides: Partial<Recipe> & { id: string }): Recipe {
  return {
    name: 'Recipe',
    iconKey: null,
    cuisine: 'Italian',
    directions: 'Do it.',
    ingredients: [{ name: 'Flour', quantity: 100, unit: 'g' }],
    userId: 'u1',
    userName: 'Alice',
    createdAt: '2026-01-01T00:00:00.000Z',
    ratings: {},
    ...overrides,
  };
}

function configure(id: string) {
  TestBed.configureTestingModule({
    imports: [RecipeDetailComponent],
    providers: [
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
    ],
  });
}

describe('RecipeDetailComponent', () => {
  beforeEach(() => localStorage.clear());

  it('[recipe-detail-2] shows the recipe when the id exists', () => {
    configure('r1');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.recipe()?.id).toBe('r1');
  });

  it('[application-2] has no recipe when the id does not exist', () => {
    configure('missing');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.recipe()).toBeUndefined();
  });

  it('[recipe-detail-3, recipe-detail-4, recipe-detail-5] defaults to 1x portions and scales ingredient quantities', () => {
    configure('r1');
    TestBed.inject(RecipeService).recipes.set([
      makeRecipe({ id: 'r1', ingredients: [{ name: 'Flour', quantity: 100, unit: 'g' }] }),
    ]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.portions()).toBe(1);
    expect(component.scaledIngredients()).toEqual([{ name: 'Flour', quantity: 100, unit: 'g' }]);

    component.selectPortions(2);
    expect(component.scaledIngredients()).toEqual([{ name: 'Flour', quantity: 200, unit: 'g' }]);

    component.selectPortions(0.5);
    expect(component.scaledIngredients()).toEqual([{ name: 'Flour', quantity: 50, unit: 'g' }]);
  });

  it('[recipe-detail-6, recipe-detail-7, recipe-detail-8] shows edit access only to the recipe owner', () => {
    configure('r1');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1', userId: 'u1' })]);
    const auth = TestBed.inject(AuthService);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.isOwner()).toBeFalse();

    auth.login({ id: 'u1', name: 'Alice' });
    expect(component.isOwner()).toBeTrue();

    auth.login({ id: 'u2', name: 'Bob' });
    expect(component.isOwner()).toBeFalse();
  });

  it('[recipe-rating-2, recipe-rating-3] shows the average rating and count, or "Not rated yet"', () => {
    configure('r1');
    const recipeService = TestBed.inject(RecipeService);
    recipeService.recipes.set([makeRecipe({ id: 'r1' })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Not rated yet');

    recipeService.recipes.set([makeRecipe({ id: 'r1', ratings: { u1: 7, u2: 8, u3: 8 } })]);
    fixture.detectChanges();

    expect(element.textContent).toContain('7.7 (3)');
  });

  it('[recipe-rating-4] shows no rating controls to anonymous users', () => {
    configure('r1');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1', ratings: { u2: 6 } })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
    const buttons = [...fixture.nativeElement.querySelectorAll('button')].map((b: HTMLElement) => b.textContent?.trim());

    expect(buttons).not.toContain('Rate');
    expect(buttons).not.toContain('Edit');
  });

  it('[recipe-rating-5, recipe-rating-6, recipe-rating-8] rates and re-rates a recipe, including one the user owns', () => {
    configure('r1');
    const recipeService = TestBed.inject(RecipeService);
    recipeService.recipes.set([makeRecipe({ id: 'r1', userId: 'u1', ratings: { u2: 4 } })]);
    TestBed.inject(AuthService).login({ id: 'u1', name: 'Alice' });

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.rate(8);
    expect(component.userRating()).toBe(8);
    expect(component.average()).toBe(6);
    expect(component.ratingCount()).toBe(2);

    component.rate(10);
    expect(component.userRating()).toBe(10);
    expect(component.average()).toBe(7);
    expect(component.ratingCount()).toBe(2);
  });
});
