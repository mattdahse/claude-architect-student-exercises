/**
 * tools.js — Mock tools for the workflow enforcement exercise.
 *
 * Three tools simulating a refund processing system:
 * - lookup_order: retrieves order details
 * - check_eligibility: checks if the order qualifies for a refund
 * - process_refund: processes the refund (the tool that needs enforcement)
 *
 * Provided complete — don't modify this file.
 */

const orders = {
  'ORD-001': { id: 'ORD-001', customer: 'Alice', total: 49.99, status: 'delivered', daysSincePurchase: 15 },
  'ORD-002': { id: 'ORD-002', customer: 'Bob', total: 250.00, status: 'delivered', daysSincePurchase: 5 },
  'ORD-003': { id: 'ORD-003', customer: 'Carol', total: 75.00, status: 'shipped', daysSincePurchase: 2 },
  'ORD-004': { id: 'ORD-004', customer: 'Dave', total: 150.00, status: 'delivered', daysSincePurchase: 95 },
};

function lookupOrder(orderId) {
  const order = orders[orderId];
  if (!order) {
    return { error: `Order ${orderId} not found`, found: false };
  }
  return { ...order, found: true };
}

function checkEligibility(orderId) {
  const order = orders[orderId];
  if (!order) {
    return { eligible: false, reason: 'Order not found' };
  }
  if (order.status !== 'delivered') {
    return { eligible: false, reason: `Order status is "${order.status}" — only delivered orders can be refunded` };
  }
  if (order.daysSincePurchase > 90) {
    return { eligible: false, reason: `Order is ${order.daysSincePurchase} days old — refunds are only available within 90 days` };
  }
  return { eligible: true, reason: 'Order qualifies for refund' };
}

function processRefund(orderId, amount) {
  console.log(`  [process_refund] Processing refund of $${amount} for order ${orderId}`);
  return { success: true, refundId: 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(), amount: amount };
}

module.exports = { lookupOrder, checkEligibility, processRefund };
