---
name: github-radar
description: Use when scanning GitHub Trending, GitHub Explore, or hot repositories to identify useful tools, product opportunities, skill/workflow ideas, and hype traps for builders.
---

# GitHub Radar

Use this skill to turn GitHub momentum into builder judgment. The goal is not to summarize a leaderboard; it is to decide what is worth using, learning from, copying ethically, or ignoring.

## Inputs

Accept any of:

- A GitHub Trending page or date.
- A list of repositories.
- A category such as "AI coding agents", "skills", "RAG", "developer tools", or "open source SaaS".
- A user goal, audience, or build constraint.

If the user gives no category, scan broadly and prioritize developer tools, AI workflows, agent infrastructure, and products that can be turned into small shippable projects.

## Workflow

1. Gather candidates from GitHub Trending, GitHub Explore, repo README files, release notes, issues, and project websites when available.
2. Filter out projects whose only signal is novelty, gray-area access, security misuse, or platform-rule arbitrage.
3. Score each serious candidate on:
   - Pain intensity: Does it solve an annoying, frequent problem?
   - Adoption signal: Stars today, total stars, contributors, issues, recent commits.
   - Builder leverage: Can an indie builder make a smaller or more focused version?
   - Workflow fit: Does it become a skill, template, CLI, MCP server, dashboard, or SaaS?
   - Trust risk: Security, compliance, maintenance, dependency, data privacy.
4. Group recommendations into:
   - Worth using now.
   - Worth studying or emulating.
   - Worth avoiding for now.
5. Convert the best opportunity into a concrete next build step.

## Output Format

Use concise sections:

```markdown
## Today's Signal

One sharp paragraph about what changed.

## Worth Watching

- repo: why it is hot, what pain it proves, and the caveat.

## Worth Using

- repo: best use case, maturity, setup cost, and risk.

## Worth Emulating

- direction: target audience, wedge, MVP, differentiation, risk.

## Avoid For Now

- repo/category: why the signal is weak or risky.

## Best Next Build

Name one concrete project, skill, workflow, or repo to create next.
```

## Judgment Rules

- Prefer boring utility with adoption over flashy demos with unclear users.
- If a repo is hot because it bypasses costs or access rules, flag the fragility.
- If a repo is infrastructure, ask what smaller vertical version can exist.
- If a repo is a skill collection, identify which skill has the clearest install-worthy pain.
- Do not recommend copying brands, code, secrets, or restricted platform behavior.

## Next Step

Feed the best opportunity from your radar report into `trend-to-product` to shape it into a differentiated product idea with MVP scope.
