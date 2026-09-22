# Application

As a user, I want the application to behave predictably for things that aren't owned by any
single feature, so that broken or unknown links are handled consistently across the app.

## Scope

- Opening any URL that doesn't match a defined route — including a recipe detail URL for an id
  that doesn't exist — shows a 404 "not found" page.

## Notes

- Previously the app silently redirected unmatched routes to the homepage (`{ path: '**',
  redirectTo: '' }`); this replaces that behavior app-wide, not just for recipe detail links.
