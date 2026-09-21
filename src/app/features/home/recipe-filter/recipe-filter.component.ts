import { Component, computed, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { CUISINES } from '../../../core/data/constants';
import { DEFAULT_FILTER_STATE, FilterState, SortDirection } from '../filter-state.model';

@Component({
  selector: 'app-recipe-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipe-filter.component.html',
  styleUrl: './recipe-filter.component.scss',
})
export class RecipeFilterComponent {
  readonly users = input.required<User[]>();
  readonly availableIngredients = input.required<string[]>();
  readonly filter = input.required<FilterState>();
  readonly filterChange = output<FilterState>();

  readonly cuisines = CUISINES;
  readonly includeControl = new FormControl('');
  readonly excludeControl = new FormControl('');

  readonly includeSuggestions = computed(() =>
    this.filterAvailable(this.includeControl.value ?? '', this.filter().includeIngredients),
  );
  readonly excludeSuggestions = computed(() =>
    this.filterAvailable(this.excludeControl.value ?? '', this.filter().excludeIngredients),
  );

  private filterAvailable(query: string, excluding: string[]): string[] {
    const lower = query.trim().toLowerCase();
    return this.availableIngredients()
      .filter((name) => !excluding.includes(name))
      .filter((name) => !lower || name.toLowerCase().includes(lower));
  }

  onUserChange(userId: string | null): void {
    this.emit({ ...this.filter(), userId: userId || null });
  }

  onCuisineChange(cuisine: string | null): void {
    this.emit({ ...this.filter(), cuisine: cuisine || null });
  }

  onSortChange(sort: SortDirection): void {
    this.emit({ ...this.filter(), sort });
  }

  addInclude(event: MatChipInputEvent | MatAutocompleteSelectedEvent): void {
    const value = this.extractValue(event);
    if (!value) {
      return;
    }
    const current = this.filter().includeIngredients;
    if (!current.includes(value)) {
      this.emit({ ...this.filter(), includeIngredients: [...current, value] });
    }
    this.includeControl.setValue('');
  }

  removeInclude(name: string): void {
    this.emit({
      ...this.filter(),
      includeIngredients: this.filter().includeIngredients.filter((n) => n !== name),
    });
  }

  addExclude(event: MatChipInputEvent | MatAutocompleteSelectedEvent): void {
    const value = this.extractValue(event);
    if (!value) {
      return;
    }
    const current = this.filter().excludeIngredients;
    if (!current.includes(value)) {
      this.emit({ ...this.filter(), excludeIngredients: [...current, value] });
    }
    this.excludeControl.setValue('');
  }

  removeExclude(name: string): void {
    this.emit({
      ...this.filter(),
      excludeIngredients: this.filter().excludeIngredients.filter((n) => n !== name),
    });
  }

  clearAll(): void {
    this.includeControl.setValue('');
    this.excludeControl.setValue('');
    this.emit({ ...DEFAULT_FILTER_STATE, sort: this.filter().sort });
  }

  private extractValue(event: MatChipInputEvent | MatAutocompleteSelectedEvent): string {
    if ('option' in event) {
      return (event.option.value as string).trim();
    }
    const value = (event.value ?? '').trim();
    event.chipInput?.clear();
    return value;
  }

  private emit(state: FilterState): void {
    this.filterChange.emit(state);
  }
}
