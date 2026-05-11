# Contributing

## Adding a Skill

1. Create a directory under `skills/` with your skill name.
2. Add a `SKILL.md` following this structure:

```markdown
---
name: skill-name
description: Use when ...
---

# Skill Name

## When To Use
## Workflow
## Output Format
## Guardrails
```

3. Add `agents/openai.yaml` with display name, short description, brand color, and default prompt.
4. Add an entry to `catalog.json` inside the `"skills"` array with `name`, `description`, and `use_when` fields.
5. Add the skill to the README.md skills table.
6. Use the `workflow-to-skill` skill to help package your workflow.

## Adding an Example

Every skill should have a corresponding example in `examples/`. When adding or updating a skill:

1. Create `examples/<skill-name>.md` with realistic output matching the skill's output format.
2. Add a link to the new example in the README.md Examples section.
3. Use a believable scenario, not a toy prompt.

## Quality Bar

- The description includes real trigger phrases and task types.
- The body is short enough to load often (under 120 lines).
- The skill gives degrees of freedom instead of forcing one brittle path.
- The output format matches the user's next action.
- Examples are realistic, not toy prompts.
- No unrelated documentation files inside the skill folder.

## Validation

Before submitting a PR, run the catalog validation script:

```bash
bash scripts/validate-catalog.sh
```

This checks:
- Every skill has a valid `SKILL.md` with `name` and `description` frontmatter.
- Every skill in `catalog.json` has a matching directory.
- Every skill is mentioned in `README.md`.
- Example coverage for each skill.

Fix all errors before merging. Warnings (like missing examples) are acceptable but should be addressed.

## Improving Existing Skills

- File an issue or PR describing the problem.
- Include a before/after showing the improvement.
- Keep changes focused: one skill per PR.

## Testing

Run your skill against a real input and include the output in your PR description. If the skill chains with others, show the handoff working.

## Style

Match the existing tone: direct, practical, no filler. Use existing skills as templates.
