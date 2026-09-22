# Specifications

Requirement specifications for Recipe Manager, one folder per feature. Each feature folder contains:

- `description.md` — prose description of the feature and its scope
- `<feature>.feature` — Gherkin scenarios for the feature

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
