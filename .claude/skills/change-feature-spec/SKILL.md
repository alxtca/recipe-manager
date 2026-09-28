---
name: change-feature-spec
description: >-
  Changes the spec of an existing recipe-manager feature (specs/<feature>/description.md +
  <feature>.feature). Use it whenever the developer wants to adjust, correct, extend or drop
  behavior of a feature that already has a spec, often after trying the implemented feature.
  Typical requests: "change recipe-rating so that...", "I didn't specify X properly", "clicking
  outside should cancel the edit", "update the spec for home", "remove the scenario about Y", or
  describing a behavior they want different from how it works now. Asks clarifying questions,
  sorts each change into modified/added/removed scenarios while keeping requirement IDs stable,
  checks for contradictions within the feature, with other specs and with the implemented code,
  and reports which tests and code are affected. It writes the spec only after the developer
  approves the draft. It does not implement the change; that happens afterwards with
  implement-the-feature. Brand-new features go through new-feature-spec instead.
---

# Change Feature Spec

`specs/` is the source of truth for behavior. Once a feature is implemented, its scenarios are
also the contract that the code and tests are traced against: every `it()` starts with the
IDs of the scenarios it verifies, e.g. `[recipe-rating-6]`. So a spec change affects more than
the wording. It changes the contract for code that already exists. This skill updates the
contract without breaking that traceability and leaves a clear list of what implementation now
has to catch up on.

It follows the same principles as `new-feature-spec`: clarify before writing Gherkin, and don't
settle contradictions silently. Read that skill's clarification and contradiction steps for
the level of detail expected. The steps below cover what is different when the spec already
exists.

## Workflow

### 1. Pin down the feature and the change

Work out which feature the change belongs to from the developer's message, and open
`specs/<feature>/`. If it's unclear, list the candidates from `specs/README.md` and ask.

Watch for changes that aren't really changes:

- If the request adds a separate capability that doesn't belong to any existing feature, it's a
  new feature. Suggest `new-feature-spec` instead.
- If the request touches several features (e.g. a change to cards that also affects
  `recipe-detail`), name every affected feature and handle each spec in this pass.

### 2. Read the current contract and what was built from it

Read:

- the feature's `description.md` and `.feature` file, including every scenario's ID tag;
- the "Requirement IDs" and "Platform-wide constraints" sections of `specs/README.md`;
- every other spec under `specs/`, for the cross-feature contradiction check;
- the tests that reference this feature's IDs. Search `src/` for `[<feature>-` to find them,
  then read the code those tests exercise. This shows how each scenario was actually
  interpreted, which is often why the developer wants a change.

### 3. Clarify

Use `AskUserQuestion` for every gap you can't close from the spec, the code or the app's
conventions, as in `new-feature-spec`. Batch the questions. Things that come up in particular
with changes:

- **Scope of the change.** Does it apply to every place the behavior appears? For example, if
  "cancel the edit" applies to the Edit dropdown, does it also apply to the first-time Rate
  dropdown? Does it apply on the card as well as the detail page?
- **Interactions with the existing scenarios.** If the new behavior sits next to an existing
  rule (e.g. "a selection is accepted right away"), ask how the two combine rather than
  assuming.
- **What happens to data that already exists** in `localStorage`, if the change affects stored
  data.

Keep going until you could write every changed scenario step without guessing.

### 4. Sort the change into scenario operations

Express the change as a list of operations on the `.feature` file. Each operation follows the
ID rules in `specs/README.md`:

- **Modify** an existing scenario when its behavior changes but it's still the same
  requirement. Keep its ID, and edit the steps in place.
- **Add** a scenario for new behavior. Give it the next free number. The next free number is
  one more than the highest ID ever used in that file, counting retired IDs, never one more
  than the highest ID still present.
- **Remove** a scenario that's no longer wanted. Delete it, and add its ID to a
  `Retired IDs:` line in the `## Notes` section of `description.md` (create the line if it
  doesn't exist). That line is what stops the ID from being reused. Never renumber the
  remaining scenarios.

A modification that turns a scenario into a different requirement should be split into a
**Remove** plus an **Add** instead. Otherwise old tests tagged with that ID would appear to
verify something they don't.

Also update the `## Scope` bullets in `description.md` so that they describe the new behavior.
The scope and the scenarios must never disagree.

### 5. Check for contradictions

Check the changed contract for contradictions at three levels, and stop at any you find. Quote
the conflicting line, explain the conflict, and ask how to resolve it:

1. **Inside the feature.** Check the new or modified scenarios against the feature's other
   scenarios and scope bullets. Changes are especially prone to this. A new rule often quietly
   contradicts an old one in the same file that nobody thought to update.
2. **Across features.** Check the change against every other spec and the platform-wide
   constraints, just as `new-feature-spec` does.
3. **Against the code.** The implementation will differ from the new spec, and that's the point
   of the change, so don't report it as a conflict. Do flag it when the code depends on the old
   behavior in a way that makes the change harder than it looks. For example, other features
   might reuse the component being changed, or stored data might have a shape the new rule
   can't support.

If nothing conflicts, say so in a sentence and continue.

### 6. Work out the impact

List what implementation will need to update:

- **Tests.** Name every `it()` that references a modified or removed ID, with its file. Tests
  for removed IDs have to be deleted or re-tagged. Tests for modified IDs need their assertions
  updated. Added IDs have no tests yet.
- **Code.** Name the components, services or models that the change most likely touches, based
  on what you read in step 2.

This is a pointer for implementation, not a plan. Keep it short.

### 7. Show the draft and get approval

Show the developer the following before writing anything:

- each scenario operation, labelled Modify / Add / Remove with its ID, showing the old and new
  Gherkin for modified scenarios;
- the changed `## Scope` bullets and any `Retired IDs:` addition;
- the impact list from step 6.

Wait for their confirmation. Adjust and show the draft again if they ask for changes.

### 8. Write the spec

Apply the approved changes to `description.md` and `<feature>.feature`. If the feature's
one-line summary in `specs/README.md` no longer describes it, update that too. If the change
introduces a new platform-wide constraint, add it under "Platform-wide constraints".

### 9. Stop

The skill ends when the spec is updated. Don't change code or tests in the same pass. Tell the
developer that the next step is to implement the change (e.g. "implement the recipe-rating
changes"). That runs the `implement-the-feature` skill, which will use the impact list and the
changed scenario IDs.
