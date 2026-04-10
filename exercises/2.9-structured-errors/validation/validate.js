/**
 * validate.js — Validation for Exercise 2.9.
 *
 * Usage:
 *   node validate.js              # Test student's implementation
 *   node validate.js --solution   # Test reference solution
 */

const path = require('path');
const useSolution = process.argv.includes('--solution');
const coordinatorPath = useSolution
  ? path.resolve(__dirname, '../solution/coordinator.js')
  : path.resolve(__dirname, '../starter/coordinator.js');

const originalLog = console.log;
const { scenarios } = require(path.resolve(__dirname, '../starter/test-scenarios.js'));

async function main() {
  originalLog('Validating Exercise 2.9: Implementing Structured Error Responses');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'}\n`);

  delete require.cache[require.resolve(coordinatorPath)];
  const { processOrder } = require(coordinatorPath);

  if (typeof processOrder !== 'function') {
    originalLog('SKIP: coordinator.js does not export processOrder.');
    return;
  }

  console.log = () => {};

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    try {
      const result = await processOrder(scenario);
      const match = result.outcome === scenario.expectedOutcome;
      if (match) {
        originalLog(`  ✓ ${scenario.name}: ${result.outcome}`);
        passed++;
      } else {
        originalLog(`  ✗ ${scenario.name}: expected "${scenario.expectedOutcome}", got "${result.outcome}"`);
        failed++;
      }
    } catch (err) {
      originalLog(`  ✗ ${scenario.name}: ERROR — ${err.message}`);
      failed++;
    }
  }

  console.log = originalLog;

  originalLog(`\n${'='.repeat(50)}`);
  originalLog(`SUMMARY: ${passed} passed, ${failed} failed out of ${scenarios.length}`);
  if (passed === scenarios.length) {
    originalLog('All scenarios handled correctly!');
  } else {
    originalLog('Some scenarios need work.');
  }
}

main().catch(console.error);
