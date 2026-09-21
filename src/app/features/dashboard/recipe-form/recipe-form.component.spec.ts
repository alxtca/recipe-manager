import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { RecipeFormComponent } from './recipe-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { RecipeService } from '../../../core/services/recipe.service';

function configure(paramId: string | null) {
  TestBed.configureTestingModule({
    imports: [RecipeFormComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap(paramId ? { id: paramId } : {}) } },
      },
    ],
  });
}

describe('RecipeFormComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts invalid and requires all fields plus at least one ingredient', () => {
    configure(null);
    const fixture = TestBed.createComponent(RecipeFormComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.form.invalid).toBeTrue();

    component.form.patchValue({
      name: 'Test',
      iconKey: 'cake',
      cuisine: 'Other',
      directions: 'Mix and bake.',
    });
    component.ingredients.at(0).patchValue({ name: 'Flour', quantity: 1, unit: 'g' });

    expect(component.form.valid).toBeTrue();
  });

  it('adds and removes ingredient rows, keeping at least one', () => {
    configure(null);
    const fixture = TestBed.createComponent(RecipeFormComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.addIngredient();
    expect(component.ingredients.length).toBe(2);

    component.removeIngredient(0);
    expect(component.ingredients.length).toBe(1);

    component.removeIngredient(0);
    expect(component.ingredients.length).toBe(1);
  });

  it('adds a new recipe attributed to the logged-in user on submit', () => {
    configure(null);
    const fixture = TestBed.createComponent(RecipeFormComponent);
    const auth = TestBed.inject(AuthService);
    const recipeService = TestBed.inject(RecipeService);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    auth.login({ id: 'u1', name: 'Alice' });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const before = recipeService.recipes().length;
    component.form.setValue({
      name: 'New Dish',
      iconKey: 'cake',
      cuisine: 'Other',
      directions: 'Do it.',
      ingredients: [{ name: 'Sugar', quantity: 1, unit: 'g' }],
    });

    component.submit();

    expect(recipeService.recipes().length).toBe(before + 1);
    expect(recipeService.recipes().at(-1)?.userId).toBe('u1');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects away when editing a recipe that is not owned by the current user', () => {
    const otherRecipe = {
      id: 'other-1',
      name: 'Not mine',
      iconKey: null,
      cuisine: 'Other',
      directions: 'x',
      ingredients: [{ name: 'x', quantity: 1, unit: 'g' }],
      userId: 'u2',
      userName: 'Bob',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    localStorage.setItem('rm-recipes', JSON.stringify([otherRecipe]));
    localStorage.setItem('rm-current-user', JSON.stringify({ id: 'u1', name: 'Alice' }));

    configure(otherRecipe.id);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const fixture = TestBed.createComponent(RecipeFormComponent);
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
