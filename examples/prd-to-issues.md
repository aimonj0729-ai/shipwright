# Example: PRD To Issues

## Release Slice

Ship a public skill pack with six skills that chain from GitHub trend scanning to launch-ready auditing. The first slice proves the full pipeline works end-to-end: a user can scan trends, shape an idea, scope a PRD, generate issues, and audit the result before publishing.

## Issues

### 1. Create github-radar skill with scoring and output format

Labels: `feature`, `mvp`
Size: M
Priority: P0

Goal: Let builders scan GitHub Trending and get actionable recommendations grouped by worth using, emulating, or avoiding.

Scope: Write SKILL.md with inputs, workflow, scoring criteria, output format template, and judgment rules. Add agents/openai.yaml.

Acceptance Criteria:
- Skill accepts a GitHub Trending page, repo list, or category as input.
- Output includes Today's Signal, Worth Watching, Worth Using, Worth Emulating, Avoid For Now, and Best Next Build sections.
- Judgment rules filter out novelty-only and platform-arbitrage projects.

Verification: Run the skill against a real GitHub Trending day and confirm the output matches the template.

Dependencies: None.

### 2. Create trend-to-product skill with MVP and positioning

Labels: `feature`, `mvp`
Size: M
Priority: P0

Goal: Turn a hot repo or trend into a differentiated product idea with clear MVP scope.

Scope: Write SKILL.md with workflow steps from pain identification through launch angle. Include product shape options and risk categories. Add agents/openai.yaml.

Acceptance Criteria:
- Output includes Trend, User Pain, Product Opportunity, MVP, Differentiation, GitHub Launch Shape, Risks, and Next 3 Tasks.
- Guardrails block illegal, unsafe, or ToS-bypassing suggestions.

Verification: Run against a real trending repo and confirm the brief is specific enough to start building.

Dependencies: None (but logically follows github-radar output).

### 3. Create idea-to-prd and prd-to-issues skills

Labels: `feature`, `mvp`
Size: M
Priority: P0

Goal: Complete the middle of the pipeline: rough idea becomes lean PRD, PRD becomes GitHub issues.

Scope: Write both SKILL.md files with workflow, output format, and quality bar. Add agents/openai.yaml for each.

Acceptance Criteria:
- idea-to-prd produces a PRD with Problem, Target User, MVP Scope, User Stories, Functional Requirements, Acceptance Criteria, Risks, and Launch Plan.
- prd-to-issues produces a release slice paragraph and ordered issues with labels, sizing, acceptance criteria, and verification steps.

Verification: Feed the trend-to-product example output through both skills and confirm the issues are buildable.

Dependencies: None.

### 4. Create launch-readiness and workflow-to-skill skills

Labels: `feature`, `mvp`
Size: M
Priority: P1

Goal: Complete the pipeline endpoints: pre-launch audit and meta-skill for packaging workflows.

Scope: Write both SKILL.md files. launch-readiness covers name, README, demo, trust, setup, examples, differentiation, and social launch prep. workflow-to-skill provides a skill skeleton and anti-patterns.

Acceptance Criteria:
- launch-readiness produces a verdict, conversion gaps, quick wins, trust risks, and launch checklist.
- workflow-to-skill produces a clean SKILL.md skeleton with trigger, workflow, output format, and guardrails.

Verification: Run launch-readiness against the ai-builder-skills repo itself. Use workflow-to-skill to package a sample workflow.

Dependencies: None.

### 5. Write install script, examples, and README

Labels: `docs`, `mvp`
Size: M
Priority: P1

Goal: Make the repo installable and presentable for first-time visitors.

Scope: Write install.sh with --claude, --codex, --agents, --uninstall, and --help flags. Create example outputs in examples/. Write README with pipeline diagram, skills table, install instructions, quick prompts, and chained example.

Acceptance Criteria:
- install.sh creates correct symlinks for all three target formats.
- README renders correctly on GitHub with badges and ASCII pipeline diagram.
- At least two example outputs demonstrate real skill runs.

Verification: Run install.sh --claude and confirm skills appear in ~/.claude/commands/. Run --uninstall and confirm cleanup.

Dependencies: Issues 1-4 (skills must exist before install and examples).
