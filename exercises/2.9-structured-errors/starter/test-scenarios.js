/**
 * test-scenarios.js — Predefined failure scenarios for testing error handling.
 *
 * Each scenario triggers a specific failure mode in one of the tools.
 * The coordinator should handle each error category differently.
 *
 * Provided complete — don't modify this file.
 */

const scenarios = [
  {
    name: 'Happy path — all succeed',
    description: 'Normal order: payment, inventory, and shipping all succeed.',
    payment: { amount: 49.99, failWith: null },
    inventory: { productId: 'PROD-001', failWith: null },
    shipment: { address: '123 Main St', failWith: null },
    expectedOutcome: 'success',
  },
  {
    name: 'Payment rate limited',
    description: 'Payment API returns 429 Too Many Requests.',
    payment: { amount: 49.99, failWith: 'rate_limited' },
    inventory: { productId: 'PROD-001', failWith: null },
    shipment: { address: '123 Main St', failWith: null },
    expectedOutcome: 'retry_payment',
  },
  {
    name: 'Invalid payment method',
    description: 'Customer\'s card is declined.',
    payment: { amount: 49.99, failWith: 'invalid_card' },
    inventory: { productId: 'PROD-001', failWith: null },
    shipment: { address: '123 Main St', failWith: null },
    expectedOutcome: 'ask_user_for_payment',
  },
  {
    name: 'Product not found',
    description: 'Product ID doesn\'t exist in inventory.',
    payment: { amount: 49.99, failWith: null },
    inventory: { productId: 'PROD-999', failWith: 'not_found' },
    shipment: { address: '123 Main St', failWith: null },
    expectedOutcome: 'report_to_user',
  },
  {
    name: 'Inventory service down',
    description: 'Inventory API is temporarily unavailable.',
    payment: { amount: 49.99, failWith: null },
    inventory: { productId: 'PROD-001', failWith: 'service_unavailable' },
    shipment: { address: '123 Main St', failWith: null },
    expectedOutcome: 'retry_inventory',
  },
  {
    name: 'Invalid shipping address',
    description: 'Shipping API rejects the address format.',
    payment: { amount: 49.99, failWith: null },
    inventory: { productId: 'PROD-001', failWith: null },
    shipment: { address: '', failWith: 'invalid_address' },
    expectedOutcome: 'ask_user_for_address',
  },
  {
    name: 'Shipping auth failure',
    description: 'Shipping API credentials are expired.',
    payment: { amount: 49.99, failWith: null },
    inventory: { productId: 'PROD-001', failWith: null },
    shipment: { address: '123 Main St', failWith: 'auth_failed' },
    expectedOutcome: 'escalate',
  },
];

module.exports = { scenarios };
