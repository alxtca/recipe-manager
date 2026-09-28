import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { RecipeRatingComponent } from './recipe-rating.component';

describe('RecipeRatingComponent', () => {
  let fixture: ComponentFixture<RecipeRatingComponent>;
  let element: HTMLElement;

  function render(inputs: { average: number | null; count: number; userRating?: number | null; canRate?: boolean }) {
    fixture = TestBed.createComponent(RecipeRatingComponent);
    fixture.componentRef.setInput('average', inputs.average);
    fixture.componentRef.setInput('count', inputs.count);
    fixture.componentRef.setInput('userRating', inputs.userRating ?? null);
    fixture.componentRef.setInput('canRate', inputs.canRate ?? false);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  function buttonLabels(): string[] {
    return [...element.querySelectorAll('button')].map((b) => b.textContent?.trim() ?? '');
  }

  function clickButton(label: string): void {
    const button = [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label);
    button!.click();
    fixture.detectChanges();
  }

  function select(): MatSelect | undefined {
    return fixture.debugElement.query(By.directive(MatSelect))?.componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RecipeRatingComponent] });
  });

  it('[recipe-rating-1, recipe-rating-2] shows the average with one decimal and the number of ratings', () => {
    render({ average: 22 / 3, count: 3 });

    expect(element.textContent).toContain('7.3 (3)');
  });

  it('[recipe-rating-3] shows "Not rated yet" for a recipe without ratings', () => {
    render({ average: null, count: 0 });

    expect(element.textContent).toContain('Not rated yet');
  });

  it('[recipe-rating-4] shows the average but no Rate or Edit button to anonymous users', () => {
    render({ average: 8, count: 1, canRate: false });

    expect(element.textContent).toContain('8.0 (1)');
    expect(buttonLabels()).toEqual([]);
  });

  it('[recipe-rating-5] rates via a 1-10 dropdown that is accepted immediately and replaced by the score view', () => {
    render({ average: null, count: 0, canRate: true });
    const emitted: number[] = [];
    fixture.componentInstance.rated.subscribe((score) => emitted.push(score));

    expect(buttonLabels()).toEqual(['Rate']);
    expect(select()).toBeUndefined();

    clickButton('Rate');
    const dropdown = select()!;
    expect(dropdown).toBeDefined();
    expect(dropdown.options.map((o) => o.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    dropdown.options.find((o) => o.value === 8)!.select();
    fixture.detectChanges();

    expect(emitted).toEqual([8]);
    expect(select()).toBeUndefined();
  });

  it('[recipe-rating-6, recipe-rating-7] shows own rating with Edit (no Rate), and edits via a preselected dropdown', () => {
    render({ average: 7.5, count: 2, userRating: 8, canRate: true });
    const emitted: number[] = [];
    fixture.componentInstance.rated.subscribe((score) => emitted.push(score));

    expect(element.textContent).toContain('7.5 (2)');
    expect(element.textContent).toContain('Your rating: 8');
    expect(buttonLabels()).toEqual(['Edit']);

    clickButton('Edit');
    const dropdown = select()!;
    expect(dropdown.value).toBe(8);

    dropdown.options.find((o) => o.value === 5)!.select();
    fixture.detectChanges();

    expect(emitted).toEqual([5]);
    expect(select()).toBeUndefined();
  });
});
