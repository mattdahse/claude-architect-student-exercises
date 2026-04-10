// Escalation handler for building structured context handoffs
// Students: Implement the handleEscalation function in this file.

/**
 * Builds a structured handoff context for the human agent.
 *
 * TODO: Implement this function to create a comprehensive handoff
 * that includes:
 * - Customer information (ID, name, tier)
 * - Issue summary
 * - What was attempted (tools called, results received)
 * - Why escalation is happening (the specific trigger)
 * - Any case facts accumulated during the conversation
 *
 * @param {string} reason - "customer_request" | "policy_gap" | "unable_to_resolve"
 * @param {object} context - Conversation context including customer and issue details
 * @returns {object} Structured escalation handoff
 */
function handleEscalation(reason, context) {
  // TODO: Build the structured handoff object
  // The human agent receiving this should be able to pick up the conversation
  // without asking the customer to repeat themselves.

  return {
    escalated: true,
    reason: reason,
    handoff: {
      // TODO: Add customer information
      // TODO: Add issue summary
      // TODO: Add what was attempted
      // TODO: Add case facts
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = { handleEscalation };
