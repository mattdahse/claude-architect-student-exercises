/**
 * coordinator.js — Reference solution with category-based error handling.
 */

const { processPayment, checkInventory, createShipment } = require('./tools');
const { scenarios } = require('../starter/test-scenarios');

function handleError(stepName, result) {
  const category = result.errorCategory;
  const retryable = result.isRetryable;

  console.log(`  [${stepName}] Error: ${result.message}`);
  console.log(`  [${stepName}] Category: ${category}, Retryable: ${retryable}`);

  if (retryable && result.retryAfterSeconds) {
    console.log(`  [${stepName}] → Waiting ${result.retryAfterSeconds}s and retrying...`);
  }

  return category;
}

async function processOrder(scenario) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Scenario: ${scenario.name}`);
  console.log(scenario.description);
  console.log('='.repeat(50));

  // Step 1: Process payment
  console.log('\n  [Payment] Processing...');
  const paymentResult = processPayment(scenario.payment);

  if (paymentResult.error) {
    const category = handleError('Payment', paymentResult);
    switch (category) {
      case 'rate_limited':
        return { outcome: 'retry_payment', error: paymentResult };
      case 'invalid_input':
        return { outcome: 'ask_user_for_payment', error: paymentResult };
      default:
        return { outcome: 'unknown_error', error: paymentResult };
    }
  }
  console.log(`  [Payment] Success: ${paymentResult.transactionId}`);

  // Step 2: Check inventory
  console.log('\n  [Inventory] Checking...');
  const inventoryResult = checkInventory(scenario.inventory);

  if (inventoryResult.error) {
    const category = handleError('Inventory', inventoryResult);
    switch (category) {
      case 'resource_not_found':
        return { outcome: 'report_to_user', error: inventoryResult };
      case 'service_unavailable':
        return { outcome: 'retry_inventory', error: inventoryResult };
      default:
        return { outcome: 'unknown_error', error: inventoryResult };
    }
  }
  console.log(`  [Inventory] In stock: ${inventoryResult.quantity} units`);

  // Step 3: Create shipment
  console.log('\n  [Shipment] Creating...');
  const shipmentResult = createShipment(scenario.shipment);

  if (shipmentResult.error) {
    const category = handleError('Shipment', shipmentResult);
    switch (category) {
      case 'invalid_input':
        return { outcome: 'ask_user_for_address', error: shipmentResult };
      case 'authentication_failed':
        return { outcome: 'escalate', error: shipmentResult };
      default:
        return { outcome: 'unknown_error', error: shipmentResult };
    }
  }
  console.log(`  [Shipment] Created: ${shipmentResult.shipmentId} via ${shipmentResult.carrier}`);

  return { outcome: 'success', payment: paymentResult, inventory: inventoryResult, shipment: shipmentResult };
}

async function main() {
  const scenarioIndex = process.argv[2];

  if (scenarioIndex !== undefined) {
    const idx = parseInt(scenarioIndex, 10);
    if (idx < 0 || idx >= scenarios.length) {
      console.log(`Scenario index must be 0-${scenarios.length - 1}`);
      return;
    }
    const result = await processOrder(scenarios[idx]);
    console.log('\nOutcome:', result.outcome);
    return;
  }

  console.log('Running all test scenarios...\n');
  const results = [];

  for (let i = 0; i < scenarios.length; i++) {
    const result = await processOrder(scenarios[i]);
    const expected = scenarios[i].expectedOutcome;
    const match = result.outcome === expected;
    console.log(`\n  ${match ? '✓' : '✗'} Expected: ${expected}, Got: ${result.outcome}`);
    results.push({ scenario: scenarios[i].name, expected, actual: result.outcome, match });
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('SUMMARY');
  console.log('='.repeat(50));
  const passed = results.filter(r => r.match).length;
  console.log(`  ${passed}/${results.length} scenarios handled correctly`);
  if (passed === results.length) {
    console.log('  All scenarios handled! Error recovery is working.');
  }
}

main().catch(console.error);

module.exports = { processOrder };
