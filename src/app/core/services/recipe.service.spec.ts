import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';
import { SEED_RECIPES } from '../data/constants';
import { RecipeInput } from '../models/recipe.model';

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

  it('seeds recipes when nothing is persisted', () => {
    const service = TestBed.inject(RecipeService);
    expect(service.recipes().length).toBe(SEED_RECIPES.length);
  });

  it('adds a recipe attributed to the given user and persists it', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };

    const created = service.add(NEW_RECIPE, user);

    expect(service.recipes().length).toBe(SEED_RECIPES.length + 1);
    expect(created.userId).toBe('u1');
    expect(created.userName).toBe('Alice');

    const persisted = JSON.parse(localStorage.getItem('rm-recipes')!);
    expect(persisted.length).toBe(SEED_RECIPES.length + 1);
  });

  it('updates an existing recipe', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.update(created.id, { ...NEW_RECIPE, name: 'Updated Soup' });

    expect(service.getById(created.id)?.name).toBe('Updated Soup');
  });

  it('deletes a recipe', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    const created = service.add(NEW_RECIPE, user);

    service.delete(created.id);

    expect(service.getById(created.id)).toBeUndefined();
  });

  it('loads persisted recipes on a fresh instance', () => {
    const service = TestBed.inject(RecipeService);
    const user = { id: 'u1', name: 'Alice' };
    service.add(NEW_RECIPE, user);

    TestBed.resetTestingModule();
    const freshService = TestBed.inject(RecipeService);

    expect(freshService.recipes().length).toBe(SEED_RECIPES.length + 1);
  });
});
