/**
 * validate.js — Validation for Exercise 4.3.
 *
 * Checks that the student's few-shot examples improve consistency
 * compared to the baseline.
 *
 * Usage:
 *   node validate.js              # Test student's implementation
 *   node validate.js --solution   # Test reference solution
 */

const path = require('path');
const useSolution = process.argv.includes('--solution');

const originalLog = console.log;

async function main() {
  originalLog('Validating Exercise 4.3: Writing Few-Shot Examples');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'}\n`);

  // Check for TODO
  const fewShotPath = useSolution
    ? path.resolve(__dirname, '../solution/classifier-few-shot.js')
    : path.resolve(__dirname, '../starter/classifier-few-shot.js');

  delete require.cache[require.resolve(fewShotPath)];
  const fewShotSource = require('fs').readFileSync(fewShotPath, 'utf8');
  if (fewShotSource.includes("TODO: Add your few-shot examples here")) {
    originalLog('SKIP: classifier-few-shot.js still contains TODO placeholder.');
    originalLog('Add your few-shot examples before running validation.');
    return;
  }

  // Check that examples are present
  if (!fewShotSource.includes('<example>') && !fewShotSource.includes('Input:')) {
    originalLog('WARNING: No examples detected in classifier-few-shot.js.');
    originalLog('Make sure you added few-shot examples with clear input/output pairs.\n');
  }

  originalLog('Few-shot examples detected. To run the full consistency test:');
  originalLog('  node tester.js baseline    # Baseline without examples');
  originalLog('  node tester.js few-shot    # Your examples');
  originalLog('\nCompare the consistency percentages to verify improvement.');
  originalLog('Target: 85%+ overall consistency with few-shot examples.');
}

main().catch(console.error);
