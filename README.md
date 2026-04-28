# AI Builder Skills

![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-blue)
![Codex](https://img.shields.io/badge/Codex-compatible-orange)
![License: MIT](https://img.shields.io/github/license/aimonj0729-ai/ai-builder-skills)

Practical Claude Code and Codex skills for indie builders who want to turn fast-moving GitHub trends into product ideas, PRDs, issues, and launch-ready projects.

This is not a prompt dump. Each skill is a reusable workflow for a real builder pain:

- Too many hot repos, not enough signal.
- Ideas that never become scoped products.
- PRDs that do not turn into buildable issues.
- GitHub projects that look useful but are not packaged well enough to earn trust.
- Recurring agent workflows that should become installable skills.

## Who Is This For

- **Indie builders** who ship side projects and want to move from "interesting repo" to "launched product" faster.
- **AI product makers** who need repeatable workflows instead of blank chat boxes.
- **Technical operators** who want useful leverage without building a heavy platform first.

Most prompt packs stop at ideation. This package connects the full path from trend discovery to public launch.

## Pipeline

These skills chain into a discovery-to-launch pipeline:

```
github-radar ──> trend-to-product ──> idea-to-prd ──> prd-to-issues ──> [build] ──> launch-readiness
  (scan)            (shape)             (scope)          (plan)                        (audit)

                              workflow-to-skill
                      (meta: package any step as a new skill)
```

You can use each skill standalone, or chain them for end-to-end product development.

## Skills

| Skill | Use it when you need to... |
| --- | --- |
| `github-radar` | Read GitHub Trending and separate useful tools, buildable opportunities, and hype traps. |
| `trend-to-product` | Turn a hot repo, trend, or category into a differentiated product opportunity. |
| `idea-to-prd` | Convert a rough product idea into a lean PRD with assumptions, scope, and acceptance criteria. |
| `prd-to-issues` | Break a PRD into GitHub-ready implementation issues ordered by delivery sequence. |
| `launch-readiness` | Audit a GitHub project before launch for README, install, demo, trust, and conversion gaps. |
| `workflow-to-skill` | Turn a repeated agent workflow into a clean, installable skill. |

## Install

Clone the repo:

```bash
git clone https://github.com/aimonj0729-ai/ai-builder-skills.git
cd ai-builder-skills
```

Install into Claude Code commands:

```bash
./scripts/install.sh --claude
```

Install into Codex skills:

```bash
./scripts/install.sh --codex
```

Install into the common agent skills directory (default):

```bash
./scripts/install.sh
```

Install into a custom directory:

```bash
./scripts/install.sh ~/my-skills
```

Uninstall:

```bash
./scripts/install.sh --uninstall
./scripts/install.sh --uninstall --claude
```

Restart your agent after installing so it reloads skill metadata.

## Quick Prompts

Use `github-radar`:

```text
Scan today's GitHub Trending and tell me which projects are worth using, which are worth copying ethically, and which I should ignore.
```

Use `trend-to-product`:

```text
Analyze this repo as a product opportunity: https://github.com/example/project
What could I build for indie developers that is smaller, sharper, and easier to adopt?
```

Use `idea-to-prd`:

```text
Turn this idea into a lean PRD: a daily GitHub radar that finds workflow and skill ideas for AI builders.
```

Use `prd-to-issues`:

```text
Break this PRD into GitHub issues for a first release. Keep the first slice shippable in one weekend.
```

Use `launch-readiness`:

```text
Audit this repository for launch readiness before I post it on GitHub, X, and Product Hunt.
```

Use `workflow-to-skill`:

```text
Turn my daily research workflow into a reusable Codex/Claude skill with a concise SKILL.md.
```

### Chained Example

Start from a trend and reach launch in five steps:

1. *"Scan today's GitHub Trending for AI coding agent opportunities."*
2. *"Take the top opportunity from the radar report and shape it into a product brief."*
3. *"Turn that product brief into a lean PRD."*
4. *"Break the PRD into GitHub issues for a weekend first release."*
5. *"Audit the repo for launch readiness before I post it."*

## Examples

The `examples/` directory contains sample outputs from real skill runs:

- [GitHub Radar Report](examples/github-radar-report.md) — Trend scan identifying builder opportunities.
- [Product Brief](examples/product-brief.md) — Trend-to-product output for this skill pack.
- [PRD to Issues](examples/prd-to-issues.md) — PRD broken into implementation issues.
- [Launch Readiness Audit](examples/launch-readiness.md) — Pre-launch repository audit.

## Design Principles

- Prefer actionable judgment over trend summaries.
- Turn every insight into a next step.
- Keep skill instructions short enough to be loaded often.
- Avoid fragile platform hacks and unclear compliance risks.
- Make outputs useful for GitHub, not just private notes.

## Roadmap

- Add a `repo-positioning` skill for improving names, descriptions, topics, and README conversion.
- Add a `demo-script` skill for turning a project into a short launch video script.
- Add a `skill-evaluator` skill for testing whether a skill triggers correctly and produces useful output.
- Add example reports from real GitHub Trending days.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding or improving skills.

## License

MIT
