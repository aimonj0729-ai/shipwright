---
name: launch-readiness
description: Use when auditing a GitHub repository, open source project, skill pack, template, CLI, MCP server, or developer tool before publishing or promoting it.
---

# Launch Readiness

Use this skill before a project is posted on GitHub, X, Product Hunt, Reddit, Hacker News, or a community forum.

## Audit Areas

Check the project from a first-time visitor's point of view:

- Name: understandable, searchable, and not misleading.
- One-line promise: clear within five seconds.
- README: problem, install, usage, examples, screenshots or terminal output.
- Demo: the fastest proof that it works.
- Trust: license, security notes, data handling, limitations.
- Setup: works from a clean environment.
- Examples: realistic enough to show value.
- Differentiation: explains why this exists.
- Contribution path: issues, roadmap, or extension points.
- Social launch: draft tweet thread, Hacker News post angle, Reddit post framing.

## Output Format

```markdown
## Launch Verdict

Ready / Almost ready / Not ready.

## Biggest Conversion Gaps

- Gap: why it hurts adoption, how to fix it.

## Quick Wins

- Change that can be done today.

## Trust Risks

- Risk and mitigation.

## README Rewrite Notes

Specific sections or copy to improve.

## Social Launch Prep

- Twitter/X thread: 3-5 tweets covering problem, solution, demo, and ask.
- Hacker News: Show HN title and opening paragraph angle.
- Reddit: subreddit targets and post framing.

## Launch Checklist

- [ ] Item
```

## Judgment Rules

- Prioritize clarity over cleverness.
- A project without a quickstart is not launch-ready.
- A skill pack should include example prompts.
- A developer tool should include at least one realistic input and output.

## Related

If you find yourself repeating any part of this audit as a workflow, use `workflow-to-skill` to package it as a reusable skill.
