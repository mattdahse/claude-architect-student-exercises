---
description: "Scan the codebase for common security vulnerabilities"
context: fork
allowed-tools:
  - Grep
  - Read
  - Glob
---

Perform a security scan of this project's source code. Check for the following vulnerability categories:

1. **Hardcoded secrets:** API keys, passwords, tokens, or connection strings embedded in source files. Look for patterns like `password =`, `apiKey =`, `secret =`, `token =`, and base64-encoded strings.
2. **SQL injection:** String concatenation or template literals used to build SQL queries instead of parameterized queries.
3. **Missing input validation:** Route handlers that use `req.body`, `req.params`, or `req.query` values without validation or sanitization.
4. **Insecure dependencies:** Check package.json for known-vulnerable or outdated packages.
5. **Exposed error details:** Stack traces, internal paths, or database errors returned in API responses to clients.

For each finding, report:
- **Severity:** Critical / High / Medium / Low
- **Path:** file path
- **Line:** line number
- **Issue:** what was found
- **Fix:** recommended remediation

Conclude with a summary count of findings by severity level.
