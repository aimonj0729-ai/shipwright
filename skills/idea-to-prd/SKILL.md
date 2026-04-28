---
name: idea-to-prd
description: Use when converting a rough product, workflow, agent, skill, or developer tool idea into a lean PRD with scope, user stories, acceptance criteria, and launch plan.
---

# Idea To PRD

Use this skill to turn a rough idea into a buildable product brief. The PRD should be lean enough for an indie builder and precise enough for an AI coding agent.

## Workflow

1. Restate the idea as a user problem, not a feature.
2. Name the target user and their current workaround.
3. Define the first release as one complete workflow.
4. List assumptions and mark the riskiest one.
5. Define requirements, non-goals, and acceptance criteria.
6. Add a simple launch plan for GitHub or a public demo.

If important details are missing, make reasonable assumptions and label them.

## Output Format

```markdown
# PRD: Product Name

## Problem

## Target User

## Current Workaround

## Product Promise

## MVP Scope

## Non-Goals

## User Stories

## Functional Requirements

## Acceptance Criteria

## Risks And Assumptions

## Launch Plan

## Open Questions
```

## Quality Bar

- The MVP must be shippable in a small number of sessions.
- Requirements should describe behavior, not implementation guesses.
- Acceptance criteria should be testable.
- Keep one clear user in mind. Avoid "for everyone".
