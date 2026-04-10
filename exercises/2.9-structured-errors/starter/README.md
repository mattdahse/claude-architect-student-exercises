# Exercise 2.9: Implementing Structured Error Responses

## Setup

```bash
cd claude-architect-student-exercises/exercises/2.9-structured-errors/starter/
npm install
```

No API key needed — this exercise uses mock tools with no API calls.

## Running

```bash
node coordinator.js           # Run all 7 test scenarios
node coordinator.js 0         # Run just the happy path
node coordinator.js 1         # Run the rate-limited scenario
```

## Files

- `tools.js` — Mock tools with TODO error responses. You'll add structured error metadata here.
- `coordinator.js` — Order coordinator with TODO error handling. You'll add category-based recovery logic here.
- `test-scenarios.js` — 7 predefined scenarios. Provided complete — don't modify.
