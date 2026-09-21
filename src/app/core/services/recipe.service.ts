import { Injectable, signal } from '@angular/core';
import { Recipe, RecipeInput } from '../models/recipe.model';
import { User } from '../models/user.model';
import { SEED_RECIPES } from '../data/constants';

const STORAGE_KEY = 'rm-recipes';

function generateId(): string {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  readonly recipes = signal<Recipe[]>(this.loadRecipes());

  getById(id: string): Recipe | undefined {
    return this.recipes().find((r) => r.id === id);
  }

  add(input: RecipeInput, user: User): Recipe {
    const recipe: Recipe = {
      ...input,
      id: generateId(),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
    };
    this.recipes.update((list) => [...list, recipe]);
    this.persist();
    return recipe;
  }

  update(id: string, input: RecipeInput): void {
    this.recipes.update((list) =>
      list.map((r) => (r.id === id ? { ...r, ...input } : r)),
    );
    this.persist();
  }

  delete(id: string): void {
    this.recipes.update((list) => list.filter((r) => r.id !== id));
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes()));
  }

  private loadRecipes(): Recipe[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return SEED_RECIPES;
    }
    try {
      const parsed = JSON.parse(raw) as Recipe[];
      return Array.isArray(parsed) ? parsed : SEED_RECIPES;
    } catch {
      return SEED_RECIPES;
    }
  }
}
