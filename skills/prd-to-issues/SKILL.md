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
