/**
 * coordinator.js — Reference solution for Exercise 1.12.
 */

const { lookupOrder, checkEligibility, processRefund } = require('../starter/tools');
const { enforceRefundLimit } = require('./hooks');

const APPROVAL_THRESHOLD = 100;

async function processRefundRequest(orderId) {
  console.log(`\nProcessing refund request for ${orderId}`);
  console.log('---');

  // Step 1: Validation Gate — Look up the order
  const order = lookupOrder(orderId);
  if (!order.found) {
    console.log(`  [Validation Gate] Order not found: ${orderId}`);
    return { status: 'rejected', reason: order.error };
  }
  console.log(`  [Validation Gate] Order found: ${order.customer}, $${order.total}, ${order.status}`);

  // Step 2: Validation Gate — Check eligibility
  const eligibility = checkEligibility(orderId);
  if (!eligibility.eligible) {
    console.log(`  [Validation Gate] Not eligible: ${eligibility.reason}`);
    return { status: 'rejected', reason: eligibility.reason };
  }
  console.log(`  [Validation Gate] Eligible: ${eligibility.reason}`);

  // Step 4: PreToolUse Hook — Check before calling process_refund
  // In a real system, the hook fires at the infrastructure level.
  // Here we simulate it by calling the hook function explicitly.
  const hookResult = enforceRefundLimit({
    toolName: 'process_refund',
    toolInput: { orderId: orderId, amount: order.total },
    toolUseId: 'toolu_' + Math.random().toString(36).substring(2, 8),
  });

  if (hookResult.decision === 'deny') {
    console.log(`  [Hook] BLOCKED: ${hookResult.reason}`);
    return { status: 'pending_approval', reason: hookResult.reason, orderId, amount: order.total };
  }

  // Step 3: If we reach here, the hook allowed it (amount <= threshold)
  console.log(`  [Approval] Auto-approved: $${order.total} is within $${APPROVAL_THRESHOLD} limit`);
  const refund = processRefund(orderId, order.total);
  return { status: 'processed', ...refund };
}

async function main() {
  const orderId = process.argv[2];
  if (!orderId) {
    console.log('Usage: node coordinator.js <order-id>');
    console.log('Examples: ORD-001, ORD-002, ORD-003, ORD-004, ORD-999');
    return;
  }

  const result = await processRefundRequest(orderId);
  console.log('\nResult:', JSON.stringify(result, null, 2));
}

main().catch(console.error);

module.exports = { processRefundRequest, APPROVAL_THRESHOLD };
