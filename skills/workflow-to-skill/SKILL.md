---
name: workflow-to-skill
description: Use when turning a repeated agent workflow, prompt sequence, operating procedure, or domain process into a concise Codex or Claude skill.
---

# Workflow To Skill

Use this skill when a repeated workflow should become an installable skill instead of living as a one-off prompt.

## Workflow

1. Identify the trigger: when should the skill activate?
2. Identify the user outcome: what should the agent produce?
3. Remove generic advice the model already knows.
4. Keep the main `SKILL.md` concise.
5. Move long examples or reference material into `references/` only if needed.
6. Add scripts only when deterministic execution matters.
7. Include output formats that make success easy to recognize.
8. Add guardrails for risky decisions.

## Skill Skeleton

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

## Quality Checklist

- The description includes the real trigger phrases and task types.
- The body is short enough to load often.
- The skill gives degrees of freedom instead of forcing one brittle path.
- The output format matches the user's next action.
- The skill avoids unrelated documentation files inside the skill folder.
- The examples are realistic, not toy prompts.

## Anti-Patterns

- A skill that is just a long prompt.
- A skill that explains concepts the model already knows.
- A skill that silently changes secrets, credentials, git history, or production systems.
- A skill with ten outputs when the user needs one decision.
