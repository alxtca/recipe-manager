import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RecipeService } from '../../core/services/recipe.service';
import { AuthService } from '../../core/services/auth.service';
import { Ingredient } from '../../core/models/recipe.model';
import { averageRating, ratingCount } from '../../core/utils/rating';
import { NotFoundComponent } from '../not-found/not-found.component';
import { RecipeRatingComponent } from '../../shared/recipe-rating/recipe-rating.component';
import { FavoriteButtonComponent } from '../../shared/favorite-button/favorite-button.component';

const PORTION_OPTIONS = [0.5, 1, 2, 3, 4];

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatButtonToggleModule, NotFoundComponent, RecipeRatingComponent, FavoriteButtonComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly auth = inject(AuthService);

  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly portionOptions = PORTION_OPTIONS;
  readonly portions = signal(1);

  readonly recipe = computed(() => this.recipeService.getById(this.id));

  readonly scaledIngredients = computed<Ingredient[]>(() => {
    const recipe = this.recipe();
    if (!recipe) {
      return [];
    }
    const factor = this.portions();
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: Math.round(ingredient.quantity * factor * 100) / 100,
    }));
  });

  readonly isOwner = computed(() => {
    const recipe = this.recipe();
    return !!recipe && recipe.userId === this.auth.currentUser()?.id;
  });

  readonly currentUserId = computed(() => this.auth.currentUser()?.id ?? null);

  readonly average = computed(() => {
    const recipe = this.recipe();
    return recipe ? averageRating(recipe) : null;
  });

  readonly ratingCount = computed(() => {
    const recipe = this.recipe();
    return recipe ? ratingCount(recipe) : 0;
  });

  readonly userRating = computed(() => {
    const userId = this.currentUserId();
    return userId ? (this.recipe()?.ratings[userId] ?? null) : null;
  });

  readonly isFavorite = computed(() => {
    const userId = this.currentUserId();
    return !!userId && !!this.recipe()?.favoritedBy.includes(userId);
  });

  selectPortions(value: number): void {
    this.portions.set(value);
  }

  rate(score: number): void {
    const userId = this.currentUserId();
    if (userId) {
      this.recipeService.rate(this.id, userId, score);
    }
  }

  toggleFavorite(): void {
    const userId = this.currentUserId();
    if (userId) {
      this.recipeService.toggleFavorite(this.id, userId);
    }
  }
}
