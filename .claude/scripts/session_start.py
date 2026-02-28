#!/usr/bin/env python3

import os
import subprocess
from pathlib import Path


def run_git_command(root: Path, *args: str) -> str:
    try:
      result = subprocess.run(
          ["git", *args],
          cwd=root,
          capture_output=True,
          text=True,
          check=False,
      )
    except OSError:
      return ""

    if result.returncode != 0:
      return ""

    return result.stdout.strip()


def main() -> int:
    root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())
    branch = run_git_command(root, "rev-parse", "--abbrev-ref", "HEAD") or "unknown"
    dirty = run_git_command(root, "status", "--short").splitlines()
    article_count = len(list((root / "content").glob("*.mdx")))
    env_files = [
        name
        for name in (".env", ".env.local", ".env.example")
        if (root / name).exists()
    ]

    lines = [
        "DevVerse session context:",
        f"- Git branch: {branch}; dirty files: {len(dirty)}; articles: {article_count}.",
        f"- Present env files by name only: {', '.join(env_files) if env_files else 'none'}.",
        "- Canonical content source is content/*.mdx; keep literal metadata plus Author and Date markers.",
        "- Preserve / versus /home, .mdx-container, and the current dark-mode chain.",
        "- Do not use npm run lint as a read-only check; it runs Prettier write mode in this repo.",
        "- Preferred validation commands: python3 .claude/scripts/check_content_contract.py, npx tsc --noEmit --pretty false, env JEST_USE_WATCHMAN=0 npm test -- --runInBand --watchman=false.",
        "- Build caveat: next/font/google may fail in restricted-network environments.",
    ]
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
