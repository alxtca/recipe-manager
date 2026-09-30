import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Recipe } from '../../../core/models/recipe.model';
import { averageRating, ratingCount } from '../../../core/utils/rating';
import { RecipeRatingComponent } from '../../../shared/recipe-rating/recipe-rating.component';
import { FavoriteButtonComponent } from '../../../shared/favorite-button/favorite-button.component';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatChipsModule, RecipeRatingComponent, FavoriteButtonComponent],
  templateUrl: './recipe-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly currentUserId = input<string | null>(null);
  readonly rate = output<number>();
  readonly favoriteToggle = output<void>();

  readonly average = computed(() => averageRating(this.recipe()));
  readonly count = computed(() => ratingCount(this.recipe()));
  readonly userRating = computed(() => {
    const userId = this.currentUserId();
    return userId ? (this.recipe().ratings[userId] ?? null) : null;
  });
  readonly isFavorite = computed(() => {
    const userId = this.currentUserId();
    return !!userId && this.recipe().favoritedBy.includes(userId);
  });
}
