# Example: Workflow To Skill

## The Repeated Workflow (Before)

Every time this builder evaluates whether a project is ready to open-source, they run the same sequence of prompts manually:

```
Prompt 1: "Check if this repo has a LICENSE file, .gitignore, and README with install instructions."
Prompt 2: "Look at the README — can a stranger install this in under five minutes?"
Prompt 3: "Are there any hardcoded secrets, API keys, or internal URLs in the code?"
Prompt 4: "Check if there's a CONTRIBUTING.md and issue templates."
Prompt 5: "Write me a summary of what's missing before I can make this repo public."
```

**Problems with this approach:**
- Five separate prompts every time, easy to forget one.
- No consistent output format — each run produces a different structure.
- No severity classification — everything feels equally important.
- The builder has to mentally synthesize five answers into a go/no-go decision.
- Not sharable — a teammate would need the same five prompts explained to them.

## The Packaged Skill (After)

```markdown
---
name: open-source-readiness
description: Use when checking whether a private repo is ready to be made public on GitHub. Trigger this when the user asks to open-source a project, make a repo public, prepare for public release, or audit a repo before sharing.
---

# Open Source Readiness

Use this skill to audit a repository before making it public. The goal is to catch missing files, exposed secrets, and documentation gaps that would embarrass the maintainer or block adoption.

## Workflow

1. Check required files exist:
   - LICENSE (any OSI-approved license).
   - .gitignore (appropriate for the project language).
   - README.md with: project name, one-line description, install instructions, usage example.
2. Scan for exposed secrets:
   - Search for hardcoded API keys, tokens, passwords, and internal URLs.
   - Check .env files are gitignored.
   - Check git history for accidentally committed secrets.
3. Audit the README install path:
   - Can a stranger clone, install, and run the project in under five minutes?
   - Are prerequisites (runtime version, OS, dependencies) documented?
   - Is expected output shown after the first command?
4. Check community readiness:
   - CONTRIBUTING.md or contribution section in README.
   - Issue templates or discussion guidelines.
   - Code of conduct (recommended for public repos).
5. Classify findings by severity:
   - Blocker: prevents going public (exposed secrets, missing license).
   - Warning: damages trust (broken install, missing docs).
   - Suggestion: improves adoption (badges, examples, changelog).

## Output Format

## Open Source Readiness Verdict

Ready / Almost ready / Not ready.

## Required Files

| File | Status | Note |
|------|--------|------|
| LICENSE | Present/Missing | License type or recommendation |
| .gitignore | Present/Missing | Coverage assessment |
| README.md | Present/Missing | Quality note |

## Secret Scan

- Finding or "No secrets detected in code or git history."

## Install Path Audit

1. Step followed and result.
2. Step where friction appeared.

## Community Readiness

- CONTRIBUTING.md: Present/Missing.
- Issue templates: Present/Missing.
- Code of conduct: Present/Missing.

## Fix Plan

1. Blocker fixes first.
2. Warning fixes second.
3. Suggestions last.

## Guardrails

- Never commit, push, or change repository visibility during an audit.
- Do not run destructive commands or modify production configuration.
- If secrets are found, recommend rotation before making the repo public.
- Flag but do not auto-fix license selection — that is a legal decision for the maintainer.
```

## What Changed

| Aspect | Before (Ad-Hoc Prompts) | After (Packaged Skill) |
|--------|------------------------|----------------------|
| Trigger | Remember to run 5 prompts | Agent activates on "open-source this repo" |
| Consistency | Different structure each time | Same output format every run |
| Completeness | Easy to skip a check | Workflow covers all five areas |
| Severity | No classification | Blocker / Warning / Suggestion |
| Decision | Mental synthesis of 5 answers | Single verdict at the top |
| Sharability | Copy-paste 5 prompts | Install one skill file |
| Safety | No guardrails | Explicit "do not push" and secret rotation guidance |

## Quality Checklist Result

- [x] Description includes real trigger phrases: "open-source", "make public", "prepare for release".
- [x] Body is under 80 lines — loads quickly.
- [x] Workflow gives degrees of freedom (does not force a specific language or tool).
- [x] Output format matches the user's next action (go/no-go decision + fix list).
- [x] No unrelated documentation files inside the skill folder.
- [x] Guardrails prevent the skill from making destructive changes.
- [x] Example is a realistic scenario, not a toy prompt.
