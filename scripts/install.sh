#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'USAGE'
Usage: install.sh [OPTIONS] [DIRECTORY]

Install ai-builder-skills into your agent's skill directory.

Options:
  --claude      Install into Claude Code commands (~/.claude/commands/)
  --codex       Install into Codex skills (~/.codex/skills/)
  --agents      Install into common agent skills (~/.agents/skills/) [default]
  --uninstall   Remove previously installed skills
  --help        Show this help message

Examples:
  ./scripts/install.sh                    # default: ~/.agents/skills/
  ./scripts/install.sh --claude           # Claude Code: ~/.claude/commands/
  ./scripts/install.sh --codex            # Codex: ~/.codex/skills/
  ./scripts/install.sh ~/my-skills        # custom directory
  ./scripts/install.sh --uninstall        # remove from default location
  ./scripts/install.sh --uninstall --claude
USAGE
}

target_dir=""
claude_mode=false
mode="install"

for arg in "$@"; do
  case "$arg" in
    --help|-h)
      usage
      exit 0
      ;;
    --uninstall)
      mode="uninstall"
      ;;
    --claude)
      target_dir="$HOME/.claude/commands"
      claude_mode=true
      ;;
    --codex)
      target_dir="$HOME/.codex/skills"
      ;;
    --agents)
      target_dir="$HOME/.agents/skills"
      ;;
    -*)
      echo "Error: Unknown option '$arg'. Use --help for usage." >&2
      exit 1
      ;;
    *)
      target_dir="$arg"
      ;;
  esac
done

if [ -z "$target_dir" ]; then
  target_dir="$HOME/.agents/skills"
fi

skill_names=()
for skill_dir in "$repo_root"/skills/*; do
  [ -d "$skill_dir" ] || continue
  skill_names+=("$(basename "$skill_dir")")
done

if [ "$mode" = "uninstall" ]; then
  for skill_name in "${skill_names[@]}"; do
    if $claude_mode; then
      target="$target_dir/$skill_name.md"
    else
      target="$target_dir/$skill_name"
    fi
    if [ -L "$target" ] || [ -e "$target" ]; then
      rm -f "$target"
      echo "Removed $target"
    else
      echo "Not found: $target (skipped)"
    fi
  done
  echo ""
  echo "Done. Restart your agent so it reloads skill metadata."
  exit 0
fi

mkdir -p "$target_dir"

for skill_name in "${skill_names[@]}"; do
  skill_dir="$repo_root/skills/$skill_name"
  if $claude_mode; then
    ln -sfn "$skill_dir/SKILL.md" "$target_dir/$skill_name.md"
    echo "Installed $skill_name.md -> $target_dir/$skill_name.md"
  else
    ln -sfn "$skill_dir" "$target_dir/$skill_name"
    echo "Installed $skill_name -> $target_dir/$skill_name"
  fi
done

echo ""
echo "Done. Restart your agent so it reloads skill metadata."
