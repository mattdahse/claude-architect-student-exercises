/**
 * hooks.js — Reference solution for the PreToolUse hook.
 */

const APPROVAL_THRESHOLD = 100;

function enforceRefundLimit(hookInput) {
  // Only apply to process_refund
  if (hookInput.toolName !== 'process_refund') {
    return { decision: 'allow' };
  }

  const amount = hookInput.toolInput.amount;

  if (amount > APPROVAL_THRESHOLD) {
    return {
      decision: 'deny',
      reason: `Refund of $${amount} exceeds the $${APPROVAL_THRESHOLD} auto-approval limit. Requires manager approval.`,
    };
  }

  return { decision: 'allow' };
}

module.exports = { enforceRefundLimit, APPROVAL_THRESHOLD };
