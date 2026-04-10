# Solution: Exercise 1.12 — Implementing Workflow Enforcement

## Design Decisions

**Validation gates before the hook:** The coordinator checks order existence and eligibility BEFORE invoking the hook. This means the hook only fires for orders that are actually eligible — it doesn't waste time checking the refund limit on orders that would be rejected anyway.

**Hook simulated in code:** In production, the PreToolUse hook fires at the SDK/infrastructure level (Lesson 1.9). In this exercise, we simulate it by calling the hook function explicitly before the tool call. The logic is identical — the hook receives the tool name and input, checks the amount, and returns allow/deny.

**Combined approach:** Validation gates handle context-dependent checks (order exists? eligible?). The hook handles a stateless, non-negotiable rule (amount limit). This is the pattern from Lesson 1.8/1.9 — coordinator code for nuanced logic, hooks for hard limits.
