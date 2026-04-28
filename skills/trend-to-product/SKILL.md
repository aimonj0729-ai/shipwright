---
name: trend-to-product
description: Use when turning a hot repository, GitHub trend, market signal, or competitor into a differentiated product idea, MVP scope, and positioning plan.
---

# Trend To Product

Use this skill when the user has a trend or repository and wants to know what they could build from it.

## Workflow

1. Identify the real pain behind the trend.
2. Separate the implementation from the insight. The user should not clone the project directly unless the license and ethics are clear.
3. Pick a narrower buyer or user than the original project.
4. Define the wedge: the small promise that makes someone try it today.
5. Choose a product shape:
   - Skill pack.
   - CLI.
   - MCP server.
   - Browser extension.
   - Dashboard.
   - SaaS.
   - Template repo.
6. Define the smallest useful MVP.
7. List risks: market, trust, maintenance, compliance, distribution.
8. Produce a launch angle for GitHub.

## Output Format

```markdown
## Trend

What is rising and why it matters now.

## User Pain

Who feels the pain, how often, and what they do today.

## Product Opportunity

One sentence positioning.

## MVP

- Core workflow
- Inputs
- Outputs
- Non-goals

## Differentiation

How this avoids being a clone.

## GitHub Launch Shape

Repo name, README promise, first demo, topics, and example prompt.

## Risks

What could make this fail.

## Next 3 Tasks

Build steps in order.
```

## Guardrails

- Do not suggest illegal, unsafe, deceptive, or ToS-bypassing products.
- Do not overfit to stars. Explain the customer pain behind the stars.
- Favor projects that can earn trust with a clear README, example, and install path.
