#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "${1:-}" in
  --codex)
    target_dir="$HOME/.codex/skills"
    ;;
  --agents|"")
    target_dir="$HOME/.agents/skills"
    ;;
  *)
    target_dir="$1"
    ;;
esac

mkdir -p "$target_dir"

for skill_dir in "$repo_root"/skills/*; do
  [ -d "$skill_dir" ] || continue
  skill_name="$(basename "$skill_dir")"
  ln -sfn "$skill_dir" "$target_dir/$skill_name"
  echo "Installed $skill_name -> $target_dir/$skill_name"
done

echo
echo "Done. Restart your agent so it reloads skill metadata."
