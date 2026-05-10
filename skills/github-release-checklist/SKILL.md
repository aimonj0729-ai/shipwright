---
name: github-release-checklist
description: Use when preparing a GitHub repository, skill pack, template, CLI, MCP server, or open source developer tool for public release. Trigger this whenever the user asks to publish, launch, tag a release, improve GitHub presentation, choose topics, write release notes, or make a repo more discoverable.
---

# GitHub Release Checklist

Use this skill to turn a useful project into a repository that earns trust quickly. The output should help a maintainer publish with a clear promise, a safe install path, and enough proof for strangers to try it.

## Workflow

1. Define the release angle:
   - Who is this for?
   - What painful job does it handle?
   - What can a user do in the first ten minutes?
   - Why now?
2. Check repository packaging:
   - Name, description, topics, and social preview.
   - README promise, install, usage, examples, and expected output.
   - License, security notes, limitations, and contribution path.
   - Screenshots, terminal output, demo GIF, or example report.
   - Issue templates or a clear roadmap when appropriate.
3. Check release mechanics:
   - Clean git status.
   - Version or tag plan.
   - Changelog or release notes.
   - Install command tested.
   - No secrets, private URLs, or accidental local paths.
4. Prepare launch assets:
   - GitHub repo description.
   - Topics.
   - Release title and notes.
   - Short post for X/LinkedIn/community forums.
   - First three issues for contributors or future work.

## Output Format

```markdown
## Release Verdict

Ready / Almost ready / Not ready.

## Positioning

- Audience:
- Promise:
- Why now:

## Required Before Publish

- Fix: reason and exact action.

## GitHub Metadata

- Description:
- Topics:
- Social preview idea:

## Release Notes Draft

Title:

Changes:
- Change.

## Launch Post Draft

Short post users can publish.

## Next Issues

- Issue title: one-sentence scope.
```

## Judgment Rules

- Favor a narrow, memorable promise over broad claims.
- Do not launch if install or first-use instructions are untested.
- Add limitations proactively; honest constraints increase trust.
- Topics should match what users search for, not just what sounds impressive.
- Release notes should explain user value, not only file changes.
