# Exercise 0.2 — Reference Solution

This exercise has no implementation work — the student just runs the provided script. The "solution" here is simply a copy of the starter wired to read the `.env` from `starter/` so the validator can execute it the same way as later exercises.

## What "Correct" Looks Like

The script prints a single line:

```
API Key enabled and environment verified
```

If Claude responds with anything close (same phrase, slight capitalization/punctuation drift), validation still passes because it compares case-insensitively and trims whitespace. Exact character-for-character match isn't necessary — what matters is that an authenticated request to the Claude API succeeded and returned a coherent response.

## Common Failures

- **`Verification failed: 401`** — API key is missing, malformed, or revoked. Check `.env` in `starter/`.
- **`Credit balance is too low`** — key is valid but the account has no API credits. Add credits at [console.anthropic.com](https://console.anthropic.com) → Billing.
- **`Cannot find module '@anthropic-ai/sdk'`** — `npm install` was skipped in `starter/`.
