# Example Launch QA Report

This example shows the kind of report produced when using `agent-output-review`, `browser-launch-audit`, `readme-install-audit`, and `github-release-checklist` together.

## Launch Verdict

Almost ready.

The project has a clear promise and a working local build, but first-time users would likely get stuck because the README does not show expected output, the mobile nav overflows at narrow widths, and the primary demo button has no loading or error state.

## Tested

- URL or command: `npm run dev`, then `http://localhost:3000`
- Browser/device widths: desktop, tablet, mobile
- Main flows: landing page, demo CTA, example form, README install path

## Critical Findings

- P1: The demo CTA accepts input but does not show a loading, success, or error state. Users cannot tell whether the product worked.
- P1: The README install section omits the required `.env` keys and expected placeholder values.
- P2: The mobile header clips the GitHub link below 390px width.

## Browser Health

- Console: no blocking runtime errors.
- Network: one missing image asset returns 404.
- Rendering: desktop layout is stable; mobile hero needs spacing fixes.

## README Patch Notes

- Add a "Requirements" section with Node version, package manager, and required env vars.
- Add a "First successful run" section with expected terminal output.
- Add a troubleshooting row for port conflicts.

## GitHub Metadata

- Description: "Launch QA skills for AI-built apps, READMEs, and GitHub releases."
- Topics: `ai-agents`, `claude-code`, `codex`, `developer-tools`, `github`, `skills`, `qa`, `vibe-coding`

## Next Fixes

1. Add explicit CTA states and error handling.
2. Patch README requirements and expected output.
3. Fix mobile header overflow.
4. Add a release note and first three contributor issues.
