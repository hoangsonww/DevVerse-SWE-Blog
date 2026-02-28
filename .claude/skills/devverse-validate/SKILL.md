---
name: devverse-validate
description: Run repository-specific validation for DevVerse changes. Use when asked to test, validate, smoke check, or confirm modifications in this repository.
argument-hint: [scope]
disable-model-invocation: true
---

# DevVerse Validation Workflow

Validate the current change set for `$ARGUMENTS`.

1. Inspect the current diff first.
Use `git status --short` and `git diff --name-only` to understand what changed.

2. Read the validation matrix before running commands.
@references/validation-matrix.md

3. Choose the smallest useful set of validations that matches the touched files.

4. Never use `npm run lint` as a read-only validation step.
It runs Prettier write mode in this repository.

5. Prefer the constrained-environment Jest commands when needed.
Use `env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false`.

6. Run `python3 .claude/scripts/check_content_contract.py` for article changes.

7. Run `npx tsc --noEmit --pretty false` for TypeScript, route, component, or library changes.

8. Run `npm run build` for page, layout, config, or global styling changes when it is worth the extra cost.
If it fails due Google font fetching, report that as an environment limitation unless there is evidence of a code regression.

9. Report exactly what ran, what passed, what failed, and what was skipped.
