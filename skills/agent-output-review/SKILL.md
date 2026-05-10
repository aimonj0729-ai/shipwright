---
name: agent-output-review
description: Use when reviewing AI-generated code, apps, workflows, skills, PRDs, GitHub repos, or automation outputs before accepting or publishing them. Trigger this whenever the user asks whether an agent's work is actually usable, complete, safe, non-hallucinated, or ready to merge.
---

# Agent Output Review

Use this skill to catch the failure modes that appear when an AI agent produces something plausible but incomplete. The goal is not to be harsh; it is to protect the user from shipping ghost features, fake integrations, missing instructions, and brittle assumptions.

## What To Review

Review the output against the user's actual goal, not just surface quality:

- Does it solve the requested problem?
- Does it work in the target environment?
- Are there fake, stubbed, or decorative features presented as real?
- Are dependencies, secrets, permissions, or setup steps missing?
- Are security and privacy risks obvious to the user?
- Is the output maintainable by someone else later?

## Workflow

1. Restate the intended outcome in one sentence.
2. Build an evidence map:
   - Files changed or artifacts produced.
   - Commands that should verify the result.
   - User-facing flows that should work.
   - External services, credentials, or assumptions.
3. Look for agent-specific failure modes:
   - Hallucinated APIs, package names, flags, or config keys.
   - UI buttons that do not do anything.
   - Example data hardcoded as if it were real.
   - Tests that assert implementation details but not user value.
   - README claims that outrun the actual feature.
   - Missing error handling around network, auth, files, or payments.
4. Verify what can be verified:
   - Run tests, lint, build, or typecheck when available.
   - Open the app in a browser when UI is involved.
   - Inspect generated files for placeholders and TODOs.
   - Check that install and usage instructions match the code.
5. Classify the result:
   - Accept: usable with minor notes.
   - Accept after fixes: valuable but has clear blockers.
   - Reject/rework: misleading, unsafe, or not actually functional.

## Output Format

```markdown
## Review Verdict

Accept / Accept after fixes / Rework.

## What Was Verified

- Command, file, or flow checked.

## Blocking Issues

- Severity: issue, evidence, and fix.

## Hallucination Or Completeness Risks

- Claim or feature that may not be real.

## Missing User Value

- What the output still needs before it solves the original problem.

## Recommended Next Patch

Smallest change that turns this from plausible to useful.
```

## Judgment Rules

- Treat untested user-facing behavior as unknown, not done.
- Do not reward volume; reward working paths, clear docs, and honest limitations.
- Point to evidence whenever possible.
- Be especially skeptical of integrations, auth, billing, browser automation, and generated README claims.
- If the output is good, say so plainly and still name the remaining risk.
