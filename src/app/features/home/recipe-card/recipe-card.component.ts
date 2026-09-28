import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Recipe } from '../../../core/models/recipe.model';
import { averageRating, ratingCount } from '../../../core/utils/rating';
import { RecipeRatingComponent } from '../../../shared/recipe-rating/recipe-rating.component';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatChipsModule, RecipeRatingComponent],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly currentUserId = input<string | null>(null);
  readonly rate = output<number>();

  readonly average = computed(() => averageRating(this.recipe()));
  readonly count = computed(() => ratingCount(this.recipe()));
  readonly userRating = computed(() => {
    const userId = this.currentUserId();
    return userId ? (this.recipe().ratings[userId] ?? null) : null;
  });
}
