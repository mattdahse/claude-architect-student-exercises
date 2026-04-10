// Escalation handler — SOLUTION
// Builds structured context handoffs for human agents

/**
 * Builds a comprehensive handoff for the receiving human agent.
 *
 * Design decisions:
 * - Include customer info so the human doesn't need to re-lookup
 * - Include what was attempted so the human doesn't repeat work
 * - Include the specific escalation reason for priority routing
 * - Never include raw conversation — structured data is more useful
 *
 * On the exam: This pattern maps to task statement 5.2 (escalation)
 * and 5.3 (error propagation). The handoff serves the same purpose
 * as coverage annotations — the human knows what's been verified
 * and what hasn't.
 */
function handleEscalation(reason, context) {
  const handoff = {
    escalated: true,
    reason: reason,
    reason_description: getReasonDescription(reason),
    handoff: {
      customer: context.customer || null,
      issue_summary: context.issue || "Not specified",
      attempted_actions: context.attempted || [],
      case_facts: context.caseFacts || null,
      conversation_length: context.conversation_turns || 0,
      priority: getPriority(reason),
      timestamp: new Date().toISOString()
    }
  };

  return handoff;
}

function getReasonDescription(reason) {
  switch (reason) {
    case "customer_request":
      return "Customer explicitly requested a human agent — honor immediately";
    case "policy_gap":
      return "Customer's request falls outside documented policy — requires human judgment";
    case "unable_to_resolve":
      return "Agent exhausted available approaches without resolving the issue";
    default:
      return "Escalation reason not categorized";
  }
}

function getPriority(reason) {
  // Customer requests are highest priority — they're already frustrated
  // enough to have asked for a human
  switch (reason) {
    case "customer_request": return "high";
    case "policy_gap": return "medium";
    case "unable_to_resolve": return "medium";
    default: return "normal";
  }
}

module.exports = { handleEscalation };
