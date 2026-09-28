# Specifications

Requirement specifications for Recipe Manager, one folder per feature. Each feature folder contains:

- `description.md` — prose description of the feature and its scope
- `<feature>.feature` — Gherkin scenarios for the feature

## Requirement IDs

Every scenario carries a unique ID as a Gherkin tag of the form `@<feature-file-name>-<number>` (e.g. `@home-4` is the 4th scenario in `home/home.feature`). Numbers are sequential per file; never renumber existing scenarios — append new ones with the next free number.

Unit tests reference the requirement(s) they verify by prefixing the `it()` description with the ID(s) in brackets, e.g. `it('[home-4] filters by user', ...)` or `it('[recipe-detail-3, recipe-detail-4] ...', ...)`.

## Features

- [home](home/) — browsing, filtering, and sorting recipes
- [authentication](authentication/) — demo-user login and access control
- [recipe-management](recipe-management/) — adding, editing, and deleting recipes on the personal dashboard
- [recipe-detail](recipe-detail/) — viewing a recipe's full details, scaling ingredients, and editing owned recipes
- [application](application/) — cross-cutting app-wide behavior not owned by a single feature

## Platform-wide constraints

These apply across all features rather than to any single one:

- Built with Angular (standalone components + signals) and Angular Material; no NgRx.
- Front-end only: all data (recipes, session) is stored in the browser's localStorage; no database or backend server.

## Adding a new feature

1. Describe the feature idea to Claude (e.g. "new feature: users can rate recipes").
2. Claude runs the `new-feature-spec` skill: it asks clarifying questions, checks for conflicts
   with existing specs, and writes `<feature-name>/description.md` + `<feature-name>.feature`
   after you approve the draft.
3. In a separate step, ask Claude to implement it (e.g. "implement recipe-rating"). It runs the
   `implement-the-feature` skill: it proposes a plan mapped to the `.feature` scenarios, implements
   the feature after you approve the plan, adds tests for each scenario, and reports coverage.
