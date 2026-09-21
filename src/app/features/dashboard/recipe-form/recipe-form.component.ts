import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthService } from '../../../core/services/auth.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { CUISINES, RECIPE_ICONS, UNITS } from '../../../core/data/constants';
import { RecipeInput } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss',
})
export class RecipeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly recipeService = inject(RecipeService);

  readonly cuisines = CUISINES;
  readonly units = UNITS;
  readonly icons = RECIPE_ICONS;

  editId: string | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    iconKey: ['', Validators.required],
    cuisine: ['', Validators.required],
    directions: ['', Validators.required],
    ingredients: this.fb.array([this.createIngredientRow()]),
  });

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      const recipe = this.recipeService.getById(this.editId);
      if (!recipe || recipe.userId !== this.auth.currentUser()?.id) {
        this.router.navigateByUrl('/dashboard');
        return;
      }
      this.ingredients.clear();
      recipe.ingredients.forEach((ingredient) => this.ingredients.push(this.createIngredientRow(ingredient)));
      this.form.patchValue({
        name: recipe.name,
        iconKey: recipe.iconKey ?? '',
        cuisine: recipe.cuisine,
        directions: recipe.directions,
      });
    }
  }

  createIngredientRow(value?: { name: string; quantity: number; unit: string }) {
    return this.fb.nonNullable.group({
      name: [value?.name ?? '', Validators.required],
      quantity: [value?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
      unit: [value?.unit ?? this.units[0], Validators.required],
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientRow());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const input: RecipeInput = {
      name: value.name,
      iconKey: value.iconKey || null,
      cuisine: value.cuisine,
      directions: value.directions,
      ingredients: value.ingredients,
    };

    if (this.editId) {
      this.recipeService.update(this.editId, input);
    } else {
      const user = this.auth.currentUser();
      if (!user) {
        this.router.navigateByUrl('/login');
        return;
      }
      this.recipeService.add(input, user);
    }

    this.router.navigateByUrl('/dashboard');
  }
}
