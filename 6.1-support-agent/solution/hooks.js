// PreToolUse hook — SOLUTION
// Enforces the refund threshold business rule

const { refundPolicy } = require("../starter/mock-data");

/**
 * PreToolUse hook — blocks refunds above the auto-approval threshold.
 *
 * Design decision: We check the amount against refundPolicy.auto_approval_limit
 * rather than hardcoding $100. This makes the hook policy-driven — if the
 * threshold changes, only mock-data.js needs updating.
 *
 * On the exam: This pattern maps to task statement 1.4 (workflow enforcement)
 * and demonstrates a PreToolUse hook that modifies agent behavior based on
 * business rules without changing the tool itself.
 */
function preToolUse(toolName, toolInput) {
  // Only intercept process_refund calls
  if (toolName !== "process_refund") {
    return { allowed: true };
  }

  // Check refund amount against policy threshold
  const amount = toolInput.amount;
  const threshold = refundPolicy.auto_approval_limit;

  if (amount > threshold) {
    return {
      allowed: false,
      message: `Refund of $${amount.toFixed(2)} exceeds the $${threshold.toFixed(2)} ` +
        `auto-approval threshold. This refund requires manager approval. ` +
        `Please inform the customer that their refund request has been ` +
        `submitted for review and will be processed within 24 hours.`
    };
  }

  return { allowed: true };
}

module.exports = { preToolUse };
