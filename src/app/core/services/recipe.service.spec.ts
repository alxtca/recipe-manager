import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';
import { SEED_RECIPES } from '../data/constants';
import { Recipe, RecipeInput } from '../models/recipe.model';

const NEW_RECIPE: RecipeInput = {
  name: 'Test Soup',
  iconKey: 'soup_kitchen',
  cuisine: 'Other',
  directions: 'Boil it.',
  ingredients: [{ name: 'Water', quantity: 1, unit: 'l' }],
};

describe('RecipeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('[home-2] seeds recipes when nothing is persisted', () => {
    const service = TestBed.inject(RecipeService);
    expect(service.recipes().length).toBe(SEED_RECIPES.length);
  });

  it('[recipe-management-2] adds a recipe attributed to the given user and persists it', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };

    const created = service.add(NEW_RECIPE, user);

    expect(service.recipes().length).toBe(SEED_RECIPES.length + 1);
    expect(created.userId).toBe('u1');
    expect(created.userName).toBe('Alice');

    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!);
    expect(persisted.length).toBe(SEED_RECIPES.length + 1);
  });

  it('[recipe-management-3] updates an existing recipe', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.update(created.id, { ...NEW_RECIPE, name: 'Updated Soup' });

    expect(service.getById(created.id)?.name).toBe('Updated Soup');
  });

  it('[recipe-rating-7] keeps one rating per user, replacing it on re-rate, and persists it', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'u1', name: 'Alice' });

    service.rate(created.id, 'u2', 8);
    service.rate(created.id, 'u2', 3);
    service.rate(created.id, 'u3', 9);

    expect(service.getById(created.id)?.ratings).toEqual({ u2: 3, u3: 9 });
    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!);
    expect(persisted.find((r: { id: string }) => r.id === created.id).ratings).toEqual({ u2: 3, u3: 9 });
  });

  it('[recipe-rating-8] lets the owner rate their own recipe', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'u1', name: 'Alice' });

    service.rate(created.id, 'u1', 10);

    expect(service.getById(created.id)?.ratings).toEqual({ u1: 10 });
  });

  it('[recipe-rating-7] keeps ratings when the recipe is edited', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'u1', name: 'Alice' });
    service.rate(created.id, 'u2', 6);

    service.update(created.id, { ...NEW_RECIPE, name: 'Renamed' });

    expect(service.getById(created.id)?.ratings).toEqual({ u2: 6 });
  });

  it('[recipe-rating-1] loads recipes saved before ratings existed as unrated', () => {
    const legacy: Partial<Recipe> = { ...SEED_RECIPES[0] };
    delete legacy.ratings;
    localStorage.setItem('rm-recipes', JSON.stringify([legacy]));

    const service = TestBed.inject(RecipeService);

    expect(service.recipes()[0].ratings).toEqual({});
  });

  it('[recipe-management-4] deletes a recipe', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.delete(created.id);

    expect(service.getById(created.id)).toBeUndefined();
  });

  it('[recipe-management-2] loads persisted recipes on a fresh instance', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    service.add(NEW_RECIPE, user);

    TestBed.resetTestingModule();
    const freshService = TestBed.inject(RecipeService);

    expect(freshService.recipes().length).toBe(SEED_RECIPES.length + 1);
  });
});
