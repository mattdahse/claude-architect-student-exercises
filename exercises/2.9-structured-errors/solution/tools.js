/**
 * tools.js — Reference solution with structured error responses.
 */

function processPayment(input) {
  if (input.failWith === 'rate_limited') {
    return {
      error: true,
      errorCategory: 'rate_limited',
      isRetryable: true,
      retryAfterSeconds: 30,
      message: 'Payment processor rate limit exceeded. Wait 30 seconds and retry with the same parameters.',
    };
  }
  if (input.failWith === 'invalid_card') {
    return {
      error: true,
      errorCategory: 'invalid_input',
      isRetryable: false,
      message: 'Payment method declined. The card on file is invalid or expired. Ask the customer to provide a different payment method.',
    };
  }
  return { success: true, transactionId: 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(), amount: input.amount };
}

function checkInventory(input) {
  if (input.failWith === 'not_found') {
    return {
      error: true,
      errorCategory: 'resource_not_found',
      isRetryable: false,
      message: `Product ${input.productId} not found in inventory. Verify the product ID or suggest an alternative product to the customer.`,
    };
  }
  if (input.failWith === 'service_unavailable') {
    return {
      error: true,
      errorCategory: 'service_unavailable',
      isRetryable: true,
      retryAfterSeconds: 10,
      message: 'Inventory service is temporarily unavailable. Wait 10 seconds and retry.',
    };
  }
  return { success: true, productId: input.productId, inStock: true, quantity: 42 };
}

function createShipment(input) {
  if (input.failWith === 'invalid_address') {
    return {
      error: true,
      errorCategory: 'invalid_input',
      isRetryable: false,
      message: 'Shipping address is invalid or incomplete. Ask the customer to provide a complete address with street, city, state, and zip code.',
    };
  }
  if (input.failWith === 'auth_failed') {
    return {
      error: true,
      errorCategory: 'authentication_failed',
      isRetryable: false,
      message: 'Shipping API authentication failed. API credentials may be expired. Escalate to engineering — this cannot be fixed by the agent.',
    };
  }
  return { success: true, shipmentId: 'SHP-' + Math.random().toString(36).substring(2, 8).toUpperCase(), carrier: 'FedEx' };
}

module.exports = { processPayment, checkInventory, createShipment };
