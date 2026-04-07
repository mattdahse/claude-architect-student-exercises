/**
 * validate.js — Validation script for Exercise 1.7.
 *
 * Tests both sequential and parallel execution patterns:
 *   1. Sequential version produces a valid report
 *   2. Parallel version produces a valid report
 *   3. Parallel version is faster than sequential
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
let capturedOutput = [];

function captureStart() {
  capturedOutput = [];
  console.log = (...args) => {
    capturedOutput.push(args.join(' '));
    originalLog(...args);
  };
}

function captureStop() {
  console.log = originalLog;
  return capturedOutput.join('\n');
}

async function runTest(name, testFn) {
  originalLog(`\n${'='.repeat(60)}`);
  originalLog(`TEST: ${name}`);
  originalLog('='.repeat(60));

  try {
    const result = await testFn();
    originalLog(`  PASS: ${result}`);
    return 'pass';
  } catch (err) {
    originalLog(`  FAIL: ${err.message}`);
    return 'fail';
  }
}

async function main() {
  originalLog('Validating Exercise 1.7: Parallel vs Sequential Subagent Execution');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'} coordinator`);

  // Clear require cache
  delete require.cache[require.resolve(coordinatorPath)];
  const { runSequential, runParallel } = require(coordinatorPath);

  if (typeof runSequential !== 'function' || typeof runParallel !== 'function') {
    originalLog('\nSKIP: coordinator.js does not export runSequential and runParallel functions.');
    originalLog('Make sure both functions are exported: module.exports = { runSequential, runParallel };');
    return;
  }

  const results = [];
  const topic = 'cloud database services';

  // Test 1: Sequential execution produces a report
  let seqTime = 0;
  results.push(await runTest('Sequential execution produces a valid report', async () => {
    captureStart();
    const start = Date.now();
    const report = await runSequential(topic);
    seqTime = Date.now() - start;
    captureStop();

    if (!report) throw new Error('runSequential returned null or undefined');
    if (!report.title) throw new Error('Report missing title field');
    if (!report.sections) throw new Error('Report missing sections field');
    if (!report.sections.recommendation) throw new Error('Report missing recommendation');

    return `Report generated with title "${report.title}" in ${(seqTime / 1000).toFixed(1)}s`;
  }));

  // Test 2: Parallel execution produces a report
  let parTime = 0;
  results.push(await runTest('Parallel execution produces a valid report', async () => {
    captureStart();
    const start = Date.now();
    const report = await runParallel(topic);
    parTime = Date.now() - start;
    captureStop();

    if (!report) throw new Error('runParallel returned null or undefined');
    if (!report.title) throw new Error('Report missing title field');
    if (!report.sections) throw new Error('Report missing sections field');
    if (!report.sections.recommendation) throw new Error('Report missing recommendation');

    return `Report generated with title "${report.title}" in ${(parTime / 1000).toFixed(1)}s`;
  }));

  // Test 3: Parallel is faster than sequential
  results.push(await runTest('Parallel execution is faster than sequential', async () => {
    if (seqTime === 0 || parTime === 0) {
      throw new Error('Cannot compare — one or both versions did not complete.');
    }

    const speedup = ((seqTime - parTime) / seqTime * 100).toFixed(0);

    if (parTime >= seqTime) {
      throw new Error(
        `Parallel (${(parTime / 1000).toFixed(1)}s) was NOT faster than sequential (${(seqTime / 1000).toFixed(1)}s). ` +
        `Are the independent tasks actually running concurrently with Promise.all()?`
      );
    }

    return `Parallel was ${speedup}% faster: ${(seqTime / 1000).toFixed(1)}s → ${(parTime / 1000).toFixed(1)}s`;
  }));

  // Test 4: Both reports contain the same data
  results.push(await runTest('Both versions produce equivalent reports', async () => {
    captureStart();
    const seqReport = await runSequential(topic);
    const parReport = await runParallel(topic);
    captureStop();

    if (seqReport.metadata.competitorCount !== parReport.metadata.competitorCount) {
      throw new Error('Competitor counts differ between sequential and parallel reports.');
    }
    if (seqReport.metadata.trendCount !== parReport.metadata.trendCount) {
      throw new Error('Trend counts differ between sequential and parallel reports.');
    }

    return `Both reports contain ${seqReport.metadata.competitorCount} competitors and ${seqReport.metadata.trendCount} trends`;
  }));

  // Summary
  originalLog(`\n${'='.repeat(60)}`);
  originalLog('SUMMARY');
  originalLog('='.repeat(60));

  const passed = results.filter(r => r === 'pass').length;
  const failed = results.filter(r => r === 'fail').length;

  originalLog(`  Passed: ${passed}`);
  originalLog(`  Failed: ${failed}`);

  if (passed === results.length) {
    originalLog('\nAll tests passed! Both execution patterns are working correctly.');
  } else {
    originalLog('\nSome tests failed. Review the output above and check your implementation.');
  }
}

main().catch(console.error);
