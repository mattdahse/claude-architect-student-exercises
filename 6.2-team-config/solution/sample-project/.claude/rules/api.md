---
globs: src/api/**
---

# API Route Rules

- Define routes using Express Router. Each resource gets its own router file.
- Follow REST conventions: GET for reads, POST for creates, PUT for full updates, PATCH for partial updates, DELETE for removals.
- Apply the `authMiddleware` to all routes that require authentication. Public routes must be explicitly documented as such.
- Return all responses using the structured envelope format: `{ data, error }`. Never return raw objects or arrays.
- Validate all incoming request body fields and query parameters before processing. Return 400 with a descriptive error for invalid input.
- Never expose stack traces or internal error details in responses. Log the full error server-side and return a safe message to the client.
- Use appropriate HTTP status codes consistently (200, 201, 400, 401, 404, 500).
- Route handler functions should delegate to the services layer for business logic. Keep handlers thin.
