# Example: Idea To PRD

# PRD: GitHub Radar Daily Digest

## Problem

Indie builders miss useful trends on GitHub because checking Trending daily is manual, noisy, and produces no actionable output. By the time a hot repo gets attention, the window to build something differentiated has closed.

## Target User

Solo developers and AI product makers who ship side projects and want early signal on buildable opportunities without spending thirty minutes a day on GitHub Trending.

## Current Workaround

Open GitHub Trending manually, skim titles, bookmark a few repos, forget about them. Some users rely on Twitter/X for second-hand trend reports that are biased toward hype.

## Product Promise

A daily digest that scans GitHub Trending, classifies each repo as a tool to use, an opportunity to build on, or noise to skip, and delivers the result as a structured Markdown report before the builder starts their day.

## MVP Scope

- Scan the top 25 repositories from GitHub Trending (all languages, daily).
- Classify each repo into one of three buckets: Worth Using, Worth Building On, Skip.
- For "Worth Building On" repos, include a one-line product opportunity note.
- Output a single Markdown file with the date, repo links, stars, and classifications.
- Deliver via a CLI command that writes the report to a local file.

## Non-Goals

- No web dashboard or hosted service in v1.
- No email or push notifications.
- No historical trend tracking or database.
- No multi-language or multi-timeframe filtering.
- No social media posting or integration.

## User Stories

1. As a builder, I run one command in the morning and get a classified trend report so I can decide what to explore in under two minutes.
2. As a builder, I see which repos are "Worth Building On" with a product angle so I can start shaping an idea immediately.
3. As a builder, I skip repos classified as hype traps so I do not waste time on projects that look impressive but have no builder value.

## Functional Requirements

1. The CLI accepts an optional date argument; defaults to today.
2. The scanner fetches the GitHub Trending page and extracts repo name, description, stars, language, and star velocity.
3. The classifier assigns a bucket to each repo based on description keywords, star velocity, and repo age. Classification rules are configurable in a local YAML file.
4. The reporter formats the result as Markdown with sections for each bucket.
5. The output file is saved to `./reports/github-radar-YYYY-MM-DD.md`.
6. Errors (network failure, parse failure) print a clear message and exit with a non-zero code.

## Acceptance Criteria

- [ ] Running `radar scan` with no arguments produces a Markdown report for today's trending repos.
- [ ] The report contains at least three sections: Worth Using, Worth Building On, Skip.
- [ ] Each repo entry includes name, link, stars, language, and one-line rationale.
- [ ] The command completes in under thirty seconds on a typical connection.
- [ ] Running with `--date 2025-01-15` produces a report for that date.
- [ ] If GitHub Trending is unreachable, the CLI prints a human-readable error and exits 1.

## Risks And Assumptions

- **Assumption (risky):** GitHub Trending page structure is stable enough to scrape. Mitigation: use a lightweight HTML parser and isolate the scraping logic so it can be swapped for an API if one becomes available.
- **Assumption:** Classification by keywords and star velocity is good enough for v1. Users can override rules in the config file.
- **Risk:** GitHub may rate-limit or block scraping. Mitigation: cache results locally and add a configurable delay between requests.

## Launch Plan

1. Ship as a public GitHub repo with a clear README, install instructions, and one example report.
2. Post to r/SideProject and r/ClaudeAI with the framing: "I automated my daily GitHub Trending review into a one-command digest."
3. Include a sample report in the repo so visitors can see the output before installing.
4. Add a `--json` flag in v1.1 for users who want to pipe the output to other tools.

## Open Questions

1. Should the classifier use an LLM call for better accuracy, or stay rule-based for speed and zero API cost?
2. Should the report include a "Best Next Build" recommendation at the top, or keep it neutral?
3. Is there demand for a weekly rollup in addition to the daily report?
