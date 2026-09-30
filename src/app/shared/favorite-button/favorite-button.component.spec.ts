import { TestBed } from '@angular/core/testing';
import { FavoriteButtonComponent } from './favorite-button.component';

describe('FavoriteButtonComponent', () => {
  function render(favorite: boolean) {
    const fixture = TestBed.createComponent(FavoriteButtonComponent);
    fixture.componentRef.setInput('favorite', favorite);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    return { fixture, button };
  }

  it('[recipe-favorites-2] shows "Add to favorites" with an outlined heart when not a favorite', () => {
    const { button } = render(false);

    expect(button.getAttribute('aria-label')).toBe('Add to favorites');
    expect(button.querySelector('mat-icon')?.textContent?.trim()).toBe('favorite_border');
  });

  it('[recipe-favorites-3] shows "Remove from favorites" with a filled heart when a favorite', () => {
    const { button } = render(true);

    expect(button.getAttribute('aria-label')).toBe('Remove from favorites');
    expect(button.querySelector('mat-icon')?.textContent?.trim()).toBe('favorite');
  });

  it('[recipe-favorites-2, recipe-favorites-3] emits a toggle when clicked', () => {
    const { fixture, button } = render(false);
    let toggles = 0;
    fixture.componentInstance.toggled.subscribe(() => toggles++);

    button.click();

    expect(toggles).toBe(1);
  });
});
