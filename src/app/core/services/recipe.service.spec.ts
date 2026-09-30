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
    const user = { id: 'user1', name: 'Alice' };

    const created = service.add(NEW_RECIPE, user);

    expect(service.recipes().length).toBe(SEED_RECIPES.length + 1);
    expect(created.userId).toBe('user1');
    expect(created.userName).toBe('Alice');

    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!);
    expect(persisted.length).toBe(SEED_RECIPES.length + 1);
  });

  it('[recipe-management-3] updates an existing recipe', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'user1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.update(created.id, { ...NEW_RECIPE, name: 'Updated Soup' });

    expect(service.getById(created.id)?.name).toBe('Updated Soup');
  });

  it('[recipe-rating-7] keeps one rating per user, replacing it on re-rate, and persists it', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });

    service.rate(created.id, 'user2', 8);
    service.rate(created.id, 'user2', 3);
    service.rate(created.id, 'user3', 9);

    expect(service.getById(created.id)?.ratings).toEqual({ user2: 3, user3: 9 });
    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!);
    expect(persisted.find((r: { id: string }) => r.id === created.id).ratings).toEqual({ user2: 3, user3: 9 });
  });

  it('[recipe-rating-8] lets the owner rate their own recipe', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });

    service.rate(created.id, 'user1', 10);

    expect(service.getById(created.id)?.ratings).toEqual({ user1: 10 });
  });

  it('[recipe-rating-7] keeps ratings when the recipe is edited', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });
    service.rate(created.id, 'user2', 6);

    service.update(created.id, { ...NEW_RECIPE, name: 'Renamed' });

    expect(service.getById(created.id)?.ratings).toEqual({ user2: 6 });
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
    const user = { id: 'user1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.delete(created.id);

    expect(service.getById(created.id)).toBeUndefined();
  });

  it('[recipe-management-2] loads persisted recipes on a fresh instance', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'user1', name: 'Alice' };
    service.add(NEW_RECIPE, user);

    TestBed.resetTestingModule();
    const freshService = TestBed.inject(RecipeService);

    expect(freshService.recipes().length).toBe(SEED_RECIPES.length + 1);
  });


  it('[recipe-favorites-2, recipe-favorites-3, recipe-favorites-6] toggles a favorite per user', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });

    service.toggleFavorite(created.id, 'user2');
    service.toggleFavorite(created.id, 'user3');
    expect(service.getById(created.id)?.favoritedBy).toEqual(['user2', 'user3']);

    service.toggleFavorite(created.id, 'user2');
    expect(service.getById(created.id)?.favoritedBy).toEqual(['user3']);
  });

  it('[recipe-favorites-5] lets the owner favorite their own recipe', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });

    service.toggleFavorite(created.id, 'user1');

    expect(service.getById(created.id)?.favoritedBy).toEqual(['user1']);
  });

  it('[recipe-favorites-7] persists favorites and keeps them when the recipe is edited', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });
    service.toggleFavorite(created.id, 'user2');
    service.update(created.id, { ...NEW_RECIPE, name: 'Renamed' });

    TestBed.resetTestingModule();
    const freshService = TestBed.inject(RecipeService);

    expect(freshService.getById(created.id)?.favoritedBy).toEqual(['user2']);
  });

  it('[recipe-favorites-7] loads recipes saved before favorites existed with no favorites', () => {
    const legacy: Partial<Recipe> = { ...SEED_RECIPES[0] };
    delete legacy.favoritedBy;
    localStorage.setItem('rm-recipes', JSON.stringify([legacy]));

    const service = TestBed.inject(RecipeService);

    expect(service.recipes()[0].favoritedBy).toEqual([]);
  });

  it('[recipe-favorites-11] deleting a recipe removes it from every favorites list', () => {
    const service = TestBed.inject(RecipeService);
    const created = service.add(NEW_RECIPE, { id: 'user1', name: 'Alice' });
    service.toggleFavorite(created.id, 'user2');

    service.delete(created.id);

    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!) as Recipe[];
    expect(persisted.some((r) => r.favoritedBy.includes('user2'))).toBeFalse();
  });
});
