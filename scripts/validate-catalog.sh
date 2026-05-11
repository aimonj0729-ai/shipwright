#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

errors=0
warnings=0

fail() { echo "  ERROR: $1"; errors=$((errors + 1)); }
warn() { echo "  WARN:  $1"; warnings=$((warnings + 1)); }
ok()   { echo "  OK:    $1"; }

echo "=== Shipwright Catalog Validation ==="
echo ""

echo "-- Skills directory --"
for skill_dir in "$ROOT_DIR"/skills/*/; do
  skill_name="$(basename "$skill_dir")"
  skill_md="$skill_dir/SKILL.md"

  if [ ! -f "$skill_md" ]; then
    fail "$skill_name: missing SKILL.md"
    continue
  fi

  if ! grep -q "^name:" "$skill_md"; then
    fail "$skill_name: SKILL.md missing 'name:' frontmatter"
  fi

  if ! grep -q "^description:" "$skill_md"; then
    fail "$skill_name: SKILL.md missing 'description:' frontmatter"
  fi

  if [ ! -f "$skill_dir/agents/openai.yaml" ]; then
    warn "$skill_name: missing agents/openai.yaml"
  fi

  ok "$skill_name: SKILL.md valid"
done

echo ""
echo "-- catalog.json --"
catalog="$ROOT_DIR/catalog.json"
if [ ! -f "$catalog" ]; then
  warn "catalog.json not found (optional but recommended)"
else
  catalog_skills=$(sed -n '/"skills"/,/^]/p' "$catalog" | grep '"name"' | sed 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  for name in $catalog_skills; do
    if [ ! -d "$ROOT_DIR/skills/$name" ]; then
      fail "catalog.json references '$name' but skills/$name/ does not exist"
    fi
  done
  ok "catalog.json entries checked"
fi

echo ""
echo "-- README.md skills table --"
readme="$ROOT_DIR/README.md"
if [ ! -f "$readme" ]; then
  warn "README.md not found"
else
  for skill_dir in "$ROOT_DIR"/skills/*/; do
    skill_name="$(basename "$skill_dir")"
    if ! grep -q "$skill_name" "$readme"; then
      warn "$skill_name: not mentioned in README.md"
    fi
  done
  ok "README.md cross-reference checked"
fi

echo ""
echo "-- Examples coverage --"
for skill_dir in "$ROOT_DIR"/skills/*/; do
  skill_name="$(basename "$skill_dir")"
  has_example=false
  for example in "$ROOT_DIR"/examples/*.md; do
    if grep -qi "$skill_name" "$example" 2>/dev/null; then
      has_example=true
      break
    fi
  done
  if [ "$has_example" = false ]; then
    warn "$skill_name: no example file references this skill"
  fi
done

echo ""
echo "=== Results ==="
echo "Errors:   $errors"
echo "Warnings: $warnings"

if [ "$errors" -gt 0 ]; then
  echo "FAIL: fix errors before merging."
  exit 1
fi

if [ "$warnings" -gt 0 ]; then
  echo "PASS with warnings."
  exit 0
fi

echo "PASS: all checks green."
