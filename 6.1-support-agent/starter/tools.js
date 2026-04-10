// Tool definitions and handlers for the customer support agent
// Students: You do NOT need to modify this file.
// Read it to understand what tools are available and how they work.

const { customers, orders, shippingRecords, refundPolicy } = require("./mock-data");

// Tool definitions (sent to Claude in the API call)
const ALL_TOOLS = [
  {
    name: "get_customer",
    description: "Look up a customer by their ID or name. Returns customer " +
      "profile including tier, contact info, and account details. Use this " +
      "when you need to identify a customer or retrieve their information.",
    input_schema: {
      type: "object",
      properties: {
        customer_id: {
          type: "string",
          description: "Customer ID (e.g., 'C-001'). Use this if you have the ID."
        },
        name: {
          type: "string",
          description: "Customer name to search for. Use this if you only have a name."
        }
      }
    }
  },
  {
    name: "lookup_order",
    description: "Retrieve details for a specific order by order ID. Returns " +
      "order status, items, total, date, and shipping information. Use this " +
      "when a customer asks about a specific order.",
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "Order ID (e.g., 'ORD-001')"
        }
      },
      required: ["order_id"]
    }
  },
  {
    name: "process_refund",
    description: "Process a refund for a delivered or disputed order. Requires " +
      "the order ID, refund amount, and reason. Note: refunds above $100 " +
      "require manager approval and may be blocked by policy hooks.",
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "Order ID to refund"
        },
        amount: {
          type: "number",
          description: "Refund amount in dollars"
        },
        reason: {
          type: "string",
          description: "Reason for the refund"
        }
      },
      required: ["order_id", "amount", "reason"]
    }
  },
  {
    name: "escalate_to_human",
    description: "Transfer the conversation to a human agent. Use this when: " +
      "(1) the customer explicitly asks to speak with a person or manager, " +
      "(2) the customer's request falls outside documented policy, or " +
      "(3) you cannot make progress after genuine attempts. Include context " +
      "so the human agent doesn't need to re-ask questions.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          enum: ["customer_request", "policy_gap", "unable_to_resolve"],
          description: "Why escalation is happening"
        },
        context: {
          type: "string",
          description: "Summary of the issue, what was tried, and relevant details"
        }
      },
      required: ["reason", "context"]
    }
  }
];

// Tool execution handler
function executeTool(toolName, input) {
  switch (toolName) {
    case "get_customer":
      return handleGetCustomer(input);
    case "lookup_order":
      return handleLookupOrder(input);
    case "process_refund":
      return handleProcessRefund(input);
    case "escalate_to_human":
      return handleEscalate(input);
    default:
      return {
        is_error: true,
        error_type: "invalid_input",
        message: `Unknown tool: ${toolName}`,
        retryable: false
      };
  }
}

function handleGetCustomer(input) {
  let customer = null;

  if (input.customer_id) {
    customer = customers.find(c => c.customer_id === input.customer_id);
  } else if (input.name) {
    const searchName = input.name.toLowerCase();
    const matches = customers.filter(c =>
      c.name.toLowerCase().includes(searchName)
    );

    if (matches.length === 0) {
      return {
        is_error: true,
        error_type: "not_found",
        message: `No customer found matching: ${input.name}`,
        attempted: { action: "get_customer", search: input.name },
        suggestions: ["Ask the customer for their customer ID or email address"],
        retryable: false
      };
    }

    if (matches.length > 1) {
      return {
        is_error: true,
        error_type: "ambiguous_match",
        message: `Multiple customers match "${input.name}": ${matches.map(m => m.name).join(", ")}`,
        attempted: { action: "get_customer", search: input.name },
        suggestions: ["Ask for a customer ID, email, or phone number to disambiguate"],
        retryable: false,
        match_count: matches.length
      };
    }

    customer = matches[0];
  } else {
    return {
      is_error: true,
      error_type: "invalid_input",
      message: "Either customer_id or name must be provided",
      retryable: false
    };
  }

  if (!customer) {
    return {
      is_error: true,
      error_type: "not_found",
      message: `No customer found with ID: ${input.customer_id}`,
      attempted: { action: "get_customer", customer_id: input.customer_id },
      suggestions: ["Verify the customer ID", "Try searching by name instead"],
      retryable: false
    };
  }

  return customer;
}

function handleLookupOrder(input) {
  if (!input.order_id) {
    return {
      is_error: true,
      error_type: "invalid_input",
      message: "order_id is required",
      retryable: false
    };
  }

  const order = orders.find(o => o.order_id === input.order_id);
  if (!order) {
    return {
      is_error: true,
      error_type: "not_found",
      message: `No order found with ID: ${input.order_id}`,
      attempted: { action: "lookup_order", order_id: input.order_id },
      suggestions: [
        "Verify the order ID with the customer",
        "Try looking up the customer first to see their order history"
      ],
      retryable: false
    };
  }

  // Include shipping info if available
  let shippingInfo = null;
  if (order.shipping && order.shipping.tracking) {
    shippingInfo = shippingRecords.find(s => s.tracking === order.shipping.tracking);
  }

  return { ...order, shipping_details: shippingInfo };
}

function handleProcessRefund(input) {
  const order = orders.find(o => o.order_id === input.order_id);
  if (!order) {
    return {
      is_error: true,
      error_type: "not_found",
      message: `No order found with ID: ${input.order_id}`,
      attempted: { action: "process_refund", order_id: input.order_id },
      retryable: false
    };
  }

  if (!refundPolicy.eligible_statuses.includes(order.status)) {
    return {
      is_error: true,
      error_type: "policy_violation",
      message: `Order ${input.order_id} has status "${order.status}" which is not eligible for refund. Eligible statuses: ${refundPolicy.eligible_statuses.join(", ")}`,
      attempted: { action: "process_refund", order_id: input.order_id, amount: input.amount },
      suggestions: ["Explain the policy to the customer", "Escalate if customer disputes"],
      retryable: false
    };
  }

  if (input.amount > order.total) {
    return {
      is_error: true,
      error_type: "invalid_input",
      message: `Refund amount $${input.amount} exceeds order total of $${order.total}`,
      attempted: { action: "process_refund", order_id: input.order_id, amount: input.amount },
      retryable: false
    };
  }

  // Simulate successful refund
  return {
    success: true,
    refund_id: `REF-${Date.now()}`,
    order_id: input.order_id,
    amount: input.amount,
    reason: input.reason,
    status: "processed",
    message: `Refund of $${input.amount.toFixed(2)} processed for order ${input.order_id}`
  };
}

function handleEscalate(input) {
  // Basic escalation — students will enhance this in escalation.js
  return {
    escalated: true,
    reason: input.reason,
    context: input.context,
    message: "Conversation has been escalated to a human agent.",
    handoff: {
      reason: input.reason,
      summary: input.context,
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = { ALL_TOOLS, executeTool };
