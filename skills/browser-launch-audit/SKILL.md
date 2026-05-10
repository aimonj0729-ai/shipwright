---
name: browser-launch-audit
description: Use when checking whether a web app, localhost build, demo URL, landing page, AI-generated frontend, or GitHub project actually works in the browser before shipping. Trigger this whenever the user asks to test, verify, inspect, QA, launch, debug UI, check console errors, check mobile responsiveness, or validate a project in a real browser.
---

# Browser Launch Audit

Use this skill to move beyond code review and verify the thing a user will actually see. AI-built projects often look complete in code but fail in the browser because of missing env vars, broken routes, console errors, fake buttons, hydration issues, or mobile layout problems.

## Inputs

Accept any of:

- A localhost URL or public URL.
- A repo path and the command to run it.
- A README with setup instructions.
- A list of critical user flows.
- A screenshot or bug report.

If no URL or run command is available, inspect the project scripts first and make a reasonable attempt to identify the dev command. Ask only if several risky options exist.

## Workflow

1. Identify the target experience:
   - App type, primary user, and the promise the page makes.
   - Critical pages or flows to test first.
   - Whether the target is local, staging, or production.
2. Launch or open the app:
   - For local projects, prefer the documented dev command.
   - Note Node, package manager, port, and any env var blockers.
   - Do not use production credentials or destructive actions.
3. Inspect the first-load experience:
   - Page renders without blank screen.
   - Main promise is visible within five seconds.
   - Navigation and primary call-to-action are obvious.
   - Loading, empty, and error states are not misleading.
4. Check browser health:
   - Console errors and warnings.
   - Failed network requests.
   - Hydration or client/server mismatch issues.
   - Missing assets, fonts, images, or source maps.
5. Test core interactions:
   - Click primary buttons and links.
   - Fill representative forms with safe dummy data.
   - Verify disabled, loading, success, and failure states when possible.
   - Flag fake or non-functional interactions clearly.
6. Check responsiveness:
   - Desktop, tablet-ish, and mobile widths.
   - Header, nav, hero, cards, modals, and forms.
   - Overflow, clipped text, unreadable buttons, and cramped spacing.
7. Check accessibility basics:
   - Keyboard reachability for core actions.
   - Visible focus states.
   - Form labels and error text.
   - Color contrast or text legibility issues.
8. Prioritize findings:
   - P0: prevents the demo or main flow from working.
   - P1: damages trust or conversion.
   - P2: polish, clarity, or edge-case improvements.

## Output Format

```markdown
## Launch Verdict

Ready / Almost ready / Not ready.

## Tested

- URL or command:
- Browser/device widths:
- Main flows:

## Critical Findings

- P0/P1/P2: what broke, evidence, and why it matters.

## Browser Health

- Console:
- Network:
- Rendering:

## UX Trust Gaps

- Gap: why a first-time user would hesitate.

## Fix Plan

1. Highest-impact fix.
2. Next fix.
3. Polish fix.

## Retest Checklist

- [ ] Item to verify after fixes.
```

## Judgment Rules

- A project is not launch-ready if the main CTA, demo path, or install path is broken.
- Do not declare success from code inspection alone when a browser check is feasible.
- Prefer concrete evidence: URL, page, action, error text, screenshot note, or console message.
- Separate "does not work" from "could be better" so the user knows what blocks shipping.
- If browser tooling is unavailable, say so and provide the best static audit instead.
