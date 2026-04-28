---
name: prd-to-issues
description: Use when converting a PRD, product brief, or feature spec into GitHub-ready issues with labels, acceptance criteria, dependencies, and verification steps.
---

# PRD To Issues

Use this skill to make a PRD executable. The output should be ready to paste into GitHub issues or hand to a coding agent.

## Workflow

1. Identify the smallest vertical slice that proves the product promise.
2. Split work by user-visible outcomes, not by technical layers.
3. Create issues with:
   - Title.
   - Goal.
   - User value.
   - Scope.
   - Acceptance criteria.
   - Suggested labels.
   - Dependencies.
   - Verification steps.
4. Put issues in build order.
5. Mark any issue that is too large and split it.

## Output Format

```markdown
## Release Slice

One paragraph describing what ships first.

## Issues

### 1. Title

Labels: `feature`, `mvp`
Size: S / M / L
Priority: P0 / P1 / P2

Goal:

Scope:

Acceptance Criteria:

Verification:

Dependencies:
```

## Issue Rules

- Each issue should deliver visible progress.
- Avoid vague tasks like "improve UX" or "add backend".
- Keep the first issue small enough to start immediately.
- Include docs and launch tasks when the project is public-facing.
- Size S: under 2 hours. Size M: half day. Size L: full day or split further.
- P0: blocks the first slice. P1: needed for launch. P2: nice to have.

## Milestone Grouping

Group issues into milestones when there is a natural release boundary:

- **v0.1 (First Slice):** The smallest set of issues that proves the product promise.
- **v0.2 (Polish):** Issues that improve quality, error handling, and edge cases.
- **v1.0 (Launch):** Docs, examples, install path, and public-facing issues.

## Next Step

After building, run `launch-readiness` to audit the repository for README quality, install experience, trust signals, and conversion gaps before publishing.
