// PreToolUse hook for enforcing business rules
// Students: Implement the refund threshold check in this file.

const { refundPolicy } = require("./mock-data");

/**
 * PreToolUse hook — runs before each tool call.
 * Returns { allowed: true } to permit the call, or
 * { allowed: false, message: "..." } to block it.
 *
 * TODO: Implement a check that blocks process_refund calls
 * when the refund amount exceeds the auto-approval threshold ($100).
 *
 * When blocked, the message should explain:
 * - What was blocked (refund of $X)
 * - Why (exceeds auto-approval threshold)
 * - What happens next (requires manager approval)
 */
function preToolUse(toolName, toolInput) {
  // TODO: Check if this is a process_refund call
  // TODO: If it is, check if toolInput.amount exceeds refundPolicy.auto_approval_limit
  // TODO: If it does, return { allowed: false, message: "..." }
  // TODO: Otherwise, return { allowed: true }

  return { allowed: true };
}

module.exports = { preToolUse };
