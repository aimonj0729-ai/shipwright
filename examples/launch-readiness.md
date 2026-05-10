# Example: Launch Readiness Audit

Project: shipwright

## Launch Verdict

Almost ready. The core skills are solid and the pipeline concept is strong. The main gaps are install friction for Claude Code users and missing example outputs for half the skills.

## Biggest Conversion Gaps

- **No pipeline visualization.** The six skills form a clear chain, but a first-time visitor has to read every skill description to understand the flow. A diagram in the README would communicate the value in seconds.
- **Install path unclear for Claude Code users.** The default install targets ~/.agents/skills/, but Claude Code users need flat .md files in ~/.claude/commands/. Without a --claude flag, the primary audience cannot install correctly.
- **Only two of six skills have example outputs.** Visitors want to see what the skills produce before installing. Missing examples for prd-to-issues and launch-readiness leave the most concrete skills undemonstrated.

## Quick Wins

- Add an ASCII pipeline diagram to the README showing the skill chain.
- Add a "Chained Example" section showing five prompts that walk through the full pipeline.
- Add compatibility badges (Claude Code, Codex, MIT License) at the top of the README.
- Add a "Who Is This For" section above the skills table.

## Trust Risks

- **No tests or CI.** Acceptable for a v1 skill pack, but adding a basic validation script (check that all SKILL.md files have required frontmatter) would signal quality.
- **No CONTRIBUTING.md.** For a public repo inviting community skills, contribution guidelines help set expectations.
- **MIT license is present.** Good.

## README Rewrite Notes

- Move "Positioning" section content higher in the README as "Who Is This For" — currently buried below Quick Prompts.
- Add an "Examples" section linking to the examples/ directory.
- The Quick Prompts section is good but would benefit from a chained example showing the full pipeline flow.
- Add "Contributing" section before License.

## Social Launch Prep

- **Twitter/X thread:**
  1. Most AI skill packs stop at ideation. This one goes from GitHub Trending to launched product in five prompts.
  2. Six skills that chain together: scan trends → shape opportunity → scope PRD → plan issues → audit for launch.
  3. Each skill is a reusable workflow, not a prompt dump. Concrete output formats, guardrails, judgment rules.
  4. Works with Claude Code and Codex. MIT licensed. Install in one command.
  5. Link to repo. "What workflow would you turn into a skill?"

- **Hacker News:** "Show HN: Shipwright — Claude Code skills for turning GitHub trends into shippable products"
  Opening: "I kept doing the same thing every time I saw a hot repo: check if it's real, think about what I could build, scope a PRD, break it into issues, then forget to audit before posting. So I packaged each step as a reusable skill."

- **Reddit:** Post to r/ClaudeAI, r/SideProject, r/indiehackers. Frame as "I packaged my product discovery workflow into installable skills" rather than "I made a prompt collection."

## Launch Checklist

- [x] README explains the problem and the promise within five seconds.
- [x] Skills table shows what each skill does.
- [x] Install instructions cover Claude Code, Codex, and custom paths.
- [x] Quick prompts show how to use each skill.
- [x] Chained example demonstrates the full pipeline.
- [x] Example outputs exist for key skills.
- [x] MIT license present.
- [x] .gitignore excludes .env and node_modules.
- [ ] CONTRIBUTING.md present.
- [ ] Pipeline diagram in README.
- [ ] Compatibility badges at top of README.
