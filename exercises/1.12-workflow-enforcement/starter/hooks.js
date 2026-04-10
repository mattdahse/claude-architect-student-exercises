/**
 * hooks.js — PreToolUse hook for refund enforcement.
 *
 * This file demonstrates a PreToolUse hook that blocks
 * the process_refund tool when the refund amount exceeds the threshold.
 *
 * Follow Step 4 in LESSON.md to complete this file.
 */

const APPROVAL_THRESHOLD = 100;

/**
 * PreToolUse hook for the process_refund tool.
 *
 * Receives the tool call details and returns a decision:
 * - { decision: 'allow' } — tool executes normally
 * - { decision: 'deny', reason: '...' } — tool is blocked
 *
 * @param {object} hookInput - { toolName, toolInput, toolUseId }
 * @returns {object} - { decision: 'allow'|'deny', reason?: string }
 */
function enforceRefundLimit(hookInput) {
  // TODO Step 4: Implement the PreToolUse hook
  //
  // 1. Check if hookInput.toolName is 'process_refund'
  //    - If not, return { decision: 'allow' } (don't interfere with other tools)
  //
  // 2. Check if hookInput.toolInput.amount > APPROVAL_THRESHOLD
  //    - If yes, return { decision: 'deny', reason: `Refund of $${amount} exceeds $${APPROVAL_THRESHOLD}...` }
  //    - If no, return { decision: 'allow' }

  console.log('TODO: Complete Step 4 — implement the PreToolUse hook.');
  return { decision: 'allow' };
}

module.exports = { enforceRefundLimit, APPROVAL_THRESHOLD };
