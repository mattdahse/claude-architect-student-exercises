---
description: "Review code against project standards"
---

Review the files I have changed (or the files I specify) against this project's standards.

1. Read CLAUDE.md for project-wide conventions.
2. Identify which path-scoped rules apply based on each file's location (api, tests, infrastructure).
3. Check every changed file against the relevant rules.
4. Report each issue found in this format:
   - **File:** path/to/file.js
   - **Line:** line number or range
   - **Standard:** which rule was violated
   - **Fix:** what to change to comply
5. After listing all issues, provide a summary: PASS if no issues found, or FAIL with a count of issues by category.

Be thorough but do not invent issues that are not covered by the documented standards.
