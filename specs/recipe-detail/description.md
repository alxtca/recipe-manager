# Recipe Detail

As a user (logged in or anonymous), I want to open a recipe from its card and see its full
details, so that I can read directions and ingredients before cooking.

## Scope

- Recipe cards on the homepage are clickable; clicking navigates to that recipe's detail page
  at `/recipe/:id`.
- Viewing a recipe's detail page requires no authentication, consistent with browsing on the
  homepage.
- The detail page displays: recipe name, picture icon, ingredient list, cooking directions, and
  who posted it (`userName`).
- The ingredient list is scalable: a portion selector lets the user multiply every ingredient
  quantity by a chosen factor (0.5, 1, 2, 3, 4), defaulting to 1x (the quantities as originally
  entered).
- Selecting 0.5x halves every ingredient quantity.
- When the recipe belongs to the currently logged-in user, an "Edit" button is shown; clicking
  it navigates to the existing recipe edit page (`/dashboard/edit/:id`).
- The edit button is not shown to anonymous users or to users viewing a recipe they don't own.
- Opening a recipe detail URL for an id that doesn't exist behaves per the `application` spec's
  404 handling.

## Notes

- Portion multiplier options are fixed: 0.5x, 1x, 2x, 3x, 4x.
