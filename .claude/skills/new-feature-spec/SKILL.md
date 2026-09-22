---
name: new-feature-spec
description: >-
  Turns a feature idea into a formal spec (description.md + Gherkin .feature file) under specs/,
  following the structure already used by recipe-manager's existing specs (home, authentication,
  recipe-management). Use this whenever the user wants to add a new feature, describes a feature
  idea, says things like "let's spec out X", "new feature: Y", "I want users to be able to Z", or
  asks to plan/scope something before building it — even if they don't mention "spec" or "gherkin"
  explicitly. Also trigger when the user pastes a rough, ambiguous feature description and wants
  it turned into concrete requirements. This skill asks clarifying questions to resolve ambiguity,
  checks specs/ for contradictions with the new feature and stops to consult the developer if any
  are found, then writes the spec files and updates specs/README.md. It does not implement the
  feature — implementation is a separate, later step.
---

# New Feature Spec

Recipe Manager treats `specs/` as the source of truth for behavior: every existing feature
(`home`, `authentication`, `recipe-management`) has a `description.md` (prose scope) and a
`<feature>.feature` (Gherkin scenarios) before any code was written for it. This skill produces
that same pair of files for a new feature, so implementation later has an unambiguous contract
to build against instead of a vague idea.

The reason to slow down and clarify before writing Gherkin: a Gherkin scenario is precise by
construction — every `Given`/`When`/`Then` bakes in a decision. If the decision was never
actually made by the developer, the skill would just be inventing requirements. Asking first is
what keeps the spec trustworthy.

## Workflow

### 1. Get the feature description

Start from whatever the user gave you (a sentence, a rough paragraph, a pasted note). Don't ask
them to restate it in a special format — read what they wrote as the starting point.

### 2. Clarify ambiguity and fill gaps

Compare what you have against what a Gherkin scenario needs to be concrete: who the actor is,
what triggers the behavior, what the exact steps/inputs are, what "success" looks like, and any
edge cases (validation, permissions, empty states) that the existing specs would think to cover.
Look at `specs/recipe-management/description.md` and `specs/recipe-management/recipe-management.feature`
as the bar for how much detail is expected — e.g. that spec doesn't just say "add a recipe", it
pins down the exact required fields, that ingredients are dynamic rows, and that edit/delete are
scoped to the owning user.

Use `AskUserQuestion` for concrete, answerable gaps (e.g. "Should this be available to logged-out
users, or only from the dashboard?"). Batch related questions together rather than trickling them
out one at a time. Don't ask about things you can reasonably infer from the existing app
conventions in `CLAUDE.md` (e.g. you don't need to ask whether it uses signals — it does).

Keep going until you could write every scenario step without guessing. If the user's answers
reveal the feature is bigger than one spec (e.g. it bundles two unrelated capabilities), say so
and suggest splitting it before continuing.

### 3. Check for contradictions with existing specs

Read every `description.md` and `.feature` file under `specs/`, plus the "Platform-wide
constraints" section of `specs/README.md`. Check whether the new feature's requirements conflict
with anything already committed to — not just literal overlap, but implied conflicts (e.g. a new
feature that assumes recipes can be shared between users would contradict
`recipe-management`'s "editing/deleting is limited to recipes owned by the current user").

If you find a contradiction, stop and lay it out for the developer plainly: quote the conflicting
line from the existing spec, explain the conflict, and ask how they want it resolved (change the
new feature, change the existing spec, or explain why it's not actually a conflict). Don't
silently pick a resolution yourself — this is exactly the kind of decision that's cheap to ask
about now and expensive to unwind after code exists on both sides.

If nothing conflicts, say so briefly and move on — no need to make a ceremony of it.

### 4. Write the spec files

Create `specs/<feature-name>/` (kebab-case, matching `home`, `authentication`,
`recipe-management`) with:

- **`description.md`** — mirror the shape of `specs/recipe-management/description.md`: an opening
  "As a ___, I want ___, so that ___" line, a `## Scope` section as a bullet list of concrete
  requirements, and an optional `## Notes` section for fixed vocabularies or non-obvious
  constraints.
- **`<feature-name>.feature`** — mirror `specs/recipe-management/recipe-management.feature`:
  a `Feature:` line with the same As/I want/So that framing, a `Background:` if scenarios share
  setup, and one `Scenario:` per user-facing behavior (happy path plus the edge cases you
  clarified in step 2 — don't skip validation/permission scenarios just because they're less
  interesting).

Before writing, show the developer the draft of both files and get a quick confirmation — specs
are cheap to correct before they exist and are the reference everything else gets built from
after.

### 5. Update specs/README.md

Add one bullet under `## Features`, matching the existing style:
`- [feature-name](feature-name/) — short description`. If the feature introduces a new
platform-wide constraint (rare — most things belong in the feature's own scope), add it under
"Platform-wide constraints" instead.

### 6. Stop

The skill's job ends when the spec is written and README is updated. Don't start implementing
components/services/routing in the same pass — that's a separate task the developer will kick off
deliberately, using the finished spec as the contract.
