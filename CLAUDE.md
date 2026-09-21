# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
ng serve                                    # dev server at http://localhost:4200
ng build                                    # production build to dist/
ng test                                     # unit tests (Karma/Jasmine, watches by default)
ng test --watch=false --browsers=ChromeHeadless   # single headless run (use this for CI-style checks)
ng test --include='**/recipe.service.spec.ts'     # run a single spec file
```

There is no e2e test setup and no lint script configured.

Tests target requirements/behavior, not individual functions — see `home.component.spec.ts` for the pattern (one `it()` per user-facing filtering/pagination/sorting behavior, not per computed signal).

## Architecture

This is a **front-end-only** Angular 19 app (standalone components + signals, no NgModules, no NgRx). There is no backend: the requirement specs (see `specs/`) require all data to live in the browser, so the two core services persist directly to `localStorage` instead of calling an API.

- `core/services/recipe.service.ts` — single source of truth for recipes. Holds a `signal<Recipe[]>`, exposes `add`/`update`/`delete`/`getById`, and writes the full list to `localStorage` (`rm-recipes`) after every mutation. Seeds itself from `core/data/constants.ts` (`SEED_RECIPES`) on first load if nothing is persisted yet.
- `core/services/auth.service.ts` — there's no real authentication. A fixed list of demo users (`DEMO_USERS` in `core/data/constants.ts`) is presented on the login screen; "logging in" just sets a `currentUser` signal and persists it to `localStorage` (`rm-current-user`). No passwords.
- `core/guards/auth.guard.ts` — functional `CanActivateFn` that redirects to `/login` when `AuthService.currentUser()` is null. Applied to all `/dashboard*` routes in `app.routes.ts`; the home route is public per the feature spec's "no authentication required to browse" requirement.
- `core/data/constants.ts` — all fixed vocabularies live here: `CUISINES`, `UNITS`, `RECIPE_ICONS` (Material icon names used as the recipe "picture" — there is no file upload), `DEMO_USERS`, and `SEED_RECIPES`.

Routing (`app.routes.ts`) lazy-loads each feature via `loadComponent`. `dashboard/add` and `dashboard/edit/:id` both point at the same `RecipeFormComponent`, which switches between create/edit mode based on whether an `id` route param is present (see `RecipeFormComponent.ngOnInit`); when editing, it verifies the recipe belongs to the current user and redirects to `/dashboard` otherwise.

Filtering/sorting/pagination for the homepage is **not** in the service layer — it's view state owned by `HomeComponent` as chained `computed()` signals: `filteredRecipes` → `sortedRecipes` → `pagedRecipes`, with `effectivePage` clamping the current page index when the filtered set shrinks. Filter state shape is `FilterState` in `features/home/filter-state.model.ts`. Page size is fixed at 21 and pagination controls (`MatPaginator`) only render when the filtered/sorted count exceeds that.

`RecipeFilterComponent` and `RecipeCardComponent` are presentational children of `HomeComponent`, communicating via `input()`/`output()` signals rather than services — `RecipeFilterComponent` emits a full `FilterState` object on every change rather than partial updates.

Ingredient filtering semantics: "include ingredients" requires a recipe to contain **all** selected ingredient names; "exclude ingredients" removes a recipe if it contains **any** of them (see `HomeComponent.matches`).
