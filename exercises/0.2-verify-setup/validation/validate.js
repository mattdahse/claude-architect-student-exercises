/**
 * validate.js — Validation script for Exercise 0.2: Verify Your Setup.
 *
 * Runs the student's verify.js and confirms it prints the expected phrase.
 * If this passes, the student's Node install, SDK, and API key are working.
 *
 * Usage:
 *   node validation/validate.js
 *   node validation/validate.js --solution
 */

require('../../../shared/load-env');
const path = require('path');

const useSolution = process.argv.includes('--solution');
const verifyPath = useSolution
  ? path.resolve(__dirname, '../solution/verify.js')
  : path.resolve(__dirname, '../starter/verify.js');

const EXPECTED = 'API Key enabled and environment verified';

const originalLog = console.log;
let captured = [];

function captureStart() {
  captured = [];
  console.log = (...args) => {
    captured.push(args.join(' '));
    originalLog(...args);
  };
}

function captureStop() {
  console.log = originalLog;
  return captured.join('\n');
}

async function main() {
  originalLog('Validating Exercise 0.2: Verify Your Setup');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'} script`);
  originalLog('='.repeat(60));

  captureStart();

  try {
    delete require.cache[require.resolve(verifyPath)];
    const mod = require(verifyPath);

    if (typeof mod.main !== 'function') {
      captureStop();
      originalLog('\n  SKIP: verify.js does not export a main function.');
      originalLog('  Add this line to the bottom of verify.js: module.exports = { main };');
      process.exit(1);
    }

    await mod.main();
    const output = captureStop().trim();

    originalLog('='.repeat(60));

    const normalized = output.toLowerCase().trim();
    const expectedNormalized = EXPECTED.toLowerCase();

    if (normalized === expectedNormalized) {
      originalLog('  PASS: Output matches expected phrase exactly.');
      originalLog('\nEnvironment verified — you are ready for Module 1.');
      process.exit(0);
    } else if (normalized.includes(expectedNormalized)) {
      originalLog('  PASS: Output contains the expected phrase.');
      originalLog('\nEnvironment verified — you are ready for Module 1.');
      process.exit(0);
    } else {
      originalLog('  FAIL: Output did not contain the expected phrase.');
      originalLog(`  Expected: "${EXPECTED}"`);
      originalLog(`  Got:      "${output}"`);
      originalLog('\nThe API call succeeded but Claude did not echo the requested string.');
      originalLog('Re-run the script — if the output is still off, your setup is fine but');
      originalLog('the model reworded the response.');
      process.exit(1);
    }
  } catch (err) {
    captureStop();
    originalLog(`\n  ERROR: ${err.message}`);
    originalLog('\nTroubleshooting:');
    originalLog('  - Missing or invalid API key? Check .env in starter/.');
    originalLog('  - Credit balance too low? Add credits at console.anthropic.com.');
    originalLog('  - Module not found? Run `npm install` in starter/.');
    process.exit(1);
  }
}

main();
