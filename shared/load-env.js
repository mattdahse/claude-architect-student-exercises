/**
 * load-env.js — Shared env loader for all course exercises.
 *
 * Each exercise's scripts `require()` this file once. It resolves the repo-root
 * .env by absolute path (based on this file's own location), so students only
 * need to create .env once at the repo root — not per exercise.
 *
 * Usage in an exercise script:
 *   require('../../../shared/load-env');   // from exercises/X.Y-name/starter/
 *   require('../../shared/load-env');      // from capstone project starters
 */

const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
// `override: true` so the repo .env wins over any ANTHROPIC_API_KEY that
// may already be set in the shell. Module 0 tells students not to export
// it globally (it conflicts with Claude Code's auth), but if they have —
// or if their shell sets it to empty — the .env should still be the source
// of truth for SDK exercises.
require('dotenv').config({ path: envPath, override: true });

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    `\nANTHROPIC_API_KEY not found.\n` +
      `Expected it in: ${envPath}\n\n` +
      `Fix: from the repo root, run:\n` +
      `  cp .env.example .env\n` +
      `and then edit .env to add your key.\n`
  );
  process.exit(1);
}
