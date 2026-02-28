#!/usr/bin/env python3

import json
import re
import sys


SECRET_FILE_TOKENS = (
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".env.test",
)

SECRET_NAME_TOKENS = (
    "SUPABASE_SERVICE_ROLE_KEY",
    "GOOGLE_AI_API_KEY",
    "PINECONE_API_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
)


def block(message: str) -> int:
    print(message, file=sys.stderr)
    return 2


def main() -> int:
    try:
        payload = json.loads(sys.stdin.read() or "{}")
    except json.JSONDecodeError:
        return 0

    command = str(payload.get("tool_input", {}).get("command", ""))
    normalized = command.lower()

    if re.fullmatch(r"\s*npm run lint(\s+.*)?", command):
        return block(
            "Blocked: `npm run lint` is not a read-only lint check in this repository. "
            "It runs Prettier write mode. Use `npm run format` intentionally, or use a non-mutating check such as `npx prettier --check`."
        )

    if ".env.example" not in normalized and any(
        token in normalized for token in SECRET_FILE_TOKENS
    ):
        return block(
            "Blocked: command appears to access a real environment file. "
            "Use `.env.example` for variable names, and never print or edit live secret values through Claude Code."
        )

    if any(token.lower() in normalized for token in SECRET_NAME_TOKENS):
        return block(
            "Blocked: command references a sensitive environment variable name directly. "
            "Keep secret handling out of generated shell commands."
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
