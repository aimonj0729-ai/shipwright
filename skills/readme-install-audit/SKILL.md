---
name: readme-install-audit
description: Use when testing whether a GitHub README, open source project, skill pack, CLI, template, MCP server, or developer tool can be installed and used by a first-time user. Trigger this whenever the user asks to check setup docs, installation instructions, onboarding, quickstart, examples, or whether a repo is easy to adopt.
---

# README Install Audit

Use this skill to test adoption, not just documentation. The goal is to answer: "Can a stranger follow the README and get value without asking the maintainer?"

## Inputs

Accept any of:

- A repository path or URL.
- README text.
- Install instructions.
- A package, CLI, skill pack, MCP server, template, or example app.

## Workflow

1. Read the public onboarding path:
   - Project name and one-line promise.
   - Install section.
   - Quickstart section.
   - Required tools, versions, credentials, and environment variables.
   - First useful command or example prompt.
2. Test from a clean-user perspective:
   - Follow the README in order.
   - Do not rely on private knowledge from the code unless the README gets stuck.
   - Use a temporary directory for clone/install tests when feasible.
   - Record the exact step where friction appears.
3. Verify the first value moment:
   - The documented command runs.
   - The documented example produces a meaningful output.
   - The user knows what success looks like.
   - The user knows how to undo, update, or remove the installation.
4. Check missing trust details:
   - License.
   - Security or data handling notes.
   - Compatibility and requirements.
   - Known limitations.
   - Troubleshooting section.
5. Rewrite only what matters:
   - Prefer small README patches over a total rewrite.
   - Add commands, expected output, and failure fixes.
   - Move advanced details below the first success path.

## Extra Checks For Skill Packs

- Every skill has a `SKILL.md` with `name` and `description`.
- Trigger descriptions are specific enough for an agent to know when to use them.
- Install script links or copies all skills.
- README includes example prompts for each skill.
- Users are told to restart their agent after installation.

## Output Format

````markdown
## Install Verdict

Pass / Pass with friction / Fail.

## First-Time User Path

1. Step followed.
2. Step followed.
3. Step where trust or execution breaks.

## Adoption Blockers

- Blocker: exact missing or broken instruction, why it matters, and fix.

## README Patch Notes

- Section: replacement or addition to make.

## Missing Trust Signals

- Signal to add and where to add it.

## Retest Command

```bash
command to verify the fix
```
````

## Judgment Rules

- If the README requires guessing, it is not done.
- If the install needs secrets, explain the safe placeholder path.
- Do not run destructive, paid, or production-impacting commands during an audit.
- A good quickstart should get to visible value in under ten minutes.
- Treat "works on my machine" as unverified until the README path works.
