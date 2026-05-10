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
4. Use the `workflow-to-skill` skill to help package your workflow.

## Quality Bar

- The description includes real trigger phrases and task types.
- The body is short enough to load often.
- The skill gives degrees of freedom instead of forcing one brittle path.
- The output format matches the user's next action.
- Examples are realistic, not toy prompts.
- No unrelated documentation files inside the skill folder.

## Improving Existing Skills

- File an issue or PR describing the problem.
- Include a before/after showing the improvement.
- Keep changes focused: one skill per PR.

## Testing

Run your skill against a real input and include the output in your PR description. If the skill chains with others, show the handoff working.

## Style

Match the existing tone: direct, practical, no filler. Use existing skills as templates.
