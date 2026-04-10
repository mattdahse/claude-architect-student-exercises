/**
 * coordinator.js — Order processing coordinator with error handling.
 *
 * Follow the steps in LESSON.md to complete this file.
 *
 * Usage:
 *   node coordinator.js           # Run all test scenarios
 *   node coordinator.js <number>  # Run a specific scenario (0-6)
 */

const { processPayment, checkInventory, createShipment } = require('./tools');
const { scenarios } = require('./test-scenarios');

async function processOrder(scenario) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Scenario: ${scenario.name}`);
  console.log(scenario.description);
  console.log('='.repeat(50));

  // Step 1: Process payment
  console.log('\n  [Payment] Processing...');
  const paymentResult = processPayment(scenario.payment);

  if (paymentResult.error !== undefined) {
    // TODO Step 3: Handle payment errors based on error metadata
    //
    // Read the errorCategory from paymentResult:
    // - If 'rate_limited': log "Waiting and retrying...", return { outcome: 'retry_payment', error: paymentResult }
    // - If 'invalid_input': log "Asking user for new payment method...", return { outcome: 'ask_user_for_payment', error: paymentResult }
    // - Otherwise: return { outcome: 'unknown_error', error: paymentResult }

    console.log('  [Payment] Failed:', JSON.stringify(paymentResult));
    console.log('  TODO: Handle this error based on its category.');
    return { outcome: 'unhandled_error' };
  }
  console.log(`  [Payment] Success: ${paymentResult.transactionId}`);

  // Step 2: Check inventory
  console.log('\n  [Inventory] Checking...');
  const inventoryResult = checkInventory(scenario.inventory);

  if (inventoryResult.error !== undefined) {
    // TODO Step 3: Handle inventory errors based on error metadata
    //
    // - If 'resource_not_found': log "Product not found...", return { outcome: 'report_to_user', error: inventoryResult }
    // - If 'service_unavailable': log "Waiting and retrying...", return { outcome: 'retry_inventory', error: inventoryResult }

    console.log('  [Inventory] Failed:', JSON.stringify(inventoryResult));
    console.log('  TODO: Handle this error based on its category.');
    return { outcome: 'unhandled_error' };
  }
  console.log(`  [Inventory] In stock: ${inventoryResult.quantity} units`);

  // Step 3: Create shipment
  console.log('\n  [Shipment] Creating...');
  const shipmentResult = createShipment(scenario.shipment);

  if (shipmentResult.error !== undefined) {
    // TODO Step 3: Handle shipment errors based on error metadata
    //
    // - If 'invalid_input': log "Asking user for correct address...", return { outcome: 'ask_user_for_address', error: shipmentResult }
    // - If 'authentication_failed': log "Escalating — credentials issue...", return { outcome: 'escalate', error: shipmentResult }

    console.log('  [Shipment] Failed:', JSON.stringify(shipmentResult));
    console.log('  TODO: Handle this error based on its category.');
    return { outcome: 'unhandled_error' };
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

  // Run all scenarios
  console.log('Running all test scenarios...\n');
  const results = [];

  for (let i = 0; i < scenarios.length; i++) {
    const result = await processOrder(scenarios[i]);
    const expected = scenarios[i].expectedOutcome;
    const match = result.outcome === expected;
    console.log(`\n  ${match ? '✓' : '✗'} Expected: ${expected}, Got: ${result.outcome}`);
    results.push({ scenario: scenarios[i].name, expected, actual: result.outcome, match });
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('SUMMARY');
  console.log('='.repeat(50));
  const passed = results.filter(r => r.match).length;
  console.log(`  ${passed}/${results.length} scenarios handled correctly`);
  if (passed === results.length) {
    console.log('  All scenarios handled! Error recovery is working.');
  } else {
    console.log('  Some scenarios need work. Check the TODO comments.');
  }
}

main().catch(console.error);

module.exports = { processOrder };
