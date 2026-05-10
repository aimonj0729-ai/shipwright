# Shipwright Web

Static website prototype for Shipwright, a launch QA tool for AI-built projects.

## Local Preview

```bash
python3 -m http.server 4173 --directory site
```

Then open:

```text
http://localhost:4173
```

## What Works Today

- Landing page for the Shipwright product concept.
- Interactive static analyzer demo.
- Markdown report generation.
- Copy and download actions.
- Responsive layout for desktop and mobile.

## What This Demo Does Not Do Yet

- It does not clone repositories.
- It does not open a real browser session.
- It does not run the local Shipwright skills automatically.
- It does not call a model API.

The executable audit workflow currently lives in the open-source skills under `../skills`.
