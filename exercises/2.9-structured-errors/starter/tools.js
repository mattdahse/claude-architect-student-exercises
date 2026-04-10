/**
 * tools.js — Mock tools with configurable failure modes.
 *
 * Three tools simulating external services:
 * - processPayment: payment API (can rate-limit, timeout, or reject)
 * - checkInventory: inventory API (can return not-found or service-unavailable)
 * - createShipment: shipping API (can fail with invalid address or auth errors)
 *
 * Each tool accepts a `failWith` parameter to trigger specific error scenarios.
 * When failWith is null/undefined, the tool succeeds.
 *
 * TODO: Your job is to modify the error responses in this file.
 * Currently, errors return empty strings — you'll add structured error metadata.
 */

function processPayment(input) {
  if (input.failWith === 'rate_limited') {
    // TODO Step 2a: Return a structured error for rate limiting
    // Include: errorCategory, isRetryable, retryAfterSeconds, message
    return { error: '' };
  }
  if (input.failWith === 'invalid_card') {
    // TODO Step 2b: Return a structured error for invalid payment method
    // Include: errorCategory, isRetryable, message
    return { error: '' };
  }
  // Success
  return { success: true, transactionId: 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(), amount: input.amount };
}

function checkInventory(input) {
  if (input.failWith === 'not_found') {
    // TODO Step 2c: Return a structured error for product not found
    // Include: errorCategory, isRetryable, message
    return { error: '' };
  }
  if (input.failWith === 'service_unavailable') {
    // TODO Step 2d: Return a structured error for service unavailability
    // Include: errorCategory, isRetryable, retryAfterSeconds, message
    return { error: '' };
  }
  // Success
  return { success: true, productId: input.productId, inStock: true, quantity: 42 };
}

function createShipment(input) {
  if (input.failWith === 'invalid_address') {
    // TODO Step 2e: Return a structured error for invalid shipping address
    // Include: errorCategory, isRetryable, message (with guidance on what's wrong)
    return { error: '' };
  }
  if (input.failWith === 'auth_failed') {
    // TODO Step 2f: Return a structured error for authentication failure
    // Include: errorCategory, isRetryable, message
    return { error: '' };
  }
  // Success
  return { success: true, shipmentId: 'SHP-' + Math.random().toString(36).substring(2, 8).toUpperCase(), carrier: 'FedEx' };
}

module.exports = { processPayment, checkInventory, createShipment };
