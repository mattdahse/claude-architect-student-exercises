# Solution: Exercise 2.9 — Implementing Structured Error Responses

## Design Decisions

**Error metadata structure:** Each error returns four fields: `errorCategory` (structured string from the taxonomy), `isRetryable` (boolean), `message` (instructive — what went wrong + what to do), and optionally `retryAfterSeconds` (for rate_limited and service_unavailable).

**Category-based routing:** The coordinator uses a switch statement on `errorCategory` to determine the recovery action. This generic pattern works for ANY tool that follows the error taxonomy — the coordinator doesn't need tool-specific error handling code.

**Instructive messages:** Each error message answers two questions: "what went wrong?" and "what should I try next?" This enables Claude to either act on the guidance or relay it to the user.
