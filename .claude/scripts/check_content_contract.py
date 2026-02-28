#!/usr/bin/env python3

import re
import sys
from pathlib import Path


METADATA_BLOCK_RE = re.compile(r"export const metadata = \{[\s\S]*?\};")
TITLE_RE = re.compile(r"title:\s*(['\"])([\s\S]*?)\1")
DESCRIPTION_RE = re.compile(r"description:\s*(['\"])([\s\S]*?)\1")
TOPICS_RE = re.compile(r"topics:\s*\[([\s\S]*?)\]")
AUTHOR_RE = re.compile(r"^###\s*Author:\s+.+$", re.MULTILINE)
DATE_RE = re.compile(r"^>\s*Date:\s+\d{4}-\d{2}-\d{2}$", re.MULTILINE)
H1_RE = re.compile(r"^#\s+\S+", re.MULTILINE)
KNOWN_EXCEPTIONS = {
    "content/Web3-and-Blockchain.mdx": {
        "missing `> Date: YYYY-MM-DD` line",
    }
}


def validate_article(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    issues: list[str] = []

    if not METADATA_BLOCK_RE.search(text):
        issues.append("missing `export const metadata = { ... };` block")
    if not TITLE_RE.search(text):
        issues.append("missing literal metadata `title`")
    if not DESCRIPTION_RE.search(text):
        issues.append("missing literal metadata `description`")
    if not TOPICS_RE.search(text):
        issues.append("missing literal metadata `topics` array")
    if not AUTHOR_RE.search(text):
        issues.append("missing `### Author: ...` line")
    if not DATE_RE.search(text):
        issues.append("missing `> Date: YYYY-MM-DD` line")
    if not H1_RE.search(text):
        issues.append("missing top-level `# Heading` in article body")

    return issues


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    content_dir = root / "content"
    failures: list[tuple[Path, list[str]]] = []

    for path in sorted(content_dir.glob("*.mdx")):
        issues = validate_article(path)
        relative_path = str(path.relative_to(root))
        ignored = KNOWN_EXCEPTIONS.get(relative_path, set())
        issues = [issue for issue in issues if issue not in ignored]
        if issues:
            failures.append((path, issues))

    if not failures:
        ignored_count = sum(len(items) for items in KNOWN_EXCEPTIONS.values())
        summary = f"Content contract OK: checked {len(list(content_dir.glob('*.mdx')))} articles."
        if ignored_count:
            summary += f" Ignored {ignored_count} known legacy exception."
        print(summary)
        return 0

    print("Content contract violations found:", file=sys.stderr)
    for path, issues in failures:
        print(f"- {path.relative_to(root)}", file=sys.stderr)
        for issue in issues:
            print(f"  - {issue}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
