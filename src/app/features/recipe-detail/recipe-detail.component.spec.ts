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

  it('shows the recipe when the id exists', () => {
    configure('r1');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.recipe()?.id).toBe('r1');
  });

  it('has no recipe when the id does not exist', () => {
    configure('missing');
    TestBed.inject(RecipeService).recipes.set([makeRecipe({ id: 'r1' })]);

    const fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.recipe()).toBeUndefined();
  });

  it('defaults to 1x portions and scales ingredient quantities', () => {
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

  it('shows edit access only to the recipe owner', () => {
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
});
