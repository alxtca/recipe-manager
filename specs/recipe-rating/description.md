# Recipe Rating

As a logged-in user, I want to rate recipes on a scale from 1 to 10 and see each recipe's average
rating, so that I can share my opinion and find well-liked recipes.

## Scope

- Every recipe's average rating is shown on its homepage card and on its detail page, to all users
  (logged in or anonymous).
- The average is calculated from every rating given for the recipe. It is shown with one decimal
  and the number of ratings, e.g. "7.3 (12)".
- A recipe with no ratings shows "Not rated yet".
- Only logged-in users can rate. Anonymous users see the average but no rating controls.
- Ratings are whole numbers from 1 to 10.
- Each user can rate each recipe once. This includes recipes they own.
- If a logged-in user hasn't rated a recipe yet, a "Rate" button is shown. Clicking it shows a
  dropdown with values 1–10. Picking a value saves the rating right away and the dropdown goes
  back to the score view.
- Once a user has rated a recipe, the score view also shows their own rating and an "Edit"
  button, e.g. "7.3 (12) · Your rating: 8 [Edit]".
- Clicking "Edit" swaps the score view for a 1–10 dropdown with the user's current rating
  selected. Picking a value saves it right away and the dropdown goes back to the score view.
- A rating can be changed but not removed.
- Rating and editing work both on homepage cards and on the recipe detail page.
- Using the rating controls on a card does not open the recipe's detail page.
- The homepage filter sidebar has a minimum-rating filter (1–10). While it's set, only recipes
  with an average at or above that value are shown, and unrated recipes are hidden. It combines
  with the other filters using AND logic.
- The homepage has a "Rating" sort option that puts the highest average first and unrated
  recipes last. Date added (newest first) stays the default sort.

## Notes

- Rating values are fixed: whole numbers 1–10.
- Ratings are stored in localStorage along with the rest of the app's data.
- Deleting a recipe also deletes its ratings.
- When sorting by rating, recipes with the same average are ordered newest first.
