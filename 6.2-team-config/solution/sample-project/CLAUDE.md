# WidgetCo API

A RESTful API service for managing widgets, orders, and user accounts.

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 4.x
- **Testing:** Jest with supertest
- **Database:** PostgreSQL (via pg driver)
- **Infrastructure:** Terraform 1.5+
- **Auth:** JWT-based authentication

## Project Structure

```
src/
  api/        # Express route handlers
  services/   # Business logic layer
  utils/      # Shared utilities
tests/        # Mirrors src/ structure
infrastructure/ # Terraform configurations
```

## Coding Conventions

- Prefer `const` over `let`. Never use `var`.
- Use `async/await` instead of raw Promises or callbacks.
- Use meaningful, descriptive names. No single-letter variables outside loop counters.
- All public functions require JSDoc comments with `@param` and `@returns`.
- Use template literals for string interpolation, not concatenation.
- Destructure objects and arrays when accessing multiple properties.

## Behavioral Rules

- Run `npm test` after any change to source files in `src/` or `tests/`.
- Never commit secrets, API keys, or credentials. Use environment variables.
- Write a descriptive PR description summarizing what changed and why.
- Use plan mode for changes that touch 3 or more files before writing code.
- Keep functions under 40 lines. Extract helpers when complexity grows.

## Response Format

All API responses use a structured envelope format:

**Success:**
```json
{
  "data": { ... },
  "error": null
}
```

**Error:**
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email field is required"
  }
}
```

Use standard HTTP status codes: 200 for success, 201 for creation, 400 for validation errors, 401 for auth failures, 404 for missing resources, 500 for server errors.
