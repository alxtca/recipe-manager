import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RecipeCardComponent } from './recipe-card.component';
import { Recipe } from '../../../core/models/recipe.model';

const RECIPE: Recipe = {
  id: 'r1',
  name: 'Recipe',
  iconKey: null,
  cuisine: 'Italian',
  directions: 'Do it.',
  ingredients: [{ name: 'Salt', quantity: 1, unit: 'g' }],
  userId: 'u2',
  userName: 'Bob',
  createdAt: '2026-01-01T00:00:00.000Z',
  ratings: { u1: 6, u3: 9 },
};

describe('RecipeCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RecipeCardComponent], providers: [provideRouter([])] });
  });

  function render(currentUserId: string | null) {
    const fixture = TestBed.createComponent(RecipeCardComponent);
    fixture.componentRef.setInput('recipe', RECIPE);
    fixture.componentRef.setInput('currentUserId', currentUserId);
    fixture.detectChanges();
    return fixture;
  }

  it('[recipe-rating-1] shows the average rating and count on the card', () => {
    const fixture = render(null);

    expect(fixture.nativeElement.textContent).toContain('7.5 (2)');
  });

  it("[recipe-rating-6] shows the logged-in user's own rating on the card", () => {
    const fixture = render('u1');

    expect(fixture.nativeElement.textContent).toContain('Your rating: 6');
  });

  it('[recipe-rating-9] using the rating controls does not navigate to the detail page', () => {
    const fixture = render('u1');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const editButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLElement) => b.textContent?.trim() === 'Edit',
    ) as HTMLElement;
    editButton.click();
    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('[recipe-detail-1] clicking the card outside the rating controls still navigates', () => {
    const fixture = render('u1');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    (fixture.nativeElement.querySelector('mat-card-title') as HTMLElement).click();

    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
