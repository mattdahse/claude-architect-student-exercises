# Exercise 0.2: Verify Your Setup

A quick end-to-end check that your Node.js install, Anthropic SDK, and API key are all working together. If this exercise runs successfully, you're ready for Module 1.

## Prerequisites

Complete the one-time repo setup at the root (see the top-level `README.md`):

```bash
# from the repo root
npm install
cp .env.example .env
# then edit .env and add your ANTHROPIC_API_KEY
```

You only do that once for the whole course.

## Running

From this directory:

```bash
node verify.js
```

## Expected Output

```
API Key enabled and environment verified
```

If you see that exact line, your environment is ready. If you see an error, check the Troubleshooting section in Module 0, Lesson 2.

## Files

- `verify.js` — The verification script. Already complete — you just need to run it.
- `package.json` — Exercise metadata and the `npm start` script (no local deps; they live at the repo root).
