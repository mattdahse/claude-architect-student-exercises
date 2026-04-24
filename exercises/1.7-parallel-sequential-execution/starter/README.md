# Exercise 1.7: Parallel vs Sequential Subagent Execution

## Prerequisites

Complete the one-time repo setup at the root (`npm install` + `.env`). See the top-level `README.md`. The mock starter doesn't make API calls, but the Step 6 "real API" path does — the root `.env` is what it uses.

## Running

```bash
node coordinator.js              # Defaults to sequential
node coordinator.js sequential   # Run subagents one after another
node coordinator.js parallel     # Run independent subagents concurrently
```

You should see a TODO message first run. Follow the steps in the course lesson to complete the exercise.

## Files

- `coordinator.js` — The main file you'll edit. Contains TODO stubs for sequential and parallel execution.
- `subagents.js` — Three mock subagent functions with simulated delays. Provided complete — don't modify this.
- `package.json` — Exercise metadata and scripts (no local deps; they live at the repo root).
