import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { RecipeService } from '../../core/services/recipe.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly recipeService = inject(RecipeService);

  readonly myRecipes = computed(() => {
    const userId = this.auth.currentUser()?.id;
    return this.recipeService.recipes().filter((r) => r.userId === userId);
  });

  deleteRecipe(id: string, name: string): void {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      this.recipeService.delete(id);
    }
  }
}
