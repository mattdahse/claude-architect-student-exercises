/**
 * validate.js — Validation script for Exercise 2.2.
 *
 * Runs both the poor and improved descriptions against the test prompts
 * and verifies that the improved descriptions achieve better accuracy.
 *
 * Usage:
 *   node validate.js              # Test student's implementation
 *   node validate.js --solution   # Test reference solution
 */

process.removeAllListeners('warning');
require('../../../shared/load-env');
const path = require('path');

const useSolution = process.argv.includes('--solution');
const improvedPath = useSolution
  ? path.resolve(__dirname, '../solution/tools-improved.js')
  : path.resolve(__dirname, '../starter/tools-improved.js');

const originalLog = console.log;

async function main() {
  originalLog('Validating Exercise 2.2: Writing Effective Tool Interfaces');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'} descriptions\n`);

  // Check for TODO descriptions
  delete require.cache[require.resolve(improvedPath)];
  const { toolDefinitions } = require(improvedPath);
  const hasTodos = toolDefinitions.some(t => t.description.includes('TODO'));

  if (hasTodos) {
    originalLog('SKIP: tools-improved.js still contains TODO placeholders.');
    originalLog('Complete the descriptions before running validation.');
    return;
  }

  // Check description quality
  originalLog('--- Description Quality Checks ---\n');
  let qualityPass = true;

  for (const tool of toolDefinitions) {
    const desc = tool.description;
    const wordCount = desc.split(/\s+/).length;
    const hasBoundary = /does not|doesn't|not include/i.test(desc);

    originalLog(`  ${tool.name}:`);
    originalLog(`    Length: ${wordCount} words ${wordCount >= 20 ? '✓' : '✗ (aim for 20+ words)'}`);
    originalLog(`    Has boundary: ${hasBoundary ? '✓' : '✗ (should state what it does NOT do)'}`);

    if (wordCount < 20 || !hasBoundary) qualityPass = false;
  }

  if (!qualityPass) {
    originalLog('\n  Some descriptions are too short or missing boundaries.');
    originalLog('  Review Lesson 2.1 for the four-part description framework.\n');
  }

  // Run accuracy tests
  originalLog('\n--- Accuracy Test ---\n');

  // Import tester
  const testerPath = path.resolve(__dirname, '../starter/tester.js');
  delete require.cache[require.resolve(testerPath)];
  const { testToolSelection } = require(testerPath);

  originalLog('Testing poor descriptions (baseline):');
  const poorResult = await testToolSelection('tools-poor.js');

  originalLog('\nTesting improved descriptions:');
  // Temporarily change require resolution for the improved file
  const improvedFile = useSolution ? '../solution/tools-improved.js' : 'tools-improved.js';
  const improvedResult = await testToolSelection(improvedFile);

  // Summary
  originalLog(`\n${'='.repeat(60)}`);
  originalLog('VALIDATION SUMMARY');
  originalLog('='.repeat(60));

  if (!poorResult || !improvedResult) {
    originalLog('  Could not complete accuracy tests. Check for errors above.');
    return;
  }

  const improvement = improvedResult.accuracy - poorResult.accuracy;

  originalLog(`  Poor descriptions:     ${poorResult.accuracy}%`);
  originalLog(`  Improved descriptions: ${improvedResult.accuracy}%`);
  originalLog(`  Improvement:           +${improvement} percentage points`);
  originalLog(`  Description quality:   ${qualityPass ? 'PASS' : 'NEEDS WORK'}`);

  const tests = [
    { name: 'Improved > Poor accuracy', pass: improvedResult.accuracy > poorResult.accuracy },
    { name: 'Improved >= 85% accuracy', pass: improvedResult.accuracy >= 85 },
    { name: 'Description quality checks', pass: qualityPass },
  ];

  originalLog('\n  Results:');
  for (const t of tests) {
    originalLog(`    ${t.pass ? '✓' : '✗'} ${t.name}`);
  }

  const allPass = tests.every(t => t.pass);
  if (allPass) {
    originalLog('\n  All validations passed! Your descriptions are effective.');
  } else {
    originalLog('\n  Some validations failed. Review the details above.');
  }
}

main().catch(console.error);
