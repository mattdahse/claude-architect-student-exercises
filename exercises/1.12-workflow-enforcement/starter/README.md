# Exercise 1.12: Implementing Workflow Enforcement

## Setup

```bash
cd claude-architect-student-exercises/exercises/1.12-workflow-enforcement/starter/
npm install
```

No `.env` or API key needed — this exercise uses mock tools with no API calls.

## Running

```bash
node coordinator.js ORD-001    # Eligible, under $100
node coordinator.js ORD-002    # Eligible, over $100
node coordinator.js ORD-003    # Not eligible (not delivered)
node coordinator.js ORD-004    # Not eligible (too old)
node coordinator.js ORD-999    # Not found
```

## Files

- `coordinator.js` — The main file you'll edit. Implements validation gates and approval threshold.
- `hooks.js` — PreToolUse hook you'll implement to enforce the refund limit.
- `tools.js` — Mock tools. Provided complete — don't modify.
