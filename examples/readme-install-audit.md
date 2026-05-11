# Example: README Install Audit

Project: quickserve (a CLI tool for spinning up mock API servers)

## Install Verdict

Fail. The documented install command works, but the first-use example crashes because it requires a config file that the README never mentions creating. A first-time user hits a wall within sixty seconds of installing.

## First-Time User Path

1. **Clone repo.** `git clone https://github.com/example/quickserve.git` — succeeds.
2. **Install dependencies.** `npm install` — succeeds, 14 seconds.
3. **Run the quickstart command.** `npx quickserve start` — crashes immediately.
   ```
   Error: Cannot find config file: quickserve.config.json
   Use --init to create a default config, or create one manually.
   ```
   The README does not mention `quickserve.config.json` or the `--init` flag anywhere. The user is stuck.
4. **Guess the fix.** Running `npx quickserve --init` creates a default config file. This works but is undocumented.
5. **Retry the quickstart.** `npx quickserve start` — succeeds. Server starts on port 3001 with two example endpoints.
6. **Test an endpoint.** `curl http://localhost:3001/api/users` — returns JSON. First value moment achieved, but only after guessing.

## Adoption Blockers

- **Missing config file step.** The README jumps from `npm install` to `npx quickserve start` without mentioning that a `quickserve.config.json` file is required. The error message hints at `--init` but the README never documents this flag.

- **No expected output shown.** After `npx quickserve start`, the README says nothing about what the user should see. The actual output is:
  ```
  quickserve v0.4.2 running on http://localhost:3001
  Routes loaded: GET /api/users, GET /api/posts
  ```
  Showing this in the README would confirm success immediately.

- **Node version requirement missing.** The tool uses `structuredClone` which requires Node 17+. Users on Node 16 (still common) get a cryptic `structuredClone is not defined` error with no guidance. The README lists no engine requirement.

- **No uninstall or cleanup instructions.** Users who clone and experiment have no documented way to remove the tool or clean up generated config files.

## README Patch Notes

- **Install section:** Add a step between `npm install` and `npx quickserve start`:
  ```markdown
  Create a default config file:
  ```bash
  npx quickserve --init
  ```
  This creates `quickserve.config.json` with two example endpoints.
  ```

- **Quickstart section:** Add expected output after `npx quickserve start`:
  ```markdown
  You should see:
  ```
  quickserve v0.4.2 running on http://localhost:3001
  Routes loaded: GET /api/users, GET /api/posts
  ```
  Open http://localhost:3001/api/users in your browser to test.
  ```

- **Requirements section (new):** Add before Install:
  ```markdown
  ## Requirements
  - Node.js 17 or later
  - npm 8 or later
  ```

- **Uninstall section (new):** Add at the bottom:
  ```markdown
  ## Uninstall
  Remove the cloned directory and delete any generated config files:
  ```bash
  rm quickserve.config.json
  ```
  ```

## Missing Trust Signals

- **No compatibility badge or engine field.** Add `"engines": { "node": ">=17" }` to package.json and a Node version badge to the README.
- **No LICENSE file.** The repo has no license. This blocks adoption for anyone working in a company or contributing to open source.
- **No error handling documentation.** Common failure modes (port in use, invalid config) are not documented.
- **No changelog.** The repo is on v0.4.2 but there is no CHANGELOG.md or release notes. Users cannot tell what changed between versions.

## Retest Command

```bash
rm -rf /tmp/quickserve-test && \
git clone https://github.com/example/quickserve.git /tmp/quickserve-test && \
cd /tmp/quickserve-test && \
npm install && \
npx quickserve --init && \
npx quickserve start &
sleep 2 && \
curl -s http://localhost:3001/api/users | head -20 && \
kill %1
```
