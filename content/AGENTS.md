# Content Guidance

- Treat each MDX file as part of a shared parsing contract, not just prose.
- Preserve literal `metadata`, `Author`, `Date`, and the first top-level `#` heading.
- When adding a new article, follow the template and conventions from the `devverse-content-mdx` skill.
- After editing content, run `python3 scripts/check_content_contract.py`.
- If the content change should affect chat retrieval quality immediately, consider the `devverse-refresh-vectors` skill.
