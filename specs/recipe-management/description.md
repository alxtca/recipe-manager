# Recipe Management

As a logged-in user, I want to add, edit, and delete my own recipes from a personal dashboard, so that I can maintain my personal recipe collection.

## Scope

- Accessing the personal dashboard requires being logged in.
- Adding a new recipe requires: a name, one picture icon from a fixed predefined set, cuisine type, cooking directions, and one or more ingredients (each with a name, numeric quantity, and unit).
- Ingredients are entered as dynamic rows, addable and removable.
- Editing an existing recipe is limited to recipes owned by the current user.
- Deleting an existing recipe is limited to recipes owned by the current user.
- Saved recipes appear immediately in the homepage recipe list.

## Notes

- Recipe "picture" is an icon selection from a fixed set (Material icons) — there is no file upload.
- Ingredient units are a fixed list: g, kg, ml, l, cups, tbsp, tsp, pcs.
- Cuisine types are a fixed list: Italian, Mexican, Indian, Chinese, American, French, Japanese, Mediterranean, Thai, Other.
