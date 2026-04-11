---
globs: tests/**
---

# Test Rules

- Use `describe` blocks to group tests by function or module. Use `it` blocks with clear descriptions of expected behavior.
- Mock all external services (database, HTTP clients, third-party APIs). Tests must not make real network calls.
- Assert on specific values, not just truthiness. Check exact status codes, response body fields, and error messages.
- Mirror the `src/` directory structure. Tests for `src/api/users.js` go in `tests/api/users.test.js`.
- Cover both the happy path and error cases for every function. At minimum: one success case, one validation failure, one auth failure where applicable.
- Use `beforeEach` to reset mocks and shared state. Tests must not depend on execution order.
- Name test files with the `.test.js` suffix.
