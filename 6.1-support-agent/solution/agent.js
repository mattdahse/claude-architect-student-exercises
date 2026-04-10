// Capstone Project A: Multi-Tool Customer Support Agent — SOLUTION
process.removeAllListeners("warning");

require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");
const { ALL_TOOLS, executeTool } = require("../starter/tools");
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

// Context management: case facts block that accumulates during the conversation
let caseFacts = {
  customer: null,
  issues: [],
  resolution_status: "in_progress"
};

// Tool output trimming projections
const toolProjections = {
  get_customer: (result) => ({
    customer_id: result.customer_id,
    name: result.name,
    tier: result.tier,
    email: result.email
  }),
  lookup_order: (result) => ({
    order_id: result.order_id,
    customer_id: result.customer_id,
    status: result.status,
    total: result.total,
    date: result.date,
    items: result.items.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
  })
};

function trimToolResult(toolName, result) {
  if (result.is_error) return result;
  const projection = toolProjections[toolName];
  return projection ? projection(result) : result;
}

function updateCaseFacts(toolName, result) {
  if (result.is_error) return;
  if (toolName === "get_customer") {
    caseFacts.customer = {
      id: result.customer_id,
      name: result.name,
      tier: result.tier
    };
  }
  if (toolName === "lookup_order") {
    // Avoid duplicate entries
    const existing = caseFacts.issues.find(i => i.order_id === result.order_id);
    if (!existing) {
      caseFacts.issues.push({
        order_id: result.order_id,
        status: result.status,
        total: result.total,
        date: result.date
      });
    }
  }
}

function buildSystemPrompt() {
  if (!caseFacts.customer) return SYSTEM_PROMPT;
  return `${SYSTEM_PROMPT}

=== CASE FACTS (PRESERVE VERBATIM — DO NOT SUMMARIZE) ===
${JSON.stringify(caseFacts, null, 2)}
=== END CASE FACTS ===`;
}

/**
 * Run the support agent with a user message.
 * Implements the complete agentic loop with:
 * - stop_reason handling (end_turn, tool_use, max_tokens)
 * - PreToolUse hook enforcement
 * - Tool output trimming
 * - Case facts accumulation
 */
async function runAgent(userMessage) {
  const messages = [{ role: "user", content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: buildSystemPrompt(),
      tools: ALL_TOOLS,
      messages: messages
    });

    // Handle end_turn: extract text and return
    if (response.stop_reason === "end_turn") {
      const textBlocks = response.content.filter(b => b.type === "text");
      return textBlocks.map(b => b.text).join("\n");
    }

    // Handle max_tokens: return whatever was generated with a warning
    if (response.stop_reason === "max_tokens") {
      const textBlocks = response.content.filter(b => b.type === "text");
      const partial = textBlocks.map(b => b.text).join("\n");
      return partial + "\n\n[Response truncated due to length]";
    }

    // Handle tool_use: execute tools and continue loop
    if (response.stop_reason === "tool_use") {
      // Add assistant response to conversation
      messages.push({ role: "assistant", content: response.content });

      // Process each tool call
      const toolResults = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          // Check PreToolUse hook BEFORE executing
          const hookResult = preToolUse(block.name, block.input);

          if (!hookResult.allowed) {
            // Hook blocked the call — return denial as tool result
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify({
                is_error: true,
                error_type: "hook_denied",
                message: hookResult.message
              })
            });
          } else {
            // Execute the tool
            const rawResult = executeTool(block.name, block.input);

            // Update case facts with successful results
            updateCaseFacts(block.name, rawResult);

            // Trim the result before adding to conversation
            const trimmedResult = trimToolResult(block.name, rawResult);

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(trimmedResult)
            });
          }
        }
      }

      // Add tool results to conversation
      messages.push({ role: "user", content: toolResults });
    }
  }
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
