/**
 * coordinator.js — Refund processing coordinator with workflow enforcement.
 *
 * Follow the steps in LESSON.md to complete this file.
 *
 * Usage:
 *   node coordinator.js ORD-001    # Eligible, under $100 — should auto-process
 *   node coordinator.js ORD-002    # Eligible, over $100 — should require approval
 *   node coordinator.js ORD-003    # Not eligible (not delivered) — should reject
 *   node coordinator.js ORD-004    # Not eligible (too old) — should reject
 *   node coordinator.js ORD-999    # Not found — should reject
 */

const { lookupOrder, checkEligibility, processRefund } = require('./tools');

const APPROVAL_THRESHOLD = 100;

async function processRefundRequest(orderId) {
  console.log(`\nProcessing refund request for ${orderId}`);
  console.log('---');

  // TODO Step 1: Validation Gate — Look up the order
  //
  // Call lookupOrder(orderId). If the order is not found (found === false),
  // return { status: 'rejected', reason: 'Order not found' }.
  // Print the order details if found.

  console.log('TODO: Complete Step 1 — look up the order.');
  return { status: 'todo' };

  // TODO Step 2: Validation Gate — Check eligibility
  //
  // Call checkEligibility(orderId). If not eligible (eligible === false),
  // return { status: 'rejected', reason: eligibility.reason }.
  // Print the eligibility result.

  // TODO Step 3: Approval Threshold
  //
  // Check the order total against APPROVAL_THRESHOLD.
  // If order.total > APPROVAL_THRESHOLD:
  //   return { status: 'pending_approval', reason: `Refund of $${order.total} exceeds $${APPROVAL_THRESHOLD} auto-approval limit`, orderId, amount: order.total }
  // If order.total <= APPROVAL_THRESHOLD:
  //   Call processRefund(orderId, order.total) and return the result with status: 'processed'
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
