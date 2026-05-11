# Example: Agent Output Review

Project: Analytics Dashboard (Claude-generated React + Express app)
Request: "Build me a full-stack analytics dashboard with user auth, chart visualizations, and CSV export."

## Review Verdict

Accept after fixes. The app renders and the basic layout matches the request, but three of six advertised features are non-functional, auth is simulated, and the CSV export downloads an empty file. The agent produced a visually complete app that does not deliver on its core promises.

## What Was Verified

- `npm run dev` starts both frontend (Vite on 5173) and backend (Express on 3001) without errors.
- Login page renders and accepts any email/password combination (no real auth).
- Dashboard page loads with four chart panels and a data table.
- Navigation between Dashboard, Settings, and Users pages works.
- Build passes: `npm run build` succeeds with zero TypeScript errors.
- Tests pass: `npm test` runs 12 tests, all green.

## Blocking Issues

- **HIGH: Auth is entirely fake.** The login form accepts any credentials and sets a hardcoded JWT token (`eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGVtbyJ9...`) in localStorage. There is no user table, no password hashing, no session management. The agent's commit message says "implement JWT authentication" but the backend has no auth middleware — every API route is open. A user who ships this has zero access control.

- **HIGH: CSV export downloads an empty file.** The "Export CSV" button triggers a download of `analytics-export.csv` but the file contains only the header row. The export function calls `generateCSV(data)` but `data` is always an empty array because the frontend fetches from `/api/analytics/export` which returns `[]`. The backend route exists but queries an empty `analytics_events` table that was never seeded.

- **MEDIUM: Two of four charts show hardcoded demo data.** The line chart and bar chart pull from the API and render real (empty) data. The pie chart and area chart use `DEMO_DATA` constants imported from `src/constants/chartData.ts`. These constants contain plausible numbers (users by country, revenue by month) that look real in the UI but are completely fabricated. There is no label or disclaimer.

## Hallucination Or Completeness Risks

- **"Real-time updates" claimed in README but not implemented.** The README says "Dashboard updates in real-time with WebSocket connections." There is no WebSocket server, no socket.io dependency, and no real-time subscription in the frontend. The data refreshes only on page load.

- **Test coverage is misleading.** All 12 tests pass but they test utility functions (date formatting, number rounding) and component rendering (smoke tests). Zero tests cover auth, API endpoints, CSV generation, or chart data fetching. The test suite gives false confidence.

- **Settings page is decorative.** The Settings page has toggles for "Email notifications", "Dark mode", and "Weekly reports". None of these are wired to any backend. Toggling them updates local React state but nothing persists. Refreshing the page resets all toggles.

- **Users page shows a table with five fake users.** The data comes from `DEMO_USERS` in a constants file, not from any API or database. The "Delete" button on each row logs to console but does not remove the row.

## Missing User Value

- **No real data pipeline.** The dashboard has no way to ingest actual analytics events. There is no SDK, no tracking script, no webhook endpoint, and no import command. Without data ingestion, the dashboard is a static mockup.

- **No database seeding or migration.** The backend uses SQLite but the schema migration runs on startup and creates empty tables. There is no seed script to populate test data. A user who launches this sees four empty charts and an empty table.

- **No deployment instructions.** The README covers `npm run dev` but says nothing about production deployment, environment variables, or database location for production.

## Recommended Next Patch

1. **Remove or label fake auth.** Either implement real JWT auth with bcrypt password hashing and a users table, or remove the login page and add a banner: "Auth is not implemented — all data is public." Do not ship simulated auth as if it were real.

2. **Fix CSV export.** Seed the database with sample analytics events and verify the export endpoint returns actual rows. Add a test that downloads the CSV and checks for data.

3. **Label demo data.** Add a visible "Sample data" badge to the pie chart and area chart. Replace hardcoded constants with API calls when real data is available.

4. **Remove README claims that outrun the code.** Delete the "real-time updates" section or replace it with "Planned: real-time updates via WebSocket."

5. **Add a seed script.** Create `npm run seed` that populates the database with 30 days of synthetic analytics events so the dashboard looks useful on first launch.
