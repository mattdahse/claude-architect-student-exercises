// Capstone Project A: Multi-Tool Customer Support Agent
// Students: Implement the agentic loop in this file.
process.removeAllListeners("warning");

require("../../shared/load-env");
const Anthropic = require("@anthropic-ai/sdk");
const { ALL_TOOLS, executeTool } = require("./tools");
const { preToolUse } = require("./hooks");
const { handleEscalation } = require("./escalation");

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a customer support agent for WidgetCo.

You help customers with order inquiries, billing questions, and refund requests.
You have access to tools for looking up customers, checking orders, processing
refunds, and escalating to human agents.

Guidelines:
- Be helpful, concise, and professional
- Always look up customer/order information before making claims
- When processing refunds, confirm the amount and reason
- If a tool returns an error, explain the situation clearly to the customer

Escalation rules:
- If the customer explicitly asks to speak with a person or manager, escalate immediately
- If the customer's request falls outside documented policy, escalate for human judgment
- If you cannot make progress after genuine attempts, escalate with context
- Never escalate based on customer sentiment alone
`;

/**
 * Run the support agent with a user message.
 * TODO: Implement the agentic loop.
 *
 * The loop should:
 * 1. Send the message to Claude with system prompt and tools
 * 2. Check stop_reason:
 *    - "end_turn": return the text response
 *    - "tool_use": execute tools (with hook check) and continue
 *    - "max_tokens": handle gracefully
 * 3. Loop until Claude responds with end_turn
 */
async function runAgent(userMessage) {
  // TODO: Initialize the messages array with the user message
  // TODO: Implement the while loop
  // TODO: Handle each stop_reason correctly
  // TODO: Integrate the preToolUse hook before each tool execution
  // TODO: Process multiple tool calls in a single turn

  console.log("Agent loop not yet implemented.");
  console.log(`Received message: "${userMessage}"`);
  return "Not implemented — complete Step 2 in the lesson.";
}

// Run from command line
const userMessage = process.argv.slice(2).join(" ");
if (!userMessage) {
  console.log("Usage: node agent.js \"your message here\"");
  console.log("Example: node agent.js \"What's the status of order ORD-001?\"");
  process.exit(1);
}

runAgent(userMessage)
  .then(response => {
    console.log("\n--- Agent Response ---");
    console.log(response);
  })
  .catch(error => {
    console.error("Agent error:", error.message);
    process.exit(1);
  });

module.exports = { runAgent };
