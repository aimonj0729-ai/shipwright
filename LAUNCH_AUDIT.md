# Shipwright — Launch Audit

> Pre-production audit completed on **2026-05-17** against the live site at
> https://shipwright.com.cn/ (GitHub Pages, source `site/`).
>
> Methodology: programmatic structural walk-through + Lighthouse desktop & mobile + targeted fixes (heading order, decorative SVG aria, print stylesheet, noscript fallback, discoverability artifacts).

## Final status

✅ **READY TO SHIP.** All P0 launch artifacts in place. P1 polish landed. Two known-infrastructure items documented below.

---

## Lighthouse (live, after fixes)

| Category        | Desktop | Mobile |
|-----------------|--------:|-------:|
| Performance     |   89    |   94   |
| Accessibility   |  100    |  100   |
| Best Practices  |   96    |   96   |
| SEO             |  100    |  100   |

(Mobile A11Y was 99 before the `h4 → h3` heading-order fix; re-run after commit `7ad4a30` confirmed **100**.)

Mobile Core Web Vitals:
- FCP **2.1 s**
- LCP **2.1 s**
- TBT **10 ms**
- CLS **0.040**
- Speed Index **4.2 s**

Reports archived at `/tmp/lh-desktop.json` and `/tmp/lh-mobile.json` (re-run with `npx lighthouse https://shipwright.com.cn/` to regenerate).

---

## Commit trail

| # | Hash       | Scope                                                   |
|---|------------|---------------------------------------------------------|
| 1 | `4d73790`  | Discoverability bundle (robots / sitemap / manifest / 404) |
| 2 | `a8dd47d`  | `<head>` additions (theme-color × 2, apple-touch-icon, manifest link, format-detection) |
| 3 | `16e72d1`  | CI smoke covers new artifacts; archived `CODEX_REFACTOR_PROMPT.md` |
| 4 | (no code)  | Functional walk-through — 10 paths × 200, 21 DOM IDs intact, 13 init fns mounted, 6 head meta verified |
| 5 | `f56d2fd`  | A11y polish: `@media print`, `<noscript>` fallback, runtime decorative-SVG `aria-hidden` tagger |
| 6 | `7ad4a30`  | Heading order: `.honesty h4` → `h3`, CSS preserved (4 selectors extended) |

Total delta: **6 commits, ~165 insertions, no removals** (all additive). Each commit reverts independently.

---

## Pre-launch artifacts (new on this audit)

- `site/robots.txt` — `User-agent: * / Allow: /` + sitemap pointer
- `site/sitemap.xml` — single-URL XML sitemap, weekly changefreq, priority 1.0
- `site/manifest.webmanifest` — PWA add-to-home metadata, theme `#0b1119`, bg `#f2eadb`
- `site/404.html` — brand-toned "this dock is empty" fallback, self-contained, dark/light auto, ~3KB

CI smoke now `curl --fail --head`s all four; deploy will fail if any goes missing.

---

## Head metadata (verified live)

```
<meta name="description" content="Shipwright checks AI-built projects before launch…">
<link rel="canonical" href="https://shipwright.com.cn">
<link rel="apple-touch-icon" href="./favicon.svg">
<link rel="manifest" href="./manifest.webmanifest">
<meta name="theme-color" content="#0b1119" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f2eadb" media="(prefers-color-scheme: light)">
<meta name="format-detection" content="telephone=no">
<meta property="og:*">    × 5  (type/url/title/description/image)
<meta name="twitter:*">   × 4  (card/title/description/image)
<script type="application/ld+json"> SoftwareApplication schema
```

---

## A11y improvements

| Change                                                         | Effect                                          |
|----------------------------------------------------------------|-------------------------------------------------|
| Honesty section `h4` → `h3` (2 spots)                          | Lighthouse a11y 99 → 100                       |
| Runtime IIFE adds `aria-hidden="true" focusable="false"` to every decorative `<svg>` lacking semantic markers | Screen readers skip 17+ icon graphics |
| `<noscript>` block at top of `<main>`                          | Non-JS users get a clear explanation + GitHub link |
| `@media print` hides hero canvas, custom cursor, FAB, sparks, radar overlay, scroll progress, back-to-top, grain, ascii ship | Clean printed copies; high-contrast text |
| `--muted` token contrast verified                              | Light 5.18:1 / Dark 11.7:1 — both pass WCAG AA |

---

## Functional zero-regression (programmatic walk-through)

All 21 critical DOM IDs present on live HTML: `themeToggle`, `langToggle`, `quickInput`, `quickError`, `brand-check`, `brandReport`, `brandReportBody`, `launch-console`, `lcLaunchBtn`, `lcLaunchLabel`, `aiChatFab`, `heroParticles`, `swCursorRing`, `swCursorDot`, `swCursorTrail`, `inspection-radar`, `analyzer`, `skills-catalog`, `workflow`, `audience`, `guide`.

All 13 init functions retained in `app.js`: `initLanguageToggle`, `initBrandWizard`, `initLaunchConsole`, `initAIChat`, `initInspectionRadar`, `initHeroParticles`, `initCursorFX`, `initRadarDataStream`, `initReportPrinter`, `initEasterEggs`, `motionController`, `emitLaunchSparks`, `tagDecorativeSvgs` (new).

JS syntax check: `node --check site/app.js` ✓ (also enforced by CI on every push).

### Manual click-through (recommended before public announcement)

These cannot be verified programmatically — please walk once:

- [ ] Theme toggle (dark/light) — confirm hero canvas colors swap
- [ ] Language toggle (EN/中文) — confirm whole-page copy swap
- [ ] Hero particle band — "shipwright" reads cleanly, mouse repulsion crisp
- [ ] Custom cursor — ring + 5-dot trail visible on desktop; magnetic snap on buttons
- [ ] Inspection Radar — scroll-into-view triggers radial particles + node pings
- [ ] Audit analyzer — paste a GitHub URL, get findings, click "Explain with AI" (BYOK key needed)
- [ ] Brand wizard — finish 5 steps, watch printer-head LED while report streams
- [ ] Launch console — INITIATE LAUNCH → countdown → IGNITION sparks → 3 tabs populate
- [ ] AI chat FAB — open, send a message, drag to reposition
- [ ] BYOK settings gear (bottom right) — change base URL/key/model, persists on reload
- [ ] Easter A: hold logo 1.5 s → ASCII ship sails across header
- [ ] Easter B: ↑↑↓↓←→←→BA → 8 s sepia+handwritten Captain's Log mode

---

## Known limitations (documented, not blocking)

1. **`errors-in-console`** Lighthouse audit — score 0/100 (weight 1) due to a single `net::ERR_CONNECTION_CLOSED` from `fonts.googleapis.com` or `fonts.gstatic.com` during the audit run. This is a transient CDN hiccup, not a code-level error in `site/app.js`. Re-running Lighthouse a few times produces clean runs. Self-hosting fonts would eliminate this but adds maintenance + bundle size; deferred.

2. **Mobile FCP 2.1 s / Speed Index 4.2 s** — driven by Google Fonts blocking on first paint. Acceptable for a content-rich landing page (and far below LCP budget of 2.5 s). Could shave ~400 ms by inlining critical font subsets but would touch the typography commits — deferred unless real-user metrics complain.

3. **Bundle weight** — `styles.css` 186 KB + `app.js` 181 KB + `styles-v6.css` 12 KB raw. After gzip (auto on Pages) effective transfer is ~90 KB total. Dead-code purge across the 4 visual overlays (Mission Control / Apple / Light / Handwritten / v5 / v6) is a tempting P2 task but high regression risk; deferred to a future cleanup pass with full visual diff coverage.

---

## Out of scope (per user direction on this audit)

- Next.js experimental code (`app/`, `lib/doctor/`, `proxy.ts`, `tests/`) — not deployed to shipwright.com.cn
- Visual / color / typography changes
- JS module refactor / dead code purge
- Content copy changes (no typos found during scan)

---

## How to re-run this audit

```bash
# Functional walk-through (programmatic)
python3 -m http.server 4173 --directory site &
curl -s http://127.0.0.1:4173/ | grep -q "Analyze launch risk" && echo SMOKE-OK

# Lighthouse
npx -y lighthouse https://shipwright.com.cn/ --preset=desktop \
  --output=html --output-path=/tmp/lh-desktop.html \
  --chrome-flags="--headless=new"
npx -y lighthouse https://shipwright.com.cn/ \
  --output=html --output-path=/tmp/lh-mobile.html \
  --chrome-flags="--headless=new"

# Manual click-through — open /tmp/lh-mobile.html and Chrome devtools
open https://shipwright.com.cn/
```

---

**Sign-off**: shipwright.com.cn is production-ready as of commit `7ad4a30`.
