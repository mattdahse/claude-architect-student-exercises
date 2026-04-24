# Exercise 2.2: Writing Effective Tool Interfaces

## Prerequisites

Complete the one-time repo setup at the root (`npm install` + `.env`). See the top-level `README.md`.

Then run the baseline from this directory:

```bash
node tester.js tools-poor.js
```

You should see an accuracy report. Follow the steps in the course lesson to improve the descriptions and beat the baseline.

## Files

- `tester.js` — Runs test prompts and reports accuracy. Provided complete — don't modify.
- `tools-poor.js` — Intentionally poor tool descriptions (the baseline). Don't modify.
- `tools-improved.js` — YOUR file. Rewrite descriptions here and test with `node tester.js tools-improved.js`.
- `test-prompts.js` — 20 test prompts with expected tool selections. Don't modify.

## Running

```bash
node tester.js tools-poor.js       # Baseline (poor descriptions)
node tester.js tools-improved.js   # Your improved descriptions
```
