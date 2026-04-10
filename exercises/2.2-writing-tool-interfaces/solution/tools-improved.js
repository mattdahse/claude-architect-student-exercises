/**
 * tools-improved.js — Reference solution with well-crafted descriptions.
 *
 * Each description follows the Lesson 2.1 framework:
 *   1. What the tool does
 *   2. When to use it
 *   3. What it returns
 *   4. What it does NOT do (explicit boundaries)
 *
 * These descriptions should achieve 90%+ accuracy on the standard test prompts.
 */

const toolDefinitions = [
  {
    name: 'get_customer',
    // Describes: personal profile information (identity and preferences)
    // Boundary: explicitly excludes billing, orders, and support history
    description:
      'Retrieves a customer\'s personal profile information, including their name, email address, phone number, preferred language, and notification settings. ' +
      'Use this when the user asks about contact details, communication preferences, or personal information on file. ' +
      'Returns profile fields only. Does not include billing or subscription data (use get_account), order history (use get_orders), or support ticket history (use get_support_history).',
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
    // Describes: billing and subscription information
    // Boundary: explicitly excludes profile, orders, and support
    description:
      'Retrieves a customer\'s billing and subscription information, including their current plan tier (free/pro/enterprise), billing cycle dates, payment method on file (last 4 digits only), renewal date, and usage limits for their plan. ' +
      'Use this when the user asks about subscription plans, billing, payment methods, plan limits, or account tier. ' +
      'Returns billing and subscription data only. Does not include personal profile information (use get_customer), order history (use get_orders), or support tickets (use get_support_history).',
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
    // Describes: purchase and order history
    // Boundary: explicitly excludes profile, billing, and support
    description:
      'Retrieves a customer\'s order history, including a list of recent orders with order ID, order date, items purchased, total amount, and current status (pending, shipped, delivered, or returned). ' +
      'Use this when the user asks about past purchases, order status, delivery tracking, what they bought, or how much they spent. ' +
      'Returns order data only. Does not include payment method details (use get_account), personal profile information (use get_customer), or support ticket history (use get_support_history).',
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
    // Describes: support tickets and complaint history
    // Boundary: explicitly excludes profile, billing, and orders
    description:
      'Retrieves a customer\'s support ticket history, including past tickets with ticket ID, date filed, subject, current status (open, resolved, or closed), and resolution summary. ' +
      'Use this when the user asks about previous support interactions, complaint history, open cases, how past issues were resolved, or whether the customer has contacted support before. ' +
      'Returns support ticket data only. Does not include personal profile information (use get_customer), billing or subscription data (use get_account), or order details (use get_orders).',
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
