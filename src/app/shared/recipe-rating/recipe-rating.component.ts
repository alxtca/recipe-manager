import { Component, computed, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RATING_VALUES } from '../../core/data/constants';

@Component({
  selector: 'app-recipe-rating',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './recipe-rating.component.html',
  styleUrl: './recipe-rating.component.scss',
})
export class RecipeRatingComponent {
  readonly average = input.required<number | null>();
  readonly count = input.required<number>();
  /** The current user's own score, or null when they haven't rated yet. */
  readonly userRating = input<number | null>(null);
  readonly canRate = input(false);
  readonly rated = output<number>();

  readonly ratingValues = RATING_VALUES;
  readonly editing = signal(false);

  readonly hasRated = computed(() => this.userRating() !== null);

  startEditing(): void {
    this.editing.set(true);
  }

  select(score: number): void {
    this.rated.emit(score);
    this.editing.set(false);
  }
}
