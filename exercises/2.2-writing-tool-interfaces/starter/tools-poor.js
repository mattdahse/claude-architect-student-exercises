/**
 * tools-poor.js — Intentionally poor tool descriptions.
 *
 * These descriptions are ambiguous, overlapping, and missing boundaries.
 * Run `node tester.js tools-poor.js` to see how poor descriptions
 * affect tool selection accuracy.
 *
 * DO NOT MODIFY THIS FILE — it's the baseline for comparison.
 */

const toolDefinitions = [
  {
    name: 'get_customer',
    description: 'Gets customer data.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Customer ID',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_account',
    description: 'Returns account information.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Customer ID',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_orders',
    description: 'Looks up orders.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Customer ID',
        },
        limit: {
          type: 'number',
          description: 'Number of orders',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    name: 'get_support_history',
    description: 'Retrieves support records.',
    input_schema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Customer ID',
        },
      },
      required: ['customer_id'],
    },
  },
];

module.exports = { toolDefinitions };
