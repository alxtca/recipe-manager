# Recipe Favorites

As a logged-in user, I want to mark recipes as favorites and filter the recipe list down to my
favorites, so that I can quickly find the recipes I like most.

## Scope

- Only logged-in users can use favorites. Anonymous users see no favorite buttons and no
  "Favorites" filter checkbox.
- Each homepage recipe card shows a favorite toggle button for logged-in users:
  - outlined heart icon with tooltip/label "Add to favorites" when the recipe is not a favorite;
  - filled heart icon with tooltip/label "Remove from favorites" when it is.
- The same toggle button is shown on the recipe detail page.
- Clicking the button adds/removes the recipe from the current user's favorites immediately;
  the button state updates right away on every view showing that recipe.
- Using the favorite button on a card does not open the recipe's detail page.
- Any recipe can be favorited, including recipes the user owns.
- Favorites are per user: each user has their own favorites list, and a user's favorites don't
  affect what other users see.
- Favorites persist across page refreshes and across logging out and back in.
- The homepage filter sidebar has a "Favorites" checkbox (logged-in users only). While checked,
  only the current user's favorite recipes are shown. It combines with the other filters using
  AND logic.
- When no recipes match (including when the user has no favorites), the existing
  "No recipes match the selected filters." message is shown.

## Notes

- Favorites are stored in localStorage along with the rest of the app's data.
- Deleting a recipe also removes it from every user's favorites.
- Favorites are viewed only through the homepage filter; there is no separate favorites page or
  dashboard section.
