/**
 * tools-improved.js — YOUR improved tool descriptions.
 *
 * Rewrite the descriptions below using the framework from Lesson 2.1:
 *   1. What does the tool do?
 *   2. When should it be used?
 *   3. What does it return?
 *   4. What does it NOT do? (explicit boundaries)
 *
 * Aim for 3-4 sentences per description.
 * Run `node tester.js tools-improved.js` to test your accuracy.
 * Target: 90%+ accuracy (compared to ~50-60% with the poor descriptions).
 */

const toolDefinitions = [
  {
    name: 'get_customer',
    // TODO: Rewrite this description.
    // This tool returns: name, email, phone, language preference, notification settings.
    // It does NOT return: billing info, orders, or support tickets.
    description: 'TODO: Write your improved description here.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'The unique customer identifier (format: cust_XXXXX)',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_account',
    // TODO: Rewrite this description.
    // This tool returns: subscription plan, billing cycle, payment method (last 4 digits), renewal date, usage limits.
    // It does NOT return: personal profile info, orders, or support history.
    description: 'TODO: Write your improved description here.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'The unique customer identifier (format: cust_XXXXX)',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_orders',
    // TODO: Rewrite this description.
    // This tool returns: list of recent orders with order ID, date, items, total amount, and status (pending/shipped/delivered/returned).
    // It does NOT return: payment details, customer profile, or support tickets.
    description: 'TODO: Write your improved description here.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'The unique customer identifier (format: cust_XXXXX)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of orders to return (default: 10, max: 50)',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_support_history',
    // TODO: Rewrite this description.
    // This tool returns: list of past support tickets with ticket ID, date, subject, status (open/resolved/closed), and resolution summary.
    // It does NOT return: customer profile, billing info, or order details.
    description: 'TODO: Write your improved description here.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'The unique customer identifier (format: cust_XXXXX)',
        },
      },
      required: ['customer_id'],
    },
  },
];

module.exports = { toolDefinitions };
