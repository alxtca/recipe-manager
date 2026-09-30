import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent {
  /** Whether the recipe is already in the current user's favorites. */
  readonly favorite = input.required<boolean>();
  readonly toggled = output<void>();

  readonly label = computed(() => (this.favorite() ? 'Remove from favorites' : 'Add to favorites'));
}
