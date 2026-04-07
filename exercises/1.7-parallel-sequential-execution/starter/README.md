# Exercise 1.7: Parallel vs Sequential Subagent Execution

## Setup

1. Navigate to this exercise's starter directory:

   ```bash
   cd claude-architect-student-exercises/exercises/1.7-parallel-sequential-execution/starter/
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Verify the starter runs:

   ```bash
   node coordinator.js
   ```

   You should see a TODO message. Follow the steps in the course lesson to complete the exercise.

## Files

- `coordinator.js` — The main file you'll edit. Contains TODO stubs for sequential and parallel execution.
- `subagents.js` — Three mock subagent functions with simulated delays. Provided complete — don't modify this.
- `package.json` — Dependencies.

## Running

```bash
node coordinator.js sequential   # Run subagents one after another
node coordinator.js parallel     # Run independent subagents concurrently
```
