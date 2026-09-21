# Home / Recipe Discovery

As a user (logged in or anonymous), I want to browse, filter, and sort recipes on the homepage, so that I can find recipes that match what I have on hand or want to cook.

## Scope

- Recipe list displayed in a 3-column grid, up to 21 cards per page.
- Pagination controls appear only when more than 21 recipes match the current filters.
- Each recipe card shows the recipe name and a picture icon when one is available.
- Filtering by user, cuisine, included ingredients (must contain **all** selected), and excluded ingredients (must contain **none** of the selected) — filters combine with AND logic.
- Filters live in an always-visible sidebar.
- Sorting by creation date; newest first by default.

## Notes

- No authentication is required to browse recipes.
- Cuisine types are a fixed list: Italian, Mexican, Indian, Chinese, American, French, Japanese, Mediterranean, Thai, Other.
