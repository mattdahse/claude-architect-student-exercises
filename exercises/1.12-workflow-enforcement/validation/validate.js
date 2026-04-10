/**
 * validate.js — Validation for Exercise 1.12.
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

async function runTest(name, testFn) {
  originalLog(`\n${'='.repeat(50)}`);
  originalLog(`TEST: ${name}`);
  originalLog('='.repeat(50));
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
  originalLog('Validating Exercise 1.12: Implementing Workflow Enforcement');
  originalLog(`Testing: ${useSolution ? 'solution' : 'starter'}`);

  delete require.cache[require.resolve(coordinatorPath)];
  const { processRefundRequest } = require(coordinatorPath);

  if (typeof processRefundRequest !== 'function') {
    originalLog('\nSKIP: coordinator.js does not export processRefundRequest.');
    return;
  }

  const results = [];

  // Suppress console.log during tests
  console.log = () => {};

  // Test 1: Eligible order under threshold → processed
  results.push(await runTest('Eligible order under $100 (ORD-001, $49.99) → processed', async () => {
    const result = await processRefundRequest('ORD-001');
    if (result.status !== 'processed') throw new Error(`Expected status "processed", got "${result.status}"`);
    if (!result.refundId) throw new Error('Missing refundId in processed result');
    return `Refund processed: ${result.refundId}`;
  }));

  // Test 2: Eligible order over threshold → pending approval
  results.push(await runTest('Eligible order over $100 (ORD-002, $250) → pending_approval', async () => {
    const result = await processRefundRequest('ORD-002');
    if (result.status !== 'pending_approval') throw new Error(`Expected status "pending_approval", got "${result.status}"`);
    return `Blocked: ${result.reason}`;
  }));

  // Test 3: Not eligible (not delivered) → rejected
  results.push(await runTest('Not eligible — shipped, not delivered (ORD-003) → rejected', async () => {
    const result = await processRefundRequest('ORD-003');
    if (result.status !== 'rejected') throw new Error(`Expected status "rejected", got "${result.status}"`);
    return `Rejected: ${result.reason}`;
  }));

  // Test 4: Not eligible (too old) → rejected
  results.push(await runTest('Not eligible — 95 days old (ORD-004) → rejected', async () => {
    const result = await processRefundRequest('ORD-004');
    if (result.status !== 'rejected') throw new Error(`Expected status "rejected", got "${result.status}"`);
    return `Rejected: ${result.reason}`;
  }));

  // Test 5: Order not found → rejected
  results.push(await runTest('Order not found (ORD-999) → rejected', async () => {
    const result = await processRefundRequest('ORD-999');
    if (result.status !== 'rejected') throw new Error(`Expected status "rejected", got "${result.status}"`);
    return `Rejected: ${result.reason}`;
  }));

  console.log = originalLog;

  // Summary
  originalLog(`\n${'='.repeat(50)}`);
  originalLog('SUMMARY');
  originalLog('='.repeat(50));
  const passed = results.filter(r => r === 'pass').length;
  const failed = results.filter(r => r === 'fail').length;
  originalLog(`  Passed: ${passed}`);
  originalLog(`  Failed: ${failed}`);
  if (passed === results.length) {
    originalLog('\nAll tests passed! Workflow enforcement is working correctly.');
  } else {
    originalLog('\nSome tests failed. Review the output above.');
  }
}

main().catch(console.error);
