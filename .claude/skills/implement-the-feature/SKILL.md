---
name: implement-the-feature
description: >-
  Implements a feature in recipe-manager from its finished spec under specs/<feature-name>/
  (description.md + <feature-name>.feature), treating the Gherkin scenarios as the contract.
  Use this whenever the developer asks to implement, build, or code a feature that has a spec —
  e.g. "implement recipe-rating", "build the recipe-detail feature", "start implementation of X",
  "code up the spec for Y". Also use it to implement changes made to an existing feature's spec,
  e.g. "implement the recipe-rating changes". Plans the work against the scenarios, gets approval,
  implements following the architecture in CLAUDE.md, writes behavior-level specs per scenario,
  runs the tests and build, and reports scenario coverage. Does not write or change specs — that's
  the job of new-feature-spec (new features) and change-feature-spec (changes to existing ones).
---

# Implement the Feature

Every feature in Recipe Manager has a spec in `specs/<feature-name>/` written before any code
(see the `new-feature-spec` skill). That spec is the contract: `description.md` gives the scope,
and each `Scenario:` in `<feature-name>.feature` is one behavior the code must produce. This
skill turns a finished spec into working code without inventing requirements along the way.

## Workflow

### 1. Find the spec

Work out the feature from the developer's message and open `specs/<feature-name>/`. If the name
is ambiguous, list the matching folders from `specs/README.md` and ask.

If the feature has no spec folder, or the folder is missing its `.feature` file, stop. Tell the
developer the feature needs a spec first and suggest running `new-feature-spec`. Don't implement
from the chat message alone.

### 2. Read the contract and the code it touches

Read:

- `specs/<feature-name>/description.md` and `<feature-name>.feature`;
- the "Platform-wide constraints" in `specs/README.md`;
- any other spec the new feature interacts with, e.g. `recipe-management` if it changes who can
  edit a recipe;
- the existing code in the areas the feature touches: services, models, routes, and the
  components it extends.

If a scenario is ambiguous or contradicts the current code or another spec, ask the developer
before planning around it. Don't pick an interpretation silently, and don't edit the spec
yourself. If the spec needs to change, the developer decides that (and may run
`change-feature-spec`).

When you're implementing a change to an already-implemented feature, start from the scenario IDs
that were modified, added or removed. Search `src/` for `[<id>` to find the tests and code
built against them. Tests for retired IDs are deleted or re-tagged, and tests for modified IDs
get updated assertions. Don't keep an old assertion that the new scenario contradicts.

### 3. Plan and get approval

Present a short plan that maps each scenario to the code that fulfils it:

- model changes (e.g. new fields on `Recipe`) and what happens to data already in `localStorage`,
  such as recipes saved before the new field existed;
- service changes, new components, and route changes;
- which spec file will cover each scenario.

Follow the architecture in `CLAUDE.md`. Use standalone components and signals, keep
presentational components on `input()`/`output()`, persist through the existing services, add
fixed vocabularies to `core/data/constants.ts`, and lazy-load new routes with `loadComponent`.

Wait for the developer to confirm the plan before writing code. Fixing a plan costs less than
unwinding code.

### 4. Implement

Build the plan. Match the surrounding code's naming, structure, and comment density. Stay within
the spec's scope. If something outside the spec looks worth adding, mention it at the end instead
of building it.

### 5. Test against the scenarios

Write specs following the pattern in `src/app/features/home/home.component.spec.ts`: one `it()`
per user-facing behavior, named after the behavior rather than the function. Every scenario in
the `.feature` file should map to at least one `it()`. Update any existing specs that the change
breaks, and don't delete their assertions to make them pass.

Run:

```bash
ng test --watch=false --browsers=ChromeHeadless
ng build
```

Fix failures. If a failure can't be fixed without going beyond the spec, stop and explain it.

### 6. Report

End with a scenario coverage table and the test and build results:

| Scenario | Implemented in | Covered by |
|---|---|---|
| Rate a recipe | `recipe-rating.component.ts` | `recipe-rating.component.spec.ts` › "rates a recipe" |

List any scenario that isn't fully covered, and explain why. Don't commit unless the developer
asks.
