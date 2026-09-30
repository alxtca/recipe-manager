import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RecipeService } from '../../core/services/recipe.service';
import { AuthService } from '../../core/services/auth.service';
import { averageRating } from '../../core/utils/rating';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipeFilterComponent } from './recipe-filter/recipe-filter.component';
import { DEFAULT_FILTER_STATE, FilterState } from './filter-state.model';
import { Recipe } from '../../core/models/recipe.model';
import { User } from '../../core/models/user.model';

const PAGE_SIZE = 21;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, RecipeFilterComponent, MatPaginatorModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly recipeService = inject(RecipeService);
  private readonly auth = inject(AuthService);

  readonly currentUserId = computed(() => this.auth.currentUser()?.id ?? null);

  readonly filter = signal<FilterState>(DEFAULT_FILTER_STATE);
  readonly currentPage = signal(0);
  readonly pageSize = PAGE_SIZE;

  readonly availableUsers = computed<User[]>(() => {
    const seen = new Map<string, User>();
    for (const recipe of this.recipeService.recipes()) {
      if (!seen.has(recipe.userId)) {
        seen.set(recipe.userId, { id: recipe.userId, name: recipe.userName });
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly availableIngredients = computed<string[]>(() => {
    const names = new Set<string>();
    for (const recipe of this.recipeService.recipes()) {
      for (const ingredient of recipe.ingredients) {
        names.add(ingredient.name);
      }
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  });

  readonly filteredRecipes = computed<Recipe[]>(() => {
    const state = this.filter();
    const userId = this.currentUserId();
    return this.recipeService.recipes().filter((recipe) => this.matches(recipe, state, userId));
  });

  readonly sortedRecipes = computed<Recipe[]>(() => {
    const state = this.filter();
    const byDate = (a: Recipe, b: Recipe) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    if (state.sort === 'rating') {
      // Highest average first, unrated last, ties newest first.
      return [...this.filteredRecipes()].sort((a, b) => {
        const diff = (averageRating(b) ?? -1) - (averageRating(a) ?? -1);
        return diff !== 0 ? diff : byDate(b, a);
      });
    }
    const sorted = [...this.filteredRecipes()].sort(byDate);
    return state.sort === 'newest' ? sorted.reverse() : sorted;
  });

  readonly effectivePage = computed(() => {
    const total = this.sortedRecipes().length;
    const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
    return Math.min(this.currentPage(), maxPage);
  });

  readonly pagedRecipes = computed<Recipe[]>(() => {
    const start = this.effectivePage() * PAGE_SIZE;
    return this.sortedRecipes().slice(start, start + PAGE_SIZE);
  });

  readonly showPagination = computed(() => this.sortedRecipes().length > PAGE_SIZE);

  onFilterChange(state: FilterState): void {
    this.filter.set(state);
    this.currentPage.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
  }

  onRate(recipeId: string, score: number): void {
    const userId = this.currentUserId();
    if (userId) {
      this.recipeService.rate(recipeId, userId, score);
    }
  }

  onToggleFavorite(recipeId: string): void {
    const userId = this.currentUserId();
    if (userId) {
      this.recipeService.toggleFavorite(recipeId, userId);
    }
  }

  private matches(recipe: Recipe, state: FilterState, userId: string | null): boolean {
    if (state.userId && recipe.userId !== state.userId) {
      return false;
    }
    if (state.cuisine && recipe.cuisine !== state.cuisine) {
      return false;
    }
    const ingredientNames = recipe.ingredients.map((i) => i.name);
    if (state.includeIngredients.length && !state.includeIngredients.every((n) => ingredientNames.includes(n))) {
      return false;
    }
    if (state.excludeIngredients.length && state.excludeIngredients.some((n) => ingredientNames.includes(n))) {
      return false;
    }
    if (state.minRating !== null) {
      const average = averageRating(recipe);
      if (average === null || average < state.minRating) {
        return false;
      }
    }
    // The favorites filter only applies to a logged-in user; the checkbox is hidden otherwise.
    if (state.favoritesOnly && userId && !recipe.favoritedBy.includes(userId)) {
      return false;
    }
    return true;
  }
}
